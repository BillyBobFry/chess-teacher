import { useState, type FormEvent } from "react";
import { authClient } from "../api/client.ts";
import { m } from "../paraglide/messages.js";

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
    if (error) setError(error.message ?? m.error_generic());
  };

  const google = () =>
    authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/app/` });

  return (
    <section className="sign-in">
      <h1>{mode === "signIn" ? m.sign_in_title() : m.sign_up_title()}</h1>
      <p className="muted">{mode === "signIn" ? m.sign_in_intro() : m.sign_up_intro()}</p>

      {googleEnabled && (
        <>
          <button className="google" onClick={google} disabled={busy}>
            {/* Google's mark, not text. */}
            <span aria-hidden>{"G"}</span> {m.sign_in_google()}
          </button>
          <div className="divider">
            <span>{m.sign_in_or()}</span>
          </div>
        </>
      )}

      <form onSubmit={submit}>
        {mode === "signUp" && (
          <label>
            {m.field_name()}
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
        )}
        <label>
          {m.field_email()}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label>
          {m.field_password()}
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
          {mode === "signIn" ? m.sign_in_submit() : m.sign_up_submit()}
        </button>
      </form>

      <p className="switch">
        {mode === "signIn" ? m.sign_in_new_here() : m.sign_up_have_account()}{" "}
        <button
          className="link"
          onClick={() => {
            setMode(mode === "signIn" ? "signUp" : "signIn");
            setError(null);
          }}
        >
          {mode === "signIn" ? m.sign_in_to_sign_up() : m.sign_in_submit()}
        </button>
      </p>
    </section>
  );
}
