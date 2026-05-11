(function () {
  const data = window.KC_TIKTOK_COMPETITOR_DATA;
  const mode = document.body.dataset.dashboardMode || "global";

  const els = {
    brand: document.querySelector("#brandFilter"),
    region: document.querySelector("#regionFilter"),
    format: document.querySelector("#formatFilter"),
    search: document.querySelector("#searchFilter"),
    reset: document.querySelector("#resetFilters"),
    grid: document.querySelector("#creativeGrid"),
    brandTable: document.querySelector("#brandTable"),
    regionalTable: document.querySelector("#regionalTable"),
    anomalyList: document.querySelector("#anomalyList"),
    cards: document.querySelector("#metricCards"),
    bars: document.querySelector("#barChart"),
    status: document.querySelector("#dataStatus")
  };

  function money(value) {
    return "$" + Math.round(value).toLocaleString("en-US");
  }

  function number(value, digits) {
    return Number(value).toLocaleString("en-US", {
      maximumFractionDigits: digits || 0,
      minimumFractionDigits: digits || 0
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function matchesFilters(item) {
    const brand = els.brand ? els.brand.value : "";
    const region = els.region ? els.region.value : "";
    const format = els.format ? els.format.value : "";
    const search = els.search ? els.search.value.trim().toLowerCase() : "";

    if (brand && item.brand !== brand) return false;
    if (region && item.region !== region) return false;
    if (format && item.format !== format) return false;
    if (search) {
      const haystack = [item.brand, item.headline, item.copy, item.angle, item.region]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  }

  function filteredCreatives() {
    return data.creatives.filter(matchesFilters);
  }

  function summaryForVisibleBrands(creatives) {
    const visibleBrands = new Set(creatives.map((item) => item.brand));
    return data.creativeSummary.filter((item) => visibleBrands.has(item.brand));
  }

  function renderMetricCards(creatives, summaries) {
    const videos = creatives.filter((item) => item.format === "video").length;
    const images = creatives.filter((item) => item.format === "image").length;
    const spend = summaries.reduce((sum, item) => sum + item.estimatedSpendUsd, 0);
    const avgRoas =
      summaries.reduce((sum, item) => sum + item.avgRoas * item.estimatedSpendUsd, 0) /
      Math.max(spend, 1);
    const avgCpa =
      summaries.reduce((sum, item) => sum + item.avgCpaUsd * item.estimatedSpendUsd, 0) /
      Math.max(spend, 1);

    const live = data.latestRefresh && data.latestRefresh.metrics;
    const cards = live
      ? [
          ["Live creative count", number(live.totalCreatives), "From Claude/Vercel refresh endpoint"],
          ["Live video / image", `${number(live.videoCount)} / ${number(live.imageCount)}`, "Latest endpoint split"],
          ["Live total spend", money(live.totalSpend), "Latest endpoint metric"],
          ["Live avg ROAS", `${number(live.avgRoas, 1)}x`, "Latest endpoint metric"]
        ]
      : [
          ["Visible creatives", number(creatives.length), "Filtered sample records"],
          ["Video / image", `${videos} / ${images}`, "Creative format split"],
          ["Estimated spend", money(spend), "From imported summary"],
          ["Avg ROAS / CPA", `${number(avgRoas, 1)}x / ${money(avgCpa)}`, "Directional only"]
        ];

    els.cards.innerHTML = cards
      .map(
        ([label, value, detail]) => `
        <section class="metric-card">
          <div class="metric-label">${label}</div>
          <div class="metric-value">${value}</div>
          <div class="metric-detail">${detail}</div>
        </section>`
      )
      .join("");
  }

  function renderBrandTable(summaries) {
    els.brandTable.innerHTML = summaries
      .sort((a, b) => b.estimatedSpendUsd - a.estimatedSpendUsd)
      .map(
        (item) => `
        <tr>
          <td><strong>${escapeHtml(item.brand)}</strong><span class="risk ${item.riskLevel.toLowerCase()}">${item.riskLevel}</span></td>
          <td>${item.count}</td>
          <td>${item.videos} / ${item.images}</td>
          <td>${money(item.estimatedSpendUsd)}</td>
          <td>${number(item.avgRoas, 1)}x</td>
          <td>${money(item.avgCpaUsd)}</td>
          <td>${escapeHtml(item.primaryAngle)}</td>
          <td>${escapeHtml(item.action)}</td>
        </tr>`
      )
      .join("");
  }

  function renderRegionalTable(creatives) {
    if (!els.regionalTable) return;

    const rows = data.meta.trackedRegions.map((region) => {
      const inRegion = creatives.filter((item) => item.region === region);
      const brands = new Set(inRegion.map((item) => item.brand)).size;
      const videos = inRegion.filter((item) => item.format === "video").length;
      const images = inRegion.filter((item) => item.format === "image").length;
      return { region, count: inRegion.length, brands, videos, images };
    });

    els.regionalTable.innerHTML = rows
      .map(
        (item) => `
        <tr>
          <td><strong>${escapeHtml(item.region)}</strong></td>
          <td>${item.count}</td>
          <td>${item.brands}</td>
          <td>${item.videos}</td>
          <td>${item.images}</td>
        </tr>`
      )
      .join("");
  }

  function renderCreatives(creatives) {
    if (!creatives.length) {
      els.grid.innerHTML = `
        <section class="empty-state">
          <h3>No creatives match these filters</h3>
          <p>Clear one filter or use a broader search term.</p>
        </section>`;
      return;
    }

    els.grid.innerHTML = creatives
      .map(
        (item) => `
        <article class="creative-card">
          <div class="creative-topline">
            <span class="brand-pill">${escapeHtml(item.brand)}</span>
            <span class="format-pill ${item.format}">${escapeHtml(item.format)}</span>
          </div>
          <h3>${escapeHtml(item.headline)}</h3>
          <p>${escapeHtml(item.copy)}</p>
          <dl>
            <div><dt>Region</dt><dd>${escapeHtml(item.region)}</dd></div>
            <div><dt>Angle</dt><dd>${escapeHtml(item.angle)}</dd></div>
            <div><dt>ID</dt><dd>${escapeHtml(item.creativeId)}</dd></div>
          </dl>
        </article>`
      )
      .join("");
  }

  function renderBars(summaries) {
    const maxSpend = Math.max(...summaries.map((item) => item.estimatedSpendUsd), 1);
    els.bars.innerHTML = summaries
      .sort((a, b) => b.estimatedSpendUsd - a.estimatedSpendUsd)
      .map((item) => {
        const width = Math.max((item.estimatedSpendUsd / maxSpend) * 100, 4);
        return `
          <div class="bar-row">
            <div class="bar-label">${escapeHtml(item.brand)}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
            <div class="bar-value">${money(item.estimatedSpendUsd)}</div>
          </div>`;
      })
      .join("");
  }

  function renderAnomalies() {
    els.anomalyList.innerHTML = data.anomalies
      .map(
        (item) => `
        <article class="anomaly-card ${item.severity.toLowerCase()}">
          <strong>${escapeHtml(item.severity)}: ${escapeHtml(item.brand)}</strong>
          <span>${escapeHtml(item.type)}</span>
          <p>${escapeHtml(item.finding)}</p>
          <small>${escapeHtml(item.action)}</small>
        </article>`
      )
      .join("");
  }

  function renderStatus() {
    const refresh = data.latestRefresh
      ? ` Auto refresh last pulled ${escapeHtml(data.latestRefresh.pulledAt)} from ${escapeHtml(data.latestRefresh.source)}.`
      : "";
    els.status.innerHTML = `
      <strong>Data status:</strong> ${escapeHtml(data.meta.confidence)}
      <span>Updated ${escapeHtml(data.meta.updatedAt)}. ${escapeHtml(data.meta.period)}.${refresh}</span>`;
  }

  function render() {
    const creatives = filteredCreatives();
    const summaries = summaryForVisibleBrands(creatives);
    renderMetricCards(creatives, summaries);
    renderBrandTable(summaries);
    renderRegionalTable(creatives);
    renderCreatives(creatives);
    renderBars(summaries);
  }

  function populateFilters() {
    data.meta.trackedBrands.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      els.brand.appendChild(option);
    });

    if (els.region) {
      data.meta.trackedRegions.forEach((region) => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        els.region.appendChild(option);
      });
    }
  }

  function bindEvents() {
    [els.brand, els.region, els.format, els.search].forEach((el) => {
      if (!el) return;
      el.addEventListener(el.tagName === "INPUT" ? "input" : "change", render);
    });
    els.reset.addEventListener("click", () => {
      [els.brand, els.region, els.format, els.search].forEach((el) => {
        if (el) el.value = "";
      });
      render();
    });
  }

  populateFilters();
  renderStatus();
  renderAnomalies();
  bindEvents();

  if (mode === "regional" && els.region && !els.region.value) {
    els.region.focus();
  }

  render();
})();
