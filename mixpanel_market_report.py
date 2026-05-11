"""
KICKS CREW — Mixpanel Market Overview Report
Pulls sessions, purchases, ATC rate, CVR, and conversion funnel by country.

Usage:
  python mixpanel_market_report.py                          # last 7 days
  python mixpanel_market_report.py --from 2026-04-01 --to 2026-04-29
  python mixpanel_market_report.py --monthly                # one JSON per month, Oct 2025–today
  python mixpanel_market_report.py --monthly --from 2025-10-01 --to 2026-04-30
"""

import requests
import json
import argparse
import calendar
import time
from datetime import datetime, timedelta
from collections import defaultdict

# ── CONFIG ────────────────────────────────────────────────────────────────────
API_SECRET = "1a0e3ac74b9c8973d43d54fb8ab96807"
PROJECT_ID = "2769561"
BASE_URL   = "https://mixpanel.com/api/2.0"
AUTH       = (API_SECRET, "")

# Event names — update these if your Mixpanel events use different names
EVENTS = {
    "session":        "gtm_session_start",
    "view_item":      "gtm_view_item",
    "add_to_cart":    "gtm_add_to_cart",
    "begin_checkout": "gtm_begin_checkout",
    "purchase":       "gtm_purchase",
}

# Markets to highlight (ISO country codes)
ME_MARKETS = {"AE", "SA", "KW", "QA", "BH", "OM", "JO", "EG"}
KEY_MARKETS = {"US", "GB", "AE", "SA", "KW", "QA"}  # shown in overview table

COUNTRY_NAMES = {
    "US": "United States", "GB": "United Kingdom", "AE": "UAE",
    "SA": "Saudi Arabia",  "KW": "Kuwait",         "QA": "Qatar",
    "BH": "Bahrain",       "OM": "Oman",            "JO": "Jordan",
    "EG": "Egypt",
}

# ── DATE RANGE ────────────────────────────────────────────────────────────────
def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--days",    type=int, default=7, help="Last N days (default 7)")
    p.add_argument("--from",    dest="from_date", help="Start date YYYY-MM-DD")
    p.add_argument("--to",      dest="to_date",   help="End date YYYY-MM-DD")
    p.add_argument("--monthly", action="store_true", help="Pull one JSON per month between --from and --to")
    p.add_argument("--diagnose",   action="store_true", help="Run diagnostics")
    p.add_argument("--investigate",action="store_true", help="Investigate KSA traffic source spike (Mar vs Apr)")
    return p.parse_args()

def get_date_range(args):
    if args.from_date and args.to_date:
        return args.from_date, args.to_date
    to   = datetime.now() - timedelta(days=1)
    frm  = to - timedelta(days=args.days - 1)
    return frm.strftime("%Y-%m-%d"), to.strftime("%Y-%m-%d")

# ── API HELPERS ───────────────────────────────────────────────────────────────
def api_get(endpoint, params, retries=5):
    for attempt in range(retries):
        resp = requests.get(
            f"{BASE_URL}/{endpoint}",
            auth=AUTH,
            params={"project_id": PROJECT_ID, **params},
            timeout=30,
        )
        if resp.status_code == 429:
            wait = 2 ** attempt * 3   # 3, 6, 12, 24, 48 seconds
            print(f"      ⏳ Rate limited — waiting {wait}s before retry {attempt+1}/{retries}...")
            time.sleep(wait)
            continue
        resp.raise_for_status()
        time.sleep(0.5)   # polite delay between every successful call
        return resp.json()
    raise Exception(f"Failed after {retries} retries (rate limit)")

def discover_events():
    """List top event names in the project."""
    data = api_get("events/names", {"type": "general", "limit": 200})
    return data if isinstance(data, list) else data.get("results", [])

