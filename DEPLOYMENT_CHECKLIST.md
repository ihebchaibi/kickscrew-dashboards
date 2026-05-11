# KICKS CREW ME Creative Intelligence Dashboard — Deployment Checklist

## Pre-Deployment Review

- [x] Netlify function created: `netlify-drop-v2/netlify/functions/refresh-competitor-feeds.js`
- [x] Platform feed sources updated: `data/raw/platform-feed-sources.json`
- [x] Netlify config updated: `netlify-drop-v2/netlify.toml`
- [x] Python refresh script updated: `scripts/refresh_competitor_platform_feeds.py`
- [x] Dashboard JS updated: `tiktok-dashboard.js`
- [x] Live/cached state handling implemented
- [x] Graceful fallback to sample data when live endpoints fail
- [x] Status badges updated to reflect live vs cached

## Files Changed

```
H:\kickscrew\KICKS CREW ME – Marketing & Content Assistant\
├── netlify-drop-v2/
│   ├── netlify.toml                          [UPDATED] environment vars
│   ├── netlify/functions/
│   │   └── refresh-competitor-feeds.js       [NEW] aggregates platform data
│   └── package.json                          [VERIFIED] no changes needed
├── data/raw/
│   └── platform-feed-sources.json            [UPDATED] live endpoints
├── scripts/
│   └── refresh_competitor_platform_feeds.py  [UPDATED] fallback logic
├── tiktok-dashboard.js                       [UPDATED] live/cached handling
├── LIVE_FEEDS_SETUP.md                       [NEW] documentation
└── DEPLOYMENT_CHECKLIST.md                   [NEW] this file
```

## Deployment Steps

### 1. Verify Node Environment (Netlify Build)
- Netlify function runs on Node.js 18+
- The function uses only built-in `https` and `fs` modules (no external deps needed)

### 2. Verify Python Environment (Build Refresh Script)
- Python 3.11 configured in `netlify.toml`
- Script imports only `json`, `os`, `ssl`, `sys`, `urllib`, `datetime`, `pathlib` (all built-in)

### 3. Git Push to Deploy
```bash
git add -A
git commit -m "feat: implement live competitive feed aggregation for TikTok, Meta, Google, Snapchat"
git push origin main
```

### 4. Netlify Auto-Deploy
- Netlify detects push
- Runs build command: `python ../scripts/refresh_competitor_platform_feeds.py && node scripts/build-netlify-data.mjs`
- Netlify function deployed to `.netlify/functions/refresh-competitor-feeds`
- Dashboard deployed to live URL

### 5. Monitor First Deploy

**In Netlify UI:**
1. Go to **Deploys** tab
2. Watch build log for:
   ```
   [Build] Running: python ../scripts/refresh_competitor_platform_feeds.py
   TikTok feed refreshed from /.netlify/functions/refresh-competitor-feeds?platform=tiktok
   Meta feed refreshed from /.netlify/functions/refresh-competitor-feeds?platform=meta
   Google feed refreshed from /.netlify/functions/refresh-competitor-feeds?platform=google
   Snapchat feed refreshed from /.netlify/functions/refresh-competitor-feeds?platform=snapchat
   ```
3. If any platform fails, check **Functions** logs for API errors
4. Deployment succeeds even if one platform fails (fallback to sample)

**In Dashboard:**
1. Open dashboard URL
2. Check status badges → should show **"live"** for all platforms
3. If some show **"⚠ cached"** → check Netlify function logs
4. Click **"Refresh now"** button → should update KPI metrics

### 6. Verify Each Platform

#### TikTok
- [ ] Status shows "live"
- [ ] 50+ creatives loaded
- [ ] Thumbnails visible for video creatives
- [ ] ROAS, CPA, hook rates populated

#### Meta
- [ ] Status shows "live"
- [ ] 50+ creatives loaded
- [ ] Images visible
- [ ] Carousel/collection ads rendering

#### Google
- [ ] Status shows "live"
- [ ] 50+ creatives loaded
- [ ] Search ads displaying
- [ ] Headlines and descriptions present

#### Snapchat
- [ ] Status shows "live"
- [ ] 30+ creatives loaded
- [ ] Video creatives playing
- [ ] Snap-specific metadata present

## Post-Deployment Monitoring

### Daily Checks
- [ ] Dashboard loads without errors
- [ ] All platform tabs accessible
- [ ] Refresh button works (updates KPI metrics)
- [ ] No 500 errors in Netlify function logs

### Weekly Checks
- [ ] Auto-refresh (every 15 min) still working
- [ ] Cached fallback data matches sample exports
- [ ] API rate limits not being hit
- [ ] Competitor feeds include new brands if added

### Monthly Checks
- [ ] Review creatives count (should grow, not stagnate)
- [ ] Check ROAS/CPA distributions (realistic ranges?)
- [ ] Verify demographics heatmap population
- [ ] Cache hit rate in function logs

## Rollback Plan

If live feeds cause issues:

### Option 1: Revert to Sample-Only (Quick)
```javascript
// In tiktok-dashboard.js, revert platformConfig status to "sample"
// and skip tryLoadPlatformFeed() call
```

### Option 2: Disable Specific Platform (Surgical)
```javascript
// Comment out function call in refreshAllFeeds()
// platform status remains "sample"
```

### Option 3: Full Rollback (Git)
```bash
git revert HEAD~1
git push origin main
```

## Success Criteria

✅ **All platforms show "live" status in dashboard**
✅ **Creatives load from all four platforms**
✅ **Sample/cached fallback works if live endpoint fails**
✅ **Auto-refresh updates KPI metrics every 15 min**
✅ **Status messages are honest about live vs cached**
✅ **No 500 errors in function logs**
✅ **No rate limit errors from platform APIs**

## Next Steps (Optional Enhancements)

1. **Add Real API Credentials**
   - Meta: Add `META_ACCESS_TOKEN` for higher rate limits
   - TikTok: Business account OAuth for full API
   - Google: Service account for historical data
   - Snapchat: API keys for authenticated access

2. **Optimize Performance**
   - Cache creatives in Redis/KV store
   - Paginate large result sets
   - Background refresh jobs on Netlify cron

3. **Enhance Data Quality**
   - Add spend estimate algorithms
   - Improve hook text extraction
   - Extract video captions for analysis
   - Better taxonomy/tagging

4. **Add Reporting**
   - Weekly email digest of top performers
   - Slack alerts for new competitor creatives
   - Grafana dashboard for trend analysis
   - Segment by region/demographic

## Questions?

Refer to `LIVE_FEEDS_SETUP.md` for:
- Architecture overview
- Platform endpoint details
- Troubleshooting guide
- Future enhancements
