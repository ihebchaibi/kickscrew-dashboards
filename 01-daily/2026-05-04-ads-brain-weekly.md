# WEEKLY REPORT BLOCKED - Week of Mon 27 Apr - Sun 03 May 2026

**Published:** Mon 04 May 2026  
**Status:** Blocked pending Shopify Admin reconciliation and Slack canvas overwrite capability

---

## What cleared

Paid media data pulled successfully for the full week of **2026-04-27** through **2026-05-03**.

| Metric | Current Week | Prior Week | WoW |
| --- | --- | --- | --- |
| Blended Spend | $14,046.93 | $13,007.39 | +7.99% |
| Blended Revenue (ad platforms) | $142,707.96 | $144,073.58 | -0.95% |
| Blended ROAS | 10.16x 🟢 | 11.08x | -8.30% |
| Blended CPO | $20.83 🟢 | $18.64 | +11.75% |

### Platform totals

| Platform | Spend | Revenue | ROAS | CPO | Conversions |
| --- | --- | --- | --- | --- | --- |
| Google Ads | $6,783.14 | $62,155.08 | 9.16x 🟢 | $21.45 🟢 | 316.23 |
| Meta Ads | $6,171.73 | $69,372.17 | 11.24x 🟢 | $20.30 🟢 | 304 |
| Snapchat Ads | $1,092.06 | $11,180.71 | 10.24x 🟢 | $20.22 🟢 | 54 |

### GA4 ME cross-check

| Metric | Current Week | Prior Week | WoW |
| --- | --- | --- | --- |
| Sessions | 86,645 | 77,996 | +11.09% |
| Transactions | 599 | 541 | +10.72% |
| Revenue | $120,665.38 | $111,460.63 | +8.26% |
| Add to Cart | 25,275 | 22,591 | +11.88% |
| Checkouts | 7,015 | 6,094 | +15.11% |
| Cart -> Purchase CVR | 2.37% | 2.39% | -0.02 pp |
| Avg Engagement Rate | 84.93% | 85.57% | -0.64 pp |

---

## Main readout

Blended paid performance remained strong on an absolute basis, but efficiency softened WoW as spend increased faster than revenue. Meta remained the largest revenue driver, while the clearest drag sat inside Meta test campaigns rather than Google or Snapchat.

The strongest current campaigns were **2604_ME_conversion_manual** on Meta at **18.69x ROAS** and **$15.91 CPO**, **KC Test Main Account 1.0** at **17.98x ROAS**, and **2604_ASC_UAE_ROAS** at **15.13x ROAS**. The weakest campaign was **2604_ASC_EG_ROAS** on Meta at **2.39x ROAS** and **$116.60 CPO**. Other drag came from **2604_KSA_manual** at **3.94x ROAS / $61.51 CPO**, **New Format Test KSA** at **4.27x ROAS / $55.32 CPO**, and Google **KicksCrew -Performance max- KU** at **6.38x ROAS / $29.55 CPO**.

---

## Why publishing is blocked

1. Shopify Windsor returned raw order-level rows with obvious zero-value and gift-card-like records, but this session has no Shopify Admin access path to validate against the required Admin report.
2. The report instructions require reconciliation to Shopify Admin within **+/-2 orders** and **+/-2% revenue** before publishing. That check could not be completed.
3. Slack tools available in this session support **read/create canvas** but do not expose a tool to **replace existing canvas `F0ASE57CV9C`**.

Because of those gates, no Slack canvas was updated.

---

## Recommended next actions

1. Re-run once Shopify Admin totals for **2026-04-27 to 2026-05-03** can be checked against Windsor.
2. Add or expose a Slack canvas update tool that can replace the existing weekly canvas.
3. When the gate clears, prioritize cutting or restructuring the weakest Meta test campaigns before increasing spend further.
