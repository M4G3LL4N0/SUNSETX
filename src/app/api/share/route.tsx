/** @jsxImportSource react */
import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          SUNSETX
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 800,
            marginTop: 16,
          }}
        >
          Tonight’s Sunset
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 48,
            marginTop: 16,
          }}
        >
          Check your live score
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