def get_segmentation_by_country(event_name, from_date, to_date):
    """
    Returns {country_code: total_count} for the given event over the date range.
    """
    data = api_get("segmentation", {
        "event":     event_name,
        "from_date": from_date,
        "to_date":   to_date,
        "on":        'properties["mp_country_code"]',
        "type":      "general",
        "unit":      "day",
    })

    counts = defaultdict(int)
    series = data.get("data", {}).get("values", {})
    for country, daily in series.items():
        counts[country] += sum(daily.values())
    return dict(counts)

# ── REPORT BUILDER ────────────────────────────────────────────────────────────
def build_market_data(from_date, to_date):
    print(f"\n📡  Fetching Mixpanel data ({from_date} → {to_date})...\n")

    raw = {}
    for key, event_name in EVENTS.items():
        print(f"   ↳ {key:20s}  ({event_name})")
        try:
            raw[key] = get_segmentation_by_country(event_name, from_date, to_date)
        except Exception as e:
            print(f"      ⚠️  Failed: {e}")
            raw[key] = {}

    # Collect all countries that appear in any event
    all_countries = set()
    for v in raw.values():
        all_countries.update(v.keys())

    markets = {}
    for cc in sorted(all_countries):
        sessions  = raw["session"].get(cc, 0)
        view_item = raw["view_item"].get(cc, 0)
        atc       = raw["add_to_cart"].get(cc, 0)
        checkout  = raw["begin_checkout"].get(cc, 0)
        purchase  = raw["purchase"].get(cc, 0)

        markets[cc] = {
            "sessions":       sessions,
            "view_item":      view_item,
            "add_to_cart":    atc,
            "begin_checkout": checkout,
            "purchases":      purchase,
            "cvr":   purchase / sessions * 100 if sessions else 0,
            "atc_rate": atc / sessions * 100 if sessions else 0,
        }
    return markets

def pct(n):
    return f"{n:.2f}%"

def fmt(n):
    return f"{n:,}"

# ── PRINT SECTIONS ────────────────────────────────────────────────────────────
def print_overview(markets, key_markets):
    print("\n" + "═" * 80)
    print("  OVERVIEW BY MARKET")
    print("═" * 80)
    header = f"{'Country':<20} {'Sessions':>10} {'Purchases':>10} {'CVR':>8} {'ATC Rate':>9}"
    print(header)
    print("─" * 60)

    for cc in key_markets:
        if cc not in markets:
            continue
        m    = markets[cc]
        name = COUNTRY_NAMES.get(cc, cc)
        print(f"{name:<20} {fmt(m['sessions']):>10} {fmt(m['purchases']):>10} "
              f"{pct(m['cvr']):>8} {pct(m['atc_rate']):>9}")

def print_me_summary(markets, me_markets):
    me_totals = defaultdict(int)
    for cc, m in markets.items():
        if cc in me_markets:
            for k in ["sessions", "view_item", "add_to_cart", "begin_checkout", "purchases"]:
                me_totals[k] += m[k]

    s = me_totals["sessions"]
    a = me_totals["add_to_cart"]
    p = me_totals["purchases"]

    print("\n" + "═" * 80)
    print("  MIDDLE EAST TOTAL (AE + SA + KW + QA + BH + OM + JO + EG)")
    print("═" * 80)
    print(f"  Sessions    : {fmt(s)}")
    print(f"  View Item   : {fmt(me_totals['view_item'])}")
    print(f"  Add to Cart : {fmt(a)}  ({pct(a/s*100 if s else 0)} ATC rate)")
    print(f"  Checkout    : {fmt(me_totals['begin_checkout'])}")
    print(f"  Purchases   : {fmt(p)}  ({pct(p/s*100 if s else 0)} CVR)")

