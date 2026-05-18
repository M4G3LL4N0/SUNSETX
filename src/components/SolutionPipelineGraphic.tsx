"use client";
export function SolutionPipelineGraphic() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <p className="text-xs uppercase text-violet-300">Unified pipeline</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row"><div key="Input" className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"><span className="text-violet-300 font-semibold">1</span> <span className="text-sm text-white">Input</span></div><div key="Process" className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"><span className="text-violet-300 font-semibold">2</span> <span className="text-sm text-white">Process</span></div><div key="Output" className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"><span className="text-violet-300 font-semibold">3</span> <span className="text-sm text-white">Output</span></div><div key="Next" className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"><span className="text-violet-300 font-semibold">4</span> <span className="text-sm text-white">Next</span></div></div>
      </div>
    </section>
  );
}