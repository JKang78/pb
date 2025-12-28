"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabaseClient";

export default function PasswordLoginForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");
  const supabase = createSupabaseBrowserClient();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/dashboard";
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
      <label className="flex flex-col gap-2 text-sm">
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border border-gray-300 px-3 py-2"
        />
      </label>
      <button type="submit" className="border border-[color:var(--text)] px-4 py-2 text-sm">
        Log in
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
