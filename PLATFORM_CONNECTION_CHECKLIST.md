# Platform Data Source Connection Checklist

**Project:** KICKS CREW ME Creative Intelligence Dashboard  
**Status:** Ready for real-data connection  
**Date:** 2026-05-11

---

## Quick Start

1. Read: `PLATFORM_DATA_SOURCES_GUIDE.md` (detailed setup for each platform)
2. Choose: Which platforms to connect first (TikTok recommended)
3. Export: Data from platform Ads Library or API
4. Update: `data/raw/platform-feed-sources.json` with real URLs
5. Test: Run refresh script and verify dashboard loads live data
6. Schedule: Daily refresh via Codex at 6:10 AM ME

---

## Platform Connection Tasks

### ✅ TikTok — HIGHEST PRIORITY
- **Status:** OAuth plugin deployed May 8, already secured
- **Action needed:**
  - [ ] Verify TikTok plugin is installed in Cowork (`tiktok-ads-library-plugin/`)
  - [ ] Confirm OAuth credentials are set (env vars: `TIKTOK_CLIENT_ID`, `TIKTOK_CLIENT_SECRET`)
  - [ ] Run daily at 6:10 AM ME (automated via Codex `kicks-crew-me-tiktok-refresh`)
  - [ ] Check plugin outputs to: `data/raw/tiktok-ads-library-export.json`
  - [ ] Dashboard will auto-update badge from "Embedded sample" → "Live" when connected
- **Data exported:** Creative rows with spend, impressions, ROAS, hook metrics, regional breakdown
- **Brands tracked:** StockX, GOAT, Stadium Goods, Namshi, SHEIN Arabic, OUNASS, Level Shoes
- **Lead:** JSU (handles OAuth, plugin deployment)

### ⚠️ Meta (Facebook Ads Manager) — MEDIUM PRIORITY
- **Status:** Needs manual export or Motion API bridge
- **Option A: Direct Export (Simplest)**
  - [ ] Go to: **Meta Ads Manager** → **Ads Library** → **All Ads**
  - [ ] Filter by: GCC countries (SA, UAE, KW, QA, BH, OM, JO, EG)
  - [ ] Filter by: Last 90 days
  - [ ] Export as: JSON format
  - [ ] Save to: `data/raw/meta-ads-library-export.json`
  - [ ] Update: `platform-feed-sources.json` to point to exported file
  - [ ] Run: `python scripts/refresh_competitor_platform_feeds.py`
  - [ ] Verify: Dashboard badge changes to "Live"
- **Option B: Motion API Bridge (If Motion is connected)**
  - [ ] Create Cowork skill to export Meta rows from Motion
  - [ ] Endpoint: `https://motion.app/api/export/meta`
  - [ ] Update: `platform-feed-sources.json` with API URL
- **Lead:** Ihab (can pull from Motion if available, or direct export)

