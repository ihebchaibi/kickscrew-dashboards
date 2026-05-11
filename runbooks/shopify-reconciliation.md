# Shopify Reconciliation Runbook — KICKS CREW ME

**Authority:** Ihab Chaibi · **Effective:** 2026-04-23

## What changed
From 2026-04-23 onwards, the daily Ads Brain must reconcile Windsor Shopify data against the Shopify Admin UI report **via Chrome** before publishing the canvas, and must publish the figures that match the Admin UI — not Windsor's raw pulls.

## Canonical ShopifyQL query (reconciliation source of truth)
```shopifyql
FROM sales
SHOW gross_sales, orders, shipping_charges, discounts, taxes, net_sales, total_sales
WHERE shipping_country IN ('Oman', 'Turkey', 'Qatar', 'Jordan', 'Egypt', 'Brunei', 'Bahrain', 'Kuwait', 'United Arab Emirates', 'Saudi Arabia')
  AND is_canceled_order = false
GROUP BY shipping_country WITH TOTALS, PERCENT_CHANGE, CURRENCY 'USD'
DURING yesterday
COMPARE TO <day_before_yesterday>
ORDER BY orders DESC
LIMIT 1000
VISUALIZE total_sales
```

**Base Admin URL** (replace the `ql=` querystring with the URL-encoded query above, or navigate and paste the ShopifyQL into the editor):
```
https://admin.shopify.com/store/kickscrewshop/analytics/reports/34013379
```

## Key semantic rules
- **Headline figure = `total_sales`** (not `gross_sales`). Shopify's definition: `gross_sales − discounts − returns + shipping + taxes`. This is what the UI shows and what the canvas must publish.
- **`is_canceled_order = false`** — always filter canceled orders.
- **`CURRENCY 'USD'`** — always in USD, no manual conversion.
- **Date range** — `DURING yesterday COMPARE TO <day_before_yesterday>`. (The URL Ihab shared uses `today` / `yesterday` because he runs it live; the daily agent reports on the completed day.)

## Columns on the canvas Shopify section
The Shopify section of the daily canvas must include these columns per country row (from the ShopifyQL output):

| Country | Orders | Gross Sales | Discounts | Shipping | Taxes | Net Sales | Total Sales | Δ vs prev |

Plus a `ME Total` row.

## Pre-publish reconciliation gate
Before updating the canvas / sending the Slack post, the daily agent must:

1. **Pull Windsor Shopify** (keep as prep data, not the headline)
2. **Open Chrome** and navigate to the Admin URL with the canonical query for yesterday
3. **Read totals** from the rendered report (orders + total_sales)
4. **Compare Admin vs Windsor:**
   - If orders match within ±2 **and** total_sales match within ±2% → proceed, publish Admin figures
   - If mismatch → stop, post a diagnostic in Slack (`#arabic-ads-central` or DM Ihab), do NOT publish an unreconciled canvas
5. **Log the reconciliation outcome** at the bottom of the canvas: "✅ Reconciled: Admin 84 orders / $16,485 · Windsor 84 / $16,485 (0% delta)"

## Weekly reporting rule
For the **weekly** Ads Brain report, do **not** start from a single raw Windsor weekly Shopify pull unless every day in the week is missing Admin-verified notes.

Preferred weekly workflow:

1. Read the seven daily notes for the target Monday-Sunday week from `01-daily/`.
2. Extract each day's **Admin** reconciliation line and use the **Admin `orders` + `total_sales`** as the weekly source of truth.
3. Sum the seven daily Admin totals to produce weekly Shopify ME orders and revenue.
4. Use Windsor weekly pulls only as a **diagnostic cross-check**, not as the primary weekly ground truth.
5. If one or more days are missing a reconciled Admin total:
   - reconcile those missing days individually in Shopify Admin first
   - or stop the weekly publish and flag exactly which days are missing

Why this rule exists:
- Windsor weekly Shopify pulls can return large raw order/refund row sets that are noisy to aggregate and harder to reconcile quickly.
- Daily Admin-verified notes already normalize the important mismatch between **Windsor gross_sales** and **Shopify Admin total_sales**.
- Weekly reporting should inherit the already-verified daily ground truth whenever it exists.

## If Chrome is unavailable
If Claude in Chrome cannot reach the Admin URL (session expired, network, etc.):
- Mark the day as `⚠️ Reconciliation skipped: Chrome session unavailable` in the canvas
- Still publish Windsor figures but flag them as unreconciled
- DM Ihab a note so he can verify manually

## Tolerances (hard)
- Orders: ±2
- Total sales: ±2%
- Anything outside → halt and flag

## Historical notes
- 2026-04-22 run initially pulled 92 orders / $17,717 without `order_cancelled_at` filter; reconciled ground truth is 84 orders / $16,485 using `is_canceled_order = false`.
- 2026-04-23 run published using Windsor `gross_sales` ($16,485). Going forward, headline will be `total_sales` which may differ by 5–15%.
