#!/usr/bin/env python3
"""
KICKS CREW ME - Meta Ads Campaign Builder
Creates 7 campaigns via Meta Marketing API. All PAUSED for review.
Account: KICKS CREW ME (2790197764523614)
"""

import os
import sys
import json
import time
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN  = os.getenv('META_ACCESS_TOKEN')
AD_ACCOUNT_ID = 'act_2790197764523614'
PIXEL_ID      = os.getenv('META_PIXEL_ID')
PAGE_ID       = os.getenv('META_PAGE_ID')
CATALOG_ID    = os.getenv('META_CATALOG_ID')
WEBSITE_URL   = 'https://www.kickscrew.com'

missing = []
if not ACCESS_TOKEN or ACCESS_TOKEN == 'paste_your_token_here':
    missing.append('META_ACCESS_TOKEN')
if not PIXEL_ID:
    missing.append('META_PIXEL_ID')
if not PAGE_ID:
    missing.append('META_PAGE_ID')
if missing:
    print("Missing in .env: " + ', '.join(missing))
    sys.exit(1)

try:
    from facebook_business.api import FacebookAdsApi
    from facebook_business.adobjects.adaccount import AdAccount
    from facebook_business.adobjects.campaign import Campaign
    from facebook_business.adobjects.adset import AdSet
    from facebook_business.adobjects.ad import Ad
except ImportError:
    print("Run: pip install -r requirements.txt")
    sys.exit(1)

FacebookAdsApi.init(access_token=ACCESS_TOKEN)
account = AdAccount(AD_ACCOUNT_ID)
created = []


def log(msg):
    print(msg)


def save_result(name, campaign_id, adset_ids):
    created.append({'campaign': name, 'campaign_id': campaign_id, 'adsets': adset_ids})


def cents(usd):
    return int(usd * 100)


def campaign_exists(name):
    """Return existing campaign ID if a campaign with this name already exists, else None."""
    try:
        campaigns = account.get_campaigns(
            fields=['id', 'name'],
            params={
                'filtering': [{'field': 'name', 'operator': 'EQUAL', 'value': name}],
                'limit': 3
            }
        )
        for c in campaigns:
            if c['name'] == name:
                log("  SKIPPED: '" + name + "' already exists (ID: " + c['id'] + ")")
                return c['id']
    except Exception as e:
        log("  Could not check for existing campaign: " + str(e))
    return None


def find_creative(fragment):
    try:
        ads = account.get_ads(
            fields=['name', 'creative'],
            params={
                'filtering': [{'field': 'name', 'operator': 'CONTAIN', 'value': fragment}],
                'limit': 5
            }
        )
        for ad in ads:
            if 'creative' in ad and ad['creative'].get('id'):
                log("  Found: '" + fragment + "' -> creative " + ad['creative']['id'])
                return ad['creative']['id']
    except Exception as e:
        log("  Could not find '" + fragment + "': " + str(e))
    return None


def make_ad(adset_id, name, creative_id):
    ad = account.create_ad(params={
        'name': name,
        'adset_id': adset_id,
        'creative': {'creative_id': creative_id},
        'status': Ad.Status.paused,
    })
    log("    Ad: " + name + " -> " + ad['id'])
    return ad


# ============================================================
# CAMPAIGNS 1-4 — Sales campaigns per market (replaces ASC)
# ASC is deprecated in API v24+. Regular OUTCOME_SALES with
# CBO + broad targeting achieves the same algorithmic result.
# ============================================================
def build_sales_campaign(name, budget_usd, countries, url_suffix):
    log("\n  Campaign: " + name)
    existing = campaign_exists(name)
    if existing:
        save_result(name, existing, [])
        return {'id': existing}
    c = account.create_campaign(params={
        'name': name,
        'objective': 'OUTCOME_SALES',
        'status': Campaign.Status.paused,
        'special_ad_categories': [],
        'daily_budget': cents(budget_usd),
    })
    log("  Campaign ID: " + c['id'])

    a = account.create_ad_set(params={
        'name': name + '_adset',
        'campaign_id': c['id'],
        'optimization_goal': AdSet.OptimizationGoal.offsite_conversions,
        'billing_event': AdSet.BillingEvent.impressions,
        'targeting': {'geo_locations': {'countries': countries}},
        'promoted_object': {'pixel_id': PIXEL_ID, 'custom_event_type': 'PURCHASE'},
        'status': AdSet.Status.paused,
    })
    log("  Adset ID: " + a['id'])
    log("  ACTION: Add creatives manually in Ads Manager before activating")
    save_result(name, c['id'], [a['id']])
    return c


