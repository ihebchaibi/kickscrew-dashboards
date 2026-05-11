param(
    [string]$DateFrom = "2025-11-01",
    [string]$DateTo = "2026-05-04",
    [string]$Store = "kickscrewshop.myshopify.com",
    [string]$OutFile = "02-analysis\me-app-repeat-shopify-2025-11-01_2026-05-04.json",
    [switch]$UseDefaultShopifyConfig,
    [int]$SliceDays = 7
)

$ErrorActionPreference = "Stop"

$shopify = "C:\temp\shopify-cli\node_modules\.bin\shopify.cmd"
$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
if (-not $UseDefaultShopifyConfig) {
    $env:APPDATA = Join-Path $workspace ".shopify-appdata"
    $env:XDG_CONFIG_HOME = Join-Path $workspace ".shopify-xdg"
}
$env:SHOPIFY_CLI_NO_ANALYTICS = "1"
$countries = @(
    @{ Name = "United Arab Emirates"; Short = "UAE" },
    @{ Name = "Saudi Arabia"; Short = "KSA" },
    @{ Name = "Kuwait"; Short = "Kuwait" },
    @{ Name = "Qatar"; Short = "Qatar" },
    @{ Name = "Bahrain"; Short = "Bahrain" }
)

$query = @'
query OrdersForRepeatBlock($query: String!, $cursor: String) {
  orders(first: 250, after: $cursor, query: $query, sortKey: CREATED_AT) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id
      name
      createdAt
      cancelledAt
      sourceName
      app { name }
      customer { id numberOfOrders }
      shippingAddress { country countryCodeV2 }
      currentTotalPriceSet { shopMoney { amount currencyCode } }
    }
  }
}
'@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$queryFile = Join-Path $PSScriptRoot "orders-repeat-block.graphql"
[System.IO.File]::WriteAllText($queryFile, $query, $utf8NoBom)
$varsFile = Join-Path $PSScriptRoot "orders-repeat-block-vars.json"

function Invoke-ShopifyOrders {
    param(
        [string]$DateFrom,
        [string]$DateTo
    )

    $cursor = $null
    $all = New-Object System.Collections.Generic.List[object]
    $search = "created_at:>=$DateFrom created_at:<=$DateTo test:false"

    do {
        $varsJson = @{ query = $search; cursor = $cursor } | ConvertTo-Json -Compress
        [System.IO.File]::WriteAllText($varsFile, $varsJson, $utf8NoBom)
        $raw = & $shopify store execute --store $Store --query-file $queryFile --variable-file $varsFile --json
        if ($LASTEXITCODE -ne 0) {
            throw "Shopify CLI failed for $DateFrom to $DateTo"
        }

        $parsed = ($raw | Out-String | ConvertFrom-Json)
        $orders = $parsed.data.orders
        foreach ($order in $orders.nodes) {
            $all.Add($order) | Out-Null
        }
        $cursor = $orders.pageInfo.endCursor
    } while ($orders.pageInfo.hasNextPage)

    return $all
}

$orderRows = New-Object System.Collections.Generic.List[object]
$countryByName = @{}
foreach ($country in $countries) {
    $countryByName[$country.Name] = $country.Short
}

$startDate = [datetime]::ParseExact($DateFrom, "yyyy-MM-dd", $null)
$endDate = [datetime]::ParseExact($DateTo, "yyyy-MM-dd", $null)

for ($sliceStart = $startDate; $sliceStart -le $endDate; $sliceStart = $sliceStart.AddDays($SliceDays)) {
    $sliceEnd = $sliceStart.AddDays($SliceDays - 1)
    if ($sliceEnd -gt $endDate) { $sliceEnd = $endDate }

    $sliceFrom = $sliceStart.ToString("yyyy-MM-dd")
    $sliceTo = $sliceEnd.ToString("yyyy-MM-dd")
    Write-Host "Fetching $sliceFrom to $sliceTo..."
    $orders = Invoke-ShopifyOrders -DateFrom $sliceFrom -DateTo $sliceTo
    foreach ($order in $orders) {
        if ($null -ne $order.cancelledAt) { continue }
        $shippingCountry = if ($order.shippingAddress) { $order.shippingAddress.country } else { $null }
        if (-not $countryByName.ContainsKey($shippingCountry)) { continue }
        $countryShort = $countryByName[$shippingCountry]
        $orderRows.Add([pscustomobject]@{
            id = $order.id
            name = $order.name
            createdAt = $order.createdAt
            country = $countryShort
            country_full = $shippingCountry
            app_name = if ($order.app) { $order.app.name } else { $null }
            source_name = $order.sourceName
            customer_id = if ($order.customer) { $order.customer.id } else { $null }
            customer_number_of_orders = if ($order.customer) { [int]$order.customer.numberOfOrders } else { $null }
            is_repeat = ($order.customer -and ([int]$order.customer.numberOfOrders -gt 1))
            total_price = [double]$order.currentTotalPriceSet.shopMoney.amount
            currency = $order.currentTotalPriceSet.shopMoney.currencyCode
        }) | Out-Null
    }
}

$unique = $orderRows | Sort-Object id -Unique

function Summarize-Orders {
    param([object[]]$Rows)

    $total = @($Rows).Count
    $repeat = @($Rows | Where-Object { $_.is_repeat }).Count
    $app = @($Rows | Where-Object { $_.app_name -eq "kickscrew_store_mobile" }).Count
    $revenue = ($Rows | Measure-Object total_price -Sum).Sum

    [pscustomobject]@{
        orders = $total
        repeat_orders = $repeat
        repeat_rate = if ($total) { [math]::Round($repeat / $total, 4) } else { 0 }
        app_direct_orders = $app
        app_order_share = if ($total) { [math]::Round($app / $total, 4) } else { 0 }
        revenue = [math]::Round($revenue, 2)
    }
}

$countrySummary = @{}
foreach ($country in $countries) {
    $countrySummary[$country.Short] = Summarize-Orders -Rows @($unique | Where-Object { $_.country -eq $country.Short })
}

$recentRows = @($unique | Where-Object {
    ([datetime]$_.createdAt).Date -ge ([datetime]"2026-03-01").Date -and
    ([datetime]$_.createdAt).Date -le ([datetime]"2026-05-04").Date
})

$result = [pscustomobject]@{
    generated_at = (Get-Date).ToString("s")
    source = "Shopify Admin GraphQL via Shopify CLI"
    baseline = [pscustomobject]@{
        date_from = $DateFrom
        date_to = $DateTo
        countries = $countrySummary
        total = Summarize-Orders -Rows @($unique)
    }
    recent = [pscustomobject]@{
        date_from = "2026-03-01"
        date_to = "2026-05-04"
        countries = @{
            UAE = Summarize-Orders -Rows @($recentRows | Where-Object { $_.country -eq "UAE" })
            KSA = Summarize-Orders -Rows @($recentRows | Where-Object { $_.country -eq "KSA" })
            Kuwait = Summarize-Orders -Rows @($recentRows | Where-Object { $_.country -eq "Kuwait" })
            Qatar = Summarize-Orders -Rows @($recentRows | Where-Object { $_.country -eq "Qatar" })
            Bahrain = Summarize-Orders -Rows @($recentRows | Where-Object { $_.country -eq "Bahrain" })
        }
        total = Summarize-Orders -Rows @($recentRows)
    }
}

$outPath = Join-Path (Get-Location) $OutFile
$outDir = Split-Path -Parent $outPath
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
[System.IO.File]::WriteAllText($outPath, ($result | ConvertTo-Json -Depth 8), $utf8NoBom)
Write-Host "Saved $outPath"
