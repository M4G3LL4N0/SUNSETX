"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Auth() {
  const [email, setEmail] = useState("")

  const signIn = async () => {
    await supabase.auth.signInWithOtp({ email })
    alert("Check your email")
  }

  return (
    <div className="mt-10">
      <input
        className="p-2 text-black"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={signIn} className="ml-2 bg-white text-black px-4 py-2">
        Login
      </button>
    </div>
  )
}
