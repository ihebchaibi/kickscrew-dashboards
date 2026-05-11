import { addFooter, bar, bg, callout, metric, style, text, title } from "./common.mjs";

export default function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "GA4 cross-check", "Site demand improved across the funnel, but cart-to-purchase conversion was flat.", "GA4 shows healthy traffic and transaction growth, while the final conversion step barely moved.");
  metric(slide, ctx, 70, 238, 210, "Sessions", "86,645", "+11.09% WoW", style.accent);
  metric(slide, ctx, 304, 238, 210, "Transactions", "599", "+10.72% WoW", style.good);
  metric(slide, ctx, 538, 238, 210, "GA4 Revenue", "$120.7K", "+8.26% WoW", style.good);
  metric(slide, ctx, 772, 238, 210, "Engagement", "84.93%", "-0.64 pp WoW", style.warn);
  text(slide, ctx, "Funnel volume", 78, 420, 420, 26, { size: 16, color: style.ink, bold: true, face: style.serif });
  bar(slide, ctx, 78, 466, 690, 18, 1.0, style.accent, "Sessions", "86,645");
  bar(slide, ctx, 78, 512, 690, 18, 0.292, style.accent2, "Add to Cart", "25,275");
  bar(slide, ctx, 78, 558, 690, 18, 0.081, style.warn, "Checkouts", "7,015");
  bar(slide, ctx, 78, 604, 690, 18, 0.0069, style.good, "Purchases", "599");
  callout(slide, ctx, 884, 454, 270, 120, "Watch point", "Cart-to-purchase CVR was 2.37%, down 0.02 pp. Demand increased; purchase completion did not improve with it.", style.warn);
  addFooter(slide, ctx, 4);
  return slide;
}
