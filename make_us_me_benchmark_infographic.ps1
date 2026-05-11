$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$out = Join-Path (Get-Location) "US_ME_app_benchmark_infographic.png"
$w = 1600
$h = 2220

$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

function Color($hex) { return [System.Drawing.ColorTranslator]::FromHtml($hex) }
function Brush($hex) { return New-Object System.Drawing.SolidBrush (Color $hex) }
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

function DrawMetricCard($x, $y, $title, $big, $note, $accent) {
    FillRound $x $y 420 245 26 "#FFFFFF" "#DCE6F1" 2
    $b = Brush $accent
    $g.FillRectangle($b, $x, $y, 13, 245)
    $b.Dispose()
    DrawText $title ($x + 38) ($y + 28) 330 34 (Font 25 ([System.Drawing.FontStyle]::Bold)) "#334155"
    DrawText $big ($x + 38) ($y + 78) 330 64 (Font 52 ([System.Drawing.FontStyle]::Bold)) "#0F172A"
    DrawText $note ($x + 38) ($y + 152) 330 70 (Font 23) "#475569"
}

function DrawCompareRow($y, $label, $us, $me, $highlight = $false) {
    if ($highlight) {
        FillRound 120 ($y - 8) 1360 72 18 "#EAF7F8" $null
        $font = Font 27 ([System.Drawing.FontStyle]::Bold)
        $color = "#0F172A"
    } else {
        $font = Font 25
        $color = "#0F172A"
        $pen = New-Object System.Drawing.Pen (Color "#E2E8F0"), 1
        $g.DrawLine($pen, 140, $y + 60, 1460, $y + 60)
        $pen.Dispose()
    }
    DrawText $label 155 $y 430 42 $font $color
    DrawText $us 670 $y 270 42 $font $color "Center"
    DrawText $me 1100 $y 270 42 $font $color "Center"
}

$g.Clear((Color "#F6F8FB"))

$topBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle 0, 0, $w, 560),
    (Color "#0F172A"),
    (Color "#115E59"),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
)
$g.FillRectangle($topBrush, 0, 0, $w, 560)
$topBrush.Dispose()

DrawText "KICKS CREW BENCHMARK" 100 78 760 44 (Font 30 ([System.Drawing.FontStyle]::Bold)) "#BEE3EA"
DrawText "ME is much more app-heavy than US" 100 135 940 150 (Font 62 ([System.Drawing.FontStyle]::Bold)) "#FFFFFF"
DrawText "Nov 1, 2025 - May 4, 2026 | Shopify sales reporting benchmark" 104 310 980 44 (Font 28) "#D7EEF2"

FillRound 1085 100 405 280 30 "#FFFFFF" $null
DrawText "Core readout" 1135 138 305 34 (Font 25 ([System.Drawing.FontStyle]::Bold)) "#0F172A" "Center"
DrawText "4.1x" 1135 188 305 78 (Font 74 ([System.Drawing.FontStyle]::Bold)) "#0E7490" "Center"
DrawText "higher app order share in ME vs US" 1135 282 305 62 (Font 25) "#334155" "Center"

DrawMetricCard 100 430 "US APP SHARE" "6.1%" "11,966 app orders out of 197,782" "#64748B"
DrawMetricCard 590 430 "ME APP SHARE" "24.9%" "4,574 app orders out of 18,357" "#0E7490"
DrawMetricCard 1080 430 "REPEAT RATE" "Similar" "US 25.2% vs ME 24.9%" "#16A34A"

DrawText "What this means" 100 725 650 52 (Font 42 ([System.Drawing.FontStyle]::Bold)) "#0F172A"
DrawText "US and ME have almost the same repeat purchase rate, but ME customers are far more likely to place orders through the app." 100 785 1340 82 (Font 30) "#334155"

FillRound 100 920 1400 520 28 "#FFFFFF" "#DCE6F1" 2
DrawText "US vs ME benchmark" 140 955 520 44 (Font 36 ([System.Drawing.FontStyle]::Bold)) "#0F172A"
DrawText "The app is not just working in ME; it is structurally more important there than in the US benchmark." 140 1010 1180 42 (Font 25) "#475569"

FillRound 120 1085 1360 66 16 "#EAF1F8" $null
DrawText "Metric" 155 1102 430 38 (Font 24 ([System.Drawing.FontStyle]::Bold)) "#334155"
DrawText "US" 670 1102 270 38 (Font 24 ([System.Drawing.FontStyle]::Bold)) "#334155" "Center"
DrawText "ME" 1100 1102 270 38 (Font 24 ([System.Drawing.FontStyle]::Bold)) "#334155" "Center"

DrawCompareRow 1180 "Repeat rate" "25.2%" "24.9%"
DrawCompareRow 1255 "Orders" "197,782" "18,357"
DrawCompareRow 1330 "Sales" '$35.96M' '$3.18M'
DrawCompareRow 1405 "App direct orders" "11,966" "4,574"
DrawCompareRow 1480 "App order share" "6.1%" "24.9%" $true

FillRound 100 1600 675 265 28 "#FFFFFF" "#DCE6F1" 2
DrawText "The useful benchmark" 140 1635 550 40 (Font 33 ([System.Drawing.FontStyle]::Bold)) "#0F172A"
DrawText "Repeat equal. App mix different." 140 1695 560 42 (Font 31 ([System.Drawing.FontStyle]::Bold)) "#0E7490"
DrawText "ME is performing like a mature repeat market, but with much stronger app adoption." 140 1752 560 78 (Font 24) "#475569"

FillRound 825 1600 675 265 28 "#FFFFFF" "#DCE6F1" 2
DrawText "Reporting note" 865 1635 550 40 (Font 33 ([System.Drawing.FontStyle]::Bold)) "#0F172A"
DrawText "Shopify sales-report orders" 865 1695 560 42 (Font 34 ([System.Drawing.FontStyle]::Bold)) "#334155"
DrawText "Order count comes from Shopify sales reporting, not raw gross API order count." 865 1752 560 78 (Font 24) "#475569"

FillRound 100 1930 1400 145 28 "#0F172A" $null
DrawText "Main narrative: ME repeat rate is basically US-level." 140 1960 1320 36 (Font 27 ([System.Drawing.FontStyle]::Bold)) "#FFFFFF"
DrawText "But ME app order share is 24.9% vs 6.1% in the US." 140 2005 1320 36 (Font 27 ([System.Drawing.FontStyle]::Bold)) "#BEE3EA"

DrawText "Prepared from Julien's US benchmark + ME comparison" 100 2150 900 36 (Font 22) "#64748B"
DrawText "KICKS CREW ME" 1230 2150 270 36 (Font 22 ([System.Drawing.FontStyle]::Bold)) "#64748B" "Far"

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output $out
