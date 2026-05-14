/**
 * Netlify Function: Refresh Competitor Creative Feeds
 *
 * This endpoint is intentionally strict: it never fabricates spend, ROAS, CPA,
 * or hook-rate numbers. Configure live feed URLs with environment variables:
 *
 * TIKTOK_FEED_URL, META_FEED_URL, GOOGLE_FEED_URL, SNAPCHAT_FEED_URL
 *
 * Each source may return either { creatives: [...] } or
 * { data: { <platform>: { creatives: [...] } } }.
 */

const https = require("https");
const http = require("http");

const PLATFORMS = {
  tiktok: {
    label: "TikTok",
    env: "TIKTOK_FEED_URL",
    source: "TikTok Ads Library"
  },
  meta: {
    label: "Meta",
    env: "META_FEED_URL",
    source: "Meta Ads Library"
  },
  google: {
    label: "Google",
    env: "GOOGLE_FEED_URL",
    source: "Google Ads Transparency Center"
  },
  snapchat: {
    label: "Snapchat",
    env: "SNAPCHAT_FEED_URL",
    source: "Snapchat Ads Library"
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": statusCode === 200 ? "public, max-age=900" : "no-store"
    },
    body: JSON.stringify(body)
  };
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;
    const request = client.get(
      url,
      {
        timeout: 12000,
        headers: {
          accept: "application/json",
          "user-agent": "kickscrew-competitor-feed/2.0"
        }
      },
      (response) => {
        let raw = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`HTTP ${response.statusCode}: ${raw.slice(0, 200)}`));
            return;
          }
          try {
            resolve(JSON.parse(raw));
          } catch (error) {
            reject(new Error(`Invalid JSON: ${error.message}`));
          }
        });
      }
    );
    request.on("timeout", () => request.destroy(new Error("Request timed out")));
    request.on("error", reject);
  });
}

function pick(source, keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (value != null && value !== "") return value;
  }
  return null;
}

function normalizeCreative(row, platform) {
  return {
    brand: pick(row, ["brand", "advertiserName", "pageName", "advertiser", "companyName"]) || "Unknown brand",
    side: pick(row, ["side"]) || "competitor",
    format: pick(row, ["format", "mediaType", "assetType"]) || "unknown",
    region: pick(row, ["region", "market", "country"]) || "Unknown",
    headline: pick(row, ["headline", "title", "adName", "name"]) || "Untitled creative",
    copy: pick(row, ["copy", "description", "body", "primaryText", "text"]) || "",
    hookText: pick(row, ["hookText", "hook", "primaryText", "copy"]) || "",
    creativeId: pick(row, ["creativeId", "creative_id", "adId", "id"]),
    sourceUrl: pick(row, ["sourceUrl", "source_url", "adSnapshotUrl", "url", "landingPage"]),
    thumbnailUrl: pick(row, ["thumbnailUrl", "thumbnail_url", "imageUrl", "previewImageUrl", "displayUrl"]),
    videoUrl: pick(row, ["videoUrl", "video_url", "videoPlayUrl", "mediaUrl"]),
    launchDate: pick(row, ["launchDate", "startDate", "adCreationTime", "createdAt"]),
    activeDays: pick(row, ["activeDays", "daysActive", "daysLive", "durationDays"]),
    spendUsd: pick(row, ["spendUsd", "spend_usd", "spend", "totalSpend"]),
    roas: pick(row, ["roas", "roasValue", "roasScore"]),
    cpaUsd: pick(row, ["cpaUsd", "cpa_usd", "cpa", "costPerResult"]),
    hookRate: pick(row, ["hookRate", "hook_rate", "engagementRate", "videoViewRate"]),
    taxonomy: Array.isArray(row.taxonomy) ? row.taxonomy : [],
    insight: pick(row, ["insight", "notes", "commentary"]) || "",
    platform: platform.label,
    sourcePlatform: platform.label
  };
}

function extractCreatives(payload, platformKey) {
  const nested = payload?.data?.[platformKey] || payload?.[platformKey] || payload;
  return {
    rows: Array.isArray(nested?.creatives)
      ? nested.creatives
      : Array.isArray(payload?.creatives)
        ? payload.creatives
        : [],
    meta: nested?.meta || payload?.meta || {},
    source: nested?.source || payload?.source || nested?.meta?.source || ""
  };
}

exports.handler = async (event) => {
  const requestedPlatform = (event.queryStringParameters?.platform || "tiktok").toLowerCase();
  const platform = PLATFORMS[requestedPlatform] || PLATFORMS.tiktok;
  const sourceUrl = process.env[platform.env];

  if (!sourceUrl) {
    return json(200, {
      ok: false,
      isLive: false,
      platform: requestedPlatform,
      source: platform.source,
      message: `${platform.env} is not configured. No live creative rows were loaded.`,
      creatives: [],
      meta: {
        platform: platform.label,
        source: platform.source,
        dataQuality: "not-connected"
      },
      timestamp: new Date().toISOString()
    });
  }

  try {
    const payload = await fetchJson(sourceUrl);
    const extracted = extractCreatives(payload, requestedPlatform);
    const creatives = extracted.rows.map((row) => normalizeCreative(row, platform));

    return json(200, {
      ok: true,
      isLive: creatives.length > 0,
      platform: requestedPlatform,
      source: extracted.source || sourceUrl,
      creatives,
      meta: {
        ...extracted.meta,
        platform: platform.label,
        source: extracted.source || sourceUrl,
        dataQuality: creatives.length > 0 ? "verified" : "empty-live-source"
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return json(502, {
      ok: false,
      isLive: false,
      platform: requestedPlatform,
      source: sourceUrl,
      message: error.message,
      creatives: [],
      meta: {
        platform: platform.label,
        source: sourceUrl,
        dataQuality: "source-error"
      },
      timestamp: new Date().toISOString()
    });
  }
};
