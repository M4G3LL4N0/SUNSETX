/** @jsxImportSource react */
import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const city = url.searchParams.get("city") ?? "Your Area"
  const score = url.searchParams.get("score") ?? "82"
  const peak = url.searchParams.get("peak") ?? "6:38 PM – 6:48 PM"
  const bestSpot = url.searchParams.get("spot") ?? "Top nearby spot"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "72px",
          background:
            "linear-gradient(180deg, #050505 0%, #111111 45%, #1d1208 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, opacity: 0.7 }}>
          SUNSETX
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            marginTop: 20,
          }}
        >
          {city}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 120,
            fontWeight: 800,
            marginTop: 20,
            lineHeight: 1,
          }}
        >
          {score} 🔥
        </div>

        <div style={{ display: "flex", fontSize: 28, marginTop: 24, opacity: 0.9 }}>
          Peak: {peak}
        </div>

        <div style={{ display: "flex", fontSize: 24, marginTop: 12, opacity: 0.75 }}>
          Best nearby: {bestSpot}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
