"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || password.length < 6) {
      setError("Enter a valid email and a password with at least 6 characters.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    // Demo-only client session. Replace with the team's real authentication API.
    localStorage.setItem("taskly-session", JSON.stringify({
      name: name.trim() || email.split("@")[0],
      email: email.trim(),
      signedInAt: new Date().toISOString()
    }));
    router.push("/");
  }

  return (
    <main className="login-page">
      <div className="login-decoration decoration-one"/>
      <div className="login-decoration decoration-two"/>
      <section className="login-card">
        <div className="login-brand"><span className="brand-mark">✓</span><span>taskly<span className="brand-dot">.</span></span></div>
        <div className="login-intro">
          <p className="eyebrow">YOUR PRODUCTIVITY SPACE</p>
          <h1>{mode === "login" ? "Welcome back." : "Create your space."}</h1>
          <p>{mode === "login" ? "Sign in to pick up where you left off." : "A clearer day starts with a plan."}</p>
        </div>
        <form className="login-form" onSubmit={submit}>
          {mode === "signup" && <div className="login-field"><label>Your name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" autoComplete="name"/></div>}
          <div className="login-field"><label>Email address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></div>
          <div className="login-field"><label>Password</label><div className="password-wrap"><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={mode==="login"?"current-password":"new-password"} minLength={6} required/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?"Hide":"Show"}</button></div></div>
          {error && <p className="login-error">{error}</p>}
          <button className="login-submit" type="submit">{mode==="login"?"Sign in":"Create account"} <span>→</span></button>
        </form>
        <div className="login-switch">{mode==="login"?"New to Taskly?":"Already have an account?"} <button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");}}>{mode==="login"?"Create an account":"Sign in"}</button></div>
        <div className="login-note"><span>✦</span> Plan with purpose. Make every day count.</div>
      </section>
      <footer className="login-footer">TASKLY · YOUR PERSONAL WORKSPACE</footer>
    </main>
  );
}
