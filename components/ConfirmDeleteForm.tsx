"use client";

import { FormEvent } from "react";

export default function ConfirmDeleteForm({
  action
}: {
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      onSubmit={(event: FormEvent) => {
        if (!confirm("Delete this post?") ) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="border border-red-500 px-3 py-1 text-red-600 text-xs"
      >
        Delete
      </button>
    </form>
  );
}
