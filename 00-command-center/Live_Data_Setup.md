# Live Data Setup

## Status

Live data access is available through Windsor.ai for the `ihab.chaibi@kickscrew.com` account.

## Connected Sources

| Source | Connector ID | Connected Accounts |
| --- | --- | --- |
| Meta Ads | `facebook` | `KICKS CREW ME` (`2790197764523614`), `KICKS CREW USD`, `PUB - AIRSELLI - PRO` |
| Google Ads | `google_ads` | `KicksCrew` (`368-224-2765`), `KC YOUTUBE` |
| GA4 | `googleanalytics4` | `01. KicksCrew - GA4`, `KICKSCREW GA4`, `Kickscrew GA4 (Server-side tracking)` |
| Shopify | `shopify` | `kickscrewshop.myshopify.com` |
| Snapchat | `snapchat` | `KICKS-CREW GROUP COMPANY LIMITED Self Service` |
| TikTok | `tiktok` | `KICKS CREW_adv`, `WT-XS-KICKS-ME` |

## Default Daily Pull

Use `last_7dT` for a rolling 7-day check including today.

### Meta Ads: KICKS CREW ME

Connector: `facebook`

Account: `2790197764523614`

Fields:

- `account_name`
- `campaign`
- `spend`
- `impressions`
- `clicks`
- `actions_purchase`
- `action_values_purchase`
- `website_purchase_roas_offsite_conversion_fb_pixel_purchase`
- `ctr`
- `cpc`

Options:

- `attribution_window`: `default`

### Google Ads: KicksCrew

Connector: `google_ads`

Account: `368-224-2765`

Fields:

- `account_name`
- `campaign`
- `spend`
- `impressions`
- `clicks`
- `conversions`
- `transactions`
- `transactionrevenue`
- `roas`
- `ctr`
- `cpc`

### Shopify

Connector: `shopify`

Account: `kickscrewshop.myshopify.com`

Current note: Windsor returns granular order-level rows for the tested Shopify fields. For daily reporting, aggregate by country/date before using in executive summaries. Avoid pulling customer email, phone, address, or other personal fields unless the user explicitly asks and confirms the specific use.

## Guardrails

- Read performance data freely when needed for analysis.
- Do not transmit, upload, or share exports externally without confirmation.
- Do not pull customer PII unless explicitly needed and confirmed.
- Treat Shopify customer/order details as sensitive.
- Use aggregated performance metrics by default.
