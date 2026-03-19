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
            fontSize: 96,
            fontWeight: 800,
            marginTop: 16,
          }}
        >
          82 🔥
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            marginTop: 12,
            opacity: 0.85,
          }}
        >
          Tonight is worth it
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            marginTop: 10,
            opacity: 0.75,
          }}
        >
          Peak: 6:38 PM – 6:48 PM
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
