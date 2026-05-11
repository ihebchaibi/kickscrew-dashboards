# TikTok Ads Plan — KICKS CREW ME
**Created:** 2026-04-23 | **Market:** Middle East (KSA, UAE, Kuwait, Qatar, Bahrain, Oman, Jordan, Egypt)

---

## Context & Constraints

- **No TikTok Shop in the Gulf** — TikTok is a traffic and awareness channel only. Conversions happen on-site, tracked via pixel.
- **Previous attempt:** "test 1.0" campaign spent $3.15 over 30 days with 0 conversions — likely a billing, creative approval, or setup issue.
- **Two accounts connected:** `KICKS CREW_adv` (7563686603487494160) and `WT-XS-KICKS-ME` (7569102163075596296) — consolidate spend under `KICKS CREW_adv` as primary.
- **TikTok's role in the funnel:** Top-of-funnel discovery and retargeting warm audiences. Meta and Google own conversion. TikTok feeds the pipeline.

---

## Step 1 — Fix the Account Before Spending a Dirham

Before launching anything, resolve the "test 1.0" failure. Go through this checklist in TikTok Ads Manager:

1. **Billing tab** — Confirm a valid payment method is active and the account has credit. TikTok blocks delivery silently when billing lapses.
2. **Ad review status** — Check if any creatives were rejected. Rejected ads kill the entire ad group's delivery even if other ads are live.
3. **Pixel verification** — Go to Assets → Events → TikTok Pixel. Confirm the pixel is firing on the kickscrewshop website (use the TikTok Pixel Helper Chrome extension to verify).
4. **Account timezone & currency** — Make sure the account is set to a Gulf timezone (Asia/Riyadh or Asia/Dubai) and currency matches your billing.
5. **Business Center linking** — Confirm `KICKS CREW_adv` is properly linked to a Business Center with admin access. Orphaned accounts hit invisible spending limits.

---

## Step 2 — Campaign Architecture

Run two parallel campaigns. Keep them separate — different objectives, different audiences, different creative logic.

### Campaign A — Awareness & Traffic (Always-On)
**Objective:** Website Traffic  
**Budget:** $30–50/day to start. Scale to $100/day once pixel data is sufficient.  
**Bid Strategy:** Lowest Cost (let TikTok optimize)

| Ad Group | Audience | Content Type |
|---|---|---|
| AG1 — KSA Broad | KSA, 18–34, interests: Sneakers, Streetwear, Basketball, Fashion | Hero product videos, new drops |
| AG2 — UAE Broad | UAE, 18–34, interests: Sneakers, Luxury Fashion, Sports | Same creative set |
| AG3 — KW/QA/BH | Kuwait + Qatar + Bahrain combined, 18–30 | Lighter spend, test and learn |

### Campaign B — Retargeting (Conversion-Focused)
**Objective:** Conversions (Purchase event via pixel)  
**Budget:** $20–30/day  
**Bid Strategy:** Cost Cap at $25 CPO to start

| Ad Group | Audience | Content Type |
|---|---|---|
| RT1 — Site Visitors 14d | All ME visitors, last 14 days, excluding buyers | Urgency-led content, "Still thinking about it?" |
| RT2 — Product Viewers 7d | Viewed product pages, last 7 days | Dynamic product-style ads, specific shoe close-ups |
| RT3 — Add-to-Cart 7d | ATC, non-purchasers | Direct offer, free shipping angle |

---

## Step 3 — Creative Strategy

TikTok lives and dies on creative. This is the most important variable — not targeting, not budget.

### Content Pillars

**1. Product Drop Reveal (highest CTR format)**
Short punchy clip: sneaker drops, slow-motion unbox, clean product shots with trending audio. 9–15 seconds. No voiceover needed. Text overlay with shoe name + price. End card: "Shop Now — kickscrew.com"

**2. Sneaker Culture / Authority Content**
Position KICKS CREW as the Gulf's go-to sneaker source. "Did you know this Jordan 1 collab sold out in 3 hours?" type content. Builds brand trust without hard selling.

**3. Social Proof & Hype**
UGC-style content or creator collabs. A Gulf-based sneaker creator wearing KICKS CREW product. Even micro-creators (50k–200k followers in KSA/UAE) will outperform polished brand content on TikTok.

**4. Offer/Urgency Ads (retargeting only)**
"Last 3 pairs left." "Ships to KSA in 3 days." Clean, direct, minimal production. These go in the retargeting ad groups only — too aggressive for cold audiences.

### Creative Specs
- Aspect ratio: 9:16 (vertical, full screen)
- Duration: 9–15 seconds for cold, up to 30 seconds for retargeting
- Safe zone: keep text/logos away from bottom 20% (TikTok UI overlaps)
- Minimum 3 creative variants per ad group — TikTok creative fatigue is fast (refresh every 2 weeks)
- Always use TikTok's native text overlays + captions (boosts completion rate)

