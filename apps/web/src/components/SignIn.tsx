import { useState, type FormEvent } from "react";
import { authClient } from "../api/client.ts";

export function SignIn({ googleEnabled }: { googleEnabled: boolean }) {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } =
      mode === "signUp"
        ? await authClient.signUp.email({ name: name || email.split("@")[0]!, email, password })
        : await authClient.signIn.email({ email, password });
    setBusy(false);
    if (error) setError(error.message ?? "Something went wrong. Please try again.");
  };

  const google = () =>
    authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/app/` });

  return (
    <section className="sign-in">
      <h1>{mode === "signIn" ? "Welcome back" : "Create your account"}</h1>
      <p className="muted">
        {mode === "signIn"
          ? "Sign in to carry on where you left off."
          : "Your games and lessons are saved to your account, so you can pick up on any device."}
      </p>

      {googleEnabled && (
        <>
          <button className="google" onClick={google} disabled={busy}>
            <span aria-hidden>G</span> Continue with Google
          </button>
          <div className="divider">
            <span>or</span>
          </div>
        </>
      )}

      <form onSubmit={submit}>
        {mode === "signUp" && (
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signUp" ? "new-password" : "current-password"}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary big" type="submit" disabled={busy}>
          {mode === "signIn" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="switch">
        {mode === "signIn" ? "New here? " : "Already have an account? "}
        <button
          className="link"
          onClick={() => {
            setMode(mode === "signIn" ? "signUp" : "signIn");
            setError(null);
          }}
        >
          {mode === "signIn" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </section>
  );
}
