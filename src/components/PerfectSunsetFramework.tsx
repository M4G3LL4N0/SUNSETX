const principles = [
  {
    title: "Clear horizon",
    body:
      "You want the western horizon open enough for the sun to disappear cleanly and for afterglow to stay visible.",
  },
  {
    title: "Some clouds, not too many",
    body:
      "Thin or broken mid and high clouds usually create stronger color than a fully empty or fully blocked sky.",
  },
  {
    title: "Good visibility",
    body:
      "Crisp air helps color stay vivid. Too much haze, smoke, or pollution can flatten the scene.",
  },
  {
    title: "Great viewing spot",
    body:
      "A better location can turn the same sky into a much better experience through panorama, framing, comfort, and low friction.",
  },
  {
    title: "Strong afterglow setup",
    body:
      "Some of the best moments come minutes after sunset, when clouds stay lit and color lingers above the horizon.",
  },
  {
    title: "Balanced atmosphere",
    body:
      "Humidity, wind, and particles all shape how warm, soft, sharp, or dramatic the final sky feels.",
  },
]

export default function PerfectSunsetFramework() {
  return (
    <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
        What makes a great sunset
      </div>

      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        What SUNSETX looks for in the perfect sky
      </h2>

      <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300">
        We do not reveal the full engine, but the best sunsets usually combine
        an open western horizon, useful cloud structure, good atmospheric
        clarity, and a location that lets the sky actually perform. The perfect
        sunset is not random. It is a convergence of visibility, cloud geometry,
        timing, and place.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {principles.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-black/30 p-5"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
