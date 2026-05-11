export const style = {
  bg: "#F7F4EE",
  panel: "#FFFFFF",
  ink: "#111827",
  soft: "#667085",
  muted: "#D9D2C7",
  dark: "#101827",
  accent: "#176B87",
  accent2: "#C47F2C",
  good: "#168A55",
  warn: "#B45309",
  bad: "#B42318",
  pale: "#EAF3F4",
  serif: "Georgia",
  sans: "Aptos",
};

export const footer = "KICKS CREW ME weekly performance | Apr 27-May 03, 2026 | Sources: paid platforms + GA4 ME";

export function text(slide, ctx, value, x, y, w, h, opts = {}) {
  return ctx.addText(slide, {
    text: String(value ?? ""),
    left: x,
    top: y,
    width: w,
    height: h,
    fontSize: opts.size ?? 18,
    color: opts.color ?? style.ink,
    bold: Boolean(opts.bold),
    typeface: opts.face ?? style.sans,
    align: opts.align ?? "left",
    valign: opts.valign ?? "top",
    fill: opts.fill ?? "#00000000",
    line: opts.line ?? ctx.line(),
    insets: opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function rect(slide, ctx, x, y, w, h, fill, opts = {}) {
  return ctx.addShape(slide, {
    left: x,
    top: y,
    width: w,
    height: h,
    geometry: opts.geometry ?? "rect",
    fill,
    line: opts.line ?? ctx.line(opts.lineColor ?? "#00000000", opts.lineWeight ?? 0),
  });
}

export function bg(slide, ctx) {
  rect(slide, ctx, 0, 0, ctx.W, ctx.H, style.bg);
}

export function title(slide, ctx, kicker, headline, subhead = "") {
  text(slide, ctx, kicker.toUpperCase(), 58, 44, 620, 18, { size: 9, color: style.soft, bold: true });
  rect(slide, ctx, 58, 68, 42, 3, style.accent);
  text(slide, ctx, headline, 58, 86, 850, 88, { size: 32, color: style.ink, bold: true, face: style.serif });
  if (subhead) text(slide, ctx, subhead, 58, 174, 850, 42, { size: 12.5, color: style.soft });
}

export function addFooter(slide, ctx, page, note = footer) {
  rect(slide, ctx, 58, 681, 1164, 1, style.muted);
  text(slide, ctx, note, 58, 690, 860, 14, { size: 7.5, color: style.soft });
  text(slide, ctx, String(page).padStart(2, "0"), 1180, 686, 42, 18, {
    size: 11,
    color: style.soft,
    bold: true,
    face: style.serif,
    align: "right",
  });
}

export function metric(slide, ctx, x, y, w, label, value, note, color = style.ink) {
  rect(slide, ctx, x, y, w, 118, style.panel, { lineColor: "#E6DED2", lineWeight: 1 });
  rect(slide, ctx, x, y, 4, 118, color);
  text(slide, ctx, label.toUpperCase(), x + 18, y + 16, w - 30, 16, { size: 8.5, color: style.soft, bold: true });
  text(slide, ctx, value, x + 18, y + 38, w - 30, 36, { size: 27, color, bold: true, face: style.serif });
  text(slide, ctx, note, x + 18, y + 78, w - 30, 28, { size: 9.5, color: style.soft });
}

export function bar(slide, ctx, x, y, w, h, pct, color, label, value) {
  text(slide, ctx, label, x, y - 2, 170, 20, { size: 11, color: style.ink, bold: true });
  rect(slide, ctx, x + 184, y + 3, w - 270, h, "#E8E1D8");
  rect(slide, ctx, x + 184, y + 3, Math.max(4, (w - 270) * pct), h, color);
  text(slide, ctx, value, x + w - 76, y - 1, 76, 20, { size: 10.5, color: style.ink, bold: true, align: "right" });
}

export function tableRow(slide, ctx, x, y, widths, cells, opts = {}) {
  const fill = opts.header ? style.dark : opts.fill ?? "#00000000";
  if (opts.header || opts.fill) rect(slide, ctx, x - 10, y - 8, widths.reduce((a, b) => a + b, 0) + 20, 34, fill);
  let xx = x;
  cells.forEach((cell, idx) => {
    text(slide, ctx, cell, xx, y, widths[idx] - 14, 22, {
      size: opts.header ? 8.5 : 10.5,
      color: opts.header ? "#FFFFFF" : opts.color ?? style.ink,
      bold: opts.header || idx === 0 || opts.bold,
      align: idx === 0 ? "left" : "right",
    });
    xx += widths[idx];
  });
}

export function callout(slide, ctx, x, y, w, h, label, copy, color = style.accent) {
  rect(slide, ctx, x, y, w, h, style.pale, { lineColor: "#D3E4E6", lineWeight: 1 });
  text(slide, ctx, label.toUpperCase(), x + 18, y + 16, w - 36, 16, { size: 8.5, color, bold: true });
  text(slide, ctx, copy, x + 18, y + 40, w - 36, h - 54, { size: 12.5, color: style.ink });
}
