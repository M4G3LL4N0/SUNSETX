export const dynamic = "force-dynamic"
export const revalidate = 0

const openings = [
  "The best sunsets usually come from balance, not extremes.",
  "A perfect sunset is a layered atmospheric event, not just a clock time.",
  "What feels magical in the sky is often a combination of structure and restraint.",
]

const middle = [
  "SUNSETX looks for a clear enough western horizon, useful cloud texture, strong visibility, and a place that lets the sky actually perform.",
  "The highest-upside evenings usually pair open horizon access with selective mid or high clouds that can catch light after the sun has dropped.",
  "Great sunsets often happen when the horizon stays readable, the atmosphere stays clean enough for contrast, and the cloud field adds texture without total blockage.",
]

const closing = [
  "That combination creates visible color, shape, depth, and a stronger afterglow window.",
  "When those pieces align, the sunset feels larger, richer, and more cinematic.",
  "That is why the perfect sunset is both sky quality and viewing quality working together.",
]

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

export async function GET() {
  return Response.json(
    {
      title: "What SUNSETX looks for in the perfect sky",
      summary: `${pick(openings)} ${pick(middle)} ${pick(closing)}`,
      bullets: [
        "A clear or mostly clear western horizon",
        "Some cloud texture, especially mid or high clouds",
        "Good visibility with limited haze or smoke",
        "A strong viewing location with broad panorama",
        "Conditions that support a visible afterglow after official sunset",
      ],
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}
