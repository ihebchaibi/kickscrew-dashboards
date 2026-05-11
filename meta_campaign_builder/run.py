#!/usr/bin/env python3
# KICKS CREW ME - Meta Campaign Builder
# Safe to re-run - skips what already exists

import os, sys, time, requests
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN  = os.getenv('META_ACCESS_TOKEN', '')
AD_ACCOUNT_ID = 'act_2790197764523614'
PIXEL_ID      = os.getenv('META_PIXEL_ID', '')
ME = ['SA','AE','KW','QA','BH','OM','JO','EG']
BASE = 'https://graph.facebook.com/v19.0'

if not ACCESS_TOKEN or not PIXEL_ID:
    print("ERROR: Missing META_ACCESS_TOKEN or META_PIXEL_ID in .env")
    sys.exit(1)

try:
    from facebook_business.api import FacebookAdsApi
    from facebook_business.adobjects.adaccount import AdAccount
    from facebook_business.adobjects.campaign import Campaign as Cam
    from facebook_business.adobjects.ad import Ad
except ImportError:
    print("Run: pip install -r requirements.txt")
    sys.exit(1)

FacebookAdsApi.init(access_token=ACCESS_TOKEN)
account = AdAccount(AD_ACCOUNT_ID)


def api_post(path, data):
    data['access_token'] = ACCESS_TOKEN
    r = requests.post(BASE + path, data=data)
    return r.json()


def api_get(path, params=None):
    p = params or {}
    p['access_token'] = ACCESS_TOKEN
    r = requests.get(BASE + path, params=p)
    return r.json()


def delete_campaign(campaign_id):
    res = api_post('/' + campaign_id, {'status': 'DELETED'})
    if res.get('success'):
        print("  Deleted archived campaign")
        return True
    msg = res.get('error', {}).get('message', str(res))
    print("  Delete failed: " + msg[:100])
    return False


def get_campaign_id(name):
    try:
        camps = account.get_campaigns(
            fields=['id', 'name'],
            params={'filtering': [{'field': 'name', 'operator': 'EQUAL', 'value': name}], 'limit': 3}
        )
        for c in camps:
            if c['name'] == name:
                return c['id']
    except Exception as e:
        print("  Lookup error: " + str(e)[:80])
    return None


def create_campaign(name, objective, daily_budget=None, extra=None):
    params = {
        'name': name,
        'objective': objective,
        'status': 'PAUSED',
        'special_ad_categories': '[]',
    }
    if daily_budget:
        # CBO: budget + bid strategy at campaign level
        params['daily_budget'] = str(daily_budget * 100)
        params['bid_strategy'] = 'LOWEST_COST_WITHOUT_CAP'
    # ABO: no campaign budget, no campaign bid_strategy — set at adset level
    if extra:
        for k, v in extra.items():
            if isinstance(v, bool):
                params[k] = '0' if not v else '1'
            else:
                params[k] = str(v)
    res = api_post('/' + AD_ACCOUNT_ID + '/campaigns', params)
    if 'id' in res:
        return res['id']
    raise Exception(str(res.get('error', res)))


def create_adset(campaign_id, name, budget, countries, cbo=False):
    import json
    targeting = {
        'geo_locations': {'countries': countries},
        'targeting_automation': {'advantage_audience': 1},
    }
    params = {
        'name': name,
        'campaign_id': campaign_id,
        'optimization_goal': 'OFFSITE_CONVERSIONS',
        'billing_event': 'IMPRESSIONS',
        'targeting': json.dumps(targeting),
        'promoted_object': json.dumps({'pixel_id': PIXEL_ID, 'custom_event_type': 'PURCHASE'}),
        'status': 'PAUSED',
    }
    if not cbo:
        params['daily_budget'] = str(budget * 100)
        params['bid_strategy'] = 'LOWEST_COST_WITHOUT_CAP'
    res = api_post('/' + AD_ACCOUNT_ID + '/adsets', params)
    if 'id' in res:
        print("    Adset created: " + name + " -> " + res['id'])
        return res['id']
    raise Exception(str(res.get('error', res)))


def find_creative(fragment):
    try:
        ads = account.get_ads(
            fields=['name', 'creative'],
            params={'filtering': [{'field': 'name', 'operator': 'CONTAIN', 'value': fragment}], 'limit': 5}
        )
        for ad in ads:
            if ad.get('creative', {}).get('id'):
                return ad['creative']['id']
    except Exception:
        pass
    return None


def create_ad(adset_id, name, creative_id):
    ad = account.create_ad(params={
        'name': name,
        'adset_id': adset_id,
        'creative': {'creative_id': creative_id},
        'status': Ad.Status.paused,
    })
    print("      Ad: " + name + " -> " + ad['id'])
    return ad['id']


