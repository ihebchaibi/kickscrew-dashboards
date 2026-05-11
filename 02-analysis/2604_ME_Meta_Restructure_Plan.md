# KICKS CREW ME — Meta Ads Restructure Plan
**Built:** April 24, 2026 | **Based on:** USD account blueprint + ME market intelligence
**Objective:** Mirror and improve the KICKS CREW USD account structure for the Middle East

---

## Why We're Restructuring

### Current ME Account (Apr 23 baseline)
| Campaign | Spend | Revenue | ROAS | CPO | Issues |
|---|---|---|---|---|---|
| KC Catalog sales 4.0 | $328 | $3,136 | 6.4x | $19.32 | Old catalog format, no ASC |
| Pokemon Cards KSA & UAE | $67 | $3,030 | 41x | $4.76 | Product burst — keep as template |
| 2604_ME_conversion_manual | $94 | $576 | ~6x | $31.24 | 2 of 4 adsets = $0 revenue |
| New Format Test KSA | $127 | $1,265 | 8.8x | $21.17 | "Test" naming, no scale plan |
| New Format Test KU & QA | $53 | $1,490 | 28.4x | $10.51 | Great signal, needs ASC upgrade |
| KC Test Main Account 1.0 | $55 | $236 | 4.3x | $55.35 | Kill immediately |
| **TOTAL** | **$724** | **$9,733** | **13.5x** | **$16.85** | Propped up by Pokemon spike |

**Without Pokemon:** $657 spend / $6,702 revenue = **10.2x ROAS** — structurally weak.

### What the USD Account Does That We Don't
1. ✅ **ASC per market** — the engine behind their consistent 11–55x ROAS per country
2. ✅ **DPA retargeting** (Checkout 10% lookalike) — 23x ROAS, zero ongoing effort
3. ✅ **Shopify Audience custom list** — 24x ROAS, our customer base as a seed
4. ✅ **Consistent naming** — YYMM_TYPE_MARKET_OBJECTIVE, fully auditable
5. ✅ **App-dedicated campaigns** — separate so web campaigns don't cannibalize
6. ❌ **We have:** "test" campaigns, catalog 4.0, mixed targeting across markets, zero retargeting

---

## New ME Campaign Architecture

### Naming Convention (mirror USD + ME spec)
```
YYMM_TYPE_MARKET_OBJECTIVE
Examples:
  2604_ASC_KSA_ROAS
  2604_ME_conversion_DPA
  2604_APP_ME_Auto
```

---

## Tier 1 — ASC (Advantage+ Shopping) per Market — 55% of budget
*The USD account's #1 performance driver. Let Meta's algorithm find buyers market-by-market with full catalog access. No manual audience needed — ASC self-optimises.*

### 2604_ASC_KSA_ROAS — Saudi Arabia
- **Why separate:** KSA = ~55% of ME revenue, largest Arabic-speaking market, distinct consumer behaviour
- **Daily budget:** $200
- **Geo:** Saudi Arabia only
- **Objective:** Sales / Purchase (ROAS-focused)
- **Creative inputs:** Arabic primary + English secondary, lifestyle + product shots
- **Expected ROAS:** 10–18x based on New Format Test KSA signal (8.8x manual → ASC should lift this)

### 2604_ASC_UAE_ROAS — United Arab Emirates
- **Why separate:** UAE = highest AOV in ME, English-dominant, premium positioning
- **Daily budget:** $130
- **Geo:** United Arab Emirates only
- **Objective:** Sales / Purchase
- **Creative inputs:** English-first, premium lifestyle creative
- **Expected ROAS:** 12–20x (Pokemon UAE signal showed 41x — ASC will find that audience at scale)

### 2604_ASC_GCC_ROAS — Kuwait + Qatar + Bahrain
- **Why bundled:** Markets too small to split individually, similar profile (wealthy Gulf, Arabic)
- **Daily budget:** $100
- **Geo:** Kuwait, Qatar, Bahrain
- **Objective:** Sales / Purchase
- **Creative inputs:** Arabic-first, mix lifestyle/product
- **Expected ROAS:** 15–28x (KU & QA manual test showed 28x signal — strong)

### 2604_ASC_EG_ROAS — Egypt
- **Why separate:** Very different profile — high volume, lower AOV, Arabic-only, price-sensitive
- **Daily budget:** $60
- **Geo:** Egypt only
- **Objective:** Sales / Purchase (volume-focused, not ROAS-focused)
- **Creative inputs:** Arabic only, value/deal messaging, price-forward
- **Expected ROAS:** 6–12x (lower AOV but high conversion volume)

