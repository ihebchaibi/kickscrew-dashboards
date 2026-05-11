# KICKS CREW ME — Platform Data Sources Configuration Guide

**Last updated:** 2026-05-11  
**Status:** Ready for real-source connection

---

## Overview

The creative intelligence dashboard (`index.html`) pulls competitor creative data from four platforms. Each platform's feed is configured in `data/raw/platform-feed-sources.json` and refreshed daily via `scripts/refresh_competitor_platform_feeds.py`.

**Current state:** All URLs point to sample/fallback endpoints. **Next step:** Replace with real data sources.

---

## Platform-by-Platform Setup

### 1. TikTok
**Status:** ✅ **Ready to connect** — OAuth-secured daily plugin export  
**Plugin:** TikTok Ads Library plugin deployed May 8, 2026  
**Daily schedule:** 6:10 AM ME (autonomous, no manual action)

**What to do:**
- The TikTok plugin exports clean creative data to a stable endpoint after each daily run
- Update `platform-feed-sources.json` to point to the plugin's output:
  ```json
  "tiktok": "file:///path/to/plugin-output/tiktok-creatives-latest.json"
  // OR if exposed via HTTP:
  // "tiktok": "https://your-domain/api/tiktok/creatives/latest"
  ```

**Brands tracked:** StockX, GOAT, Stadium Goods, Namshi, SHEIN Arabic, OUNASS, Level Shoes

**Plugin endpoint details:**
- Requires OAuth token (auto-managed by Cowork)
- Returns: `{ creatives: [...], meta: {...}, latestRefresh: {...} }`
- Includes: spend, impressions, clicks, hook metrics, regional breakdown, demographic data

**Live plugin location:** H:\kickscrew\KICKS CREW ME – Marketing & Content Assistant\tiktok-ads-library-plugin\

---

### 2. Meta (Facebook Ads Manager)
**Status:** ⚠️ **Needs setup** — Direct export or Motion bridge  
**Options:**

#### Option A: Meta Ads Library Direct Export (Recommended)
1. Go to **Meta Ads Manager** → **Ads Library** → **All Ads**
2. Set filters:
   - Platform: Instagram, Facebook
   - Countries: Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman, Jordan, Egypt
   - Date range: Last 90 days
3. Export as JSON:
   - Click **Download** → Select format **JSON**
   - Save to: `data/raw/meta-ads-library-export.json`
4. Run: `python scripts/refresh_competitor_platform_feeds.py`

**Exported schema expected:**
```json
{
  "creatives": [
    {
      "id": "...",
      "brand": "...",
      "region": "...",
      "format": "video|carousel|image",
      "headline": "...",
      "copy": "...",
      "cta": "...",
      "spend_usd": 0,
      "impressions": 0,
      "clicks": 0,
      "ctr": 0.0,
      "conversions": 0,
      "roas": 0.0,
      "cpa_usd": 0,
      "thumbnail_url": "...",
      "source_url": "...",
      "launch_date": "2026-05-01"
    }
  ]
}
```

#### Option B: Motion API Bridge
- If Motion platform is connected, create a Cowork skill that exports Meta rows from Motion
- Export endpoint: `https://motion.app/api/export/meta`
- Requires: Motion API key in environment

**Update in `platform-feed-sources.json`:**
```json
"meta": "https://your-motion-instance/api/export/meta"
// OR direct file URL after manual export:
// "meta": "file:///C:/path/to/meta-ads-library-export.json"
```

---

### 3. Google Ads
**Status:** ⚠️ **Needs setup** — Google Ads Library export  
**Options:**

