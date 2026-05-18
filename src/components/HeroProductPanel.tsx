"use client";
export function HeroProductPanel() {
  return (
    <div className="relative w-full" aria-label="Product preview">
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-violet-500/20 to-transparent blur-2xl" aria-hidden />
      <div className="relative rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 ring-1 ring-violet-500/20 backdrop-blur sm:p-6">
        <p className="text-xs font-semibold uppercase text-violet-300">Product workspace</p>
        <span className="ml-2 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-300">Workflow intelligence</span>
        <div className="mt-4 grid grid-cols-3 gap-2"><div key="Tasks" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"><p className="text-[10px] uppercase text-slate-500">Tasks</p><p className="mt-0.5 text-sm font-semibold text-white">24</p></div><div key="Done" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"><p className="text-[10px] uppercase text-slate-500">Done</p><p className="mt-0.5 text-sm font-semibold text-white">18</p></div><div key="Risk" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"><p className="text-[10px] uppercase text-slate-500">Risk</p><p className="mt-0.5 text-sm font-semibold text-white">Low</p></div></div>
        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-3 space-y-2"><div key="Input" className="flex items-center gap-2 text-xs text-slate-300"><span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-[10px]">1</span>Input</div><div key="Process" className="flex items-center gap-2 text-xs text-slate-300"><span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-[10px]">2</span>Process</div><div key="Output" className="flex items-center gap-2 text-xs text-slate-300"><span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-[10px]">3</span>Output</div><div key="Next" className="flex items-center gap-2 text-xs text-slate-300"><span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-[10px]">4</span>Next</div></div>
        <p className="mt-4 text-[10px] text-slate-500">Sample metrics — local review only.</p>
      </div>
    </div>
  );
}