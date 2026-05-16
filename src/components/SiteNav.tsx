"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const items = [
  { href: "/#live", label: "Live score" },
  { href: "/#education", label: "Learn" },
  { href: "/#board", label: "Global board" },
  { href: "/#framework", label: "Framework" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const link =
    "rounded-full px-3 py-1.5 text-zinc-300 hover:bg-white/5 hover:text-white";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-orange-400 text-xs font-bold text-black">
            SX
          </span>
          <span className="truncate text-sm font-semibold tracking-tight text-white">SUNSETX</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#live"
            className="hidden rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black sm:inline-flex sm:text-sm"
            onClick={() => setOpen(false)}
          >
            Live sunset
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white md:hidden"
            aria-expanded={open}
            aria-controls="sunsetx-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden>{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="sunsetx-mobile-nav"
          className="mx-auto flex max-w-7xl flex-col gap-1 border-t border-white/10 px-4 py-3 sm:px-6 md:hidden"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm text-zinc-200 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <p className="px-3 pt-1 text-[11px] leading-relaxed text-zinc-500">
            Sunset scores use weather and timing models for planning — not safety guarantees for travel or photography.
          </p>
        </nav>
      )}
    </header>
  );
}
