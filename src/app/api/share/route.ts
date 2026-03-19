import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "black",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 48,
        }}
      >
        <div>SUNSETX</div>
        <div style={{ fontSize: 24, marginTop: 20 }}>
          Tonight’s Sunset: 82 🔥
        </div>
        <div style={{ fontSize: 18, marginTop: 10 }}>
          Peak: 6:38 – 6:48 PM
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