def build_asc_ksa():
    log("\n[1/7] Building 2604_ASC_KSA_ROAS (Saudi Arabia | $200/day)...")
    return build_sales_campaign('2604_ASC_KSA_ROAS', 200, ['SA'], 'en-sa')


def build_asc_uae():
    log("\n[2/7] Building 2604_ASC_UAE_ROAS (UAE | $130/day)...")
    return build_sales_campaign('2604_ASC_UAE_ROAS', 130, ['AE'], 'en-ae')


def build_asc_gcc():
    log("\n[3/7] Building 2604_ASC_GCC_ROAS (Kuwait+Qatar+Bahrain | $100/day)...")
    return build_sales_campaign('2604_ASC_GCC_ROAS', 100, ['KW', 'QA', 'BH'], 'en-kw')


def build_asc_eg():
    log("\n[4/7] Building 2604_ASC_EG_ROAS (Egypt | $60/day)...")
    return build_sales_campaign('2604_ASC_EG_ROAS', 60, ['EG'], 'en-eg')


# ============================================================
# CAMPAIGN 5 — 2604_ME_conversion_DPA
# Dynamic Retargeting | $100/day | 3 adsets
# ============================================================
def build_dpa():
    log("\n[5/7] Building 2604_ME_conversion_DPA (Dynamic Retargeting)...")
    existing = campaign_exists('2604_ME_conversion_DPA')
    if existing:
        save_result('2604_ME_conversion_DPA', existing, [])
        return {'id': existing}
    if not CATALOG_ID:
        log("  No CATALOG_ID - skipping")
        return None

    c = account.create_campaign(params={
        'name': '2604_ME_conversion_DPA',
        'objective': 'OUTCOME_SALES',
        'status': Campaign.Status.paused,
        'special_ad_categories': [],
        'is_adset_budget_sharing_enabled': False,
    })
    log("  Campaign: " + c['id'])
    adset_ids = []

    me_countries = ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'EG']

    adsets = [
        ('ME_LL_Checkout_10pct', 50, 'Attach: 10% lookalike of checkout visitors'),
        ('ME_LL_Purchase_5pct',  30, 'Attach: 5% lookalike from Shopify customer list'),
        ('ME_RT_ViewContent_7d', 20, 'Attach: ViewContent custom audience - last 7 days'),
    ]

    for adset_name, budget, action in adsets:
        a = account.create_ad_set(params={
            'name': adset_name,
            'campaign_id': c['id'],
            'daily_budget': cents(budget),
            'optimization_goal': AdSet.OptimizationGoal.offsite_conversions,
            'billing_event': AdSet.BillingEvent.impressions,

            'targeting': {'geo_locations': {'countries': me_countries}},
            'promoted_object': {
                'pixel_id': PIXEL_ID,
                'custom_event_type': 'PURCHASE',
            },
            'status': AdSet.Status.paused,
        })
        log("  Adset: " + adset_name + " -> " + a['id'])
        log("  ACTION: " + action)
        adset_ids.append(a['id'])

    log("  ACTION: Add dynamic catalog ads manually in Ads Manager")
    save_result('2604_ME_conversion_DPA', c['id'], adset_ids)
    return c


