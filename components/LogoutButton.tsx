"use client";

import { createSupabaseBrowserClient } from "../lib/supabaseClient";

export default function LogoutButton() {
  const supabase = createSupabaseBrowserClient();

  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.reload();
      }}
      className="text-xs text-gray-500"
    >
      Log out
    </button>
  );
}