def print_funnel(markets, key_markets):
    print("\n" + "═" * 80)
    print("  CONVERSION FUNNEL")
    print("═" * 80)

    cols = [COUNTRY_NAMES.get(cc, cc) for cc in key_markets if cc in markets]
    header = f"{'Stage':<22}" + "".join(f"{c:>16}" for c in cols)
    print(header)
    print("─" * (22 + 16 * len(cols)))

    stages = [
        ("Sessions",       "sessions"),
        ("View Item",      "view_item"),
        ("Add to Cart",    "add_to_cart"),
        ("Begin Checkout", "begin_checkout"),
        ("Purchase",       "purchases"),
    ]
    for stage_label, key in stages:
        row = f"{stage_label:<22}"
        for cc in key_markets:
            if cc not in markets:
                continue
            val = markets[cc][key]
            if key != "sessions" and markets[cc]["sessions"]:
                rate = val / markets[cc]["sessions"] * 100
                row += f"{fmt(val):>10} {rate:>4.1f}%"
            else:
                row += f"{fmt(val):>16}"
        print(row)

def print_cvr_comparison(markets, key_markets):
    print("\n" + "═" * 80)
    print("  CONVERSION RATE COMPARISON")
    print("═" * 80)
    header = f"{'Country':<20} {'Purchase CVR':>14} {'ATC Rate':>10}"
    print(header)
    print("─" * 46)
    for cc in key_markets:
        if cc not in markets:
            continue
        m = markets[cc]
        name = COUNTRY_NAMES.get(cc, cc)
        print(f"{name:<20} {pct(m['cvr']):>14} {pct(m['atc_rate']):>10}")

def save_json(markets, from_date, to_date):
    filename = f"mixpanel_{from_date}_{to_date}.json"
    with open(filename, "w") as f:
        json.dump({"period": {"from": from_date, "to": to_date}, "markets": markets}, f, indent=2)
    print(f"\n💾  Raw data saved to {filename}")

# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    args       = parse_args()
    from_date, to_date = get_date_range(args)

    # Optional: uncomment to see all available event names first
    # print("\n🔍 Available events:"); print(discover_events())

    markets = build_market_data(from_date, to_date)

    print_overview(markets, KEY_MARKETS)
    print_me_summary(markets, ME_MARKETS)
    print_funnel(markets, KEY_MARKETS)
    print_cvr_comparison(markets, KEY_MARKETS)

    save_json(markets, from_date, to_date)
    print("\n✅  Done.\n")

def diagnose():
    """Run this first to find your actual event names and country property."""
    print("\n🔍  ALL event names in your project...\n")
    try:
        events = discover_events()
        if isinstance(events, list):
            print(f"  Total: {len(events)} events")
            for e in events:
                print(f"  - {e}")
        else:
            print(json.dumps(events, indent=2))
    except Exception as ex:
        print(f"  ⚠️  {ex}")

    # Try known gtm_ events with different country properties
    test_event = "gtm_add_to_cart"
    country_props = ["mp_country_code", "$country_code", "Country", "country", "$country", "mp_lib"]
    print(f"\n🔍  Testing '{test_event}' with different country properties...")
    for prop in country_props:
        try:
            r = api_get("segmentation", {
                "event": test_event, "from_date": "2026-04-22", "to_date": "2026-04-28",
                "on": f'properties["{prop}"]', "type": "general", "unit": "day",
            })
            vals = r.get("data", {}).get("values", {})
            if vals:
                print(f"  ✅ '{prop}' → {len(vals)} countries: {list(vals.keys())[:8]}")
            else:
                print(f"  ✗  '{prop}' → 0 results")
        except Exception as ex:
            print(f"  ⚠️  '{prop}' → {ex}")

    # Raw total for gtm_add_to_cart (no segmentation)
    print(f"\n🔍  Raw total for '{test_event}' (no segmentation)...")
    try:
        r = api_get("segmentation", {
            "event": test_event, "from_date": "2026-04-22", "to_date": "2026-04-28",
            "type": "general", "unit": "day",
        })
        vals = r.get("data", {}).get("values", {})
        total = sum(sum(d.values()) for d in vals.values()) if vals else 0
        print(f"  → Total '{test_event}' events: {total}")
        print(f"  Raw response keys: {list(r.keys())}")
        print(f"  data keys: {list(r.get('data',{}).keys())}")
    except Exception as ex:
        print(f"  ⚠️  {ex}")

