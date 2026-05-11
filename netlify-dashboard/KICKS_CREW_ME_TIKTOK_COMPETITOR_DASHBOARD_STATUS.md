# KICKS CREW ME TikTok Competitor Dashboard Status

Updated: 2026-05-10

## Current status

The TikTok competitor dashboard project is now a local creative intelligence dashboard. It is not a fully automated TikTok/Motion row-level API system yet, but the top-line KPIs auto-refresh from Claude's deployed endpoint.

## Working files

- `index.html` - dashboard launcher
- `competitor-tiktok-dashboard.html` - global competitor dashboard
- `gcc-competitor-tiktok-dashboard.html` - GCC regional dashboard
- `tiktok-competitor-data.js` - shared data source
- `tiktok-dashboard.js` - shared dashboard renderer
- `tiktok-dashboard.css` - shared styling
- `scripts/refresh_tiktok_competitor_from_claude.py` - pulls the Claude/Vercel refresh endpoint into the local data file
- `TIKTOK_COMPETITOR_PROJECT_STATUS.md` - implementation truth and next steps

## What changed from the Claude version

- Removed fake "live API" and "fully operational" language from the active dashboard.
- Replaced two disconnected embedded datasets with one shared data file.
- Removed dependency on Chart.js/CDN assets, so the dashboard works locally.
- Added clear data-confidence language.
- Added an explicit project status note explaining that API automation still needs a real data source.
- Rebuilt the root page into a full creative intelligence interface instead of a thin dashboard.
- Added KICKS CREW own creative rows beside competitors.
- Added OUNASS and Level Shoes to the GCC competitor set.
- Added taxonomy filters, hook analysis, demographic heatmap, intelligence recommendations, and creative briefs.
- Removed external image dependencies by rendering reliable brand creative visuals in CSS.

## Data status

Current creative-row data is a cleaned sample inherited from the May 8 Claude/Motion handoff. It can support creative review and dashboard workflow testing, but it should not be used for live spend or budget decisions.

Top-line metrics now auto-pull from Claude's public Vercel refresh endpoint:

`https://kickscrew-dashboards.vercel.app/api/refresh`

That endpoint currently returns total creatives, video/image split, brands tracked, total spend, and average ROAS. It does not return full creative rows.

## Automation

Codex automation created:

- ID: `tiktok-competitor-dashboard-refresh`
- Schedule: daily at 6:10
- Command: `python scripts\refresh_tiktok_competitor_from_claude.py`
- Output updated: `tiktok-competitor-data.js` and `data/raw/claude-vercel-refresh-latest.json`

## Next build step

Export verified competitor data from Motion or TikTok Ads Library using this schema:

```csv
date,brand,region,format,headline,copy,creative_id,spend_usd,impressions,clicks,ctr,conversions,roas,cpa_usd,thumbnail_url,source_url
```

Once that export exists, extend `scripts/refresh_tiktok_competitor_from_claude.py` to import full creative rows instead of only top-line metrics.

## Verification run

- JavaScript syntax check passed for `tiktok-dashboard.js`.
- Shared data file loaded successfully in Node.
- Data contains 22 creative sample records, 6 brand summaries, and 6 tracked brands.
- Claude/Vercel refresh endpoint tested successfully and returned live top-line metrics.
- Rendered QA passed locally in Chrome headless at desktop and mobile viewports.
- In-app browser visual QA was attempted, but the browser plugin blocked both direct file URL access and the local preview URL. Static validation passed; visual browser validation remains pending.
