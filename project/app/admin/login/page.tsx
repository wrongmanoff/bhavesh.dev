"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Terminal } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      const msg = authError.message.toLowerCase();
      if (msg.includes("invalid login credentials")) {
        setError(
          "Invalid email or password. Check you created the user in project gwdxmyuwecexgsjarvnf with Auto Confirm enabled."
        );
      } else if (msg.includes("email not confirmed")) {
        setError("Email not confirmed. In Supabase Dashboard → Users, confirm the user or recreate with Auto Confirm ON.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="flex items-center gap-2 mb-6">
        <Terminal size={18} className="text-[#00ff88]" />
        <h1 className="font-mono text-lg font-semibold text-white">admin login</h1>
      </div>

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
        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full font-mono text-sm py-2.5 rounded bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] hover:bg-[#00ff88]/20 transition-colors disabled:opacity-50"
        >
          {loading ? "authenticating..." : "sign in"}
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