> **ME Advantage over USD:** We can feed Arabic-language creatives into each market ASC — a targeting lever the USD account doesn't have. Arabic creative in KSA/UAE/GCC ASCs will outperform generic English ads from the USD playbook.

---

## Tier 2 — DPA Retargeting (Dynamic Product Ads) — 15% of budget
*The USD account's most efficient campaign type. 23x ROAS from people who already showed intent.*

### 2604_ME_conversion_DPA
- **Daily budget:** $100 total
- **Adset 1 — ME_LL_Checkout_10%** ($50/day)
  - Audience: 10% lookalike of people who reached checkout but didn't purchase (last 180 days)
  - Creative: Dynamic catalog carousel — the exact products they viewed
  - Expected CPO: $8–14
- **Adset 2 — ME_LL_Purchase_5%** ($30/day)
  - Audience: 5% lookalike of past purchasers from Shopify customer list
  - Creative: Dynamic catalog — new arrivals / complementary products
  - Expected CPO: $10–18
- **Adset 3 — ME_RT_ViewContent_7d** ($20/day)
  - Audience: People who viewed a product page in the last 7 days (no purchase)
  - Creative: Dynamic carousel of viewed products + urgency messaging ("Still available")
  - Expected CPO: $12–20

---

## Tier 3 — Manual Conversion Prospecting — 12% of budget
*Keep the best-performing adsets from current 2604_ME_conversion_manual, kill the zero performers, add the Shopify Audience lever.*

### 2604_ME_conversion_manual (rebuilt)
- **Daily budget:** $90 total

| Adset | Budget | Targeting | Why |
|---|---|---|---|
| ME_BT_Arabic_Sneaker_KSA+UAE | $25 | Interest: Nike, Jordan, Adidas + Arabic language | Best converting manual interest combo |
| ME_BT_Streetwear_GCC | $25 | Interest: streetwear brands + GCC geo | Captures fashion-forward buyer |
| ME_Shopify_Audience | $25 | Custom: upload Shopify customer list as seed | USD gets 24x from this — we should too |
| ME_LL_NikeMind_3% | $15 | 3% lookalike of NikeMind engagers | Keep — was small but showed intent signal |

**Kill from current setup:**
- ~~BT_Arabic_ALL_18-45_sneaker platform_UAE~~ → $31 spend, 0 purchases → folded into ASC_UAE
- ~~BT_mix_ALL_18-45_street_UAE~~ → $21 spend, 0 purchases → folded into ASC_UAE

---

## Tier 4 — App Install Campaigns — 12% of budget
*Mirror USD's 2603_APP structure. Keep app campaigns completely separate so they don't cannibalise web purchase attribution.*

### 2604_APP_ME_Auto
- **Daily budget:** $80
- **Adset 1 — APP_ME_KSA+UAE** ($50/day) — largest user base potential
- **Adset 2 — APP_ME_GCC** ($30/day) — Kuwait, Qatar
- **Objective:** App installs / App events (not web purchases)
- **Note:** USD's app campaigns show near-zero web ROAS (0.6x) — these are acquisition plays, track LTV not ROAS

---

## Tier 5 — Product Burst Template (keep)
*The Pokemon Cards campaign proved that product-specific bursts work. Build a reusable template.*

### Template: YYMM_[PRODUCT]_[MARKET]_burst
- **Trigger:** New exclusive drop, collaboration, limited release
- **Budget:** $50–100/day for 5–10 days
- **Structure:** 2 adsets — KSA+UAE / GCC+EG
- **Creative:** Product-specific, urgency-driven, Arabic + English
- **Kill switch:** If ROAS < 8x after 3 days, pause and redirect budget to ASC

---

## Budget Reallocation Summary

