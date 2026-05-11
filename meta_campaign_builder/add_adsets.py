#!/usr/bin/env python3
"""
KICKS CREW ME - Add adsets to existing campaigns.
Run this when campaigns exist but have no adsets.
"""

import os
import sys
import json
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN  = os.getenv('META_ACCESS_TOKEN')
AD_ACCOUNT_ID = 'act_2790197764523614'
PIXEL_ID      = os.getenv('META_PIXEL_ID')
CATALOG_ID    = os.getenv('META_CATALOG_ID')

if not ACCESS_TOKEN or not PIXEL_ID:
    print("Missing META_ACCESS_TOKEN or META_PIXEL_ID in .env")
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


def log(msg):
    print(msg)


def cents(usd):
    return int(usd * 100)


def get_campaign_id(name):
    campaigns = account.get_campaigns(
        fields=['id', 'name'],
        params={
            'filtering': [{'field': 'name', 'operator': 'EQUAL', 'value': name}],
            'limit': 3
        }
    )
    for c in campaigns:
        if c['name'] == name:
            return c['id']
    return None


def has_adsets(campaign_id):
    from facebook_business.adobjects.campaign import Campaign as C
    c = C(campaign_id)
    adsets = c.get_ad_sets(fields=['id'], params={'limit': 1})
    return len(list(adsets)) > 0


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
                log("  Found creative: " + fragment + " -> " + ad['creative']['id'])
                return ad['creative']['id']
    except Exception as e:
        log("  Could not find creative '" + fragment + "': " + str(e))
    return None


def make_adset(campaign_id, name, budget, countries, age_min=18, age_max=55, interests=None):
    targeting = {'geo_locations': {'countries': countries}, 'age_min': age_min, 'age_max': age_max}
    if interests:
        targeting['flexible_spec'] = [{'interests': interests}]
    a = account.create_ad_set(params={
        'name': name,
        'campaign_id': campaign_id,
        'daily_budget': cents(budget),
        'optimization_goal': AdSet.OptimizationGoal.offsite_conversions,
        'billing_event': AdSet.BillingEvent.impressions,
        'targeting': targeting,
        'promoted_object': {'pixel_id': PIXEL_ID, 'custom_event_type': 'PURCHASE'},
        'status': AdSet.Status.paused,
    })
    log("  Adset: " + name + " -> " + a['id'])
    return a


def make_ad(adset_id, name, creative_id):
    ad = account.create_ad(params={
        'name': name,
        'adset_id': adset_id,
        'creative': {'creative_id': creative_id},
        'status': Ad.Status.paused,
    })
    log("    Ad: " + name + " -> " + ad['id'])
    return ad


