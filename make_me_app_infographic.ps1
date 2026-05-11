$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$out = Join-Path (Get-Location) "ME_app_performance_infographic.png"
$w = 1600
$h = 2250

$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

function Color($hex) {
    return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function Brush($hex) {
    return New-Object System.Drawing.SolidBrush (Color $hex)
}

function PenC($hex, $width = 1) {
    return New-Object System.Drawing.Pen (Color $hex), $width
}

function Font($size, $style = [System.Drawing.FontStyle]::Regular) {
    return New-Object System.Drawing.Font("Segoe UI", $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function RoundedRectPath($x, $y, $width, $height, $radius) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $width - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $width - $d, $y + $height - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $height - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function FillRound($x, $y, $width, $height, $radius, $fill, $stroke = $null, $strokeWidth = 1) {
    $p = RoundedRectPath $x $y $width $height $radius
    $g.FillPath((Brush $fill), $p)
    if ($stroke) {
        $pen = New-Object System.Drawing.Pen (Color $stroke), $strokeWidth
        $g.DrawPath($pen, $p)
        $pen.Dispose()
    }
    $p.Dispose()
}

function DrawText($text, $x, $y, $width, $height, $font, $color, $align = "Near", $valign = "Near") {
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::$align
    $sf.LineAlignment = [System.Drawing.StringAlignment]::$valign
    $sf.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
    $rect = New-Object System.Drawing.RectangleF $x, $y, $width, $height
    $g.DrawString($text, $font, (Brush $color), $rect, $sf)
    $sf.Dispose()
}

function DrawMetric($x, $y, $title, $value, $note, $accent) {
    FillRound $x $y 350 245 24 "#FFFFFF" "#DCE6F1" 2
    $accentBrush = Brush $accent
    $g.FillRectangle($accentBrush, $x, $y, 12, 245)
    $accentBrush.Dispose()
    DrawText $title ($x + 34) ($y + 28) 280 32 (Font 25 ([System.Drawing.FontStyle]::Bold)) "#334155"
    DrawText $value ($x + 34) ($y + 72) 280 60 (Font 48 ([System.Drawing.FontStyle]::Bold)) "#0F172A"
    DrawText $note ($x + 34) ($y + 142) 280 78 (Font 23) "#475569"
}

function DrawTableRow($y, $market, $orders, $share, $cvr, $flagColor, $isHeader = $false) {
    if ($isHeader) {
        FillRound 110 $y 1380 62 16 "#EAF1F8" $null
        $font = Font 23 ([System.Drawing.FontStyle]::Bold)
        $color = "#334155"
    } else {
        $font = Font 24
        $color = "#0F172A"
        $linePen = New-Object System.Drawing.Pen (Color "#E2E8F0"), 1
        $g.DrawLine($linePen, 130, $y + 62, 1470, $y + 62)
        $linePen.Dispose()
        $flagBrush = Brush $flagColor
        $g.FillEllipse($flagBrush, 134, $y + 21, 18, 18)
        $flagBrush.Dispose()
    }
    DrawText $market 170 ($y + 15) 330 36 $font $color
    DrawText $orders 540 ($y + 15) 230 36 $font $color "Center"
    DrawText $share 850 ($y + 15) 230 36 $font $color "Center"
    DrawText $cvr 1160 ($y + 15) 230 36 $font $color "Center"
}

$g.Clear((Color "#F6F8FB"))

# Background bands
$topBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle 0, 0, $w, 520),
    (Color "#0F172A"),
    (Color "#195E6B"),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
)
$g.FillRectangle($topBrush, 0, 0, $w, 600)
$topBrush.Dispose()

DrawText "KICKS CREW ME APP" 100 80 720 44 (Font 30 ([System.Drawing.FontStyle]::Bold)) "#BEE3EA"
DrawText "Already a major sales channel" 100 135 890 160 (Font 62 ([System.Drawing.FontStyle]::Bold)) "#FFFFFF"
DrawText "Nov 1, 2025 - May 4, 2026 | Shopify + GA4 + Mixpanel readout" 104 310 900 44 (Font 28) "#D7EEF2"

FillRound 1080 100 410 285 30 "#FFFFFF" $null
DrawText "Main narrative" 1130 142 310 34 (Font 25 ([System.Drawing.FontStyle]::Bold)) "#0F172A" "Center"
DrawText "~25%" 1130 188 310 78 (Font 72 ([System.Drawing.FontStyle]::Bold)) "#0E7490" "Center"
DrawText "of ME orders already come from the app" 1130 280 310 76 (Font 25) "#334155" "Center"

DrawMetric 100 455 "APP SHARE" "24.9%" "4,574 app orders out of 18,357 ME orders" "#0E7490"
DrawMetric 475 455 "APP SALES" "$807K" "Shopify app direct revenue" "#16A34A"
DrawMetric 850 455 "APP CVR" "1.25%" "GA4 app conversion rate" "#7C3AED"
DrawMetric 1225 455 "WEB CVR" "0.61%" "GA4 web conversion rate" "#F97316"

DrawText "What this means" 100 770 660 50 (Font 42 ([System.Drawing.FontStyle]::Bold)) "#0F172A"
DrawText "The app converts about 2x better than web and already drives 1 in 4 ME orders, before a major app-specific campaign push." 100 830 1340 92 (Font 30) "#334155"

FillRound 100 980 1400 500 28 "#FFFFFF" "#DCE6F1" 2
DrawText "Market opportunity" 135 1015 520 44 (Font 36 ([System.Drawing.FontStyle]::Bold)) "#0F172A"
DrawText "KSA is the biggest app growth market by volume. Qatar and Kuwait show the strongest app adoption rates." 135 1070 1180 42 (Font 25) "#475569"

DrawTableRow 1145 "Market" "App orders" "App share" "App CVR" "#FFFFFF" $true
DrawTableRow 1210 "KSA" "2,429" "29.1%" "1.47%" "#16A34A"
DrawTableRow 1275 "UAE" "1,834" "20.3%" "1.03%" "#0E7490"
DrawTableRow 1340 "Kuwait" "183" "31.7%" "1.29%" "#F59E0B"
DrawTableRow 1405 "Qatar" "120" "33.5%" "1.43%" "#7C3AED"

FillRound 100 1535 675 300 28 "#FFFFFF" "#DCE6F1" 2
DrawText "Repeat purchase strength" 135 1570 550 40 (Font 33 ([System.Drawing.FontStyle]::Bold)) "#0F172A"
DrawText "ME repeat rate: 24.9%" 135 1630 550 44 (Font 34 ([System.Drawing.FontStyle]::Bold)) "#0E7490"
DrawText "Kuwait and Qatar lead repeat behavior, while UAE and KSA drive the largest sales volume." 135 1690 560 90 (Font 25) "#475569"

FillRound 825 1535 675 300 28 "#FFFFFF" "#DCE6F1" 2
DrawText "Mixpanel behavior signal" 860 1570 560 40 (Font 33 ([System.Drawing.FontStyle]::Bold)) "#0F172A"
DrawText "37,221 first-open users" 860 1630 560 44 (Font 34 ([System.Drawing.FontStyle]::Bold)) "#7C3AED"
DrawText "Use Mixpanel for app behavior and drop-off. Use Shopify for orders/revenue and GA4 for app vs web CVR." 860 1690 560 100 (Font 25) "#475569"

FillRound 100 1880 1400 245 28 "#0F172A" $null
DrawText "Data rule of thumb" 140 1918 390 36 (Font 30 ([System.Drawing.FontStyle]::Bold)) "#FFFFFF"
DrawText "Shopify = business truth for orders/revenue | GA4 = cleaner platform CVR" 140 1970 1300 36 (Font 27) "#D7EEF2"
DrawText "Mixpanel = app behavior and drop-off, not final business CVR" 140 2015 1300 36 (Font 27) "#D7EEF2"
DrawText "Recommended focus: scale app campaigns in KSA, then improve UAE first-open to purchase conversion." 140 2074 1300 38 (Font 25) "#BEE3EA"

DrawText "Prepared from Julien's ME app / repeat / CVR readout" 100 2180 900 36 (Font 22) "#64748B"
DrawText "KICKS CREW ME" 1230 2180 270 36 (Font 22 ([System.Drawing.FontStyle]::Bold)) "#64748B" "Far"

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output $out
