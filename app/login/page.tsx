"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-browser";

const ALLOWED_USERNAME = "magdi";
const ALLOWED_PASSWORD = "magdi@123";
const FIXED_LOGIN_EMAIL = "magdi@local.app";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => identifier.trim().length > 0 && password.trim().length > 0 && !loading,
    [identifier, password, loading]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const normalizedIdentifier = identifier.trim().toLowerCase();
      if (normalizedIdentifier !== ALLOWED_USERNAME || password !== ALLOWED_PASSWORD) {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة.");
        return;
      }

      if (hasSupabaseConfig) {
        const supabase = createSupabaseBrowserClient();
        let { error: signInError } = await supabase.auth.signInWithPassword({
          email: FIXED_LOGIN_EMAIL,
          password: ALLOWED_PASSWORD
        });

        if (signInError) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: FIXED_LOGIN_EMAIL,
            password: ALLOWED_PASSWORD
          });
          if (signUpError) {
            setError(signInError.message);
            return;
          }
          const retry = await supabase.auth.signInWithPassword({
            email: FIXED_LOGIN_EMAIL,
            password: ALLOWED_PASSWORD
          });
          signInError = retry.error;
        }

        if (signInError) {
          setError(signInError.message);
          return;
        }
      }

      if (!rememberMe) {
        localStorage.setItem("remember-me", "false");
        sessionStorage.setItem("remember-session", "active");
        document.cookie = "auth_local=1; path=/; samesite=lax";
      } else {
        localStorage.setItem("remember-me", "true");
        sessionStorage.setItem("remember-session", "active");
        document.cookie = `auth_local=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("فشل تسجيل الدخول. تأكد من بياناتك.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-slate-700 bg-card p-6">
        <h1 className="text-2xl font-semibold text-slate-100">تسجيل الدخول</h1>
        <p className="text-sm text-slate-400">استخدم اسم المستخدم وكلمة المرور للوصول إلى لوحة التحكم.</p>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">اسم المستخدم</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
            placeholder="magdi"
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
            placeholder="********"
            autoComplete="current-password"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          تذكرني
        </label>

        {error && <div className="rounded-lg bg-bad/20 px-3 py-2 text-sm text-bad">{error}</div>}
        {!hasSupabaseConfig && (
          <div className="rounded-lg bg-warn/20 px-3 py-2 text-sm text-warn">
            إعدادات Supabase غير موجودة. يعمل النظام بوضع تسجيل محلي.
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-lg bg-ok/20 px-4 py-2 text-sm font-medium text-ok disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "جاري تسجيل الدخول..." : "دخول"}
        </button>
      </form>
    </main>
  );
}