# ============================================================
# CAMPAIGN 6 — 2604_ME_conversion_manual
# Manual Prospecting | $90/day | 4 adsets
# ============================================================
def build_manual():
    log("\n[6/7] Building 2604_ME_conversion_manual (Manual Prospecting)...")
    existing = campaign_exists('2604_ME_conversion_manual')
    if existing:
        save_result('2604_ME_conversion_manual', existing, [])
        return {'id': existing}
    c = account.create_campaign(params={
        'name': '2604_ME_conversion_manual',
        'objective': 'OUTCOME_SALES',
        'status': Campaign.Status.paused,
        'special_ad_categories': [],
        'is_adset_budget_sharing_enabled': False,
    })
    log("  Campaign: " + c['id'])
    adset_ids = []

    adsets = [
        {
            'name': 'ME_BT_Arabic_Sneaker',
            'budget': 25,
            'countries': ['SA', 'AE'],
            'age_min': 18, 'age_max': 45,
            'interests': [
                {'id': '6003107902433', 'name': 'Nike'},
                {'id': '6003348604959', 'name': 'Adidas'},
                {'id': '6003384592629', 'name': 'Sneakers'},
            ]
        },
        {
            'name': 'ME_BT_Streetwear_GCC',
            'budget': 25,
            'countries': ['SA', 'AE', 'KW', 'QA', 'BH'],
            'age_min': 18, 'age_max': 35,
            'interests': [
                {'id': '6003107902433', 'name': 'Nike'},
                {'id': '6003348604959', 'name': 'Adidas'},
                {'id': '6003512898682', 'name': 'Streetwear'},
            ]
        },
        {
            'name': 'ME_Shopify_Audience',
            'budget': 25,
            'countries': ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'EG'],
            'age_min': 18, 'age_max': 55,
            'interests': None,
            'action': 'Attach KC_ME_Shopify_Customers custom audience in Ads Manager'
        },
        {
            'name': 'ME_LL_NikeMind_3pct',
            'budget': 15,
            'countries': ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'EG'],
            'age_min': 18, 'age_max': 55,
            'interests': None,
            'action': 'Attach NikeMind 3% lookalike audience in Ads Manager'
        },
    ]

    for s in adsets:
        targeting = {
            'geo_locations': {'countries': s['countries']},
            'age_min': s['age_min'],
            'age_max': s['age_max'],
        }
        if s.get('interests'):
            targeting['flexible_spec'] = [{'interests': s['interests']}]

        a = account.create_ad_set(params={
            'name': s['name'],
            'campaign_id': c['id'],
            'daily_budget': cents(s['budget']),
            'optimization_goal': AdSet.OptimizationGoal.offsite_conversions,
            'billing_event': AdSet.BillingEvent.impressions,

            'targeting': targeting,
            'promoted_object': {'pixel_id': PIXEL_ID, 'custom_event_type': 'PURCHASE'},
            'status': AdSet.Status.paused,
        })
        log("  Adset: " + s['name'] + " -> " + a['id'])
        if s.get('action'):
            log("  ACTION: " + s['action'])
        adset_ids.append(a['id'])

    log("  ACTION: Add creatives manually in Ads Manager (reuse top performers from existing campaigns)")
    save_result('2604_ME_conversion_manual', c['id'], adset_ids)
    return c


