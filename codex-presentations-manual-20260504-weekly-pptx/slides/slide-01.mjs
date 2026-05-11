import { addFooter, bg, metric, rect, style, text } from "./common.mjs";

export default function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  rect(slide, ctx, 0, 0, 1280, 720, style.dark);
  rect(slide, ctx, 58, 54, 5, 60, style.accent2);
  text(slide, ctx, "KICKS CREW ME", 78, 56, 360, 18, { size: 10, color: "#C9D0DA", bold: true });
  text(slide, ctx, "Weekly performance report | Apr 27-May 03, 2026", 78, 86, 520, 18, { size: 10, color: "#C9D0DA" });
  text(slide, ctx, "Strong absolute return,\nbut efficiency softened\nas spend rose.", 58, 164, 650, 178, {
    size: 41,
    color: "#FFFFFF",
    bold: true,
    face: style.serif,
  });
  text(slide, ctx, "Blended paid ROAS stayed above target at 10.16x, while CPO held under the $22 target. The issue is momentum: spend grew 8.0% WoW while platform revenue slipped 1.0%, leaving the week blocked for publishing until Shopify Admin reconciliation clears.", 760, 180, 398, 128, {
    size: 15,
    color: "#D9E2EF",
  });
  metric(slide, ctx, 58, 446, 260, "Blended Spend", "$14,046.93", "+7.99% WoW", style.accent2);
  metric(slide, ctx, 342, 446, 260, "Ad Platform Revenue", "$142,707.96", "-0.95% WoW", style.accent);
  metric(slide, ctx, 626, 446, 260, "Blended ROAS", "10.16x", "-8.30% WoW, still above 7x", style.good);
  metric(slide, ctx, 910, 446, 260, "Blended CPO", "$20.83", "+11.75% WoW, still below $22", style.good);
  addFooter(slide, ctx, 1, "Status: blocked pending Shopify Admin reconciliation before Slack publishing");
  return slide;
}
