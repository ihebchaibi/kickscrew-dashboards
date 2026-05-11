import { addFooter, bg, callout, rect, style, text, title } from "./common.mjs";

function step(slide, ctx, n, x, y, headline, body, color = style.accent) {
  rect(slide, ctx, x, y, 42, 42, color);
  text(slide, ctx, String(n), x, y + 7, 42, 24, { size: 18, color: "#FFFFFF", bold: true, align: "center", face: style.serif });
  text(slide, ctx, headline, x + 60, y, 460, 22, { size: 15, color: style.ink, bold: true });
  text(slide, ctx, body, x + 60, y + 28, 470, 46, { size: 11, color: style.soft });
}

export default function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Publishing gate", "The report should not be published until Shopify Admin reconciliation clears.", "The paid and GA4 data is ready. The missing piece is ground-truth validation against Shopify Admin.");
  callout(slide, ctx, 78, 238, 474, 138, "Why blocked", "Windsor returned raw order-level rows with obvious zero-value and gift-card-like records. The required Shopify Admin reconciliation could not be completed in this session.", style.warn);
  callout(slide, ctx, 614, 238, 474, 138, "Required gate", "Report instructions require Shopify Admin agreement within +/-2 orders and +/-2% revenue before publishing. Slack canvas overwrite also was not available.", style.warn);
  step(slide, ctx, 1, 96, 452, "Re-run Shopify reconciliation", "Validate Apr 27-May 03 orders and revenue against Shopify Admin totals.", style.accent);
  step(slide, ctx, 2, 96, 540, "Restore Slack canvas update path", "Enable replacement of existing weekly canvas F0ASE57CV9C when the gate clears.", style.accent2);
  step(slide, ctx, 3, 650, 452, "Cut weak Meta tests", "Act on ASC EG, KSA manual, and New Format Test KSA before scaling further.", style.bad);
  step(slide, ctx, 4, 650, 540, "Keep efficient campaigns funded", "Protect 2604_ME_conversion_manual, KC Test Main Account 1.0, and ASC UAE.", style.good);
  addFooter(slide, ctx, 6, "Final status: PPTX prepared from weekly notes; publishing remains blocked by reconciliation gate");
  return slide;
}
