import { addFooter, bg, callout, style, tableRow, text, title } from "./common.mjs";

export default function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Weekly verdict", "The week cleared paid-media targets, but the WoW direction was not clean.", "Spend accelerated faster than revenue, which compressed ROAS and lifted CPO even though both metrics remained in acceptable territory.");
  const x = 82;
  const y = 260;
  const widths = [250, 190, 190, 150];
  tableRow(slide, ctx, x, y, widths, ["Metric", "Current Week", "Prior Week", "WoW"], { header: true });
  tableRow(slide, ctx, x, y + 54, widths, ["Blended Spend", "$14,046.93", "$13,007.39", "+7.99%"]);
  tableRow(slide, ctx, x, y + 100, widths, ["Blended Revenue", "$142,707.96", "$144,073.58", "-0.95%"], { fill: "#FBF8F3" });
  tableRow(slide, ctx, x, y + 146, widths, ["Blended ROAS", "10.16x", "11.08x", "-8.30%"]);
  tableRow(slide, ctx, x, y + 192, widths, ["Blended CPO", "$20.83", "$18.64", "+11.75%"], { fill: "#FBF8F3" });
  callout(slide, ctx, 928, 264, 250, 214, "Main readout", "Performance is still strong on an absolute basis. The near-term question is not whether ME can scale; it is where the incremental spend should stop until test-campaign drag is cleaned up.", style.accent);
  callout(slide, ctx, 928, 502, 250, 88, "Target check", "ROAS above 7x. CPO below $22. Publish gate still open.", style.good);
  addFooter(slide, ctx, 2);
  return slide;
}
