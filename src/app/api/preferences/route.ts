import { getUserPreferences, saveUserPreferences } from "@/lib/preferences"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userKey = url.searchParams.get("userKey")

    if (!userKey) {
      return Response.json({ error: "Missing userKey" }, { status: 400 })
    }

    const prefs = await getUserPreferences(userKey)
    return Response.json(prefs)
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown preferences error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    await saveUserPreferences({
      userKey: body.userKey,
      prefersWoodsy: !!body.prefersWoodsy,
      maxDriveMinutes: Number(body.maxDriveMinutes ?? 12),
      avoidWaterSmell: !!body.avoidWaterSmell,
      quietVibe: !!body.quietVibe,
    })

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown preferences save error" },
      { status: 500 }
    )
  }
}
