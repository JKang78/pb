import RegisterForm from "../../components/RegisterForm";
import { getUser } from "../../lib/auth";
import LogoutButton from "../../components/LogoutButton";
import Link from "next/link";

export default async function RegisterPage() {
  const user = await getUser();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Register</h1>
        <p className="text-sm text-gray-600">
          Create an account and verify your email once.
        </p>
      </div>

      {user ? (
        <div className="space-y-3">
          <p className="text-sm">You are signed in as {user.email}.</p>
          <LogoutButton />
        </div>
      ) : (
        <div className="space-y-4">
          <RegisterForm />
          <p className="text-xs text-gray-600">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      )}
    </section>
  );
}
