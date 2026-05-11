#!/usr/bin/env python3
"""
KICKS CREW ME — Meta Asset Discovery
Run this first to find your Pixel ID, Page ID, Catalog ID, App ID.
Paste results into your .env file.
"""

import os
import sys
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN = os.getenv('META_ACCESS_TOKEN')
AD_ACCOUNT_ID = 'act_2790197764523614'

if not ACCESS_TOKEN or ACCESS_TOKEN == 'paste_your_token_here':
    print("❌ No access token found. Add META_ACCESS_TOKEN to your .env file first.")
    sys.exit(1)

try:
    from facebook_business.api import FacebookAdsApi
    from facebook_business.adobjects.adaccount import AdAccount
    from facebook_business.adobjects.business import Business
except ImportError:
    print("❌ Missing SDK. Run: pip install -r requirements.txt")
    sys.exit(1)

FacebookAdsApi.init(access_token=ACCESS_TOKEN)
account = AdAccount(AD_ACCOUNT_ID)

print("\n" + "="*55)
print("  KICKS CREW ME — Meta Asset Discovery")
print("="*55)

# --- Pixels ---
print("\n📡 PIXELS:")
try:
    pixels = account.get_ads_pixels(fields=['id', 'name'])
    for p in pixels:
        print(f"  → {p['name']}  |  ID: {p['id']}")
    if not pixels:
        print("  (none found)")
except Exception as e:
    print(f"  Error: {e}")

# --- Pages ---
print("\n📄 FACEBOOK PAGES:")
try:
    pages = account.get_connected_instagram_accounts(fields=['id', 'name'])
    for p in pages:
        print(f"  → {p.get('name', '?')}  |  ID: {p['id']}")
except Exception:
    pass
try:
    import requests
    resp = requests.get(
        'https://graph.facebook.com/v19.0/me/accounts',
        params={'access_token': ACCESS_TOKEN, 'fields': 'id,name'}
    )
    data = resp.json()
    for page in data.get('data', []):
        print(f"  → {page['name']}  |  ID: {page['id']}")
    if not data.get('data'):
        print("  (none found — check token has pages_read_engagement permission)")
except Exception as e:
    print(f"  Error: {e}")

# --- Product Catalogs ---
print("\n🗂️  PRODUCT CATALOGS:")
try:
    catalogs = account.get_product_catalogs(fields=['id', 'name'])
    for c in catalogs:
        print(f"  → {c['name']}  |  ID: {c['id']}")
    if not catalogs:
        print("  (none found)")
except Exception as e:
    print(f"  Error: {e}")

# --- Apps ---
print("\n📱 APPS:")
try:
    import requests
    resp = requests.get(
        f'https://graph.facebook.com/v19.0/{AD_ACCOUNT_ID}/applications',
        params={'access_token': ACCESS_TOKEN, 'fields': 'id,name'}
    )
    data = resp.json()
    for app in data.get('data', []):
        print(f"  → {app['name']}  |  ID: {app['id']}")
    if not data.get('data'):
        print("  (none found — app campaigns may need separate setup)")
except Exception as e:
    print(f"  Error: {e}")

print("\n" + "="*55)
print("  Copy the IDs above into your .env file,")
print("  then run: python build_campaigns.py")
print("="*55 + "\n")
