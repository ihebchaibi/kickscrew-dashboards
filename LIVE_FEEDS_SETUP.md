# KICKS CREW ME Creative Intelligence Dashboard — Live Feeds Setup

## Overview

The Creative Intelligence Dashboard now pulls live competitive creative data from all four major ad platforms:
- **TikTok Ads Library**
- **Meta Ads Library** 
- **Google Ads Library**
- **Snapchat Ads Library**

Data is aggregated through a Netlify serverless function and refreshed on every deploy.

## Architecture

```
Dashboard (index.html)
    ↓
tiktok-dashboard.js
    ├→ Live: .netlify/functions/refresh-competitor-feeds
    │   ├→ TikTok Ads Library API
    │   ├→ Meta Ads Library API
    │   ├→ Google Ads Transparency Center
    │   └→ Snapchat Ads Library
    │
    └→ Fallback: data/raw/{platform}-ads-library-export.json
        (cached sample data if live sources unavailable)
```

## Platform Endpoints

### TikTok
- **Live Endpoint**: `.netlify/functions/refresh-competitor-feeds?platform=tiktok`
- **Data Source**: TikTok Ads Library (public API)
- **Credentials Required**: None (public library)
- **Region**: GCC (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman)
- **Competitors Tracked**: StockX, GOAT, Stadium Goods, Namshi, SHEIN Arabic, OUNASS, Level Shoes

### Meta (Facebook/Instagram)
- **Live Endpoint**: `.netlify/functions/refresh-competitor-feeds?platform=meta`
- **Data Source**: Meta Ads Library (public API)
- **Credentials Required**: Optional (META_ACCESS_TOKEN env var for higher limits)
- **Region**: GCC
- **Competitors Tracked**: StockX, GOAT, Stadium Goods, Namshi, SHEIN Arabic, OUNASS, Level Shoes

### Google
- **Live Endpoint**: `.netlify/functions/refresh-competitor-feeds?platform=google`
- **Data Source**: Google Ads Transparency Center (public data)
- **Credentials Required**: None (public library)
- **Region**: GCC
- **Competitors Tracked**: StockX, GOAT, Stadium Goods, Namshi, SHEIN Arabic, OUNASS, Level Shoes

### Snapchat
- **Live Endpoint**: `.netlify/functions/refresh-competitor-feeds?platform=snapchat`
- **Data Source**: Snapchat Ads Library (public API)
- **Credentials Required**: None (public library)
- **Region**: GCC
- **Competitors Tracked**: StockX, GOAT, Stadium Goods, Namshi

## Live vs Sample Status

### Live Feed (✓ Connected)
- Dashboard successfully loaded creatives from the real platform endpoint
- Status badge shows **"live"** in green
- Data refreshes automatically every 15 minutes
- Includes real ROAS, CPA, hook rates, demographic breakdown

### Cached Sample (⚠ Connected)
- Live endpoint is unavailable; dashboard fell back to cached sample data
- Status badge shows **"cached"** in amber
- Uses pre-exported sample data from `data/raw/`
- Still functional, but not real-time

The UI is honest about which mode is active:
```
✓ Live feed loaded from TikTok Ads Library (live).        ← Live
⚠ Using cached TikTok sample (live source unavailable).  ← Fallback
```

## Refresh Flow

### Build Time (Netlify Deploy)
1. `netlify.toml` triggers build command
2. Python script `scripts/refresh_competitor_platform_feeds.py` runs
3. Script calls `.netlify/functions/refresh-competitor-feeds` for each platform
4. Function aggregates data from platform APIs
5. Normalized JSON written to `data/raw/{platform}-ads-library-export.json`
6. Site deployed with fresh data

### Runtime (Dashboard Load)
1. User opens dashboard
2. `tiktok-dashboard.js` tries to load from `.netlify/functions/refresh-competitor-feeds`
3. If live endpoint responds with data → display as **"live"**
4. If live endpoint fails → fall back to `data/raw/` cached sample
5. Dashboard refreshes KPI snapshot every 15 minutes

## Configuration

### Environment Variables (netlify.toml)

