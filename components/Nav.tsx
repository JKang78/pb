import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Nav({
  blogTitle,
  isOwner
}: {
  blogTitle: string;
  isOwner: boolean;
}) {
  return (
    <nav className="mx-auto flex w-full max-w-[var(--content-width)] items-center justify-between px-6 pb-4 pt-10 text-[13px] tracking-[0.01em] text-[color:var(--text)]">
      <Link href="/" className="font-title text-[15px] font-medium opacity-90 hover:opacity-100">
        {blogTitle}
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/about" className="opacity-60 hover:opacity-100">
          About
        </Link>
        {isOwner ? (
          <>
            <Link href="/dashboard" className="opacity-60 hover:opacity-100">
              Dashboard
            </Link>
            <LogoutButton className="text-[12px] opacity-60 hover:opacity-100" />
          </>
        ) : (
          <Link href="/login" className="opacity-60 hover:opacity-100">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
