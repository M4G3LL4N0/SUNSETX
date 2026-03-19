import OpenAI from "openai"
import { getCachedAiSummary, setCachedAiSummary } from "@/lib/ai-cache"
import { buildFallbackNarrative } from "@/lib/fallback-report"

const apiKey = process.env.OPENAI_API_KEY
const client = apiKey ? new OpenAI({ apiKey }) : null

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
  const fallback = buildFallbackNarrative({
    cityLabel: input.cityLabel,
    score: input.score,
    sunsetLocalTime: input.sunsetLocalTime,
    peakStart: input.peakStart,
    peakEnd: input.peakEnd,
    explanation: input.explanation,
    topSpotName: input.spots[0]?.name,
  })

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
    return {
      data: cached,
      status: "cached" as const,
    }
  }

  if (!client) {
    return {
      data: fallback,
      status: "fallback" as const,
    }
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

    const parsed = {
      ...JSON.parse(response.output_text),
      source: "openai",
    }

    await setCachedAiSummary({
      cacheKey,
      cityLabel: input.cityLabel,
      regionLabel: input.regionLabel,
      summary: parsed,
      ttlMinutes: 45,
    })

    return {
      data: parsed,
      status: "live" as const,
    }
  } catch (error) {
    console.error("OpenAI narrative fallback triggered:", error)
    return {
      data: fallback,
      status: "fallback" as const,
    }
  }
}
