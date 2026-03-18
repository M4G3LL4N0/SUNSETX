export function sunsetXScore(
  sky: number,
  scent: number,
  spot: number
) {
  return Math.round(
    0.6 * sky +
    0.25 * spot +
    0.15 * scent
  )
}
