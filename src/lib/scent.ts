export function calculateScentScore(env: any) {
  const vegetation = env.vegetation || 0.7
  const pollution = env.pollution || 0.2
  const humidity = env.humidity || 0.5
  const windQuality = env.windQuality || 0.7
  const terrain = env.terrain || 0.8

  const score =
    0.3 * vegetation +
    0.2 * (1 - pollution) +
    0.2 * windQuality +
    0.15 * (1 - Math.abs(humidity - 0.5)) +
    0.15 * terrain

  return Math.round(score * 100)
}