# ============================================================
# CAMPAIGN 7 — 2604_KSA_manual
# KSA with PROVEN creatives | $90/day | 3 adsets
# nike mind 3.0 (8x ROAS) + Nike 2.0 (CPO $18.8) + New Balance (23x ROAS)
# ============================================================
def build_ksa_manual():
    log("\n[7/7] Building 2604_KSA_manual (KSA - Proven Creatives)...")
    existing = campaign_exists('2604_KSA_manual')
    if existing:
        save_result('2604_KSA_manual', existing, [])
        return {'id': existing}

    log("  Searching proven creative IDs...")
    creatives = {
        'nike_mind':   find_creative('nike mind 3.0'),
        'nike_2':      find_creative('Nike 2.0 ON'),
        'new_balance': find_creative('New balance ON'),
    }

    c = account.create_campaign(params={
        'name': '2604_KSA_manual',
        'objective': 'OUTCOME_SALES',
        'status': Campaign.Status.paused,
        'special_ad_categories': [],
        'is_adset_budget_sharing_enabled': False,
    })
    log("  Campaign: " + c['id'])
    adset_ids = []

    ksa_adsets = [
        {
            'name': 'KSA_Arabic_sneaker',
            'budget': 40,
            'age_min': 18, 'age_max': 45,
            'interests': None,
        },
        {
            'name': 'KSA_street_broad',
            'budget': 35,
            'age_min': 18, 'age_max': 35,
            'interests': None,
        },
        {
            'name': 'KSA_NikeMind_LL3',
            'budget': 15,
            'age_min': 18, 'age_max': 55,
            'interests': None,
            'action': 'Attach NikeMind 3% lookalike audience in Ads Manager'
        },
    ]

    ksa_ads = [
        ('nike_mind',   'KSA_nike_mind',       'نايك Mind - الآن في السعودية',            'أحدث إصدارات نايك - أصالة مضمونة 100% - اطلب من KICKS CREW'),
        ('nike_2',      'KSA_nike_collection', 'أحذية نايك الأصلية - شحن سريع للسعودية', 'تسوّق من أكبر تشكيلة أحذية رياضية - أكثر من 500,000 طراز على KICKS CREW'),
        ('new_balance', 'KSA_new_balance',     'New Balance - إصدارات حصرية',             'أحذية New Balance الأصلية بأفضل الأسعار - توصيل سريع لجميع مناطق المملكة'),
    ]

    for s in ksa_adsets:
        targeting = {
            'geo_locations': {'countries': ['SA']},
            'age_min': s['age_min'],
            'age_max': s['age_max'],
        }
        if s.get('interests'):
            targeting['flexible_spec'] = [{'interests': s['interests']}]

        a = account.create_ad_set(params={
            'name': s['name'],
            'campaign_id': c['id'],
            'daily_budget': cents(s['budget']),
            'optimization_goal': AdSet.OptimizationGoal.offsite_conversions,
            'billing_event': AdSet.BillingEvent.impressions,

            'targeting': targeting,
            'promoted_object': {'pixel_id': PIXEL_ID, 'custom_event_type': 'PURCHASE'},
            'status': AdSet.Status.paused,
        })
        log("  Adset: " + s['name'] + " ($" + str(s['budget']) + "/day) -> " + a['id'])
        if s.get('action'):
            log("  ACTION: " + s['action'])
        adset_ids.append(a['id'])

        for creative_key, ad_name, headline, body in ksa_ads:
            cid = creatives.get(creative_key)
            if cid:
                make_ad(a['id'], ad_name + '_' + s['name'][:6], cid)
                log("    Copy to paste in Ads Manager:")
                log("    Headline: " + headline)
                log("    Body:     " + body)
            else:
                log("    No creative found for " + creative_key + " - add manually")

    save_result('2604_KSA_manual', c['id'], adset_ids)
    return c


# ============================================================
# MAIN
# ============================================================
def main():
    print("\n" + "=" * 55)
    print("  KICKS CREW ME - Meta Campaign Builder")
    print("  All campaigns created in PAUSED status.")
    print("=" * 55)

    results = []
    errors  = []

    campaigns = [
        ('2604_ASC_KSA_ROAS',         build_asc_ksa),
        ('2604_ASC_UAE_ROAS',         build_asc_uae),
        ('2604_ASC_GCC_ROAS',         build_asc_gcc),
        ('2604_ASC_EG_ROAS',          build_asc_eg),
        ('2604_ME_conversion_DPA',    build_dpa),
        ('2604_ME_conversion_manual', build_manual),
        ('2604_KSA_manual',         build_ksa_manual),
    ]

    for name, fn in campaigns:
        try:
            result = fn()
            if result:
                results.append(name)
            time.sleep(1)
        except Exception as e:
            errors.append((name, str(e)))
            log("  FAILED: " + name)
            log("  Error: " + str(e))

    print("\n" + "=" * 55)
    print("  SUMMARY")
    print("=" * 55)
    print("Created (" + str(len(results)) + "/" + str(len(campaigns)) + "):")
    for r in results:
        print("  + " + r)
    if errors:
        print("Failed (" + str(len(errors)) + "):")
        for name, err in errors:
            print("  x " + name)

    with open('campaign_manifest.json', 'w') as f:
        json.dump(created, f, indent=2)
    print("\nManifest saved -> campaign_manifest.json")
    print("\nNEXT STEPS:")
    print("  1. Open Ads Manager - confirm all campaigns PAUSED")
    print("  2. 2604_KSA_manual -> ads created with proven creatives")
    print("  3. Other campaigns -> add creatives from existing library")
    print("  4. Attach custom audiences where flagged above")
    print("  5. Activate 2604_KSA_manual first, then ASC campaigns")


if __name__ == '__main__':
    main()
