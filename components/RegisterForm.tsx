"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../lib/supabaseClient";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setMessage("Password should be at least 8 characters.");
      return;
    }

    setMessage("Creating account...");
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      "/verify"
    )}`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo
      }
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your email to verify, then log in.");
    router.push(`/verify?email=${encodeURIComponent(email)}`);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-3">
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
        Register
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
