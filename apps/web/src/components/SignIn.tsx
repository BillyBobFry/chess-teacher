import { useState, type FormEvent } from "react";
import { authClient } from "../api/client.ts";
import { authErrorText } from "../api/errors.ts";
import { m } from "../paraglide/messages.js";
import { Alert } from "../ui/Alert.tsx";
import { Button } from "../ui/Button.tsx";
import { TextField } from "../ui/TextField.tsx";

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
    if (error) setError(authErrorText(error));
  };

  const google = () =>
    authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/app/` });

  return (
    <section className="sign-in">
      <h1>{mode === "signIn" ? m.sign_in_title() : m.sign_up_title()}</h1>
      <p className="muted">{mode === "signIn" ? m.sign_in_intro() : m.sign_up_intro()}</p>

      {googleEnabled && (
        <>
          <Button className="mt-4 w-full" onPress={google} isDisabled={busy}>
            {/* Google's mark, not text. */}
            <span aria-hidden>{"G"}</span> {m.sign_in_google()}
          </Button>
          <div className="divider">
            <span>{m.sign_in_or()}</span>
          </div>
        </>
      )}

      <form onSubmit={submit}>
        {mode === "signUp" && (
          <TextField label={m.field_name()} value={name} onChange={setName} autoComplete="name" />
        )}
        <TextField
          label={m.field_email()}
          type="email"
          isRequired
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <TextField
          label={m.field_password()}
          type="password"
          isRequired
          minLength={8}
          value={password}
          onChange={setPassword}
          autoComplete={mode === "signUp" ? "new-password" : "current-password"}
        />
        {error && <Alert>{error}</Alert>}
        <Button variant="primary" size="large" type="submit" isDisabled={busy}>
          {mode === "signIn" ? m.sign_in_submit() : m.sign_up_submit()}
        </Button>
      </form>

      <p className="switch">
        {mode === "signIn" ? m.sign_in_new_here() : m.sign_up_have_account()}{" "}
        <Button
          variant="link"
          onPress={() => {
            setMode(mode === "signIn" ? "signUp" : "signIn");
            setError(null);
          }}
        >
          {mode === "signIn" ? m.sign_in_to_sign_up() : m.sign_in_submit()}
        </Button>
      </p>
    </section>
  );
}
