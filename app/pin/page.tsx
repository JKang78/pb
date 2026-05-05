import { submitPin } from "./actions";

export default function PinPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <form action={submitPin}>
        <input
          name="pin"
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="PIN"
          className="w-64 border border-black px-4 py-3 text-center text-lg tracking-[0.3em] outline-none"
        />
        <button
          type="submit"
          className="mt-3 w-full border border-black px-4 py-3 text-center text-sm font-medium uppercase tracking-[0.2em]"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
