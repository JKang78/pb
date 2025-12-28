import LoginForm from "../../components/LoginForm";
import { getUser } from "../../lib/auth";

export default async function LoginPage() {
  const user = await getUser();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-sm text-gray-600">
        Magic link access for the blog owner.
      </p>
      {user ? (
        <div className="space-y-4">
          <p className="text-sm">You are signed in as {user.email}.</p>
          <LoginForm initialEmail={user.email ?? ""} showLogout />
        </div>
      ) : (
        <LoginForm />
      )}
    </section>
  );
}
