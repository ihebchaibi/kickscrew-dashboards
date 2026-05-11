import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataFile = join(root, "public", "tiktok-competitor-data.js");
const rawFile = join(root, "data", "raw", "claude-vercel-refresh-latest.json");
const refreshUrl =
  process.env.CLAUDE_REFRESH_ENDPOINT ||
  "https://kickscrew-dashboards.vercel.app/api/refresh";

async function fetchRefresh() {
  const response = await fetch(refreshUrl, {
    headers: {
      accept: "application/json",
      "user-agent": "kickscrew-netlify-build/1.0"
    }
  });
  if (!response.ok) {
    throw new Error(`Refresh endpoint returned ${response.status}`);
  }
  return response.json();
}

function patchData(payload) {
  const pulledAt = new Date().toISOString();
  const latestRefresh = {
    source: refreshUrl,
    pulledAt,
    endpointTimestamp: payload.timestamp,
    status: payload.status,
    message: payload.message,
    metrics: payload.metrics || {}
  };

  let text = readFileSync(dataFile, "utf8");
  text = text.replace(
    /latestRefresh:\s*(?:null|\{.*?\}),\s*\n\s*targets:/s,
    `latestRefresh: ${JSON.stringify(latestRefresh, null, 4)},\n  targets:`
  );
  text = text.replace(/updatedAt:\s*"[^"]+"/, `updatedAt: "${pulledAt.slice(0, 10)}"`);
  writeFileSync(dataFile, text, "utf8");

  mkdirSync(dirname(rawFile), { recursive: true });
  writeFileSync(rawFile, JSON.stringify(latestRefresh, null, 2), "utf8");
  return latestRefresh;
}

try {
  const payload = await fetchRefresh();
  const latest = patchData(payload);
  console.log(
    `Netlify data refresh complete: ${latest.metrics.totalCreatives} creatives, ${latest.metrics.brandsTracked} brands, ${latest.metrics.avgRoas}x ROAS`
  );
} catch (error) {
  console.warn(`Netlify data refresh skipped: ${error.message}`);
  console.warn("Continuing build with the committed latestRefresh data.");
}