def main():
    print("\n" + "=" * 55)
    print("  KICKS CREW ME - Add Adsets to Existing Campaigns")
    print("=" * 55)

    results = []
    errors  = []
    me_countries = ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'EG']

    # ── 1. Sales campaigns (1-4) ─────────────────────────
    sales = [
        ('2604_ASC_KSA_ROAS', 200, ['SA']),
        ('2604_ASC_UAE_ROAS', 130, ['AE']),
        ('2604_ASC_GCC_ROAS', 100, ['KW', 'QA', 'BH']),
        ('2604_ASC_EG_ROAS',   60, ['EG']),
    ]

    for name, budget, countries in sales:
        log("\n[Sales] " + name)
        try:
            cid = get_campaign_id(name)
            if not cid:
                log("  Campaign not found - run build_campaigns.py first")
                continue
            if has_adsets(cid):
                log("  Already has adsets - skipping")
                results.append(name)
                continue
            make_adset(cid, name + '_adset', budget, countries)
            log("  ACTION: Add creatives manually in Ads Manager")
            results.append(name)
        except Exception as e:
            errors.append((name, str(e)))
            log("  FAILED: " + str(e))

    # ── 2. DPA ────────────────────────────────────────────
    log("\n[DPA] 2604_ME_conversion_DPA")
    try:
        cid = get_campaign_id('2604_ME_conversion_DPA')
        if cid and not has_adsets(cid):
            for adset_name, budget, note in [
                ('ME_LL_Checkout_10pct', 50, 'Attach: 10% lookalike of checkout visitors'),
                ('ME_LL_Purchase_5pct',  30, 'Attach: 5% lookalike from Shopify list'),
                ('ME_RT_ViewContent_7d', 20, 'Attach: ViewContent audience last 7 days'),
            ]:
                make_adset(cid, adset_name, budget, me_countries)
                log("  ACTION: " + note)
            log("  ACTION: Add dynamic catalog ads manually in Ads Manager")
            results.append('2604_ME_conversion_DPA')
        else:
            log("  Already has adsets - skipping")
            results.append('2604_ME_conversion_DPA')
    except Exception as e:
        errors.append(('2604_ME_conversion_DPA', str(e)))
        log("  FAILED: " + str(e))

    # ── 3. Manual (already has adsets from earlier run) ───
    log("\n[Manual] 2604_ME_conversion_manual")
    try:
        cid = get_campaign_id('2604_ME_conversion_manual')
        if cid and not has_adsets(cid):
            adsets_config = [
                ('ME_BT_Arabic_Sneaker', 25, ['SA', 'AE'], 18, 45,
                 [{'id': '6003107902433', 'name': 'Nike'}, {'id': '6003348604959', 'name': 'Adidas'}]),
                ('ME_BT_Streetwear_GCC', 25, ['SA', 'AE', 'KW', 'QA', 'BH'], 18, 35,
                 [{'id': '6003107902433', 'name': 'Nike'}, {'id': '6003348604959', 'name': 'Adidas'}]),
                ('ME_Shopify_Audience',  25, me_countries, 18, 55, None),
                ('ME_LL_NikeMind_3pct',  15, me_countries, 18, 55, None),
            ]
            for name, budget, countries, amin, amax, interests in adsets_config:
                make_adset(cid, name, budget, countries, amin, amax, interests)
                if name in ('ME_Shopify_Audience', 'ME_LL_NikeMind_3pct'):
                    log("  ACTION: Attach custom audience in Ads Manager")
            log("  ACTION: Add creatives manually in Ads Manager")
            results.append('2604_ME_conversion_manual')
        else:
            log("  Already has adsets - skipping")
            results.append('2604_ME_conversion_manual')
    except Exception as e:
        errors.append(('2604_ME_conversion_manual', str(e)))
        log("  FAILED: " + str(e))

    # ── 4. KSA manual with proven creatives ──────────────
    log("\n[KSA] 2604_KSA_manual")
    try:
        cid = get_campaign_id('2604_KSA_manual')
        if not cid:
            log("  Campaign not found")
        elif has_adsets(cid):
            log("  Already has adsets - skipping")
            results.append('2604_KSA_manual')
        else:
            log("  Finding proven creative IDs...")
            creatives = {
                'nike_mind':   find_creative('nike mind 3.0'),
                'nike_2':      find_creative('Nike 2.0 ON'),
                'new_balance': find_creative('New balance ON'),
            }

            ksa_adsets = [
                ('KSA_Arabic_sneaker', 40, 18, 45),
                ('KSA_street_broad',   35, 18, 35),
                ('KSA_NikeMind_LL3',   15, 18, 55),
            ]
            ksa_ads = [
                ('nike_mind',   'KSA_nike_mind',       'نايك Mind - الآن في السعودية',            'أحدث إصدارات نايك - أصالة مضمونة 100% - اطلب من KICKS CREW'),
                ('nike_2',      'KSA_nike_collection', 'أحذية نايك الأصلية - شحن سريع للسعودية', 'تسوّق من أكبر تشكيلة أحذية رياضية - أكثر من 500,000 طراز على KICKS CREW'),
                ('new_balance', 'KSA_new_balance',     'New Balance - إصدارات حصرية',             'أحذية New Balance الأصلية بأفضل الأسعار - توصيل سريع لجميع مناطق المملكة'),
            ]

            for adset_name, budget, amin, amax in ksa_adsets:
                a = make_adset(cid, adset_name, budget, ['SA'], amin, amax)
                if adset_name == 'KSA_NikeMind_LL3':
                    log("  ACTION: Attach NikeMind 3% lookalike in Ads Manager")
                for creative_key, ad_name, headline, body in ksa_ads:
                    crid = creatives.get(creative_key)
                    if crid:
                        make_ad(a['id'], ad_name + '_' + adset_name[:6], crid)
                        log("    Copy -> Headline: " + headline)
                        log("    Copy -> Body:     " + body)
                    else:
                        log("    No creative for " + creative_key + " - add manually")

            results.append('2604_KSA_manual')
    except Exception as e:
        errors.append(('2604_KSA_manual', str(e)))
        log("  FAILED: " + str(e))

    # ── Summary ───────────────────────────────────────────
    print("\n" + "=" * 55)
    print("  SUMMARY")
    print("=" * 55)
    print("Done (" + str(len(results)) + "/7):")
    for r in results:
        print("  + " + r)
    if errors:
        print("Failed:")
        for name, err in errors:
            print("  x " + name + ": " + err[:120])

    print("\nNEXT STEPS:")
    print("  1. Open Ads Manager - verify adsets are there")
    print("  2. KSA_manual -> paste Arabic copy printed above into each ad")
    print("  3. Attach custom audiences where flagged")
    print("  4. Add creatives to campaigns 1-5 from existing ad library")
    print("  5. Activate 2604_KSA_manual first when ready")


if __name__ == '__main__':
    main()
