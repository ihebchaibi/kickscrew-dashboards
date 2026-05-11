import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDataFile = join(root, "public", "tiktok-competitor-data.js");
const rootDataFile = join(root, "tiktok-competitor-data.js");
const dataFile = existsSync(publicDataFile) ? publicDataFile : rootDataFile;
const rawFile = join(root, "data", "raw", "claude-vercel-refresh-latest.json");
const refreshUrl =
  process.env.CLAUDE_REFRESH_ENDPOINT ||
  "https://kickscrew-dashboards.vercel.app/api/refresh";

async function fetchPlatformData(platform, url) {
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "kickscrew-netlify-build/1.0"
      },
      timeout: 30000
    });
    if (!response.ok) {
      console.warn(`Platform ${platform} returned ${response.status}, skipping`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.warn(`Failed to fetch ${platform} data: ${error.message}`);
    return null;
  }
}

async function fetchRefresh() {
  // Fetch platform feeds in parallel
  const platformFeeds = await Promise.all([
    fetchPlatformData("TikTok", process.env.TIKTOK_FEED_URL),
    fetchPlatformData("Meta", process.env.META_FEED_URL),
    fetchPlatformData("Google", process.env.GOOGLE_FEED_URL),
    fetchPlatformData("Snapchat", process.env.SNAPCHAT_FEED_URL)
  ]);

  // Also fetch the Claude refresh endpoint for top-line metrics
  let claudeRefresh = null;
  try {
    const response = await fetch(refreshUrl, {
      headers: {
        accept: "application/json",
        "user-agent": "kickscrew-netlify-build/1.0"
      }
    });
    if (response.ok) {
      claudeRefresh = await response.json();
    }
  } catch (error) {
    console.warn(`Claude refresh endpoint unavailable: ${error.message}`);
  }

  // Aggregate metrics from all platforms
  const aggregated = {
    timestamp: new Date().toISOString(),
    status: "success",
    message: "Platform feeds refreshed",
    platforms: {
      tiktok: platformFeeds[0] ? "connected" : "unavailable",
      meta: platformFeeds[1] ? "connected" : "unavailable",
      google: platformFeeds[2] ? "connected" : "unavailable",
      snapchat: platformFeeds[3] ? "connected" : "unavailable"
    },
    metrics: {
      totalCreatives: platformFeeds.reduce((sum, feed) =>
        sum + (feed?.creatives?.length || 0), 0),
      brandsTracked: new Set(
        platformFeeds.flatMap(feed => feed?.creatives?.map(c => c.brand) || [])
      ).size,
      avgRoas: claudeRefresh?.metrics?.avgRoas || 0,
      lastFetch: new Date().toISOString()
    }
  };

  return aggregated;
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
