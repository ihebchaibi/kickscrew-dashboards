# KICKS CREW ME Creative Intelligence - Netlify Static v3

This package is the safest Netlify deploy format.

It has no build command, so Netlify will not fail because of a missing script.

Netlify settings:

- Build command: leave empty
- Publish directory: `.`
- Functions directory: `netlify/functions`

Use this package when uploading directly to Netlify or when the repo does not include the helper build scripts.

The dashboard already includes the latest KPI payload embedded in `tiktok-competitor-data.js`.
