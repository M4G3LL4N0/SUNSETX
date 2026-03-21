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
          alignItems: "center",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1a0a 100%)",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        <div style={{ 
          display: "flex",
          fontSize: 32,
          letterSpacing: 2,
          opacity: 0.8,
          fontWeight: 500,
          marginBottom: 40,
          background: "linear-gradient(45deg, #f472b6, #fb923c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          SUNSETX PREMIUM
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            marginBottom: 24,
            lineHeight: 1,
            background: "linear-gradient(45deg, #fb923c, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          {score} ⭐️
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 40,
            opacity: 0.9,
          }}
        >
          {city}
        </div>

        <div style={{ 
          display: "flex",
          fontSize: 28,
          marginBottom: 12,
          opacity: 0.9,
          fontWeight: 500
        }}>
          Peak Window: {peak}
        </div>

        <div style={{ 
          display: "flex",
          fontSize: 24,
          opacity: 0.8,
          fontWeight: 500
        }}>
          Top Spot: {bestSpot}
        </div>

        <div style={{
          position: "absolute",
          bottom: 48,
          fontSize: 18,
          opacity: 0.6,
          fontWeight: 400
        }}>
          sunsetx.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