def get_months_between(from_date_str, to_date_str):
    """Returns list of (month_start, month_end) strings covering the range."""
    start = datetime.strptime(from_date_str, "%Y-%m-%d")
    end   = datetime.strptime(to_date_str,   "%Y-%m-%d")
    months = []
    cur = start.replace(day=1)
    while cur <= end:
        last_day = calendar.monthrange(cur.year, cur.month)[1]
        m_start  = cur.strftime("%Y-%m-%d")
        m_end    = min(cur.replace(day=last_day), end).strftime("%Y-%m-%d")
        months.append((m_start, m_end))
        # advance to next month
        if cur.month == 12:
            cur = cur.replace(year=cur.year+1, month=1)
        else:
            cur = cur.replace(month=cur.month+1)
    return months

def investigate_source(country, from_date, to_date, event="gtm_session_start"):
    """Break down an event by traffic source properties for a specific country. Returns dict."""
    props = ["utm_source", "utm_medium", "utm_campaign", "$initial_referrer", "$referrer"]
    label = f"{country}_{from_date}_{to_date}"
    print(f"\n{'='*60}")
    print(f"  SOURCE INVESTIGATION — {country}  ({from_date} → {to_date})")
    print(f"{'='*60}")
    result = {}
    for prop in props:
        try:
            r = api_get("segmentation", {
                "event":     event,
                "from_date": from_date,
                "to_date":   to_date,
                "on":        f'properties["{prop}"]',
                "type":      "general",
                "unit":      "day",
                "where":     f'properties["mp_country_code"] == "{country}"',
            })
            vals = r.get("data", {}).get("values", {})
            totals = {k: sum(v.values()) for k, v in vals.items() if k not in ("undefined","") and sum(v.values()) > 0}
            sorted_vals = sorted(totals.items(), key=lambda x: -x[1])[:15]
            result[prop] = dict(sorted_vals)
            print(f"\n  [{prop}]")
            for k, v in sorted_vals:
                print(f"    {k:<45} {v:>8,}")
        except Exception as e:
            result[prop] = {"error": str(e)}
            print(f"\n  [{prop}]  → error: {e}")
    return result

def run_monthly(args):
    """Pull data month-by-month and save one combined JSON + per-month JSONs."""
    # Default range: Oct 2025 → today
    from_date = args.from_date or "2025-10-01"
    to_date   = args.to_date   or datetime.now().strftime("%Y-%m-%d")

    months   = get_months_between(from_date, to_date)
    combined = {}

    for m_start, m_end in months:
        label = datetime.strptime(m_start, "%Y-%m-%d").strftime("%Y-%m")
        print(f"\n{'='*60}")
        print(f"  Month: {label}  ({m_start} → {m_end})")
        print(f"{'='*60}")
        markets = build_market_data(m_start, m_end)
        combined[label] = markets

        # Save individual month file
        fname = f"mixpanel_{m_start}_{m_end}.json"
        with open(fname, "w") as f:
            json.dump({"period": {"from": m_start, "to": m_end}, "markets": markets}, f, indent=2)
        print(f"  💾  Saved {fname}")

    # Save combined monthly file
    combined_fname = f"mixpanel_monthly_{from_date[:7]}_{to_date[:7]}.json"
    with open(combined_fname, "w") as f:
        json.dump({"months": combined}, f, indent=2)
    print(f"\n✅  All months saved. Combined file: {combined_fname}\n")

if __name__ == "__main__":
    args = parse_args()
    if args.diagnose:
        diagnose()
    elif args.monthly:
        run_monthly(args)
    elif args.investigate:
        print("\n🔍  MARCH (baseline):")
        march = investigate_source("SA", "2026-03-01", "2026-03-31")
        print("\n🔍  APRIL (spike):")
        april = investigate_source("SA", "2026-04-01", "2026-04-29")
        out = {"march": march, "april": april}
        fname = "mixpanel_ksa_source_investigation.json"
        with open(fname, "w") as f:
            json.dump(out, f, indent=2)
        print(f"\n💾  Saved to {fname}")
    else:
        main()
