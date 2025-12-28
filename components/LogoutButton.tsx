"use client";

import { createSupabaseBrowserClient } from "../lib/supabaseClient";

export default function LogoutButton({ className = "text-xs text-muted" }: { className?: string }) {
  const supabase = createSupabaseBrowserClient();

  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.reload();
      }}
      className={className}
    >
      Log out
    </button>
  );
}