### Localization
- Arabic copy in text overlays for KSA — even if the video is English, Arabic text stops the scroll
- Use Gulf-relevant references (not generic global streetwear)
- Avoid music that may be restricted in MENA — use TikTok's commercial music library

---

## Step 4 — Targeting Parameters

### Cold Audiences (Campaign A)
- Age: 18–34 (sweet spot for Gulf sneaker buyers)
- Gender: Male skew (70% male, 30% female — adjust after 2 weeks of data)
- Interests: Sneakers, Streetwear, Sports Fashion, Basketball, Nike, Adidas, Jordan Brand, Luxury Goods
- Behavior: Engaged with fashion/apparel content in last 30 days
- Device: All (but monitor iOS vs Android CPO — iOS attribution is weaker post-ATT)

### Retargeting Audiences (Campaign B)
- Built from TikTok Pixel events: ViewContent, AddToCart, InitiateCheckout
- Minimum audience size for retargeting to work: 1,000+ users. If pixel is fresh, give it 2–3 weeks of cold campaign data first before retargeting is viable.

### Exclusions (apply to all)
- Exclude past purchasers (last 30 days) from cold campaigns
- Exclude RT3 (ATC) audience from RT1 and RT2 to avoid overlap

---

## Step 5 — Budget & Ramp Plan

| Week | Daily Budget | Focus | Expected Outcome |
|---|---|---|---|
| Week 1–2 | $30/day (Campaign A only) | Pixel warm-up, creative testing | Build audience data, identify winning creative |
| Week 3–4 | $50/day ($35 A + $15 B) | Add retargeting once pixel has data | First retargeting conversions, CPO benchmark |
| Month 2 | $80–100/day | Scale winning ad groups, pause losers | Target: 5x+ ROAS on retargeting, positive blended ROAS |
| Month 3+ | $150+/day | Expand to Jordan/Egypt, add creator content | TikTok as a meaningful top-of-funnel channel |

**Total Month 1 investment:** ~$1,000–1,200 USD. Low risk, enough data to make real decisions.

---

## Step 6 — Measurement & KPIs

Since TikTok has no native checkout, measurement requires combining TikTok Ads Manager + GA4 + Shopify.

### Primary KPIs (evaluate weekly)
| Metric | Target | Flag If |
|---|---|---|
| CTR (cold) | >1.5% | <0.8% → creative problem |
| CPM | $5–15 | >$20 → audience too narrow |
| Landing Page CVR | >1.5% | <0.8% → landing page or audience mismatch |
| CPO (retargeting) | <$22 | >$30 → retargeting audience too cold |
| ROAS (retargeting) | >4x | <2x → pause and rethink |

### Attribution Note
TikTok uses a **7-day click / 1-day view** attribution window by default. This will inflate reported conversions vs. what GA4 or Shopify shows — that's expected. Use Shopify ME as ground truth, and look at blended ROAS (all channels combined) rather than trusting TikTok's self-reported ROAS.

### Weekly Review Cadence
- Monday: Pull TikTok data (spend, CTR, CPM by ad group)
- Check GA4 ME for organic vs paid traffic shift
- Check Shopify ME orders for any TikTok-assisted revenue (UTM tagged: `utm_source=tiktok&utm_medium=paid`)
- Rotate creative every 14 days regardless of performance (TikTok fatigue is faster than Meta)

---

## Step 7 — Creator / UGC Layer (Month 2+)

Once baseline paid is running, add a creator layer. This is what separates good TikTok from great TikTok.

**Target creator profile:**
- Gulf-based (KSA or UAE preferred)
- 50k–500k followers
- Sneaker/streetwear or lifestyle niche
- Authentic audience (check engagement rate >3%)

**Deal structure to start:**
- Gifting + $200–400 per video (no exclusivity needed at this stage)
- Ask for usage rights to whitelabel their content as Spark Ads (TikTok's version of boosted creator content — outperforms brand-made creative by 30–40% on average)

**Why Spark Ads matter:** Running a creator's TikTok as an ad (rather than a brand ad) keeps the native feel, retains the creator's social proof (comments, likes), and consistently outperforms standard ads in the Gulf market.

---

## What Success Looks Like (90-Day View)

By end of Month 3, TikTok should be:
- Driving 500–1,500 incremental site sessions/week from ME
- Retargeting achieving >4x ROAS
- Blended CPO across all channels unchanged or improved (TikTok feeding top-of-funnel so Google/Meta close at lower CPO)
- 2–3 creator partnerships active
- Creative library of 10+ proven video assets

TikTok will not replace Meta or Google. The goal is to own the discovery moment — especially for the 18–25 Gulf audience that is increasingly unreachable on Meta — and hand warm traffic to the channels that close.

---

*Plan prepared: 2026-04-23 | KICKS CREW ME Marketing*
