import { submitPin } from "./actions";

export default function PinPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0b0b]">
      <form action={submitPin} className="flex flex-col items-center gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-white/75">pin</p>
        <input
          name="pin"
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="PIN"
          className="w-64 border border-white/80 bg-transparent px-4 py-3 text-center text-lg tracking-[0.3em] text-white outline-none"
        />
      </form>
    </div>
  );
}
