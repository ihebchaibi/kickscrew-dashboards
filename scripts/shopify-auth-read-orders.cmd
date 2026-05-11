@echo off
setlocal
set "APPDATA=H:\kickscrew\KICKS CREW ME – Marketing & Content Assistant\.shopify-appdata"
set "XDG_CONFIG_HOME=H:\kickscrew\KICKS CREW ME – Marketing & Content Assistant\.shopify-xdg"
"C:\temp\shopify-cli\node_modules\.bin\shopify.cmd" store auth --store kickscrewshop.myshopify.com --scopes read_orders --json
