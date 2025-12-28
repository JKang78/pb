import MagicLinkForm from "../../components/MagicLinkForm";
import PasswordLoginForm from "../../components/PasswordLoginForm";
import PasswordSetupForm from "../../components/PasswordSetupForm";
import LogoutButton from "../../components/LogoutButton";
import { getUser } from "../../lib/auth";

export default async function LoginPage() {
  const user = await getUser();
  const passwordSet = Boolean(user?.user_metadata?.password_set);

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-gray-600">
          Verify your email once, then use a password going forward.
        </p>
      </div>

      {user ? (
        <div className="space-y-4">
          <p className="text-sm">You are signed in as {user.email}.</p>
          {!passwordSet ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Set a password now so you can log in without email links.
              </p>
              <PasswordSetupForm />
            </div>
          ) : (
            <p className="text-sm text-gray-600">Password is set.</p>
          )}
          <LogoutButton />
        </div>
      ) : (
        <div className="space-y-10">
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Password login</h2>
            <PasswordLoginForm />
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">First time verification</h2>
            <p className="text-xs text-gray-600">
              Use this once to verify your email and set a password.
            </p>
            <MagicLinkForm />
          </div>
        </div>
      )}
    </section>
  );
}
