# Netlify Deployment Setup — KICKS CREW ME Creative Intelligence

**Project:** KICKS CREW ME Creative Intelligence Dashboard  
**Hosting:** Netlify Drop (root publish)  
**Build command:** `python ../scripts/refresh_competitor_platform_feeds.py && node scripts/build-netlify-data.mjs`  
**Publish directory:** `.` (root)

---

## Quick Setup

### 1. Connect Your Git Repository to Netlify

```bash
# In Netlify UI:
# New site from Git → Connect your repo → Select branch → Deploy
```

### 2. Set Environment Variables in Netlify UI

Go to **Site settings** → **Build & deploy** → **Environment** → **Edit variables**

Add these environment variables:

```
TIKTOK_FEED_URL = "https://your-tiktok-plugin-endpoint/api/creatives/latest.json"
META_FEED_URL = "https://api.facebook.com/ads/export/meta"
GOOGLE_FEED_URL = "https://adslib.google.com/api/exports/google"
SNAPCHAT_FEED_URL = "https://api.snapchat.com/ads/export"
PYTHON_VERSION = "3.11"
```

### 3. Trigger a Deploy

```bash
git push
# OR in Netlify UI: Site overview → Trigger deploy
```

---

## Environment Variables

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| `TIKTOK_FEED_URL` | TikTok creative data export endpoint | `https://plugin.kicks/tiktok.json` | ✅ Yes |
| `META_FEED_URL` | Meta Ads Library or Motion export | `https://api.facebook.com/...` | ✅ Yes |
| `GOOGLE_FEED_URL` | Google Ads Library export | `https://adslib.google.com/...` | ✅ Yes |
| `SNAPCHAT_FEED_URL` | Snapchat Ads Manager export | `https://api.snapchat.com/...` | ✅ Yes |
| `PYTHON_VERSION` | Python runtime version | `3.11` | ⚠️ Recommended |
| `CLAUDE_REFRESH_ENDPOINT` | Claude's Vercel refresh endpoint | `https://kickscrew-dashboards.vercel.app/api/refresh` | ⚠️ Optional |

---

## Build Process (Step by Step)

### What Happens on Deploy:

1. **Fetch real platform data** (`build-netlify-data.mjs`)
   - Calls `TIKTOK_FEED_URL`, `META_FEED_URL`, `GOOGLE_FEED_URL`, `SNAPCHAT_FEED_URL` in parallel
   - Falls back gracefully if any platform is unavailable
   - Aggregates metrics: total creatives, brands tracked, avg ROAS

2. **Refresh platform feeds** (`refresh_competitor_platform_feeds.py`)
   - Reads `platform-feed-sources.json` (which uses env vars)
   - Fetches from configured endpoints
   - Validates JSON schema
   - Writes to `data/raw/{platform}-ads-library-export.json`
   - Timestamps each refresh

3. **Build dashboard UI**
   - Embeds aggregated metrics in `tiktok-competitor-data.js`
   - Updates `latestRefresh` timestamp
   - Generates static HTML (`index.html`, etc.)

4. **Publish to Netlify**
   - Deploys to `https://your-site.netlify.app/`
   - Cache-Control headers set for `tiktok-competitor-data.js` (5 min)
   - Security headers applied (CSP, X-Frame-Options, etc.)

---

## Netlify Configuration (`netlify.toml`)

```toml
[build]
  publish = "."
  functions = "netlify/functions"
  command = "python ../scripts/refresh_competitor_platform_feeds.py && node scripts/build-netlify-data.mjs"

[build.environment]
  TIKTOK_FEED_URL = "..."
  META_FEED_URL = "..."
  GOOGLE_FEED_URL = "..."
  SNAPCHAT_FEED_URL = "..."
  PYTHON_VERSION = "3.11"

[[redirects]]
  from = "/gcc"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/tiktok-competitor-data.js"
  [headers.values]
    Cache-Control = "public, max-age=300"  # 5-minute cache
```

---

## Testing Your Netlify Build Locally

Before pushing to Netlify, test the build locally:

```bash
cd netlify-drop-v2

# Set environment variables
export TIKTOK_FEED_URL="https://..."
export META_FEED_URL="https://..."
export GOOGLE_FEED_URL="https://..."
export SNAPCHAT_FEED_URL="https://..."

# Run the build command
python ../scripts/refresh_competitor_platform_feeds.py && node scripts/build-netlify-data.mjs

# Check output
cat data/raw/claude-vercel-refresh-latest.json
cat tiktok-competitor-data.js | grep -A5 "latestRefresh:"

# Serve locally
python -m http.server 8000
# Open http://localhost:8000/index.html
```

