param(
    [Parameter(Mandatory = $true)]
    [string]$DateFrom,

    [Parameter(Mandatory = $true)]
    [string]$DateTo,

    [string]$DailyDir = ".\\01-daily"
)

$start = [datetime]::ParseExact($DateFrom, "yyyy-MM-dd", $null)
$end = [datetime]::ParseExact($DateTo, "yyyy-MM-dd", $null)

if ($end -lt $start) {
    throw "date_to must be on or after date_from"
}

$adminLineRegex = [regex]'Admin\s+(?<orders>\d+)\s+orders\s+/\s+\$(?<sales>[0-9,]+(?:\.[0-9]{1,2})?)\s+total_sales'

$rows = @()
$missing = @()
$unreconciled = @()

for ($d = $start; $d -le $end; $d = $d.AddDays(1)) {
    $dateKey = $d.ToString("yyyy-MM-dd")
    $path = Join-Path $DailyDir "$dateKey-ads-brain.md"

    if (-not (Test-Path $path)) {
        $missing += $dateKey
        continue
    }

    $content = Get-Content -Raw $path
    $match = $adminLineRegex.Match($content)

    if (-not $match.Success) {
        $unreconciled += [pscustomobject]@{
            date = $dateKey
            file = $path
            reason = "No Admin reconciliation line with total_sales found"
        }
        continue
    }

    $orders = [int]$match.Groups["orders"].Value
    $sales = [double](($match.Groups["sales"].Value) -replace ",", "")

    $rows += [pscustomobject]@{
        date = $dateKey
        file = $path
        admin_orders = $orders
        admin_total_sales = [math]::Round($sales, 2)
    }
}

$summary = [pscustomobject]@{
    date_from = $DateFrom
    date_to = $DateTo
    reconciled_days = $rows.Count
    missing_days = $missing
    unreconciled_days = $unreconciled
    weekly_admin_orders = [int](($rows | Measure-Object admin_orders -Sum).Sum)
    weekly_admin_total_sales = [math]::Round((($rows | Measure-Object admin_total_sales -Sum).Sum), 2)
    status = if (($missing.Count -eq 0) -and ($unreconciled.Count -eq 0)) { "ready" } else { "blocked" }
}

[pscustomobject]@{
    summary = $summary
    daily_rows = $rows
} | ConvertTo-Json -Depth 6
