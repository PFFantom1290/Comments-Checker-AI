"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useT } from "@/components/I18nProvider";

interface Props {
  mode: "login" | "register";
  googleEnabled: boolean;
}

export default function AuthForm({ mode, googleEnabled }: Props) {
  const router = useRouter();
  const t = useT();
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (password.length < 8) {
        setError(t.auth.short);
        return;
      }
      if (password !== confirm) {
        setError(t.auth.mismatch);
        return;
      }
    }

    setLoading(true);
    try {
      if (!isLogin) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Could not create account.");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", { email, password, redirect: false });

      if (result?.error) {
        setError(isLogin ? t.auth.invalid : "Account created, but sign-in failed. Try logging in.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          {isLogin ? t.auth.welcomeBack : t.auth.createTitle}
        </h1>
        <p className="text-gray-500 text-sm">{isLogin ? t.auth.signInSub : t.auth.createSub}</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-950/50 border border-red-800/60 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {!isLogin && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.auth.name}
            autoComplete="name"
            className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.auth.email}
          required
          autoComplete="email"
          className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.auth.password}
          required
          autoComplete={isLogin ? "current-password" : "new-password"}
          className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        {!isLogin && (
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={t.auth.confirm}
            required
            autoComplete="new-password"
            className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-3 transition-colors shadow-lg shadow-indigo-900/30"
        >
          {loading ? t.auth.pleaseWait : isLogin ? t.auth.signIn : t.auth.create}
        </button>
      </form>

      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-gray-800" />
            <span className="text-gray-600 text-xs uppercase tracking-wider">{t.auth.or}</span>
            <div className="h-px flex-1 bg-gray-800" />
          </div>
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl px-4 py-3 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
            </svg>
            {t.auth.google}
          </button>
        </>
      )}

      <p className="text-center text-gray-500 text-sm mt-6">
        {isLogin ? (
          <>
            {t.auth.noAccount}{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300">
              {t.auth.signUp}
            </Link>
          </>
        ) : (
          <>
            {t.auth.haveAccount}{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
              {t.auth.signIn}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