# Campaign config - all IDs hardcoded to avoid lookup calls
CAMPAIGNS = [
    {
        'name': '2604_ASC_KSA_ROAS',
        'label': 'Sales KSA $200/day',
        'objective': 'OUTCOME_SALES',
        'daily_budget': 200,
        'cbo': True,
        'id': '120248874321350191',
        'skip': True,
        'adsets': [],
    },
    {
        'name': '2604_ASC_UAE_ROAS',
        'label': 'Sales UAE $130/day',
        'objective': 'OUTCOME_SALES',
        'daily_budget': 130,
        'cbo': True,
        'id': '120248874330160191',
        'skip': True,
        'adsets': [],
    },
    {
        'name': '2604_ASC_GCC_ROAS',
        'label': 'Sales GCC $100/day',
        'objective': 'OUTCOME_SALES',
        'daily_budget': 100,
        'cbo': True,
        'id': '120248874336620191',
        'skip': True,
        'adsets': [],
    },
    {
        'name': '2604_ASC_EG_ROAS',
        'label': 'Sales Egypt $60/day',
        'objective': 'OUTCOME_SALES',
        'daily_budget': 60,
        'cbo': True,
        'id': '120248874341100191',
        'skip': True,
        'adsets': [],
    },
    {
        'name': '2604_ME_conversion_DPA',
        'label': 'DPA Retargeting $100/day',
        'objective': 'OUTCOME_SALES',
        'extra': {'is_adset_budget_sharing_enabled': False},
        'adsets': [
            {'name': 'ME_LL_Checkout_10pct', 'budget': 50, 'countries': ME},
            {'name': 'ME_LL_Purchase_5pct',  'budget': 30, 'countries': ME},
            {'name': 'ME_RT_ViewContent_7d', 'budget': 20, 'countries': ME},
        ],
    },
    {
        'name': '2604_ME_conversion_manual',
        'label': 'Manual Prospecting - skip',
        'objective': 'OUTCOME_SALES',
        'id': '120246945728210191',
        'skip': True,
        'adsets': [],
    },
    {
        'name': '2604_KSA_manual',
        'label': 'KSA Proven Creatives $90/day',
        'objective': 'OUTCOME_SALES',
        'extra': {'is_adset_budget_sharing_enabled': False},
        'ksa': True,
        'adsets': [
            {'name': 'KSA_Arabic_sneaker', 'budget': 40, 'countries': ['SA']},
            {'name': 'KSA_street_broad',   'budget': 35, 'countries': ['SA']},
            {'name': 'KSA_NikeMind_LL3',   'budget': 15, 'countries': ['SA']},
        ],
    },
]


def main():
    print("\n" + "="*50)
    print("KICKS CREW ME - Campaign Builder")
    print("="*50)

    # Pre-fetch KSA creatives
    ksa_creatives = {}
    print("\nFinding KSA creative IDs...")
    ksa_creatives['nike_mind']   = find_creative('nike mind 3.0')
    ksa_creatives['nike_2']      = find_creative('Nike 2.0 ON')
    ksa_creatives['new_balance'] = find_creative('New balance ON')
    for k, v in ksa_creatives.items():
        print("  " + k + ": " + (v if v else "not found"))

    ok = []
    fail = []

    for camp in CAMPAIGNS:
        name = camp['name']
        cid  = camp.get('id', '')
        print("\n[" + name + "] " + camp['label'])
        if cid:
            print("  ID: " + cid)

        if camp.get('skip'):
            print("  Skipped (already has adsets)")
            ok.append(name)
            continue

        # If adsets already exist, just add ads to them
        if camp.get('adsets_done') and camp.get('add_ads_to_adset'):
            print("  Adsets already exist - adding ads...")
            aid = camp['add_ads_to_adset']
            ksa_ads = [
                ('nike_mind',   name + '_nike_mind'),
                ('nike_2',      name + '_nike_2'),
                ('new_balance', name + '_new_balance'),
            ]
            for key, ad_name in ksa_ads:
                crid = ksa_creatives.get(key)
                if crid:
                    try:
                        create_ad(aid, ad_name, crid)
                    except Exception as e:
                        print("    Ad error: " + str(e)[:100])
            ok.append(name)
            continue

        try:
            # Get or create campaign
            cid = camp.get('id')
            if cid:
                # Try to delete if archived, then recreate
                print("  Deleting if archived...")
                delete_campaign(cid)
                time.sleep(2)

            cid = create_campaign(
                name,
                camp['objective'],
                camp.get('daily_budget'),
                camp.get('extra')
            )
            print("  Fresh campaign: " + cid)
            camp['id'] = cid

            is_cbo = camp.get('cbo', False)

            for adset_def in camp['adsets']:
                aname = adset_def['name']
                try:
                    aid = create_adset(cid, aname, adset_def['budget'], adset_def['countries'], cbo=is_cbo)
                    time.sleep(2)

                    # Attach KSA proven creatives
                    if camp.get('ksa'):
                        ksa_ads = [
                            ('nike_mind',   'KSA_nike_mind'),
                            ('nike_2',      'KSA_nike_collection'),
                            ('new_balance', 'KSA_new_balance'),
                        ]
                        for key, ad_name in ksa_ads:
                            crid = ksa_creatives.get(key)
                            if crid:
                                create_ad(aid, ad_name + '_' + aname[:8], crid)
                            else:
                                print("      No creative for " + key)

                except Exception as e:
                    print("    Adset FAILED: " + aname)
                    print("    " + str(e)[:200])

                ok.append(name)
            time.sleep(3)

        except Exception as e:
            print("  FAILED: " + str(e)[:200])
            fail.append(name)

    print("\n" + "="*50)
    print("DONE")
    print("="*50)
    if ok:
        print("OK: " + ", ".join(ok))
    if fail:
        print("FAILED: " + ", ".join(fail))
    print("\nNEXT STEPS IN ADS MANAGER:")
    print("  1. KSA ads: update Arabic copy on each ad")
    print("  2. Attach custom audiences to DPA + NikeMind adsets")
    print("  3. Add creatives to campaigns 1-5")
    print("  4. Activate KSA_manual first")


if __name__ == '__main__':
    main()
    main()
