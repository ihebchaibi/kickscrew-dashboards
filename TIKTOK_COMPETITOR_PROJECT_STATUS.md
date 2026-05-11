# KICKS CREW ME TikTok Competitor Project Status

Updated: 2026-05-10

## What is working now

- `index.html` is the upgraded Creative Intelligence dashboard.
- `competitor-tiktok-dashboard.html` redirects to the upgraded dashboard for compatibility.
- `gcc-competitor-tiktok-dashboard.html` redirects to the upgraded dashboard for compatibility.
- `tiktok-competitor-data.js` is the single shared data source for both dashboards.
- `tiktok-dashboard.js` renders filters, cards, KC vs competitor comparison, hook analysis, GCC split, heatmap, intelligence notes, and creative briefs.
- `tiktok-dashboard.css` contains the shared dashboard styling.
- `scripts/refresh_tiktok_competitor_from_claude.py` pulls top-line metrics from Claude's Vercel refresh endpoint.

The dashboard works locally without Chart.js, external image links, or CDN dependencies.

## What Claude overclaimed

The older handoff said the system was fully operational, with TikTok API access, OAuth, Codex scheduling, Slack posting, and dashboard refreshes. In this workspace, those claims are not backed by working files. The only plugin artifact present is:

- `tiktok-ads-library-plugin/.claude-plugin/plugin.json`

That is a manifest, not a working data connector.

## Current data quality

The current creative-row data is a cleaned inherited sample based on the Claude/Motion handoff from May 8, 2026. It is good enough for:

- reviewing competitor angles,
- testing filters and dashboard layout,
- agreeing on the reporting format,
- planning the real automation.

It is not good enough for:

- current budget decisions,
- claiming live competitor spend,
- automated Slack alerts,
- trend analysis against real history.

Top-line metrics now refresh automatically from:

`https://kickscrew-dashboards.vercel.app/api/refresh`

Codex automation ID: `tiktok-competitor-dashboard-refresh`

## Upgrade added on 2026-05-10

The dashboard now includes KICKS CREW's own creative rows, competitor rows, OUNASS, Level Shoes, taxonomy tags, hook text, demographic heatmap data, intelligence recommendations, and auto-generated creative brief examples. External thumbnails were removed from the UI because missing images made the deployed page feel broken; the new version uses code-rendered creative visuals that always load.

## Recommended next step

Export one verified file from Motion or TikTok Ads Library with these columns:

```csv
date,brand,region,format,headline,copy,creative_id,spend_usd,impressions,clicks,ctr,conversions,roas,cpa_usd,thumbnail_url,source_url
```

After that, the next build should add a small importer that converts the export into `tiktok-competitor-data.js`, then the dashboard can be refreshed safely.

## Competitors in scope

- StockX
- Stadium Goods
- GOAT
- Namshi
- SHEIN Arabic
- OUNASS

## Regions in scope

- Saudi Arabia
- UAE
- Kuwait
- Qatar
- Bahrain
- Oman
