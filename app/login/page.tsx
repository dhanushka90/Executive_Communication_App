"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, LogIn } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
      const data = await response.json() as { error?: string; confirmationRequired?: boolean };
      if (!response.ok) throw new Error(data.error ?? "Unable to continue");
      if (data.confirmationRequired) setMessage("Check your email to confirm your account, then sign in.");
      else window.location.href = "/";
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to continue"); }
    finally { setBusy(false); }
  }

  return <main className="auth-page"><div className="auth-card"><a className="back-link" href="/"><ArrowLeft size={15} /> Back to Briefly</a><div className="auth-mark"><LogIn size={21} /></div><span className="eyebrow">YOUR PRIVATE COACH</span><h1>{mode === "sign-in" ? <>Welcome <em>back.</em></> : <>Build your <em>practice.</em></>}</h1><p>{mode === "sign-in" ? "Sign in to sync your saved phrases and progress across devices." : "Create an account to keep your practice in sync."}</p><form onSubmit={submit}>{mode === "sign-up" && <label>Name<input value={name} onChange={event => setName(event.target.value)} placeholder="Your name" autoComplete="name" /></label>}<label>Email<input value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="you@company.com" autoComplete="email" required /></label><label>Password<input value={password} onChange={event => setPassword(event.target.value)} type="password" placeholder="At least 6 characters" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={6} required /></label><button className="primary-button auth-submit" disabled={busy}>{busy ? "Working…" : mode === "sign-in" ? "Sign in" : "Create account"}</button></form>{message && <p className="auth-message">{message}</p>}<button className="auth-switch" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setMessage(""); }}>{mode === "sign-in" ? "Need an account? Create one" : "Already have an account? Sign in"}</button></div></main>;
}
