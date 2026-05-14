(function () {
  const embeddedData = window.KC_TIKTOK_COMPETITOR_DATA;
  const data = {
    ...embeddedData,
    creatives: [...embeddedData.creatives],
    intelligence: [...embeddedData.intelligence],
    creativeBriefs: [...embeddedData.creativeBriefs],
    demographicHeatmap: [...embeddedData.demographicHeatmap]
  };

  const AUTO_REFRESH_MS = 15 * 60 * 1000;
  const palette = {
    "KICKS CREW": ["#111827", "#0f766e"],
    StockX: ["#113c2b", "#20a36b"],
    GOAT: ["#171717", "#737373"],
    "Stadium Goods": ["#243b53", "#d69e2e"],
    Namshi: ["#8a1238", "#f97316"],
    "SHEIN Arabic": ["#111827", "#ec4899"],
    OUNASS: ["#3f2a16", "#b88746"],
    "Level Shoes": ["#0f172a", "#7c3aed"]
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const state = {
    platform: "tiktok",
    view: "radar",
    query: "",
    side: "",
    brand: "",
    region: "",
    taxonomy: "",
    sourceState: "archive",
    sourceDetail: ""
  };

  const platformConfig = {
    tiktok: {
      label: "TikTok",
      badge: "TikTok view",
      source: "TikTok Ads Library (live)",
      dataUrl: ".netlify/functions/refresh-competitor-feeds?platform=tiktok",
      refreshUrl: ".netlify/functions/refresh-competitor-feeds?platform=tiktok",
      fallbackUrl: "data/raw/tiktok-ads-library-export.json",
      status: "needs-source"
    },
    meta: {
      label: "Meta",
      badge: "Meta view",
      source: "Meta Ads Library (live)",
      dataUrl: ".netlify/functions/refresh-competitor-feeds?platform=meta",
      refreshUrl: ".netlify/functions/refresh-competitor-feeds?platform=meta",
      fallbackUrl: "data/raw/meta-ads-library-export.json",
      status: "needs-source"
    },
    google: {
      label: "Google",
      badge: "Google view",
      source: "Google Ads Library (live)",
      dataUrl: ".netlify/functions/refresh-competitor-feeds?platform=google",
      refreshUrl: ".netlify/functions/refresh-competitor-feeds?platform=google",
      fallbackUrl: "data/raw/google-ads-library-export.json",
      status: "needs-source"
    },
    snapchat: {
      label: "Snapchat",
      badge: "Snapchat view",
      source: "Snapchat Ads Library (live)",
      dataUrl: ".netlify/functions/refresh-competitor-feeds?platform=snapchat",
      refreshUrl: ".netlify/functions/refresh-competitor-feeds?platform=snapchat",
      fallbackUrl: "data/raw/snapchat-ads-library-export.json",
      status: "needs-source"
    }
  };

  function fmtMoney(value) {
    return "$" + Math.round(value || 0).toLocaleString("en-US");
  }

  function fmtNumber(value, digits = 0) {
    return Number(value || 0).toLocaleString("en-US", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits
    });
  }

  function fmtMetric(value, formatter, fallback = "Not available") {
    return value == null || Number.isNaN(Number(value)) ? fallback : formatter(value);
  }

  function hasTrustedPerformance() {
    return state.sourceState === "live-feed" || data.meta?.dataQuality === "verified";
  }

  function esc(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function pickUrl(item, keys) {
    for (const key of keys) {
      const value = item?.[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
  }

  function normalizeCreative(item) {
    const thumbnailUrl = pickUrl(item, [
      "thumbnailUrl",
      "imageUrl",
      "previewImageUrl",
      "creativeThumbnailUrl",
      "displayUrl"
    ]);
    const videoUrl = pickUrl(item, [
      "videoUrl",
      "videoPlayUrl",
      "mediaUrl",
      "creativeVideoUrl",
      "adVideoUrl"
    ]);
    const mediaType = String(item.mediaType || item.format || (videoUrl ? "video" : "image")).toLowerCase();
    const taxonomy = Array.isArray(item.taxonomy) ? item.taxonomy : [];

    return {
      brand: item.brand || item.advertiserName || item.pageName || "Unknown brand",
      side: item.side || (item.brand === "KICKS CREW" ? "own" : "competitor"),
      format: item.format || mediaType,
      region: item.region || item.market || item.country || "Unknown",
      headline: item.headline || item.title || item.adName || item.adText || "Untitled ad",
      copy: item.copy || item.description || item.body || item.primaryText || "",
      hookText: item.hookText || item.hook || item.primaryText || item.copy || "",
      roas: item.roas ?? item.roasValue ?? item.roasScore ?? null,
      cpaUsd: item.cpaUsd ?? item.cpa ?? item.costPerResult ?? null,
      hookRate: item.hookRate ?? item.engagementRate ?? item.videoViewRate ?? null,
      spendUsd: item.spendUsd ?? item.spend ?? item.totalSpend ?? null,
      activeDays: item.activeDays ?? item.daysLive ?? item.durationDays ?? null,
      taxonomy,
      insight: item.insight || item.notes || item.commentary || "",
      thumbnailUrl,
      videoUrl,
      mediaType
    };
  }

  function extractFeed(payload) {
    const platformKey = state.platform;
    const nested = payload?.data?.[platformKey] || payload?.[platformKey] || payload;
    const creatives = Array.isArray(nested?.creatives)
      ? nested.creatives
      : Array.isArray(payload?.creatives)
        ? payload.creatives
        : [];
    return {
      ...nested,
      creatives,
      meta: nested?.meta || payload?.meta || {},
      isLive: Boolean(nested?.isLive || payload?.isLive || payload?.cacheStatus === "live"),
      source: nested?.source || payload?.source || nested?.meta?.source || ""
    };
  }

  function platformRows(platform) {
    const label = platformConfig[platform]?.label || "TikTok";
    return data.creatives.map((item) => ({
      ...item,
      platform: label,
      sourcePlatform: label
    }));
  }

  function currentPlatformConfig() {
    return platformConfig[state.platform] || platformConfig.tiktok;
  }

  function filteredCreatives() {
    const q = state.query.toLowerCase();
    return platformRows(state.platform).filter((item) => {
      if (state.side && item.side !== state.side) return false;
      if (state.brand && item.brand !== state.brand) return false;
      if (state.region && item.region !== state.region) return false;
      if (state.taxonomy && !item.taxonomy.includes(state.taxonomy)) return false;
      if (!q) return true;
      return [item.brand, item.headline, item.copy, item.hookText, item.region, item.insight, ...item.taxonomy]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }

  function brandStats(rows) {
    const byBrand = new Map();
    rows.forEach((item) => {
      const current = byBrand.get(item.brand) || {
        brand: item.brand,
        side: item.side,
        count: 0,
        spend: 0,
        roasSpend: 0,
        cpaSpend: 0,
        hookRate: 0,
        hooks: 0
      };
      current.count += 1;
      current.spend += Number(item.spendUsd || 0);
      current.roasSpend += Number(item.roas || 0) * Number(item.spendUsd || 0);
      current.cpaSpend += Number(item.cpaUsd || 0) * Number(item.spendUsd || 0);
      if (item.hookRate != null) {
        current.hookRate += Number(item.hookRate);
        current.hooks += 1;
      }
      byBrand.set(item.brand, current);
    });
    return [...byBrand.values()].map((item) => ({
      ...item,
      avgRoas: item.roasSpend / Math.max(item.spend, 1),
      avgCpa: item.cpaSpend / Math.max(item.spend, 1),
      avgHookRate: item.hookRate / Math.max(item.hooks, 1)
    }));
  }

  function renderStatus() {
    const live = data.latestRefresh;
    const liveText = live
      ? `Live KPI refresh: ${fmtNumber(live.metrics.totalCreatives)} creatives, ${fmtNumber(live.metrics.videoCount)} videos, ${fmtNumber(live.metrics.imageCount)} images, ${fmtMoney(live.metrics.totalSpend)} spend, ${fmtNumber(live.metrics.avgRoas, 1)}x ROAS.`
      : "Live KPI refresh has not run yet in this package.";
    const platform = currentPlatformConfig();
    const sourceText =
      state.sourceState === "live-feed"
        ? `Live creative rows loaded from ${state.sourceDetail || platform.source}.`
        : state.sourceState === "live-kpi"
          ? "Live KPI snapshot refreshed. Row-level creative metrics still need a verified feed."
          : state.sourceState === "refreshing"
            ? `Refreshing ${platform.label} data...`
            : `No verified live ${platform.label} row feed is connected yet. Showing archived structure without trusted performance numbers.`;
    $("#statusLine").innerHTML = `
      <strong>${platform.badge}</strong>
      <span>${esc(sourceText)} ${live ? `Last KPI pull: ${esc(live.pulledAt)}.` : ""}</span>
    `;
    const legend = $("#platformLegend");
    if (legend) {
      legend.innerHTML = Object.entries(platformConfig)
        .map(([key, item]) => {
          const active = key === state.platform ? " active" : "";
          const statusText = state.sourceState === "live-feed" && key === state.platform ? "live rows" : "source needed";
          return `<span class="platform-chip${active}">${esc(item.label)} · ${esc(statusText)}</span>`;
        })
        .join("");
    }
    const badge = $("#liveBadge");
    if (badge) {
      badge.classList.toggle("is-live", state.sourceState === "live-feed" || state.sourceState === "live-kpi");
      badge.classList.toggle("is-refreshing", state.sourceState === "refreshing");
      const label = badge.querySelector(".live-text");
      if (label) {
        label.textContent =
          state.sourceState === "live-feed"
            ? `${platform.label} live rows`
            : state.sourceState === "live-kpi"
              ? "Live KPI only"
              : state.sourceState === "refreshing"
                ? "Refreshing..."
                : `${platform.label} source needed`;
      }
    }
  }

  function renderMetrics(rows) {
    const own = rows.filter((item) => item.side === "own");
    const competitors = rows.filter((item) => item.side === "competitor");
    const trusted = hasTrustedPerformance();
    const rowsWithSpend = rows.filter((item) => item.spendUsd != null);
    const spend = rowsWithSpend.reduce((sum, item) => sum + Number(item.spendUsd || 0), 0);
    const avgRoas = rowsWithSpend.reduce((sum, item) => sum + Number(item.roas || 0) * Number(item.spendUsd || 0), 0) / Math.max(spend, 1);
    const rowsWithHook = rows.filter((item) => item.hookRate != null);
    const avgHook = rowsWithHook.reduce((sum, item) => sum + Number(item.hookRate || 0), 0) / Math.max(rowsWithHook.length, 1);
    const brandCount = new Set(rows.map((item) => item.brand)).size;
    const cards = [
      ["KC benchmark rows", own.length, "Non-live KC reference set"],
      ["Competitor rows", competitors.length, "Tracked external ads"],
      ["Brands visible", brandCount, "Current filter set"],
      ["Spend", trusted ? fmtMetric(spend, fmtMoney) : "Needs source", trusted ? "Verified row-level spend" : "Not shown from sample data"],
      ["ROAS / hook", trusted ? `${fmtNumber(avgRoas, 1)}x / ${fmtNumber(avgHook, 0)}%` : "Needs source", trusted ? "Weighted by spend / first 3 seconds" : "No random performance numbers"]
    ];
    $("#metricGrid").innerHTML = cards
      .map(
        ([label, value, note]) => `
      <section class="metric-card">
        <div class="mini-label">${label}</div>
        <div class="metric-value">${value}</div>
        <div class="metric-note">${note}</div>
      </section>
    `
      )
      .join("");
  }

  function renderCreatives(rows) {
    if (!rows.length) {
      $("#creativeGrid").innerHTML = `<div class="empty-state"><strong>No creatives match these filters.</strong><p>Clear one filter or search more broadly.</p></div>`;
      return;
    }
    $("#creativeGrid").innerHTML = rows
      .map((item) => {
        const [a, b] = palette[item.brand] || ["#1f2937", "#64748b"];
        const mediaClass = `creative-visual creative-media ${item.mediaType === "video" ? "has-video" : "has-image"}`;
        const mediaMarkup = item.thumbnailUrl
          ? `<div class="creative-thumb"><img src="${esc(item.thumbnailUrl)}" alt="${esc(item.headline)}"></div>`
          : item.videoUrl
            ? `<div class="creative-thumb"><video src="${esc(item.videoUrl)}" muted playsinline preload="metadata"></video></div>`
            : `<div class="creative-thumb-fallback">${esc(item.brand)} creative<br><span style="font-weight:600;opacity:.85">Media asset pending from source</span></div>`;
        return `
        <article class="creative-card" style="--brand-a:${a};--brand-b:${b}">
          <div class="${mediaClass}">
            ${mediaMarkup}
            <div class="visual-brand">${esc(item.brand)}</div>
            <div class="visual-copy">${esc(item.headline)}</div>
          </div>
          <div class="creative-body">
            <div class="creative-row">
              <span class="pill ${item.side}">${item.side === "own" ? "KC benchmark" : "Competitor"}</span>
              <span class="pill">${esc(item.platform || currentPlatformConfig().label)}</span>
              <span class="pill">${esc(item.format)} · ${esc(item.region)}</span>
            </div>
            <h3>${esc(item.headline)}</h3>
            <p>${esc(item.copy)}</p>
            <p><strong>Hook:</strong> ${esc(item.hookText)}</p>
            <div class="creative-meta">
              <span>${hasTrustedPerformance() ? fmtMetric(item.spendUsd, (value) => `${fmtMoney(value)} spend`) : "Spend not verified"}</span>
              <span>${fmtMetric(item.activeDays, (value) => `${fmtNumber(value)} days live`, "Dates unavailable")}</span>
              <span>${esc(item.region)}</span>
            </div>
            <div class="stats-line">
              <div class="stat-box"><span class="mini-label">ROAS</span><strong>${hasTrustedPerformance() ? fmtMetric(item.roas, (value) => `${fmtNumber(value, 1)}x`) : "Needs source"}</strong></div>
              <div class="stat-box"><span class="mini-label">CPA</span><strong>${hasTrustedPerformance() ? fmtMetric(item.cpaUsd, fmtMoney) : "Needs source"}</strong></div>
              <div class="stat-box"><span class="mini-label">Hook</span><strong>${hasTrustedPerformance() ? fmtMetric(item.hookRate, (value) => `${fmtNumber(value)}%`) : "Needs source"}</strong></div>
            </div>
            <p>${esc(item.insight)}</p>
            <div class="tags">${item.taxonomy.slice(0, 6).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div>
          </div>
        </article>
      `;
      })
      .join("");
  }

  function renderComparison(rows) {
    const stats = brandStats(rows).sort((a, b) => b.avgRoas - a.avgRoas);
    $("#comparisonTable").innerHTML = stats
      .map(
        (item) => `
      <tr>
        <td><strong>${esc(item.brand)}</strong><span class="pill ${item.side}">${item.side === "own" ? "Benchmark" : "Competitor"}</span></td>
        <td>${item.count}</td>
        <td>${hasTrustedPerformance() ? fmtMoney(item.spend) : "Needs source"}</td>
        <td>${hasTrustedPerformance() ? `${fmtNumber(item.avgRoas, 1)}x` : "Needs source"}</td>
        <td>${hasTrustedPerformance() ? fmtMoney(item.avgCpa) : "Needs source"}</td>
        <td>${hasTrustedPerformance() ? `${fmtNumber(item.avgHookRate)}%` : "Needs source"}</td>
      </tr>
    `
      )
      .join("");

    const max = Math.max(...stats.map((item) => item.avgRoas), 1);
    $("#comparisonBars").innerHTML = stats
      .map(
        (item) => `
      <div class="bar-row">
        <strong>${esc(item.brand)}</strong>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max((item.avgRoas / max) * 100, 4)}%"></div></div>
        <span>${hasTrustedPerformance() ? `${fmtNumber(item.avgRoas, 1)}x` : "Needs source"}</span>
      </div>
    `
      )
      .join("");
  }

  function renderHooks(rows) {
    const videoRows = rows.filter((item) => item.format === "video").sort((a, b) => Number(b.hookRate || 0) - Number(a.hookRate || 0));
    $("#hookTable").innerHTML = videoRows
      .map(
        (item) => `
      <tr>
        <td><strong>${esc(item.brand)}</strong>${esc(item.region)}</td>
        <td>${esc(item.hookText)}</td>
        <td>${hasTrustedPerformance() ? fmtMetric(item.hookRate, (value) => `${fmtNumber(value)}%`) : "Needs source"}</td>
        <td>${hasTrustedPerformance() ? fmtMetric(item.roas, (value) => `${fmtNumber(value, 1)}x`) : "Needs source"}</td>
        <td>${esc(item.taxonomy.find((tag) => data.meta.taxonomy.hookTactic.includes(tag)) || "Unclassified")}</td>
      </tr>
    `
      )
      .join("");
  }

  function renderHeatmap() {
    $("#heatmap").innerHTML = data.demographicHeatmap
      .map(
        (item) => `
      <div class="heat-cell" style="--score:${Math.min(item.roas, 14)}">
        <span class="mini-label">${esc(item.region)} · ${esc(item.age)} · ${esc(item.gender)}</span>
        <strong>${fmtNumber(item.roas, 1)}x</strong>
        <span>ROAS</span>
      </div>
    `
      )
      .join("");
  }

  function renderIntelligence() {
    $("#intelList").innerHTML = data.intelligence
      .map(
        (item) => `
      <article class="intel-card">
        <span class="priority ${item.priority.toLowerCase()}">${esc(item.priority)}</span>
        <h3>${esc(item.title)}</h3>
        <p><strong>Why:</strong> ${esc(item.why)}</p>
        <p><strong>Action:</strong> ${esc(item.action)}</p>
      </article>
    `
      )
      .join("");
  }

  function renderBriefs() {
    $("#briefGrid").innerHTML = data.creativeBriefs
      .map(
        (item) => `
      <article class="brief-card">
        <span class="pill">${esc(item.format)}</span>
        <h3>${esc(item.title)}</h3>
        <p><strong>Audience:</strong> ${esc(item.audience)}</p>
        <p><strong>Hook:</strong> ${esc(item.hook)}</p>
        <ul>${item.scenes.map((scene) => `<li>${esc(scene)}</li>`).join("")}</ul>
        <p>${esc(item.why)}</p>
      </article>
    `
      )
      .join("");
  }

  function renderRegional(rows) {
    const regions = data.meta.trackedRegions.map((region) => {
      const inRegion = rows.filter((item) => item.region === region);
      const spend = inRegion.reduce((sum, item) => sum + Number(item.spendUsd || 0), 0);
      const roas = inRegion.reduce((sum, item) => sum + Number(item.roas || 0) * Number(item.spendUsd || 0), 0) / Math.max(spend, 1);
      return { region, count: inRegion.length, brands: new Set(inRegion.map((item) => item.brand)).size, spend, roas };
    });
    $("#regionalTable").innerHTML = regions
      .map(
        (item) => `
      <tr>
        <td><strong>${esc(item.region)}</strong></td>
        <td>${item.count}</td>
        <td>${item.brands}</td>
        <td>${hasTrustedPerformance() ? fmtMoney(item.spend) : "Needs source"}</td>
        <td>${hasTrustedPerformance() ? `${fmtNumber(item.roas, 1)}x` : "Needs source"}</td>
      </tr>
    `
      )
      .join("");
  }

  function renderTaxonomyOptions() {
    const tags = [...new Set(data.creatives.flatMap((item) => item.taxonomy))].sort();
    $("#taxonomyFilter").innerHTML =
      `<option value="">All taxonomy tags</option>` + tags.map((tag) => `<option value="${esc(tag)}">${esc(tag)}</option>`).join("");
  }

  function populateFilters() {
    $("#brandFilter").innerHTML =
      `<option value="">All brands</option>` + data.meta.trackedBrands.map((brand) => `<option value="${esc(brand)}">${esc(brand)}</option>`).join("");
    $("#regionFilter").innerHTML =
      `<option value="">All regions</option>` + data.meta.trackedRegions.map((region) => `<option value="${esc(region)}">${esc(region)}</option>`).join("");
    renderTaxonomyOptions();
  }

  function render() {
    const rows = filteredCreatives();
    renderStatus();
    renderMetrics(rows);
    renderCreatives(rows);
    renderComparison(rows);
    renderHooks(rows);
    renderRegional(rows);
    renderHeatmap();
    renderIntelligence();
    renderBriefs();
  }

  function tryLoadLiveCreativeFeed() {
    const platform = currentPlatformConfig();
    const feed = data.creatives.filter((item) => item && typeof item === "object").map(normalizeCreative);
    if (!feed.length) return false;
    data.creatives = feed.map((item) => ({ ...item, platform: platform.label, sourcePlatform: platform.label }));
    state.sourceState = "archive";
    return true;
  }

  async function refreshLiveSnapshot() {
    try {
      state.sourceState = "refreshing";
      renderStatus();
      const platform = currentPlatformConfig();
      const response = await fetch(platform.refreshUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const metrics = payload.metrics || payload.latestRefresh?.metrics || {};
      const required = ["totalCreatives", "videoCount", "imageCount", "brandsTracked", "totalSpend", "avgRoas"];
      const missing = required.filter((key) => metrics[key] == null);
      if (missing.length) {
        throw new Error(`Refresh payload is missing required KPI fields: ${missing.join(", ")}`);
      }
      data.latestRefresh = {
        source: platform.refreshUrl,
        pulledAt: new Date().toISOString(),
        endpointTimestamp: payload.timestamp || payload.latestRefresh?.endpointTimestamp || null,
        status: payload.status || payload.latestRefresh?.status || "success",
        message: payload.message || payload.latestRefresh?.message || "Dashboard refresh completed",
        metrics
      };
      if (state.sourceState !== "live-feed") state.sourceState = "live-kpi";
      renderStatus();
    } catch (error) {
      console.warn("Auto-refresh skipped:", error);
      if (state.sourceState !== "live-feed") state.sourceState = "archive";
      renderStatus();
    }
  }

  async function tryLoadPlatformFeed() {
    const platform = currentPlatformConfig();
    if (!platform.dataUrl) return false;

    // Try live endpoint first
    try {
      const response = await fetch(platform.dataUrl, { cache: "no-store" });
      if (response.ok) {
        const payload = extractFeed(await response.json());
        const rows = payload.creatives.map(normalizeCreative);
        if (rows.length > 0) {
          data.creatives = rows.map((item) => ({ ...item, platform: platform.label, sourcePlatform: platform.label }));
          if (Array.isArray(payload.intelligence)) data.intelligence = payload.intelligence;
          if (Array.isArray(payload.creativeBriefs)) data.creativeBriefs = payload.creativeBriefs;
          if (Array.isArray(payload.demographicHeatmap)) data.demographicHeatmap = payload.demographicHeatmap;
          if (payload.meta) data.meta = { ...data.meta, ...payload.meta };
          state.sourceState = payload.isLive ? "live-feed" : "archive";
          state.sourceDetail = payload.source || platform.source;
          populateFilters();
          return true;
        }
      }
    } catch (error) {
      console.warn(`Live feed load failed for ${state.platform}:`, error.message);
    }

    // Fall back to archived rows only; never present them as live performance.
    if (platform.fallbackUrl) {
      try {
        const response = await fetch(platform.fallbackUrl, { cache: "no-store" });
        if (response.ok) {
          const payload = await response.json();
          const rows = Array.isArray(payload.creatives) ? payload.creatives.map(normalizeCreative) : [];
          if (rows.length > 0) {
            data.creatives = rows.map((item) => ({ ...item, platform: platform.label, sourcePlatform: platform.label }));
            if (Array.isArray(payload.intelligence)) data.intelligence = payload.intelligence;
            if (Array.isArray(payload.creativeBriefs)) data.creativeBriefs = payload.creativeBriefs;
            if (Array.isArray(payload.demographicHeatmap)) data.demographicHeatmap = payload.demographicHeatmap;
            if (payload.meta) data.meta = { ...data.meta, ...payload.meta };
            state.sourceState = "archive";
            state.sourceDetail = "archived local feed";
            populateFilters();
            return true;
          }
        }
      } catch (error) {
        console.warn(`Fallback feed load failed for ${state.platform}:`, error.message);
      }
    }

    return false;
  }

  function bind() {
    $$(".platform-tabs button").forEach((button) => {
      button.addEventListener("click", async () => {
        state.platform = button.dataset.platform;
        $$(".platform-tabs button").forEach((btn) => btn.classList.toggle("active", btn === button));
        await tryLoadPlatformFeed();
        render();
      });
    });
    $$(".nav-tabs button").forEach((button) => {
      button.addEventListener("click", () => {
        state.view = button.dataset.view;
        $$(".nav-tabs button").forEach((btn) => btn.classList.toggle("active", btn === button));
        $$(".view").forEach((view) => view.classList.toggle("active", view.id === `${state.view}View`));
      });
    });
    $("#searchFilter").addEventListener("input", (event) => {
      state.query = event.target.value;
      render();
    });
    $("#sideFilter").addEventListener("change", (event) => {
      state.side = event.target.value;
      render();
    });
    $("#brandFilter").addEventListener("change", (event) => {
      state.brand = event.target.value;
      render();
    });
    $("#regionFilter").addEventListener("change", (event) => {
      state.region = event.target.value;
      render();
    });
    $("#taxonomyFilter").addEventListener("change", (event) => {
      state.taxonomy = event.target.value;
      render();
    });
    $("#resetFilters").addEventListener("click", () => {
      state.query = "";
      state.side = "";
      state.brand = "";
      state.region = "";
      state.taxonomy = "";
      ["#searchFilter", "#sideFilter", "#brandFilter", "#regionFilter", "#taxonomyFilter"].forEach((selector) => {
        $(selector).value = "";
      });
      render();
    });
    const refreshButton = $("#refreshNowButton");
    if (refreshButton) {
      refreshButton.addEventListener("click", async () => {
        refreshButton.disabled = true;
        refreshButton.textContent = "Refreshing...";
        await tryLoadPlatformFeed();
        if (state.sourceState !== "live-feed") await refreshLiveSnapshot();
        render();
        refreshButton.textContent = "Refresh now";
        refreshButton.disabled = false;
      });
    }
  }

  populateFilters();
  bind();
  tryLoadPlatformFeed().finally(() => {
    tryLoadLiveCreativeFeed();
    render();
    refreshLiveSnapshot();
    window.setInterval(refreshLiveSnapshot, AUTO_REFRESH_MS);
  });
})();
