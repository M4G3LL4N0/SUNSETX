import { createServerSupabase } from "@/lib/supabase-server"
import type { SunsetSpot } from "@/lib/locations"

export type UserPreferences = {
  userKey: string
  prefersWoodsy: boolean
  maxDriveMinutes: number
  avoidWaterSmell: boolean
  quietVibe: boolean
}

export async function getUserPreferences(userKey: string): Promise<UserPreferences> {
  const supabase = createServerSupabase()

  const { data } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_key", userKey)
    .maybeSingle()

  if (!data) {
    return {
      userKey,
      prefersWoodsy: true,
      maxDriveMinutes: 12,
      avoidWaterSmell: false,
      quietVibe: true,
    }
  }

  return {
    userKey,
    prefersWoodsy: data.prefers_woodsy,
    maxDriveMinutes: data.max_drive_minutes,
    avoidWaterSmell: data.avoid_water_smell,
    quietVibe: data.quiet_vibe,
  }
}

export async function saveUserPreferences(input: UserPreferences) {
  const supabase = createServerSupabase()

  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_key: input.userKey,
      prefers_woodsy: input.prefersWoodsy,
      max_drive_minutes: input.maxDriveMinutes,
      avoid_water_smell: input.avoidWaterSmell,
      quiet_vibe: input.quietVibe,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_key",
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  return { ok: true }
}

export function personalizeSpotScore(
  spot: SunsetSpot & { distanceMiles: number; driveMinutes: number; score: number },
  prefs: UserPreferences
) {
  let adjusted = spot.score

  if (prefs.prefersWoodsy) {
    adjusted += Math.round(spot.woodsyBias * 8)
  }

  if (prefs.avoidWaterSmell && spot.waterLabel.toLowerCase().includes("moderate")) {
    adjusted -= 8
  }

  if (prefs.quietVibe && spot.vibeLabel.toLowerCase().includes("quiet")) {
    adjusted += 5
  }

  if (spot.driveMinutes > prefs.maxDriveMinutes) {
    adjusted -= Math.min(15, (spot.driveMinutes - prefs.maxDriveMinutes) * 2)
  }

  return Math.max(0, Math.min(100, adjusted))
}
