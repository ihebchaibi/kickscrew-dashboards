window.KC_TIKTOK_COMPETITOR_DATA = {
  meta: {
    project: "KICKS CREW ME TikTok Competitor Intelligence",
    updatedAt: "2026-05-10",
    refreshSource: "https://kickscrew-dashboards.vercel.app/api/refresh",
    period: "Imported sample from Claude/Motion handoff, originally dated 2026-05-08",
    source: "Workspace dashboard samples plus Claude handoff notes",
    confidence:
      "Directional sample. Use for creative review and workflow testing until a verified TikTok Ads Library export is connected.",
    trackedBrands: [
      "StockX",
      "Stadium Goods",
      "GOAT",
      "Namshi",
      "SHEIN Arabic",
      "OUNASS"
    ],
    trackedRegions: [
      "Saudi Arabia",
      "UAE",
      "Kuwait",
      "Qatar",
      "Bahrain",
      "Oman"
    ]
  },
  latestRefresh: {
    "source": "https://kickscrew-dashboards.vercel.app/api/refresh",
    "pulledAt": "2026-05-10T19:57:10+00:00",
    "endpointTimestamp": "2026-05-10T19:57:09.866Z",
    "status": "success",
    "message": "Dashboard refresh completed",
    "metrics": {
        "totalCreatives": 20,
        "videoCount": 11,
        "imageCount": 9,
        "brandsTracked": 6,
        "totalSpend": 14250,
        "avgRoas": 8.2
    }
},
  targets: {
    minUsefulCreatives: 20,
    roasWatchFloor: 3,
    cpaWatchCeiling: 22
  },
  creativeSummary: [
    {
      brand: "SHEIN Arabic",
      count: 50,
      videos: 25,
      images: 25,
      regions: ["Saudi Arabia", "UAE", "Kuwait", "Qatar", "Bahrain", "Oman"],
      estimatedSpendUsd: 6100,
      avgRoas: 8.7,
      avgCpaUsd: 17.9,
      primaryAngle: "Eid discount, Arabic-first fashion, fast product rotation",
      riskLevel: "High",
      action: "Track offer cadence and Arabic hooks. Useful for KC discount and sneaker-drop framing."
    },
    {
      brand: "StockX",
      count: 19,
      videos: 9,
      images: 10,
      regions: ["Saudi Arabia", "UAE", "Kuwait"],
      estimatedSpendUsd: 3250,
      avgRoas: 7.9,
      avgCpaUsd: 19.2,
      primaryAngle: "Heat-check drops, authenticated sneaker marketplace, trend urgency",
      riskLevel: "High",
      action: "Watch Qatar and KSA pressure. Mirror urgency only when KC has real inventory depth."
    },
    {
      brand: "Stadium Goods",
      count: 10,
      videos: 0,
      images: 10,
      regions: ["Saudi Arabia", "UAE"],
      estimatedSpendUsd: 1750,
      avgRoas: 7.1,
      avgCpaUsd: 20.7,
      primaryAngle: "Product-first sneaker and streetwear cards",
      riskLevel: "Medium",
      action: "Use as benchmark for clean product cards and static retargeting."
    },
    {
      brand: "OUNASS",
      count: 3,
      videos: 2,
      images: 1,
      regions: ["UAE", "Saudi Arabia"],
      estimatedSpendUsd: 2100,
      avgRoas: 9.4,
      avgCpaUsd: 15.8,
      primaryAngle: "Luxury service promise, premium delivery, app-first shopping",
      riskLevel: "High",
      action: "Steal the service clarity: delivery, authenticity, premium shopping experience."
    },
    {
      brand: "Namshi",
      count: 1,
      videos: 0,
      images: 1,
      regions: ["Saudi Arabia"],
      estimatedSpendUsd: 350,
      avgRoas: 5.2,
      avgCpaUsd: 24.3,
      primaryAngle: "Broad fashion discovery",
      riskLevel: "Low",
      action: "Low current signal. Keep in monitor set because Namshi can restart quickly."
    },
    {
      brand: "GOAT",
      count: 1,
      videos: 0,
      images: 1,
      regions: ["UAE", "Qatar"],
      estimatedSpendUsd: 700,
      avgRoas: 6.8,
      avgCpaUsd: 21.1,
      primaryAngle: "Top drops and resale demand",
      riskLevel: "Medium",
      action: "Watch Qatar and UAE. Compare against StockX before opening new test budget."
    }
  ],
  creatives: [
    {
      brand: "StockX",
      format: "image",
      headline: "Secure Your Pair Today",
      copy: "Authenticated sneaker marketplace",
      region: "Saudi Arabia",
      creativeId: "stockx-sa-001",
      angle: "Urgency"
    },
    {
      brand: "StockX",
      format: "video",
      headline: "520 Heat Check",
      copy: "Trending sneaker drop",
      region: "Saudi Arabia",
      creativeId: "stockx-sa-002",
      angle: "Drop culture"
    },
    {
      brand: "StockX",
      format: "video",
      headline: "Stay Ahead of the Game with StockX",
      copy: "Buy, sell, and bid",
      region: "UAE",
      creativeId: "stockx-uae-001",
      angle: "Marketplace"
    },
    {
      brand: "StockX",
      format: "image",
      headline: "Shop What's Trending",
      copy: "Sneaker trends now",
      region: "Kuwait",
      creativeId: "stockx-kw-001",
      angle: "Trend"
    },
    {
      brand: "Stadium Goods",
      format: "image",
      headline: "Adizero Evo SL",
      copy: "Performance sneaker feature",
      region: "Saudi Arabia",
      creativeId: "sg-sa-001",
      angle: "Product card"
    },
    {
      brand: "Stadium Goods",
      format: "image",
      headline: "Fresh Nike Mind 001 Styles",
      copy: "New arrival push",
      region: "UAE",
      creativeId: "sg-uae-001",
      angle: "New arrival"
    },
    {
      brand: "Stadium Goods",
      format: "image",
      headline: "Air Jordan 4 Toro Bravo",
      copy: "Hero product creative",
      region: "Saudi Arabia",
      creativeId: "sg-sa-002",
      angle: "Hero SKU"
    },
    {
      brand: "GOAT",
      format: "image",
      headline: "The Top Drops of 2026 Are Here",
      copy: "New sneaker releases",
      region: "UAE",
      creativeId: "goat-uae-001",
      angle: "Drops"
    },
    {
      brand: "Namshi",
      format: "image",
      headline: "Discover Your Style",
      copy: "Broad fashion discovery",
      region: "Saudi Arabia",
      creativeId: "namshi-sa-001",
      angle: "Discovery"
    },
    {
      brand: "SHEIN Arabic",
      format: "video",
      headline: "26Eid discount campaign",
      copy: "Eid offer and Arabic-first sale messaging",
      region: "Saudi Arabia",
      creativeId: "shein-sa-001",
      angle: "Discount"
    },
    {
      brand: "SHEIN Arabic",
      format: "image",
      headline: "18 percent off with Eid code",
      copy: "Fashion and Eid offer",
      region: "Saudi Arabia",
      creativeId: "shein-sa-002",
      angle: "Coupon"
    },
    {
      brand: "SHEIN Arabic",
      format: "video",
      headline: "Summer collection refresh",
      copy: "Fast product rotation",
      region: "UAE",
      creativeId: "shein-uae-001",
      angle: "Seasonal"
    },
    {
      brand: "SHEIN Arabic",
      format: "image",
      headline: "Latest summer fashion",
      copy: "Product grid creative",
      region: "UAE",
      creativeId: "shein-uae-002",
      angle: "Seasonal"
    },
    {
      brand: "SHEIN Arabic",
      format: "video",
      headline: "Kuwait special offer",
      copy: "Localized deal",
      region: "Kuwait",
      creativeId: "shein-kw-001",
      angle: "Localized offer"
    },
    {
      brand: "SHEIN Arabic",
      format: "image",
      headline: "Qatar selection",
      copy: "Localized product selection",
      region: "Qatar",
      creativeId: "shein-qa-001",
      angle: "Localized range"
    },
    {
      brand: "SHEIN Arabic",
      format: "video",
      headline: "Bahrain sale",
      copy: "Country-specific discount",
      region: "Bahrain",
      creativeId: "shein-bh-001",
      angle: "Localized offer"
    },
    {
      brand: "SHEIN Arabic",
      format: "image",
      headline: "Oman featured offers",
      copy: "Country-specific product push",
      region: "Oman",
      creativeId: "shein-om-001",
      angle: "Localized offer"
    },
    {
      brand: "SHEIN Arabic",
      format: "video",
      headline: "Flash deal",
      copy: "Urgency sale creative",
      region: "Saudi Arabia",
      creativeId: "shein-sa-003",
      angle: "Urgency"
    },
    {
      brand: "SHEIN Arabic",
      format: "image",
      headline: "Editor's choice",
      copy: "Curated fashion products",
      region: "UAE",
      creativeId: "shein-uae-003",
      angle: "Curation"
    },
    {
      brand: "OUNASS",
      format: "video",
      headline: "Luxury perfumes with 2-hour delivery",
      copy: "Service-led premium retail",
      region: "UAE",
      creativeId: "ounass-uae-001",
      angle: "Delivery"
    },
    {
      brand: "OUNASS",
      format: "video",
      headline: "Designer essentials",
      copy: "Premium fashion collection",
      region: "Saudi Arabia",
      creativeId: "ounass-sa-001",
      angle: "Premium"
    },
    {
      brand: "OUNASS",
      format: "image",
      headline: "Resort 2026 collection",
      copy: "Luxury seasonal collection",
      region: "UAE",
      creativeId: "ounass-uae-002",
      angle: "Seasonal"
    }
  ],
  anomalies: [
    {
      severity: "Medium",
      brand: "SHEIN Arabic",
      type: "Spend spike",
      finding: "+24 percent vs 7-day average in the Claude handoff",
      action: "Monitor for format or offer changes for the next 2 days."
    },
    {
      severity: "Low",
      brand: "Namshi",
      type: "Regional reallocation",
      finding: "UAE +15 percent and Saudi Arabia -8 percent in the Claude handoff",
      action: "Keep in watch list, but do not treat as a current threat without fresh data."
    }
  ]
};
