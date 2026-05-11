# Live Performance Snapshot - 2026-05-03

Date range: last 7 days including today, `2026-04-27` to `2026-05-03`.

Source: Windsor.ai live connectors.

## Meta Ads - KICKS CREW ME

Account: `KICKS CREW ME` (`2790197764523614`)

| Campaign | Spend | Revenue | ROAS | Purchases | CPO | CTR | CPC | Verdict |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| KC Catalog sales 4.0 | $1,550.36 | $18,484.99 | 10.75x | 100 | $15.50 | 2.77% | $0.11 | Scale/maintain |
| 2604_ME_conversion_manual | $520.93 | $7,620.89 | 12.05x | 29 | $17.96 | 10.05% | $0.10 | Strong |
| KC Test Main Account 1.0 | $457.37 | $8,006.08 | 13.97x | 24 | $19.06 | 2.12% | $0.22 | Strong |
| 2604_ASC_UAE_ROAS | $628.44 | $9,526.45 | 11.25x | 44 | $14.28 | 11.43% | $0.07 | Strong |
| Pokemon Cards KSA & UAE | $586.24 | $6,530.71 | 8.24x | 26 | $22.55 | 1.20% | $0.32 | Watch CPO |
| 2604_ASC_GCC_ROAS | $453.80 | $4,555.29 | 6.98x | 22 | $20.63 | 8.85% | $0.06 | Borderline ROAS |
| New Format Test KU & QA | $166.04 | $1,478.06 | 5.40x | 6 | $27.67 | 2.01% | $0.31 | Fix or pause |
| New Format Test KSA | $738.21 | $2,815.90 | 3.30x | 13 | $56.79 | 0.93% | $0.53 | Pause/rework |
| 2604_ASC_KSA_ROAS | $384.91 | $1,190.21 | 3.09x | 6 | $64.15 | 4.75% | $0.13 | Pause/rework |
| 2604_KSA_manual | $184.53 | $515.91 | 2.80x | 2 | $92.27 | 5.55% | $0.15 | Pause |
| 2604_ASC_EG_ROAS | $116.60 | $279.24 | 2.39x | 1 | $116.60 | 12.65% | $0.03 | Pause |

### Meta Readout

- Best scale candidates: `KC Catalog sales 4.0`, `2604_ASC_UAE_ROAS`, `2604_ME_conversion_manual`, and `KC Test Main Account 1.0`.
- Pokemon remains efficient on ROAS, but the latest CPO is slightly above the $22 guardrail.
- New Format KSA and the weaker ASC/KSA/EG/manual tests are spending into weak ROAS and high CPO.
- GCC ASC is near the 7x ROAS floor and needs one more close review before a hard decision.

## Google Ads - KicksCrew

Account: `KicksCrew` (`368-224-2765`)

| Campaign | Spend | Impressions | Clicks | Conversions | Reported ROAS | CTR | CPC | Note |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| AE-Sales-Performance-Max #NEW | $26,753.19 | 1,757,184 | 24,897 | 165.07 | 1005.24 | 1.42% | $1.07 | Largest scale engine |
| KicksCrew -Performance max- SA | $18,851.35 | 1,109,147 | 14,448 | 106.18 | 884.89 | 1.30% | $1.30 | Strong volume |
| KicksCrew -Performance max- KU | $5,785.32 | 348,598 | 4,746 | 24.97 | 662.44 | 1.36% | $1.22 | Smaller but active |

### Google Readout

- AE PMax remains the biggest Google engine by spend, clicks, conversions, and reported revenue.
- SA PMax remains the second scale engine.
- KU is smaller and should be reviewed against CPO/order quality before scaling.
- The Windsor Google `roas` field appears formatted differently from the April report convention, so use it directionally until normalized.

## Shopify

Shopify live access works, but the tested query returns order-level rows. Next step is to add an aggregation layer before using Shopify in daily executive summaries.

## Actions

1. Pause or rework the weakest Meta tests: `2604_ASC_EG_ROAS`, `2604_KSA_manual`, `2604_ASC_KSA_ROAS`, and `New Format Test KSA`.
2. Maintain or scale carefully: `KC Catalog sales 4.0`, `2604_ASC_UAE_ROAS`, `2604_ME_conversion_manual`, and `KC Test Main Account 1.0`.
3. Watch Pokemon CPO; keep the angle, but refresh creative or budget pacing if CPO stays above $22.
4. Build a small aggregation layer for Shopify and normalized Google ROAS.
