import { createServerSupabase } from "@/lib/supabase-server"

export async function getFavoriteSpotIds(userKey: string) {
  const supabase = createServerSupabase()

  const { data, error } = await supabase
    .from("favorite_spots")
    .select("spot_id")
    .eq("user_key", userKey)

  if (error || !data) return []

  return data.map((row) => row.spot_id)
}

export async function toggleFavoriteSpot(userKey: string, spotId: string) {
  const supabase = createServerSupabase()

  const { data } = await supabase
    .from("favorite_spots")
    .select("id")
    .eq("user_key", userKey)
    .eq("spot_id", spotId)
    .maybeSingle()

  if (data?.id) {
    const { error } = await supabase
      .from("favorite_spots")
      .delete()
      .eq("id", data.id)

    if (error) throw new Error(error.message)
    return { favorited: false }
  }

  const { error } = await supabase.from("favorite_spots").insert({
    user_key: userKey,
    spot_id: spotId,
  })

  if (error) throw new Error(error.message)

  return { favorited: true }
}
