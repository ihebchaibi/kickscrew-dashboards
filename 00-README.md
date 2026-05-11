# KICKS CREW ME — Creative Intelligence Dashboard

**Status:** ✅ **Ready for real-data connection**  
**Last Updated:** 2026-05-11  
**Owner:** Ihab (Digital Marketing Manager, ME)

---

## What This Is

A competitive creative intelligence dashboard for KICKS CREW Middle East — tracks creative performance across TikTok, Meta, Google, and Snapchat against 8 competitor brands (StockX, GOAT, Stadium Goods, Namshi, SHEIN Arabic, OUNASS, Level Shoes).

**Key Views:**
- 📊 Creative Radar — Browse all competitor creatives with metrics
- ⚔️ KC vs Competitors — Head-to-head ROAS, CPO, spend
- 🎣 Hook Analysis — First 3-second video hooks with engagement rates
- 🗺️ Regional Breakdown — GCC country-by-country performance
- 📋 Creative Briefs — AI-generated campaign recommendations

---

## Quick Navigation

**I want to...**

### 🚀 Deploy the dashboard to Netlify

→ **Start here:** [`QUICK_START.txt`](QUICK_START.txt) (5-min overview)  
→ **Then:** [`PLATFORM_CONNECTION_CHECKLIST.md`](PLATFORM_CONNECTION_CHECKLIST.md) (step-by-step)  
→ **Full guide:** [`netlify-drop-v2/NETLIFY_SETUP.md`](netlify-drop-v2/NETLIFY_SETUP.md)

### 📊 Connect real platform data sources

