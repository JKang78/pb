import PasswordLoginForm from "../../components/PasswordLoginForm";
import LogoutButton from "../../components/LogoutButton";
import { getUser } from "../../lib/auth";
import Link from "next/link";

export default async function LoginPage() {
  const user = await getUser();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-gray-600">
          Log in with email and password.
        </p>
      </div>

      {user ? (
        <div className="space-y-3">
          <p className="text-sm">You are signed in as {user.email}.</p>
          <LogoutButton />
        </div>
      ) : (
        <div className="space-y-4">
          <PasswordLoginForm />
          <p className="text-xs text-gray-600">
            Need an account? <Link href="/register">Register</Link>
          </p>
        </div>
      )}
    </section>
  );
}
