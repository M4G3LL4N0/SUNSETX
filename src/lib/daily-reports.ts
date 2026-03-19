import { createServerSupabase } from "@/lib/supabase-server"

export async function saveDailyReport(input: {
  cityLabel: string
  regionLabel?: string
  lat: number
  lon: number
  reportDate: string
  report: unknown
}) {
  const supabase = createServerSupabase()

  const { error } = await supabase.from("daily_sunset_reports").upsert(
    {
      city_label: input.cityLabel,
      region_label: input.regionLabel ?? null,
      lat: input.lat,
      lon: input.lon,
      report_date: input.reportDate,
      report: input.report,
    },
    {
      onConflict: "lat,lon,report_date",
    }
  )

  if (error) {
    console.error("Failed to save daily report:", error)
  }
}
