# KICKS CREW ME Creative Intelligence - Netlify

This is the Netlify-ready version of the KICKS CREW ME creative intelligence dashboard.

## Deploy

Use this folder as the Netlify project root:

`netlify-dashboard`

Netlify settings:

- Build command: `npm run build`
- Publish directory: `public`
- Functions directory: `netlify/functions`

## Data Refresh

At build time, `scripts/build-netlify-data.mjs` pulls top-line KPIs from:

`https://kickscrew-dashboards.vercel.app/api/refresh`

You can override that endpoint with:

`CLAUDE_REFRESH_ENDPOINT`

The scheduled function `refresh-dashboard.mjs` is configured for every 12 hours. It currently validates and returns the latest Claude/Vercel payload. For true in-place static data updates, connect a durable data store, Netlify Blobs, or a GitHub commit workflow.

## Important Data Note

Top-line KPIs refresh automatically. Creative rows, hook text, taxonomy, demographic heatmap, and creative briefs are structured dashboard data until Motion/Meta row-level APIs are exposed.
