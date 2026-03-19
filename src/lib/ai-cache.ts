import { createServerSupabase } from "@/lib/supabase-server"

export async function getCachedAiSummary(cacheKey: string) {
  const supabase = createServerSupabase()

  const { data, error } = await supabase
    .from("sunset_ai_cache")
    .select("summary, expires_at")
    .eq("cache_key", cacheKey)
    .single()

  if (error || !data) return null

  const expiresAt = new Date(data.expires_at)
  if (expiresAt.getTime() < Date.now()) return null

  return data.summary
}

export async function setCachedAiSummary(input: {
  cacheKey: string
  cityLabel: string
  regionLabel: string
  summary: unknown
  ttlMinutes?: number
}) {
  const supabase = createServerSupabase()
  const ttlMinutes = input.ttlMinutes ?? 45
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString()

  const { error } = await supabase.from("sunset_ai_cache").upsert(
    {
      cache_key: input.cacheKey,
      city_label: input.cityLabel,
      region_label: input.regionLabel,
      summary: input.summary,
      expires_at: expiresAt,
    },
    {
      onConflict: "cache_key",
    }
  )

  if (error) {
    console.error("Failed to cache AI summary:", error)
  }
}
