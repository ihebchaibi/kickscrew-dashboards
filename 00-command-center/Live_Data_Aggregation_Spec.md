# Live Data Aggregation Spec

## Purpose

This spec defines how Codex should convert raw Windsor.ai pulls into the standard KICKS CREW ME report format.

## Date Ranges

| Report | Date Range |
| --- | --- |
| Daily | Yesterday plus today when useful |
| Weekly | Monday to Sunday |
| Monthly | First day to last day of month |

## Meta Aggregation

Connector: `facebook`

Account: `2790197764523614`

Group by:

- `campaign`

Sum:

- `spend`
- `impressions`
- `clicks`
- `actions_purchase`
- `action_values_purchase`

Calculate:

- ROAS = `action_values_purchase / spend`
- CPO = `spend / actions_purchase`
- CTR = `clicks / impressions`
- CPC = `spend / clicks`

## Google Ads Aggregation

Connector: `google_ads`

Account: `368-224-2765`

Group by:

- `campaign`

Sum:

- `spend`
- `impressions`
- `clicks`
- `conversions`
- `transactionrevenue`

Calculate:

- ROAS = normalized `transactionrevenue / spend` after currency handling
- CPO = `spend / conversions`
- CTR = `clicks / impressions`
- CPC = `spend / clicks`

Currency note: The pulled Google `roas` field appears to use a different scale than the April reports. Prefer recomputing ROAS after confirming currency normalization.

## Shopify Aggregation

Connector: `shopify`

Account: `kickscrewshop.myshopify.com`

Use only non-PII fields by default.

Filter ME countries:

- United Arab Emirates
- Saudi Arabia
- Kuwait
- Qatar
- Oman
- Bahrain
- Egypt
- Turkey
- Brunei when included in ME reporting

Group by:

- `order_shipping_address_country`

Sum:

- `order_count`
- `order_total_price`

Clean:

- Treat zero-value and gift-card-like rows carefully.
- Include refunds/negative rows in gross-vs-net notes when relevant.
- Reconcile with Shopify Admin when the report is official.

## GA4 Aggregation

Connector: `googleanalytics4`

Use ME country filters.

Core metrics:

- sessions
- add to cart
- checkout
- purchases
- revenue
- engagement rate

Use GA4 as the neutral cross-check, not the final revenue source.

## Blended Metrics

Ad platform blended revenue:

`Google revenue + Meta revenue + Snapchat revenue + TikTok revenue`

Blended spend:

`Google spend + Meta spend + Snapchat spend + TikTok spend`

Blended ROAS:

`ad platform revenue / blended spend`

Blended CPO:

`blended spend / total platform purchases or conversions`

Attribution gap:

`(ad platform revenue - Shopify ME revenue) / ad platform revenue`

## Default Output

Every live report should produce:

1. A Markdown report in the H workspace.
2. A mirrored Markdown report in Obsidian.
3. A short Slack-ready summary if the user asks for posting or drafting.
