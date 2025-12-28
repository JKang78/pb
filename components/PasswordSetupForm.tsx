"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabaseClient";

export default function PasswordSetupForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string>("");
  const supabase = createSupabaseBrowserClient();

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setMessage("Password should be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Saving password...");
    const { error } = await supabase.auth.updateUser({
      password,
      data: { password_set: true }
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password saved. You can now log in with email and password.");
  };

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <label className="flex flex-col gap-2 text-sm">
        New password
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border border-gray-300 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        Confirm password
        <input
          type="password"
          required
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="border border-gray-300 px-3 py-2"
        />
      </label>
      <button type="submit" className="border border-[color:var(--text)] px-4 py-2 text-sm">
        Set password
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
