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
    sourceState: "embedded"
  };

  const platformConfig = {
    tiktok: {
      label: "TikTok",
      badge: "TikTok view",
      source: "TikTok Ads Library / benchmark sample",
      dataUrl: "data/raw/tiktok-ads-library-export.json",
      refreshUrl: data.latestRefresh?.source || embeddedData.meta.refreshSource,
      status: "sample"
    },
    meta: {
      label: "Meta",
      badge: "Meta view",
      source: "Meta Ads Library / benchmark sample",
      dataUrl: "data/raw/meta-ads-library-export.json",
      refreshUrl: "data/raw/meta-ads-library-export.json",
      status: "sample"
    },
    google: {
      label: "Google",
      badge: "Google view",
      source: "Google Ads sample",
      dataUrl: "data/raw/google-ads-library-export.json",
      refreshUrl: "data/raw/google-ads-library-export.json",
      status: "sample"
    },
    snapchat: {
      label: "Snapchat",
      badge: "Snapchat view",
      source: "Snapchat Ads sample",
      dataUrl: "data/raw/snapchat-ads-library-export.json",
      refreshUrl: "data/raw/snapchat-ads-library-export.json",
      status: "sample"
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
      roas: Number(item.roas || item.roasValue || item.roasScore || 0),
      cpaUsd: Number(item.cpaUsd || item.cpa || item.costPerResult || 0),
      hookRate: Number(item.hookRate || item.engagementRate || item.videoViewRate || 0),
      spendUsd: Number(item.spendUsd || item.spend || item.totalSpend || 0),
      activeDays: Number(item.activeDays || item.daysLive || item.durationDays || 0),
      taxonomy,
      insight: item.insight || item.notes || item.commentary || "",
      thumbnailUrl,
      videoUrl,
      mediaType
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
      current.spend += item.spendUsd;
      current.roasSpend += item.roas * item.spendUsd;
      current.cpaSpend += item.cpaUsd * item.spendUsd;
      current.hookRate += item.hookRate;
      current.hooks += 1;
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
        ? `Creative feed loaded from ${platform.source}.`
        : state.sourceState === "live-kpi"
          ? `KPI snapshot refreshed from ${platform.refreshUrl}.`
          : `Using embedded ${platform.label} sample until the live feed is available.`;
    $("#statusLine").innerHTML = `
      <strong>${platform.badge}</strong>
      <span>${esc(sourceText)} ${live ? `Pulled ${esc(live.pulledAt)}.` : ""}</span>
    `;
    const legend = $("#platformLegend");
    if (legend) {
      legend.innerHTML = Object.entries(platformConfig)
        .map(([key, item]) => {
          const active = key === state.platform ? " active" : "";
          return `<span class="platform-chip${active}">${esc(item.label)} · ${esc(item.status)}</span>`;
        })
        .join("");
    }
    const badge = $("#liveBadge");
    if (badge) {
      badge.classList.toggle("is-live", state.sourceState !== "embedded");
      badge.classList.toggle("is-refreshing", state.sourceState === "refreshing");
      const label = badge.querySelector(".live-text");
      if (label) {
        label.textContent =
          state.sourceState === "live-feed"
            ? `${platform.label} feed`
            : state.sourceState === "live-kpi"
              ? "Live KPI snapshot"
              : state.sourceState === "refreshing"
                ? "Refreshing..."
                : `${platform.label} sample`;
      }
    }
  }

  function renderMetrics(rows) {
    const own = rows.filter((item) => item.side === "own");
    const competitors = rows.filter((item) => item.side === "competitor");
    const spend = rows.reduce((sum, item) => sum + item.spendUsd, 0);
    const avgRoas = rows.reduce((sum, item) => sum + item.roas * item.spendUsd, 0) / Math.max(spend, 1);
    const avgHook = rows.reduce((sum, item) => sum + item.hookRate, 0) / Math.max(rows.length, 1);
    const cards = [
      ["KC benchmark rows", own.length, "Non-live KC reference set"],
      ["Competitor rows", competitors.length, "Tracked external ads"],
      ["Est. spend", fmtMoney(spend), "Row-level sample spend"],
      ["Avg ROAS", `${fmtNumber(avgRoas, 1)}x`, "Weighted by spend"],
      ["Avg hook rate", `${fmtNumber(avgHook, 0)}%`, "First 3 seconds"]
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
            : `<div class="creative-thumb-fallback">${esc(item.brand)} creative<br><span style="font-weight:600;opacity:.85">No image URL in source yet</span></div>`;
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
              <span>${fmtMoney(item.spendUsd)} spend</span>
              <span>${fmtNumber(item.activeDays)} days live</span>
              <span>${esc(item.region)}</span>
            </div>
            <div class="stats-line">
              <div class="stat-box"><span class="mini-label">ROAS</span><strong>${fmtNumber(item.roas, 1)}x</strong></div>
              <div class="stat-box"><span class="mini-label">CPA</span><strong>${fmtMoney(item.cpaUsd)}</strong></div>
              <div class="stat-box"><span class="mini-label">Hook</span><strong>${fmtNumber(item.hookRate)}%</strong></div>
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
        <td>${fmtMoney(item.spend)}</td>
        <td>${fmtNumber(item.avgRoas, 1)}x</td>
        <td>${fmtMoney(item.avgCpa)}</td>
        <td>${fmtNumber(item.avgHookRate)}%</td>
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
        <span>${fmtNumber(item.avgRoas, 1)}x</span>
      </div>
    `
      )
      .join("");
  }

  function renderHooks(rows) {
    const videoRows = rows.filter((item) => item.format === "video").sort((a, b) => b.hookRate - a.hookRate);
    $("#hookTable").innerHTML = videoRows
      .map(
        (item) => `
      <tr>
        <td><strong>${esc(item.brand)}</strong>${esc(item.region)}</td>
        <td>${esc(item.hookText)}</td>
        <td>${fmtNumber(item.hookRate)}%</td>
        <td>${fmtNumber(item.roas, 1)}x</td>
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
      const spend = inRegion.reduce((sum, item) => sum + item.spendUsd, 0);
      const roas = inRegion.reduce((sum, item) => sum + item.roas * item.spendUsd, 0) / Math.max(spend, 1);
      return { region, count: inRegion.length, brands: new Set(inRegion.map((item) => item.brand)).size, spend, roas };
    });
    $("#regionalTable").innerHTML = regions
      .map(
        (item) => `
      <tr>
        <td><strong>${esc(item.region)}</strong></td>
        <td>${item.count}</td>
        <td>${item.brands}</td>
        <td>${fmtMoney(item.spend)}</td>
        <td>${fmtNumber(item.roas, 1)}x</td>
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
    state.sourceState = "embedded";
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
      state.sourceState = "live-kpi";
      renderStatus();
    } catch (error) {
      console.warn("Auto-refresh skipped:", error);
      state.sourceState = "embedded";
      renderStatus();
    }
  }

  async function tryLoadPlatformFeed() {
    const platform = currentPlatformConfig();
    if (!platform.dataUrl) return false;
    try {
      const response = await fetch(platform.dataUrl, { cache: "no-store" });
      if (!response.ok) return false;
      const payload = await response.json();
      const rows = Array.isArray(payload.creatives) ? payload.creatives.map(normalizeCreative) : [];
      if (!rows.length) return false;
      data.creatives = rows.map((item) => ({ ...item, platform: platform.label, sourcePlatform: platform.label }));
      if (Array.isArray(payload.intelligence)) data.intelligence = payload.intelligence;
      if (Array.isArray(payload.creativeBriefs)) data.creativeBriefs = payload.creativeBriefs;
      if (Array.isArray(payload.demographicHeatmap)) data.demographicHeatmap = payload.demographicHeatmap;
      if (payload.meta) data.meta = { ...data.meta, ...payload.meta };
      state.sourceState = platform.status === "connected" ? "live-feed" : "embedded";
      populateFilters();
      return true;
    } catch (error) {
      return false;
    }
  }

  function bind() {
    $$(".platform-tabs button").forEach((button) => {
      button.addEventListener("click", () => {
        state.platform = button.dataset.platform;
        $$(".platform-tabs button").forEach((btn) => btn.classList.toggle("active", btn === button));
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
        await refreshLiveSnapshot();
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
