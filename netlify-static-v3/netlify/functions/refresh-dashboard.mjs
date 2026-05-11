export const config = {
  schedule: "0 */12 * * *"
};

const refreshUrl =
  process.env.CLAUDE_REFRESH_ENDPOINT ||
  "https://kickscrew-dashboards.vercel.app/api/refresh";

export default async function handler() {
  try {
    const response = await fetch(refreshUrl, {
      headers: {
        accept: "application/json",
        "user-agent": "kickscrew-netlify-scheduled-refresh/1.0"
      }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          status: response.status,
          message: "Claude/Vercel refresh endpoint failed"
        }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const payload = await response.json();
    return new Response(
      JSON.stringify({
        ok: true,
        refreshedAt: new Date().toISOString(),
        source: refreshUrl,
        payload
      }),
      { headers: { "content-type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: error.message
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
