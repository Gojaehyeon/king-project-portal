export const dynamic = "force-static";

export function GET() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();

  if (!publisherId) {
    return new Response("# AdSense publisher ID not configured. Set NEXT_PUBLIC_ADSENSE_CLIENT_ID.\n", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const pub = publisherId.replace(/^ca-/, "");
  const body = `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
