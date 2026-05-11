import { addFooter, bg, callout, rect, style, tableRow, text, title } from "./common.mjs";

export default function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Campaign readout", "The winners are clear; the drag is concentrated in Meta test campaigns.", "The next optimization pass should protect high-ROAS campaigns and stop low-return spend from setting the blended trend.");
  text(slide, ctx, "Best current campaigns", 78, 238, 420, 24, { size: 17, color: style.good, bold: true, face: style.serif });
  const widths = [300, 120, 120];
  tableRow(slide, ctx, 78, 286, widths, ["Campaign", "ROAS", "CPO"], { header: true });
  tableRow(slide, ctx, 78, 338, widths, ["2604_ME_conversion_manual", "18.69x", "$15.91"]);
  tableRow(slide, ctx, 78, 386, widths, ["KC Test Main Account 1.0", "17.98x", "-"], { fill: "#FBF8F3" });
  tableRow(slide, ctx, 78, 434, widths, ["2604_ASC_UAE_ROAS", "15.13x", "-"]);
  text(slide, ctx, "Weakest drag points", 684, 238, 420, 24, { size: 17, color: style.bad, bold: true, face: style.serif });
  tableRow(slide, ctx, 684, 286, widths, ["Campaign", "ROAS", "CPO"], { header: true });
  tableRow(slide, ctx, 684, 338, widths, ["2604_ASC_EG_ROAS", "2.39x", "$116.60"], { color: style.bad });
  tableRow(slide, ctx, 684, 386, widths, ["2604_KSA_manual", "3.94x", "$61.51"], { fill: "#FBF8F3", color: style.bad });
  tableRow(slide, ctx, 684, 434, widths, ["New Format Test KSA", "4.27x", "$55.32"], { color: style.bad });
  rect(slide, ctx, 78, 536, 1100, 1, style.muted);
  callout(slide, ctx, 134, 558, 1010, 78, "Decision", "Prioritize cutting or restructuring the weakest Meta tests before increasing spend further. Google KU at 6.38x ROAS / $29.55 CPO also needs review, but it is a smaller drag than the Meta underperformers.", style.bad);
  addFooter(slide, ctx, 5);
  return slide;
}
