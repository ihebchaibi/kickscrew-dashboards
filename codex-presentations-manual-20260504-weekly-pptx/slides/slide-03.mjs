import { addFooter, bar, bg, callout, metric, style, text, title } from "./common.mjs";

export default function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Platform mix", "Meta carried the largest revenue pool; Google and Snapchat were both efficient enough to defend.", "All three channels were above the 7x ROAS floor, which points the clean-up work toward campaign-level pruning rather than channel shutdowns.");
  metric(slide, ctx, 72, 238, 230, "Google Ads", "$62.2K", "9.16x ROAS | $21.45 CPO", style.accent);
  metric(slide, ctx, 326, 238, 230, "Meta Ads", "$69.4K", "11.24x ROAS | $20.30 CPO", style.good);
  metric(slide, ctx, 580, 238, 230, "Snapchat Ads", "$11.2K", "10.24x ROAS | $20.22 CPO", style.accent2);
  text(slide, ctx, "Revenue contribution", 78, 420, 420, 26, { size: 16, color: style.ink, bold: true, face: style.serif });
  bar(slide, ctx, 78, 464, 680, 18, 0.486, style.good, "Meta Ads", "$69,372");
  bar(slide, ctx, 78, 512, 680, 18, 0.436, style.accent, "Google Ads", "$62,155");
  bar(slide, ctx, 78, 560, 680, 18, 0.078, style.accent2, "Snapchat Ads", "$11,181");
  callout(slide, ctx, 884, 252, 270, 248, "Implication", "The budget story is nuanced: Meta is the biggest revenue driver, but the same platform also contains the worst drag. Keep winners funded while cutting the weak tests.", style.accent);
  addFooter(slide, ctx, 3);
  return slide;
}
