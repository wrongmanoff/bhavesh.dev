"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Terminal } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const LOCKOUT_THRESHOLD = 3;
const LOCKOUT_DURATION_MS = 30_000;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/x9k2-manage";
  const unauthorized = searchParams.get("error") === "unauthorized";

  useEffect(() => {
    if (!unauthorized) return;
    const supabase = createClient();
    supabase.auth.signOut().catch(() => undefined);
  }, [unauthorized]);

  useEffect(() => {
    if (!lockedUntil) {
      setSecondsRemaining(0);
      return;
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) {
        setLockedUntil(null);
        setFailedAttempts(0);
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [lockedUntil]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (lockedUntil && lockedUntil > Date.now()) {
      setError(`Too many failed attempts. Try again in ${secondsRemaining}s.`);
      return;
    }

    if (!captchaToken) {
      setError("Please complete the captcha.");
      return;
    }

    setLoading(true);
    setError(unauthorized ? "Unauthorized. This account does not have admin access." : "");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
      options: { captchaToken },
    });

    // reset captcha after every attempt
    captchaRef.current?.resetCaptcha();
    setCaptchaToken(null);

    if (authError) {
      const nextFailedAttempts = failedAttempts + 1;
      const msg = authError.message.toLowerCase();
      if (msg.includes("invalid login credentials")) {
        setError(
          "Invalid email or password. Check you created the user in Supabase with Auto Confirm enabled."
        );
      } else if (msg.includes("email not confirmed")) {
        setError("Email not confirmed. In Supabase Dashboard → Users, confirm the user or recreate with Auto Confirm ON.");
      } else {
        setError(authError.message);
      }
      setFailedAttempts(nextFailedAttempts);
      if (nextFailedAttempts >= LOCKOUT_THRESHOLD) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION_MS);
      }
      setLoading(false);
      return;
    }

    setFailedAttempts(0);
    setLockedUntil(null);
    router.push(redirect);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="flex items-center gap-2 mb-6">
        <Terminal size={18} className="text-[#00ff88]" />
        <h1 className="font-mono text-lg font-semibold text-white">admin login</h1>
      </div>

      {unauthorized && (
        <p className="mb-4 rounded border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-mono text-red-300">
          Unauthorized. This account does not have admin access.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00ff88]/50"
          />
        </div>
        <div>
          <label className="font-mono text-xs text-[#6b6b6b] block mb-1.5">password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00ff88]/50"
          />
        </div>

        <div className="flex justify-center">
          <HCaptcha
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
            ref={captchaRef}
            theme="dark"
          />
        </div>

        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

        <button
          type="submit"
          disabled={loading || !captchaToken || Boolean(lockedUntil && lockedUntil > Date.now())}
          className="w-full font-mono text-sm py-2.5 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/20 transition-colors disabled:opacity-50"
        >
          {loading
            ? "authenticating..."
            : lockedUntil && lockedUntil > Date.now()
              ? `try again in ${secondsRemaining}s`
              : "sign in"}
        </button>
      </form>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-14">
      <Suspense fallback={<div className="font-mono text-sm text-[#6b6b6b]">loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}