---

## Netlify Logs & Debugging

**View build logs:**
1. Netlify UI → Site overview → **Deployments** → Click a deploy
2. Scroll to **Deploy log**
3. Look for Python script output and build metrics

**Common issues:**

| Error | Cause | Solution |
|-------|-------|----------|
| `ModuleNotFoundError: No module named 'urllib'` | Python version too old | Set `PYTHON_VERSION = "3.11"` in build env |
| `Timeout fetching {platform}` | Feed endpoint slow or unavailable | Increase timeout in `build-netlify-data.mjs` |
| `Cannot find module 'node:fs'` | Node version too old | Netlify auto-upgrades; redeploy |
| `Endpoint returned 404` | Feed URL is wrong | Verify env variables in Netlify UI |

---

## Continuous Deployment

**Automatic deploys happen when:**
- You push to the connected branch (main, master, etc.)
- You manually trigger a deploy in Netlify UI
- A scheduled deploy via Netlify Build Hooks

**Set up scheduled deploys (optional):**

1. Netlify UI → Site settings → **Build & deploy** → **Build hooks**
2. **New build hook** → Name: `daily-creative-refresh`
3. Copy webhook URL
4. Schedule via Cowork or cron:
   ```bash
   curl -X POST https://api.netlify.com/build_hooks/...
   ```

---

## Performance & Caching

**Dashboard data refresh frequency:**
- **`tiktok-competitor-data.js`** — Cache for 5 minutes (max-age=300)
- **`index.html`** — No cache (fetches latest on each load)
- **Platform feeds** — Fetched fresh on every deploy

**To force a refresh:**
- Netlify UI → **Deployments** → **Trigger deploy**
- OR push a commit: `git push`
- OR call build hook: `curl https://api.netlify.com/build_hooks/...`

---

## Deployment Checklist

Before your first Netlify deploy:

- [ ] Git repo connected to Netlify
- [ ] `netlify.toml` in project root
- [ ] Environment variables set in Netlify UI
- [ ] `PYTHON_VERSION = "3.11"` set
- [ ] `platform-feed-sources.json` uses `${VAR}` syntax
- [ ] Platform feeds tested locally with `python ../scripts/...`
- [ ] Build succeeds locally: `node scripts/build-netlify-data.mjs`
- [ ] Dashboard UI loads on `http://localhost:8000/index.html`
- [ ] Browser console shows no errors

---

## File Structure

```
netlify-drop-v2/
├── netlify.toml                          # Netlify config (updated)
├── package.json                          # Node build scripts (updated)
├── index.html                            # Dashboard UI (links to scripts below)
├── tiktok-dashboard.js                   # Dashboard logic
├── tiktok-dashboard.css                  # Dashboard styling
├── tiktok-competitor-data.js             # Embedded data + latestRefresh
├── scripts/
│   └── build-netlify-data.mjs            # Build script (updated)
└── netlify/
    └── functions/
        └── refresh-dashboard.mjs         # Serverless function (optional)

../
├── scripts/
│   └── refresh_competitor_platform_feeds.py  # Platform feed refresh
└── data/raw/
    ├── platform-feed-sources.json        # Feed URLs (uses env vars)
    ├── tiktok-ads-library-export.json
    ├── meta-ads-library-export.json
    ├── google-ads-library-export.json
    └── snapchat-ads-library-export.json
```

---

## Next Steps

1. **Set env variables** in Netlify UI (see table above)
2. **Test locally:** `python ../scripts/refresh_competitor_platform_feeds.py && node scripts/build-netlify-data.mjs`
3. **Push to branch** that's connected to Netlify
4. **Check build logs** → Deployments → Latest deploy → Deploy log
5. **Visit site** at `https://your-site.netlify.app/`
6. **Verify badges** change from "Embedded sample" to "Live"

---

## Reference Links

- **Netlify Dashboard:** https://app.netlify.com/
- **Environment Variables:** https://docs.netlify.com/configure-builds/environment-variables/
- **Build Hooks:** https://docs.netlify.com/configure-builds/build-hooks/
- **Deploy Logs:** https://docs.netlify.com/monitor-sites/deploy-log-details/

---

## Questions?

See `PLATFORM_DATA_SOURCES_GUIDE.md` for platform-specific setup.  
See `PLATFORM_CONNECTION_CHECKLIST.md` for per-platform action items.