### ⚠️ Google Ads — MEDIUM PRIORITY
- **Status:** Needs manual export or API connection
- **Option A: Google Ads Library Direct (Simplest)**
  - [ ] Visit: **[Google Ads Library](https://adslib.google.com/)**
  - [ ] Select: Ads across Google services
  - [ ] Filter by: GCC countries, last 90 days
  - [ ] Search for: StockX, GOAT, Stadium Goods, Namshi, SHEIN Arabic, OUNASS
  - [ ] Export as: JSON/CSV
  - [ ] Save to: `data/raw/google-ads-library-export.json`
  - [ ] Update: `platform-feed-sources.json`
  - [ ] Run: `python scripts/refresh_competitor_platform_feeds.py`
  - [ ] Verify: Dashboard badge changes to "Live"
- **Option B: Google Ads API (Advanced)**
  - [ ] Requires: Service account + Google Ads API access
  - [ ] Create: Cowork skill to poll Google Ads API daily
  - [ ] Update: `platform-feed-sources.json` with API endpoint
- **Lead:** Ihab

### ⚠️ Snapchat Ads Manager — LOWEST PRIORITY
- **Status:** Needs manual export or API connection
- **Option A: Snapchat Ads Manager Download (Simplest)**
  - [ ] Go to: **[Snapchat Ads Manager](https://business.snapchat.com/)**
  - [ ] Navigate to: Creatives or Ad Library
  - [ ] Filter by: Last 90 days, GCC regions
  - [ ] Export as: JSON/CSV
  - [ ] Save to: `data/raw/snapchat-ads-library-export.json`
  - [ ] Update: `platform-feed-sources.json`
  - [ ] Run: `python scripts/refresh_competitor_platform_feeds.py`
  - [ ] Verify: Dashboard badge changes to "Live"
- **Option B: Snapchat API (Advanced)**
  - [ ] Requires: Business API access
  - [ ] Create: Cowork skill to poll Snapchat API
  - [ ] Update: `platform-feed-sources.json` with API endpoint
- **Lead:** Ihab

---

## Data Flow Architecture

```
Platform Ads Library
        ↓
   (Export JSON)
        ↓
data/raw/{platform}-ads-library-export.json
        ↓
   (Python refresh script reads sources.json)
        ↓
refresh_competitor_platform_feeds.py
        ↓
   (Validates schema, normalizes data)
        ↓
data/raw/{platform}-ads-library-export.json (updated)
        ↓
   (Browser fetches and renders)
        ↓
index.html → tiktok-dashboard.js → Creative Radar + Views
```

---

## Automation Schedule

Once platforms are connected, refresh happens daily:

| Time | What | Who | Status |
|------|------|-----|--------|
| 6:10 AM ME | TikTok plugin exports daily snapshot | Codex (autonomous) | ✅ Ready |
| 6:15 AM ME | Python refresh script runs | Codex (autonomous) | ⏳ Waiting for Meta/Google/Snapchat setup |
| 6:20 AM ME | Dashboard loads fresh data on next browser open | Auto | ⏳ Pending |
| 6:25 AM ME | Slack post to #arabic-ads-central (optional) | Cowork skill | ⏳ Can add later |

---

## Testing the Connection (Per Platform)

After exporting and updating `platform-feed-sources.json`:

```bash
# Test the refresh script
python scripts/refresh_competitor_platform_feeds.py

# Check output
cat data/raw/tiktok-ads-library-export.json | head -10
cat data/raw/meta-ads-library-export.json | head -10
cat data/raw/google-ads-library-export.json | head -10
cat data/raw/snapchat-ads-library-export.json | head -10

# Verify JSON is valid
python -m json.tool data/raw/tiktok-ads-library-export.json > /dev/null && echo "TikTok JSON valid"
python -m json.tool data/raw/meta-ads-library-export.json > /dev/null && echo "Meta JSON valid"
python -m json.tool data/raw/google-ads-library-export.json > /dev/null && echo "Google JSON valid"
python -m json.tool data/raw/snapchat-ads-library-export.json > /dev/null && echo "Snapchat JSON valid"

# Open dashboard in browser
open index.html
# → Check browser console for fetch errors
# → Verify badge changes from "Embedded sample" to "Live"
```

---

## File Locations Reference

| File | Purpose | Status |
|------|---------|--------|
| `data/raw/platform-feed-sources.json` | URL config for each platform | ✅ Updated with env vars |
| `data/raw/tiktok-ads-library-export.json` | TikTok feed data | ⏳ Waiting for plugin export |
| `data/raw/meta-ads-library-export.json` | Meta feed data | ⏳ Waiting for export |
| `data/raw/google-ads-library-export.json` | Google feed data | ⏳ Waiting for export |
| `data/raw/snapchat-ads-library-export.json` | Snapchat feed data | ⏳ Waiting for export |
| `scripts/refresh_competitor_platform_feeds.py` | Refresh automation | ✅ Ready |
| `index.html` | Dashboard UI | ✅ Ready |
| `tiktok-dashboard.js` | Dashboard logic | ✅ Ready |
| `tiktok-dashboard.css` | Dashboard styling | ✅ Ready |
| `tiktok-competitor-data.js` | Embedded sample fallback | ✅ Ready |

---

## Environment Variables (Optional)

For remote API endpoints, use environment variables in `platform-feed-sources.json`:

```bash
# Set in system environment or .env file
export TIKTOK_FEED_URL="https://api.tiktok.com/ads/export/..."
export META_FEED_URL="https://api.facebook.com/ads/export/..."
export GOOGLE_FEED_URL="https://api.google.com/ads/export/..."
export SNAPCHAT_FEED_URL="https://api.snapchat.com/ads/export/..."

# Or in Codex task:
TIKTOK_FEED_URL=... python scripts/refresh_competitor_platform_feeds.py
```

---

## Known Issues & Workarounds

| Issue | Cause | Solution |
|-------|-------|----------|
| Dashboard still shows "Embedded sample" | Feed URL not found or invalid JSON | Check `platform-feed-sources.json`, run `python -m json.tool` on exported file |
| Refresh script times out | Large export file or slow network | Increase timeout in `refresh_competitor_platform_feeds.py` (line 47) |
| "404" error in browser console | File path is relative, not absolute | Use absolute path in `platform-feed-sources.json` |
| Missing brands in dashboard | Export didn't include all competitors | Update export filters to include: StockX, GOAT, Stadium Goods, Namshi, SHEIN Arabic, OUNASS, Level Shoes |

---

## Success Criteria

Dashboard is fully connected when:

- ✅ All 4 platform badges show "Live" (not "Embedded sample")
- ✅ Creative radar displays rows from all platforms
- ✅ Comparison table shows all competitors with metrics
- ✅ Refresh script runs daily without errors
- ✅ Slack post to #arabic-ads-central shows latest stats
- ✅ Browser console has zero fetch/JSON errors

---

## Next Steps (Recommended Order)

**This week:**
1. **TikTok** — Verify plugin deployment and OAuth (JSU)
2. **Meta** — Export from Motion or Ads Manager (Ihab)
3. **Google** — Export from Google Ads Library (Ihab)
4. **Snapchat** — Export from Snapchat Ads Manager (Ihab)

**Next week:**
- [ ] Verify all 4 platforms showing "Live" in dashboard
- [ ] Schedule daily 6:15 AM refresh via Codex
- [ ] Set up Slack notification on refresh completion
- [ ] Monitor data freshness and schema compliance

**Ongoing:**
- [ ] Add new competitor brands to tracking list
- [ ] Refine taxonomy filters based on patterns
- [ ] Archive old exports monthly
- [ ] Update brand spend targets based on actual performance

---

## Questions?

Refer to `PLATFORM_DATA_SOURCES_GUIDE.md` for detailed setup per platform.

For TikTok plugin questions, see: `TIKTOK_PLUGIN_DEPLOYMENT_READY.md`

For dashboard UI/UX questions, see: `KICKS_CREW_ME_TIKTOK_COMPETITOR_DASHBOARD_STATUS.md`
