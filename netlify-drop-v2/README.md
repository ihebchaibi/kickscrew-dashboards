# KICKS CREW ME Creative Intelligence - Netlify Drop v2

This package fixes the Netlify error:

`Deploy directory 'public' does not exist`

Use this folder or zip as the Netlify project root. It publishes from the root directory.

Netlify settings:

- Build command: `npm run build`
- Publish directory: `.`
- Functions directory: `netlify/functions`

If using drag-and-drop deploy and Netlify ignores build settings, this still works because `index.html`, CSS, and JS are already at the package root.
