@echo off
setlocal
set "SCRIPT=H:\kickscrew\KICKS CREW ME – Marketing & Content Assistant\scripts\shopify-auth-read-orders.cmd"
set "OUT=H:\kickscrew\KICKS CREW ME – Marketing & Content Assistant\.shopify-auth-live.out.txt"
set "ERR=H:\kickscrew\KICKS CREW ME – Marketing & Content Assistant\.shopify-auth-live.err.txt"
if exist "%OUT%" del /f /q "%OUT%"
if exist "%ERR%" del /f /q "%ERR%"
start "shopify-auth-live" /b cmd /c call "%SCRIPT%" 1>"%OUT%" 2>"%ERR%"