| Campaign | Current | New | Change |
|---|---|---|---|
| KC Catalog sales 4.0 | $328 | $0 | ❌ Kill — replaced by ASCs |
| KC Test Main Account 1.0 | $55 | $0 | ❌ Kill immediately |
| New Format Test KSA | $127 | $0 | ❌ Kill — learnings go into ASC_KSA |
| New Format Test KU & QA | $53 | $0 | ❌ Kill — learnings go into ASC_GCC |
| 2604_ME_conversion_manual | $94 | $90 | ♻️ Rebuilt with 4 clean adsets |
| **2604_ASC_KSA_ROAS** (new) | $0 | $200 | 🆕 |
| **2604_ASC_UAE_ROAS** (new) | $0 | $130 | 🆕 |
| **2604_ASC_GCC_ROAS** (new) | $0 | $100 | 🆕 |
| **2604_ASC_EG_ROAS** (new) | $0 | $60 | 🆕 |
| **2604_ME_conversion_DPA** (new) | $0 | $100 | 🆕 |
| **2604_APP_ME_Auto** (new) | $0 | $80 | 🆕 |
| Product burst (Pokemon-style) | $67 | $67 | ✅ Keep as-is |
| **TOTAL** | **$724** | **$827** | +$103/day |

*Note: +$103/day increase justified by moving from broken structure (10x ROAS without Pokemon) to proven ASC-led architecture. Expected blended ROAS: 14–20x.*

---

## ME-Specific Advantages Over USD Blueprint

The USD account is generic English-language global. We have 3 levers they don't:

1. **Arabic creative advantage** — Feed Arabic-language ads into ASC. Meta's algorithm will preferentially serve these to Arabic-first users, dramatically lowering CPM and raising CTR in KSA/GCC.

2. **Cultural calendar layer** — Eid, Saudi National Day, UAE National Day, Ramadan are high-intent windows where we should temporarily increase ASC budgets by 30–50% and swap in seasonal creative. USD doesn't do this.

3. **WhatsApp retargeting integration** — ME users are heavy WhatsApp users. Once Meta's WhatsApp Business API retargeting matures, ME account will benefit disproportionately. Build the audiences now.

---

## Implementation Phases

### Phase 1 — Week 1 (Kill + Launch ASCs)
- [ ] Pause: KC Test Main Account 1.0
- [ ] Pause: KC Catalog sales 4.0 (after ASCs are live 3 days)
- [ ] Pause: New Format Test KSA (after ASC_KSA is live)
- [ ] Pause: New Format Test KU & QA (after ASC_GCC is live)
- [ ] Launch: 2604_ASC_KSA_ROAS ($200/day)
- [ ] Launch: 2604_ASC_UAE_ROAS ($130/day)
- [ ] Launch: 2604_ASC_GCC_ROAS ($100/day)
- [ ] Launch: 2604_ASC_EG_ROAS ($60/day)

### Phase 2 — Week 2 (Add Retargeting + Prospecting rebuild)
- [ ] Kill zero-purchase adsets in 2604_ME_conversion_manual
- [ ] Launch: 2604_ME_conversion_DPA (all 3 adsets)
- [ ] Launch: ME_Shopify_Audience adset (requires Shopify customer list upload)
- [ ] Rebuild 2604_ME_conversion_manual with 4 clean adsets

### Phase 3 — Week 3 (App + Optimise)
- [ ] Launch: 2604_APP_ME_Auto
- [ ] Review ASC learning phase results — scale winners by 20%
- [ ] Review DPA performance — shift budget to best-performing adset
- [ ] Build Arabic creative variants for top-performing ASC markets

### Review Gate — Day 21
Compare vs baseline (Apr 23):
- Target blended ROAS: ≥ 14x (vs 10.2x without Pokemon)
- Target blended CPO: ≤ $18 (vs $16.85 — maintain efficiency at higher spend)
- Target: 0 adsets with >$30 spend and 0 purchases running

---

## Creative Briefs Required

| Campaign | Priority | Format | Language | Brief |
|---|---|---|---|---|
| ASC_KSA | 🔴 Urgent | 4:5 video + static | Arabic primary | Lifestyle sneaker, local influencer feel |
| ASC_UAE | 🔴 Urgent | 4:5 video + static | English primary | Premium positioning, high AOV products |
| ASC_GCC | 🟡 Week 2 | Static catalog | Arabic | Mix of lifestyle + product flat lay |
| ASC_EG | 🟡 Week 2 | Static | Arabic only | Value messaging, bundle/deal framing |
| DPA retargeting | 🟡 Week 2 | Dynamic carousel | Auto | "Still available" + product name overlay |
| App campaigns | 🟢 Week 3 | 9:16 video | Arabic + English | App UI showcase, download CTA |

---

*Document prepared by Ads Brain — KICKS CREW ME*
*Based on: Live Windsor.ai data pull Apr 23, 2026 + USD account reverse-engineering*