#### Option A: Google Ads Library Direct Download
1. Visit **[Google Ads Library](https://adslib.google.com/)**
2. Select **Ads across Google services**
3. Filter by:
   - Country: Saudi Arabia, UAE, Kuwait, etc. (GCC + surrounding)
   - Language: Arabic, English
   - Date range: Last 90 days
4. Search for competitor brands (StockX, GOAT, Stadium Goods, etc.)
5. Export as CSV/JSON and save to `data/raw/google-ads-library-export.json`

**Exported schema expected:**
```json
{
  "creatives": [
    {
      "id": "...",
      "brand": "...",
      "region": "...",
      "format": "search|display|video",
      "headline": "...",
      "copy": "...",
      "cta": "...",
      "spend_usd": 0,
      "impressions": 0,
      "clicks": 0,
      "ctr": 0.0,
      "conversions": 0,
      "roas": 0.0,
      "cpa_usd": 0,
      "landing_page_url": "...",
      "source_url": "...",
      "launch_date": "2026-05-01"
    }
  ]
}
```

#### Option B: Google Ads API (Advanced)
- Requires: Google Ads API access + service account
- Create a Cowork skill to poll Google Ads API daily
- Endpoint: `https://your-domain/api/google/creatives`

**Update in `platform-feed-sources.json`:**
```json
"google": "file:///C:/path/to/google-ads-library-export.json"
// OR API:
// "google": "https://your-domain/api/google/creatives"
```

---

### 4. Snapchat Ads Manager
**Status:** ⚠️ **Needs setup** — Snapchat Ads Manager export  
**Options:**

#### Option A: Snapchat Ads Manager Download
1. Go to **[Snapchat Ads Manager](https://business.snapchat.com/)**
2. Navigate to **Creatives** or **Ad Library**
3. Filter by:
   - Campaign date range: Last 90 days
   - Regions: GCC countries
4. Export as JSON/CSV to `data/raw/snapchat-ads-library-export.json`

**Exported schema expected:**
```json
{
  "creatives": [
    {
      "id": "...",
      "brand": "...",
      "region": "...",
      "format": "snap|collection|story",
      "headline": "...",
      "copy": "...",
      "cta": "...",
      "spend_usd": 0,
      "impressions": 0,
      "swipes": 0,
      "swipe_up_rate": 0.0,
      "conversions": 0,
      "roas": 0.0,
      "cpa_usd": 0,
      "thumbnail_url": "...",
      "landing_page_url": "...",
      "source_url": "...",
      "launch_date": "2026-05-01"
    }
  ]
}
```

#### Option B: Snapchat API (Advanced)
- Requires: Snapchat Business API access
- Create a Cowork skill to poll Snapchat API
- Endpoint: `https://your-domain/api/snapchat/creatives`

**Update in `platform-feed-sources.json`:**
```json
"snapchat": "file:///C:/path/to/snapchat-ads-library-export.json"
// OR API:
// "snapchat": "https://your-domain/api/snapchat/creatives"
```

---

## Configuration File Format

**File:** `data/raw/platform-feed-sources.json`

```json
{
  "tiktok": "https://your-tiktok-plugin-endpoint/api/creatives/latest.json",
  "meta": "file:///C:/Users/.../data/raw/meta-ads-library-export.json",
  "google": "file:///C:/Users/.../data/raw/google-ads-library-export.json",
  "snapchat": "file:///C:/Users/.../data/raw/snapchat-ads-library-export.json"
}
```

**URL format rules:**
- `file://` — local file (absolute path required)
- `https://` — remote HTTP endpoint (must return valid JSON)
- Environment variables: `${ENV_VAR}` (e.g., `${TIKTOK_API_URL}`)

---

## Refresh Automation

**Script:** `scripts/refresh_competitor_platform_feeds.py`

```bash
python scripts/refresh_competitor_platform_feeds.py
```

**What it does:**
1. Reads `platform-feed-sources.json`
2. Fetches JSON from each platform endpoint
3. Validates schema
4. Normalizes to internal format
5. Writes to `data/raw/{platform}-ads-library-export.json`
6. Timestamps each refresh in `meta.updatedAt`

**Execution:**
- **Manual:** Run script anytime
- **Automated:** Codex scheduler (6:10 AM ME daily)
- **On-demand:** "Refresh now" button in dashboard UI

---

## Data Schema Reference

All platform exports must conform to this normalized schema:

```typescript
interface CreativeExport {
  meta: {
    platform: string;           // "TikTok" | "Meta" | "Google" | "Snapchat"
    source: string;             // "TikTok Ads Library" | "Meta Ads Manager" | etc.
    updatedAt: string;          // ISO date (YYYY-MM-DD)
    refreshedAt: string;        // ISO timestamp
    brandCount: number;
    creativeCount: number;
    dateRange: { from: string; to: string };
  };
  creatives: Array<{
    id: string;
    brand: string;
    region: string;
    format: "video" | "image" | "carousel" | "story" | "snap" | "search" | "display";
    headline: string;
    copy: string;
    cta: string;
    spend_usd: number;
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    roas: number;
    cpa_usd: number;
    thumbnail_url?: string;
    landing_page_url?: string;
    source_url?: string;
    launch_date: string;
    demographics?: {
      age_range: string;
      gender: string;
      region: string;
    };
  }>;
  intelligence?: Array<{
    type: "insight" | "trend" | "flag" | "opportunity";
    message: string;
    brand?: string;
    severity: "info" | "warning" | "critical";
  }>;
  creativeBriefs?: Array<{
    brand: string;
    region: string;
    theme: string;
    recommendation: string;
    rationale: string;
  }>;
}
```

---

## Status Labels in Dashboard

The dashboard displays **sample/live** status dynamically:

```javascript
// In tiktok-dashboard.js, platformConfig object:
meta: {
  status: "sample"  // Shows "Embedded sample" badge until live source is connected
  // When connected: status: "live"
}
```

**Badge rules:**
- **"Embedded sample"** — Falls back to local sample data (`tiktok-competitor-data.js`)
- **"Live"** — Real data endpoint successfully loaded
- **"Updating..."** — Refresh in progress
- **"Error"** — Endpoint unreachable, falls back to sample

---

## Testing the Connection

After updating `platform-feed-sources.json`:

```bash
# 1. Test the refresh script
python scripts/refresh_competitor_platform_feeds.py

# 2. Check output files
cat data/raw/tiktok-ads-library-export.json | head -20
cat data/raw/meta-ads-library-export.json | head -20

# 3. Verify JSON is valid
python -m json.tool data/raw/tiktok-ads-library-export.json > /dev/null && echo "Valid JSON"

# 4. Open dashboard in browser
open index.html
# → Check browser console for any fetch errors
# → Verify "Embedded sample" badge changes to "Live" for each platform
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "404 on endpoint" | Check URL in `platform-feed-sources.json`, verify file path or API is accessible |
| "Invalid JSON" | Run `python -m json.tool` on export file to find parsing errors |
| "Badge still says 'sample'" | Check browser console for fetch errors; inspect Network tab in DevTools |
| "Endpoint times out" | Increase timeout in `refresh_competitor_platform_feeds.py` (line 47: `timeout=45`) |
| "File URL not found" | Use absolute path in `platform-feed-sources.json`, not relative |

---

## Next Steps

**Immediate (Today):**
1. ✅ Review this guide
2. Choose data source for each platform (Options A or B)
3. Export or configure first platform (TikTok recommended — already OAuth'd)
4. Update `platform-feed-sources.json`
5. Test refresh script
6. Verify dashboard loads live data

**This week:**
- Connect remaining platforms (Meta, Google, Snapchat)
- Schedule daily refresh via Codex at 6:10 AM ME
- Set up Slack notification on refresh completion

**Ongoing:**
- Monitor data freshness and schema compliance
- Update competitor brand list if needed
- Adjust taxonomy filters based on performance patterns
