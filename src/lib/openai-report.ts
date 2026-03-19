import OpenAI from "openai"
import { getCachedAiSummary, setCachedAiSummary } from "@/lib/ai-cache"

const apiKey = process.env.OPENAI_API_KEY

const client = apiKey
  ? new OpenAI({ apiKey })
  : null

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

function buildCacheKey(input: {
  cityLabel: string
  score: number
  sunsetLocalTime: string
  peakStart: string
  peakEnd: string
  clouds: number
  humidity: number
  visibility: number
  wind: number
  topSpot: string
}) {
  return [
    input.cityLabel,
    input.score,
    input.sunsetLocalTime,
    input.peakStart,
    input.peakEnd,
    input.clouds,
    input.humidity,
    input.visibility,
    input.wind,
    input.topSpot,
  ].join("|")
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
  const cacheKey = buildCacheKey({
    cityLabel: input.cityLabel,
    score: input.score,
    sunsetLocalTime: input.sunsetLocalTime,
    peakStart: input.peakStart,
    peakEnd: input.peakEnd,
    clouds: input.clouds,
    humidity: input.humidity,
    visibility: input.visibility,
    wind: input.wind,
    topSpot: input.spots[0]?.name ?? "none",
  })

  const cached = await getCachedAiSummary(cacheKey)
  if (cached) {
    return cached
  }

  if (!client) {
    return null
  }

  try {
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
    const parsed = JSON.parse(text)

    await setCachedAiSummary({
      cacheKey,
      cityLabel: input.cityLabel,
      regionLabel: input.regionLabel,
      summary: parsed,
      ttlMinutes: 45,
    })

    return parsed
  } catch (error) {
    console.error("OpenAI narrative fallback triggered:", error)
    return null
  }
}
