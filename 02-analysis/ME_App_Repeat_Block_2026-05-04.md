# ME App / Repeat Block

Windows:
- Full baseline: 2025-11-01 to 2026-05-04
- Recent repeat view: 2026-03-01 to 2026-05-04

Targets:
- App order share: 50%
- Repeat rate: 35%

Source hierarchy:
- Shopify: order and revenue truth
- GA4: app-vs-web CVR and funnel read
- Mixpanel: app behavior only; not business CVR

## Shopify Status

Source: connected Shopify Admin GraphQL bulk export, 85,160 rows scanned.

Scope caveat: the connected Shopify app currently returned orders from 2026-03-06T13:45:17Z to 2026-05-04T15:59:42Z. This covers almost all of the recent repeat view but not the full 2025-11-01 baseline, because the app does not appear to have `read_all_orders` historical access.

| Country | Orders | Repeat orders | Repeat rate | App direct orders | App order share | Revenue |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| UAE | 1,855 | 700 | 37.7% | 451 | 24.3% | $427,905 |
| KSA | 2,405 | 926 | 38.5% | 738 | 30.7% | $499,255 |
| Kuwait | 172 | 76 | 44.2% | 42 | 24.4% | $40,013 |
| Qatar | 67 | 30 | 44.8% | 19 | 28.4% | $18,005 |
| Bahrain | 12 | 11 | 91.7% | 2 | 16.7% | $2,675 |
| ME total | 4,511 | 1,743 | 38.6% | 1,252 | 27.8% | $987,852 |

App direct orders use Shopify app name `kickscrew_store_mobile`.

## Gap vs Target

| Metric | Current | Target | Gap |
| --- | ---: | ---: | ---: |
| ME app order share | 27.8% | 50.0% | -22.2 pp |
| ME repeat rate | 38.6% | 35.0% | +3.6 pp |

## GA4 Recent App vs Web CVR

Source: Windsor.ai GA4 account `378657085`, 2026-03-01 to 2026-05-04.

| Country | Web sessions | Web txns | Web CVR | App sessions | App txns | App CVR |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| UAE | 245,972 | 1,381 | 0.56% | 55,467 | 482 | 0.87% |
| KSA | 377,352 | 1,758 | 0.47% | 60,223 | 859 | 1.43% |
| Kuwait | 34,072 | 146 | 0.43% | 4,749 | 47 | 0.99% |
| Qatar | 10,050 | 43 | 0.43% | 2,003 | 9 | 0.45% |
| Bahrain | 6,445 | 15 | 0.23% | 318 | 1 | 0.31% |
| ME total | 673,891 | 3,343 | 0.50% | 122,760 | 1,398 | 1.14% |

App = iOS + Android. Web = GA4 platform `web`. CVR here is transactions / sessions.

## GA4 Full Baseline App vs Web CVR

Source: Windsor.ai GA4 account `378657085`, 2025-11-01 to 2026-05-04.

| Country | Web sessions | Web txns | Web CVR | App sessions | App txns | App CVR |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| UAE | 775,146 | 5,641 | 0.73% | 171,486 | 1,772 | 1.03% |
| KSA | 999,800 | 5,294 | 0.53% | 158,598 | 2,341 | 1.48% |
| Kuwait | 57,791 | 353 | 0.61% | 15,411 | 196 | 1.27% |
| Qatar | 26,202 | 168 | 0.64% | 6,358 | 92 | 1.45% |
| Bahrain | 20,689 | 45 | 0.22% | 1,034 | 8 | 0.77% |
| ME total | 1,879,628 | 11,501 | 0.61% | 352,887 | 4,409 | 1.25% |

## Mixpanel Behavior

Local Mixpanel exports are available through 2026-04-29. No local `MIXPANEL_API_SECRET` environment variable was available in this session, so the 2026-04-30 to 2026-05-04 tail and first-open could not be refreshed safely.

Recent available Mixpanel behavior: 2026-03-01 to 2026-04-29.

| Country | First open | Sessions | Add to cart | Checkout | Purchase |
| --- | ---: | ---: | ---: | ---: | ---: |
| UAE | n/a | 245,645 | 10,559 | 8,352 | 571 |
| KSA | n/a | 936,604 | 15,859 | 12,327 | 824 |
| Kuwait | n/a | 31,272 | 1,113 | 588 | 46 |
| Qatar | n/a | 5,707 | 555 | 240 | 12 |
| Bahrain | n/a | 0 | 63 | 0 | 0 |
| ME total | n/a | 1,219,228 | 28,149 | 21,507 | 1,453 |

Full available Mixpanel baseline: 2025-11-01 to 2026-04-29.

| Country | First open | Sessions | Add to cart | Checkout | Purchase |
| --- | ---: | ---: | ---: | ---: | ---: |
| UAE | n/a | 750,523 | 33,282 | 57,263 | 4,694 |
| KSA | n/a | 1,566,700 | 37,524 | 54,920 | 4,266 |
| Kuwait | n/a | 49,013 | 2,162 | 2,769 | 250 |
| Qatar | n/a | 25,387 | 1,571 | 1,880 | 130 |
| Bahrain | n/a | 0 | 211 | 219 | 24 |
| ME total | n/a | 2,391,623 | 74,750 | 117,051 | 9,364 |

## Reconciliation Note

Shopify app orders now read 1,252 `kickscrew_store_mobile` orders for the accessible Shopify window. GA4 recent app transactions read 1,398 across UAE/KSA/Kuwait/Qatar/Bahrain for 2026-03-01 to 2026-05-04. These are directionally close but not expected to match exactly because Shopify is order truth, GA4 is analytics/funnel telemetry, and the Shopify connected app export starts on 2026-03-06 rather than 2026-03-01.

Mixpanel is behavior telemetry only. Use it for first-open/session/add-to-cart/checkout/purchase behavior and downloaded-but-did-not-buy exploration, not business CVR or revenue reporting.
