import webpush from "web-push"
import { createServerSupabase } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const endpoint = body?.endpoint
    const payload = body?.payload ?? {
      title: "SUNSETX",
      body: "Tonight may be worth it. Check your sunset report.",
      url: "/",
    }

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

    await webpush.sendNotification(subscription, JSON.stringify(payload))

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown push send error",
      },
      { status: 500 }
    )
  }
}
