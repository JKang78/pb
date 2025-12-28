"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabaseClient";

export default function MagicLinkForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState<string>("");
  const supabase = createSupabaseBrowserClient();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("Sending magic link...");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your email for the magic link.");
  };

  return (
    <form onSubmit={handleLogin} className="space-y-3">
      <label className="flex flex-col gap-2 text-sm">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border border-gray-300 px-3 py-2"
        />
      </label>
      <button type="submit" className="border border-[color:var(--text)] px-4 py-2 text-sm">
        Send magic link
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
