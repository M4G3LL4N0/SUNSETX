"use client"

import React from "react"

type Props = {
  children: React.ReactNode
  fallbackTitle?: string
}

type State = {
  hasError: boolean
}

export default class ClientSafeBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("SUNSETX client section crashed:", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 text-white backdrop-blur-2xl">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {this.props.fallbackTitle ?? "SUNSETX section"}
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            This section is temporarily unavailable, but the page is still running.
          </p>
        </section>
      )
    }

    return this.props.children
  }
}
