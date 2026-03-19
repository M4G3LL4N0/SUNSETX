import { createServerSupabase } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const endpoint = body?.endpoint
    const p256dh = body?.keys?.p256dh
    const auth = body?.keys?.auth
    const lat = body?.lat ?? null
    const lon = body?.lon ?? null
    const cityLabel = body?.cityLabel ?? null
    const timezoneOffset = body?.timezoneOffset ?? null

    if (!endpoint || !p256dh || !auth) {
      return Response.json({ error: "Invalid push subscription payload" }, { status: 400 })
    }

    const supabase = createServerSupabase()

    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        endpoint,
        p256dh,
        auth,
        lat,
        lon,
        city_label: cityLabel,
        timezone_offset: timezoneOffset,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" }
    )

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown push subscription error",
      },
      { status: 500 }
    )
  }
}
