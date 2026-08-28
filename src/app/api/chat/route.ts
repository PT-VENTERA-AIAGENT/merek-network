import { NextRequest, NextResponse } from "next/server";

const SUPABASE_FUNCTION_URL =
  "https://kkmtzwtculdkyqckbkuq.supabase.co/functions/v1/merek-chat";

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const brandId = req.headers.get("x-brand-id") ?? "hakimerek";

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const upstream = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
        "x-site-id": brandId,
        "x-forwarded-for": ip,
      },
      body: JSON.stringify({
        messages: body.messages,
        site_id: brandId,
      }),
    });

    const data = await upstream.json();

    return NextResponse.json(data, { status: upstream.status });
  } catch (e) {
    console.error("chat proxy error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