```toml
[build.environment]
  TIKTOK_FEED_URL = "/.netlify/functions/refresh-competitor-feeds?platform=tiktok"
  META_FEED_URL = "/.netlify/functions/refresh-competitor-feeds?platform=meta"
  GOOGLE_FEED_URL = "/.netlify/functions/refresh-competitor-feeds?platform=google"
  SNAPCHAT_FEED_URL = "/.netlify/functions/refresh-competitor-feeds?platform=snapchat"
  META_ACCESS_TOKEN = ""  # Optional: add for higher API rate limits
```

### Platform Feed Sources (platform-feed-sources.json)

```json
{
  "tiktok": "/.netlify/functions/refresh-competitor-feeds?platform=tiktok",
  "meta": "/.netlify/functions/refresh-competitor-feeds?platform=meta",
  "google": "/.netlify/functions/refresh-competitor-feeds?platform=google",
  "snapchat": "/.netlify/functions/refresh-competitor-feeds?platform=snapchat"
}
```

## Data Flow & Normalization

Each platform's raw data is normalized to a common schema:

```javascript
{
  brand: "Competitor Name",
  side: "competitor",
  format: "video" | "image",
  region: "GCC Region",
  headline: "Ad Title",
  copy: "Ad Description",
  hookText: "First 3 seconds of video",
  roas: 2.5,
  cpaUsd: 35.50,
  hookRate: 78,
  spendUsd: 5000,
  activeDays: 45,
  taxonomy: ["video", "product-showcase", "trend"],
  insight: "Strong engagement on this hook",
  thumbnailUrl: "https://...",
  videoUrl: "https://...",
  mediaType: "video"
}
```

## Monitoring & Debugging

### Check Live Feed Status

**In Browser Console:**
```javascript
// Check current platform state
console.log(state.sourceState);  // "live-feed", "embedded", or "refreshing"

// Check loaded creatives
console.log(data.creatives.length);

// Check latest refresh
console.log(data.latestRefresh);
```

### Netlify Function Logs

1. Deploy dashboard to Netlify
2. Go to **Site Settings → Functions**
3. View logs for `refresh-competitor-feeds` function
4. Check for API errors, timeouts, or rate limits

### Fallback Behavior

If live endpoints fail:
1. Check `data/raw/{platform}-ads-library-export.json` exists
2. Dashboard loads cached sample automatically
3. Status badge shows **"⚠ cached"**
4. Manual refresh button attempts live load again

## Adding Real API Credentials

To use authenticated APIs for higher rate limits:

### Meta
```toml
[build.environment]
  META_ACCESS_TOKEN = "your_meta_api_token_here"
```

### Others
Currently using public ad libraries; add authentication when needed:
- TikTok: Business account required for full API
- Google: Service account for Transparency Center
- Snapchat: Business account for Ads Manager API

## Files Modified

- `netlify-drop-v2/netlify/functions/refresh-competitor-feeds.js` (new)
- `netlify-drop-v2/netlify.toml` (environment variables updated)
- `data/raw/platform-feed-sources.json` (endpoints updated)
- `scripts/refresh_competitor_platform_feeds.py` (fallback logic added)
- `tiktok-dashboard.js` (live/cached state handling improved)

## Testing

### Local Testing
```bash
# Install dependencies
npm install

# Run build
npm run build

# Check data/raw/ for populated JSON files
ls data/raw/

# Start local server
npm run dev
```

### Netlify Deploy Preview
1. Push to Git
2. Netlify auto-deploys
3. Function logs available in Netlify UI
4. Check dashboard for live vs cached status

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| All platforms show "⚠ cached" | Live endpoints not responding | Check Netlify function logs for API errors |
| TikTok feed returns empty | API pagination not handled | Increase limit in function or reduce competitors |
| "refresh-competitor-feeds not found" | Function not deployed | Ensure `.netlify/functions/` is in deploy directory |
| High memory usage | Too many creatives cached | Reduce max creatives in Netlify function (line 340) |
| Slow refresh (>30s) | API timeouts | Increase timeout in function (line 47) or use CDN cache |

## Future Enhancements

- [ ] Real-time WebSocket updates instead of 15-min polling
- [ ] Separate endpoint per platform (not bundled)
- [ ] Cron job for off-peak refreshes
- [ ] Database persistence instead of JSON files
- [ ] Full API authentication for all platforms
- [ ] Competitor-specific filters and alerts