→ **Guide:** [`PLATFORM_DATA_SOURCES_GUIDE.md`](PLATFORM_DATA_SOURCES_GUIDE.md)  
→ **Meta setup:** Section 2  
→ **Google setup:** Section 3  
→ **Snapchat setup:** Section 4  
→ **TikTok (already OAuth'd):** See plugin docs below

### 🔌 Understand the architecture

→ **Full overview:** [`IMPLEMENTATION_COMPLETE.md`](IMPLEMENTATION_COMPLETE.md)  
→ **Netlify config:** [`netlify-drop-v2/NETLIFY_SETUP.md`](netlify-drop-v2/NETLIFY_SETUP.md)  
→ **Platform refresh:** See section on `refresh_competitor_platform_feeds.py`

### 🎯 Automate daily refreshes

→ **Scheduling:** [`PLATFORM_CONNECTION_CHECKLIST.md`](PLATFORM_CONNECTION_CHECKLIST.md) (Automation Schedule section)  
→ **TikTok plugin:** [`TIKTOK_PLUGIN_DEPLOYMENT_READY.md`](TIKTOK_PLUGIN_DEPLOYMENT_READY.md)  
→ **Codex integration:** Schedule task at 6:10 AM ME

---

## Files at a Glance

### 📋 Getting Started

| File | Purpose |
|------|---------|
| [`QUICK_START.txt`](QUICK_START.txt) | 5-min overview + to-do list |
| [`PLATFORM_CONNECTION_CHECKLIST.md`](PLATFORM_CONNECTION_CHECKLIST.md) | Step-by-step action items |
| [`PLATFORM_DATA_SOURCES_GUIDE.md`](PLATFORM_DATA_SOURCES_GUIDE.md) | Per-platform setup guide |
| [`IMPLEMENTATION_COMPLETE.md`](IMPLEMENTATION_COMPLETE.md) | Full architecture + details |

### 🛠️ Configuration

| File | Purpose | Status |
|------|---------|--------|
| `data/raw/platform-feed-sources.json` | Platform feed URLs (env var-based) | ✅ Updated |
| `netlify-drop-v2/netlify.toml` | Netlify build config | ✅ Updated |
| `netlify-drop-v2/package.json` | Build scripts | ✅ Updated |
| `netlify-drop-v2/scripts/build-netlify-data.mjs` | Netlify build logic | ✅ Updated |

### 🎨 Dashboard UI

| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Dashboard entry point | ✅ Ready |
| `tiktok-dashboard.js` | UI logic + filters | ✅ Ready |
| `tiktok-dashboard.css` | Styling | ✅ Ready |
| `tiktok-competitor-data.js` | Embedded sample data | ✅ Ready |

### 🤖 Automation

| File | Purpose | Status |
|------|---------|--------|
| `scripts/refresh_competitor_platform_feeds.py` | Platform feed refresh | ✅ Ready |
| `netlify-drop-v2/NETLIFY_SETUP.md` | Netlify deployment | ✅ Ready |
| `TIKTOK_PLUGIN_DEPLOYMENT_READY.md` | TikTok OAuth plugin | ✅ Deployed |

---

## Your To-Do List (This Week)

**⏱️ Total time: ~2 hours**

- [ ] **Read** [`QUICK_START.txt`](QUICK_START.txt) (5 min)
- [ ] **Export** Meta, Google, Snapchat data (1 hour)
  - [ ] Meta: Export from Ads Manager
  - [ ] Google: Export from Google Ads Library
  - [ ] Snapchat: Export from Ads Manager
- [ ] **Test locally** (10 min)
  - [ ] Run refresh script
  - [ ] Run Netlify build
  - [ ] Open dashboard in browser
- [ ] **Set Netlify env vars** (5 min)
  - [ ] `TIKTOK_FEED_URL`
  - [ ] `META_FEED_URL`
  - [ ] `GOOGLE_FEED_URL`
  - [ ] `SNAPCHAT_FEED_URL`
  - [ ] `PYTHON_VERSION = 3.11`
- [ ] **Deploy** (automatic)
  - [ ] `git push origin main`
  - [ ] Wait for Netlify build
- [ ] **Verify** (5 min)
  - [ ] Dashboard loads
  - [ ] Badges show "Live"
  - [ ] All data visible
  - [ ] No console errors

---

## Architecture (30-second version)

```
Platform Ads Library
    ↓ (Export JSON)
Local JSON files (data/raw/)
    ↓ (Python refresh script)
Normalized feed data
    ↓ (Netlify build)
Embedded in dashboard JS
    ↓ (Netlify deploy)
https://your-site.netlify.app/
    ↓ (Browser loads)
Dashboard displays:
  • Creative Radar
  • Comparison charts
  • Hook analysis
  • Regional breakdown
  • AI briefs
```

---

## Success Criteria

Dashboard is fully operational when:

- ✅ All 4 platform badges show **"Live"** (not "Embedded sample")
- ✅ Creative radar displays creatives from all 8 competitors + KICKS CREW
- ✅ Comparison table shows ROAS, spend, CPO with confidence indicators
- ✅ Hook analysis lists first-3-second hooks with engagement metrics
- ✅ Regional view shows GCC breakdown by country
- ✅ Briefs view generates AI-powered creative recommendations
- ✅ Browser console has zero fetch/JSON errors
- ✅ Page loads in <2 seconds
- ✅ Filters work (search, brand, region, taxonomy)

---

## Key Features

### 📊 Dashboard Views

1. **Creative Radar** — Browse all competitor creatives
   - Grid view with thumbnails
   - Hover for metrics (spend, ROAS, impressions, clicks)
   - Filter by brand, region, format
   - Search by hook, headline, copy

2. **KC vs Competitors** — Head-to-head comparison
   - Table: Spend, ROAS, CPO, conversion rate
   - Bar chart ranking by ROAS
   - Identifies winners and underperformers

3. **Hook Analysis** — Video opening tactics
   - First 3-second hook text
   - Hook engagement rate
   - ROAS breakdown by hook type
   - Identify patterns in high-performing openings

4. **GCC Regional Breakdown** — Market-by-market performance
   - Creative count, spend, ROAS per country
   - Demographic heatmap (age, gender, region)
   - Identify opportunities by region

5. **Creative Briefs** — AI-generated recommendations
   - Per-brand insights
   - Suggested hooks and themes
   - Regional customization tips

### 🔄 Automation

- **Daily refresh** at 6:10 AM ME (Codex scheduled task)
- **Parallel data fetch** (all 4 platforms simultaneously)
- **Fallback to sample data** if endpoints unavailable
- **Honest labeling** (badges show "Live" or "Embedded sample")

### 🛡️ Data Integrity

- Environment variable-based config (production-ready)
- JSON schema validation
- Automatic metric aggregation
- Fallback to committed data if fetch fails
- No data loss if endpoint unavailable

---

## Integration Points

### TikTok Plugin
- **Status:** ✅ Deployed May 8, 2026
- **Run:** Daily 6:10 AM ME via Codex
- **Output:** `data/raw/tiktok-ads-library-export.json`
- **OAuth:** Handled by Cowork (auto-managed)
- **Doc:** [`TIKTOK_PLUGIN_DEPLOYMENT_READY.md`](TIKTOK_PLUGIN_DEPLOYMENT_READY.md)

### Motion Integration (Optional)
- Export Meta rows from Motion if available
- Set env var: `META_FEED_URL = https://motion.app/api/export/meta`
- Fallback to direct export if Motion unavailable

### Slack Integration (Optional)
- Post daily summary to `#arabic-ads-central`
- Triggered by Netlify build completion
- Shows: total creatives, brands tracked, avg ROAS

---

## Troubleshooting

**Problem:** Dashboard shows "Embedded sample"  
→ **Cause:** Netlify env vars not set  
→ **Fix:** Add env vars in Netlify UI (see checklist)

**Problem:** Build fails in Netlify  
→ **Cause:** Python version too old  
→ **Fix:** Set `PYTHON_VERSION = 3.11` in build env

**Problem:** "404" errors on platform endpoints  
→ **Cause:** Feed URL is wrong  
→ **Fix:** Verify URLs in `platform-feed-sources.json`

**Problem:** JSON parsing errors  
→ **Cause:** Export file is invalid JSON  
→ **Fix:** Run `python -m json.tool` to validate

**Problem:** Badges loading forever  
→ **Cause:** Browser cache or endpoint timeout  
→ **Fix:** Hard refresh (Cmd+Shift+R) or increase timeout

See [`PLATFORM_CONNECTION_CHECKLIST.md`](PLATFORM_CONNECTION_CHECKLIST.md) for more.

---

## Environment Variables

Set these in **Netlify UI** → **Site settings** → **Build & deploy** → **Environment**:

| Variable | Value | Example |
|----------|-------|---------|
| `TIKTOK_FEED_URL` | TikTok plugin export endpoint | `https://...` |
| `META_FEED_URL` | Meta Ads Manager or Motion export | `https://...` |
| `GOOGLE_FEED_URL` | Google Ads Library export | `https://...` |
| `SNAPCHAT_FEED_URL` | Snapchat Ads Manager export | `https://...` |
| `PYTHON_VERSION` | Python runtime | `3.11` |

---

## Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Dashboard UI | ✅ Complete | All 5 views built and tested |
| Data refresh script | ✅ Ready | Pulls from any JSON endpoint |
| Netlify integration | ✅ Ready | Build pipeline configured |
| TikTok plugin | ✅ Deployed | OAuth secured, daily refresh |
| Meta connection | ⏳ Needs setup | Direct export recommended |
| Google connection | ⏳ Needs setup | Google Ads Library export |
| Snapchat connection | ⏳ Needs setup | Direct export recommended |
| Sample/live badges | ✅ Ready | Honest data source labeling |

---

## Next Steps

**Immediate (This week):**
1. Export Meta, Google, Snapchat data
2. Test locally
3. Set Netlify env vars
4. Deploy to Netlify
5. Verify badges show "Live"

**Short-term (Next week):**
1. Monitor Netlify build logs
2. Refine competitor brand list
3. Set up daily refresh schedule
4. Add Slack notification

**Long-term (Ongoing):**
1. Add new competitor brands
2. Refine taxonomy filters
3. Monitor dashboard performance
4. Archive old exports

---

## Support & Questions

**For platform setup details:**  
→ [`PLATFORM_DATA_SOURCES_GUIDE.md`](PLATFORM_DATA_SOURCES_GUIDE.md)

**For step-by-step actions:**  
→ [`PLATFORM_CONNECTION_CHECKLIST.md`](PLATFORM_CONNECTION_CHECKLIST.md)

**For Netlify deployment:**  
→ [`netlify-drop-v2/NETLIFY_SETUP.md`](netlify-drop-v2/NETLIFY_SETUP.md)

**For TikTok plugin:**  
→ Contact JSU (handles OAuth, deployment)

**For full architecture:**  
→ [`IMPLEMENTATION_COMPLETE.md`](IMPLEMENTATION_COMPLETE.md)

---

## TL;DR

✅ **The dashboard is fully built and ready to go live.**

**What to do:**
1. Export data from Meta, Google, Snapchat Ads Libraries (~1 hour)
2. Set 4 environment variables in Netlify (~5 min)
3. Push to git (automatic Netlify deploy)
4. Verify badges show "Live"

**Time to live:** ~2 hours  
**Support:** See docs above or contact Ihab

---

**Last updated:** 2026-05-11  
**Owner:** Ihab  
**Status:** ✅ Ready for deployment
