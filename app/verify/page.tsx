import Link from "next/link";

export default function VerifyPage({
  searchParams
}: {
  searchParams?: { email?: string; verified?: string };
}) {
  const email = searchParams?.email;
  const isVerified = searchParams?.verified === "1";

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Verify email</h1>
      {isVerified ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Your email is verified. You can now log in.
          </p>
          <Link href="/login" className="text-sm">
            Go to login
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {email
              ? `We sent a verification link to ${email}.`
              : "Check your email for the verification link."}
          </p>
          <p className="text-xs text-gray-600">
            Once verified, this page will update automatically.
          </p>
        </div>
      )}
    </section>
  );
}
