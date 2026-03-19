import { getFavoriteSpotIds, toggleFavoriteSpot } from "@/lib/favorites"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userKey = url.searchParams.get("userKey")

    if (!userKey) {
      return Response.json({ error: "Missing userKey" }, { status: 400 })
    }

    const favorites = await getFavoriteSpotIds(userKey)
    return Response.json({ favorites })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown favorites error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.userKey || !body.spotId) {
      return Response.json({ error: "Missing userKey or spotId" }, { status: 400 })
    }

    const result = await toggleFavoriteSpot(body.userKey, body.spotId)
    return Response.json(result)
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown favorite toggle error" },
      { status: 500 }
    )
  }
}
