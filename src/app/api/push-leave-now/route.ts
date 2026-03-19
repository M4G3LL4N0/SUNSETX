import webpush from "web-push"
import { createServerSupabase } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

function configureWebPush() {
  const subject = process.env.VAPID_SUBJECT
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY

  if (!subject || !publicKey || !privateKey) {
    return {
      ok: false as const,
      error: "Missing VAPID environment variables",
    }
  }

  try {
    webpush.setVapidDetails(subject, publicKey, privateKey)
    return { ok: true as const }
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Invalid VAPID configuration",
    }
  }
}

export async function POST(req: Request) {
  try {
    const config = configureWebPush()

    if (!config.ok) {
      return Response.json(
        {
          error: "Push notifications are not configured yet.",
          details: config.error,
        },
        { status: 503 }
      )
    }

    const body = await req.json()
    const endpoint = body?.endpoint
    const cityLabel = body?.cityLabel ?? "your area"
    const peakStart = body?.peakStart ?? "soon"
    const bestSpot = body?.bestSpot ?? "your top nearby spot"

    if (!endpoint) {
      return Response.json({ error: "Missing endpoint" }, { status: 400 })
    }

    const supabase = createServerSupabase()

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("endpoint", endpoint)
      .eq("is_active", true)
      .single()

    if (error || !data) {
      return Response.json({ error: "Subscription not found" }, { status: 404 })
    }

    const subscription = {
      endpoint: data.endpoint,
      keys: {
        p256dh: data.p256dh,
        auth: data.auth,
      },
    }

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "SUNSETX",
        body: `Leave now for ${cityLabel}. Peak starts around ${peakStart}. Best spot: ${bestSpot}.`,
        url: "/",
      })
    )

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown push error",
      },
      { status: 500 }
    )
  }
}
