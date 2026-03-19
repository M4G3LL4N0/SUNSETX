/** @jsxImportSource react */
import { ImageResponse } from "next/og"

export const runtime = "edge"

const size = {
  width: 1200,
  height: 630,
}

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
            fontSize: 96,
            fontWeight: 800,
            marginTop: 16,
          }}
        >
          92 🔥
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 32,
            marginTop: 12,
            opacity: 0.85,
          }}
        >
          Peak 7:21 PM
        </div>
      </div>
    ),
    size
  )
}
