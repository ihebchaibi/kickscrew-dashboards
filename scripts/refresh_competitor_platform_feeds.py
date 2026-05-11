import json
import os
import ssl
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw"
CONFIG_FILE = RAW_DIR / "platform-feed-sources.json"

PLATFORMS = {
    "tiktok": {
        "label": "TikTok",
        "default_source": "/.netlify/functions/refresh-competitor-feeds?platform=tiktok",
        "output": RAW_DIR / "tiktok-ads-library-export.json",
    },
    "meta": {
        "label": "Meta",
        "default_source": "/.netlify/functions/refresh-competitor-feeds?platform=meta",
        "output": RAW_DIR / "meta-ads-library-export.json",
    },
    "google": {
        "label": "Google",
        "default_source": "/.netlify/functions/refresh-competitor-feeds?platform=google",
        "output": RAW_DIR / "google-ads-library-export.json",
    },
    "snapchat": {
        "label": "Snapchat",
        "default_source": "/.netlify/functions/refresh-competitor-feeds?platform=snapchat",
        "output": RAW_DIR / "snapchat-ads-library-export.json",
    },
}


def fetch_json(url: str) -> dict:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "KICKS-CREW-ME-Competitor-Feed-Refresh/1.0",
            "Accept": "application/json",
        },
    )
    context = ssl.create_default_context()
    with urllib.request.urlopen(request, timeout=45, context=context) as response:
        payload = response.read().decode("utf-8")
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status}: {payload[:300]}")
        return json.loads(payload)


def normalize_refresh_payload(platform: str, payload: dict) -> dict:
    latest_refresh = payload.get("latestRefresh") or {}
    creatives = payload.get("creatives") or []
    if not isinstance(creatives, list):
        creatives = []
    return {
        "meta": {
            **(payload.get("meta") or {}),
            "platform": PLATFORMS[platform]["label"],
            "source": payload.get("meta", {}).get("source")
            or f"{PLATFORMS[platform]['label']} auto-refresh feed",
        },
        "latestRefresh": latest_refresh,
        "creatives": creatives,
        "intelligence": payload.get("intelligence") or [],
        "creativeBriefs": payload.get("creativeBriefs") or [],
        "demographicHeatmap": payload.get("demographicHeatmap") or [],
    }


def load_sources() -> dict:
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    return {
        platform: os.environ.get(f"{platform.upper()}_FEED_URL", config["default_source"])
        for platform, config in PLATFORMS.items()
    }


def write_feed(platform: str, payload: dict) -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    normalized = normalize_refresh_payload(platform, payload)
    normalized["meta"]["updatedAt"] = datetime.now(timezone.utc).date().isoformat()
    PLATFORMS[platform]["output"].write_text(
        json.dumps(normalized, indent=2),
        encoding="utf-8",
    )


def main() -> int:
    try:
        sources = load_sources()

        # Try to use local Netlify function first (during build), fall back to remote
        netlify_base = os.environ.get("URL", "").rstrip("/") or "http://localhost:9999"

        for platform, config in PLATFORMS.items():
            source_url = sources.get(platform) or config["default_source"]

            # If using local function endpoint, replace with actual URL if available
            if ".netlify/functions/" in source_url and netlify_base != "http://localhost:9999":
                source_url = f"{netlify_base}{source_url}"

            try:
                payload = fetch_json(source_url)
                write_feed(platform, payload)
                print(f"{config['label']} feed refreshed from {source_url}")
            except Exception as platform_error:
                print(f"Warning: {config['label']} refresh failed ({platform_error}), using fallback", file=sys.stderr)
                # Try fallback source
                if "localhost" in source_url:
                    try:
                        fallback_url = config["default_source"]
                        payload = fetch_json(fallback_url)
                        write_feed(platform, payload)
                        print(f"{config['label']} feed refreshed from fallback: {fallback_url}")
                    except Exception as fallback_error:
                        print(f"Error: {config['label']} fallback also failed: {fallback_error}", file=sys.stderr)

        return 0
    except Exception as exc:
        print(f"Competitor feed refresh failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
