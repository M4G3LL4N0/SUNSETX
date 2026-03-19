import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type Spot = {
  name: string
  address: string
  score: number
  distanceMiles: number
  driveMinutes: number
  smellLabel: string
  parkingLabel: string
  vibeLabel: string
  bestFor: string
  whyItWins: string
  panoramaLabel: string
  easeLabel: string
  waterLabel: string
}

export async function generateAiSunsetNarrative(input: {
  cityLabel: string
  regionLabel: string
  score: number
  sunsetLocalTime: string
  peakStart: string
  peakEnd: string
  afterglow: string
  explanation: string
  clouds: number
  humidity: number
  visibility: number
  wind: number
  spots: Spot[]
}) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      title: `SUNSETX REPORT — ${input.cityLabel.toUpperCase()}`,
      intro: `Tonight in ${input.cityLabel}, sunset conditions look ${input.score >= 80 ? "strong" : "mixed"}, with a score of ${input.score}/100.`,
      whyTonightIsGood: {
        cloudStructure: "Useful cloud texture can help catch warm light near sunset.",
        atmosphere: "Visibility and atmospheric softness are balanced enough for color to show.",
        wind: "Moderate wind can help keep the sky from feeling flat.",
      },
      whatToExpect: [
        "Warm gold and orange color potential",
        "Best colors likely after the sun dips",
        "Smoother cinematic gradients rather than chaotic storm drama",
      ],
      avoid: [
        "Blocked western horizons",
        "Leaving too late",
        "Low-value spots with poor panorama",
      ],
      decision: {
        goNoGo: input.score >= 75 ? "GO — HIGH CONFIDENCE" : "GO — MODERATE CONFIDENCE",
        bestMove: `Go to ${input.spots[0]?.name ?? "the top nearby spot"} and arrive before ${input.peakStart}.`,
      },
    }
  }

  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are SUNSETX, an elite sunset intelligence writer. Return concise JSON only. No markdown. No extra text. Keep it elegant, premium, useful, and consumer-facing. Preserve proprietary ambiguity: explain enough to be useful but do not reveal exact scoring formulas.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify(input),
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "sunset_report",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            intro: { type: "string" },
            whyTonightIsGood: {
              type: "object",
              additionalProperties: false,
              properties: {
                cloudStructure: { type: "string" },
                atmosphere: { type: "string" },
                wind: { type: "string" },
              },
              required: ["cloudStructure", "atmosphere", "wind"],
            },
            whatToExpect: {
              type: "array",
              items: { type: "string" },
            },
            avoid: {
              type: "array",
              items: { type: "string" },
            },
            decision: {
              type: "object",
              additionalProperties: false,
              properties: {
                goNoGo: { type: "string" },
                bestMove: { type: "string" },
              },
              required: ["goNoGo", "bestMove"],
            },
          },
          required: [
            "title",
            "intro",
            "whyTonightIsGood",
            "whatToExpect",
            "avoid",
            "decision",
          ],
        },
      },
    },
  })

  const text = response.output_text
  return JSON.parse(text)
}
