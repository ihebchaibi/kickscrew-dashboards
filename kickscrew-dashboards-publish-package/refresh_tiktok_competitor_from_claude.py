import json
import re
import ssl
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "tiktok-competitor-data.js"
RAW_DIR = ROOT / "data" / "raw"
REFRESH_URL = "https://kickscrew-dashboards.vercel.app/api/refresh"


def fetch_json(url: str) -> dict:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "KICKS-CREW-ME-TikTok-Dashboard-Refresh/1.0",
            "Accept": "application/json",
        },
    )
    context = ssl.create_default_context()
    with urllib.request.urlopen(request, timeout=30, context=context) as response:
        payload = response.read().decode("utf-8")
        if response.status != 200:
            raise RuntimeError(f"Refresh endpoint returned HTTP {response.status}: {payload[:300]}")
        return json.loads(payload)


def update_data_file(refresh_payload: dict) -> None:
    text = DATA_FILE.read_text(encoding="utf-8")
    pulled_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    latest_refresh = {
        "source": REFRESH_URL,
        "pulledAt": pulled_at,
        "endpointTimestamp": refresh_payload.get("timestamp"),
        "status": refresh_payload.get("status"),
        "message": refresh_payload.get("message"),
        "metrics": refresh_payload.get("metrics", {}),
    }

    replacement = "latestRefresh: " + json.dumps(latest_refresh, indent=4) + ",\n  targets:"
    text = re.sub(
        r"latestRefresh:\s*(?:null|\{.*?\}),\s*\n\s*targets:",
        replacement,
        text,
        count=1,
        flags=re.S,
    )
    text = re.sub(
        r'updatedAt:\s*"[^"]+"',
        f'updatedAt: "{pulled_at[:10]}"',
        text,
        count=1,
    )
    DATA_FILE.write_text(text, encoding="utf-8")

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    (RAW_DIR / "claude-vercel-refresh-latest.json").write_text(
        json.dumps(latest_refresh, indent=2),
        encoding="utf-8",
    )


def main() -> int:
    try:
        payload = fetch_json(REFRESH_URL)
        metrics = payload.get("metrics") or {}
        required = ["totalCreatives", "videoCount", "imageCount", "brandsTracked", "totalSpend", "avgRoas"]
        missing = [key for key in required if key not in metrics]
        if missing:
            raise RuntimeError(f"Refresh endpoint is missing metrics: {', '.join(missing)}")
        update_data_file(payload)
        print(
            "TikTok competitor refresh complete: "
            f"{metrics['totalCreatives']} creatives, "
            f"{metrics['brandsTracked']} brands, "
            f"${metrics['totalSpend']} spend, "
            f"{metrics['avgRoas']}x ROAS"
        )
        return 0
    except Exception as exc:
        print(f"TikTok competitor refresh failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
