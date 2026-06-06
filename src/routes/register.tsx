import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/register")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Create account — Consistency Tracker" },
      { name: "description", content: "Create your Consistency Tracker account." },
    ],
  }),
  component: RegisterPage,
});

const registerSchema = z
  .object({
    username: z.string().trim().min(2, "Username must be at least 2 characters").max(40),
    email: z.string().trim().email("Invalid email address").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = registerSchema.safeParse({ username, email, password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const redirectUrl = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl, data: { username } },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Verification link has been sent to your email.");
    navigate({ to: "/auth" });
  }

  const inputCls =
    "h-11 bg-background/40 border-border/60 focus-visible:border-primary/60 focus-visible:ring-primary/30 transition-colors";
  const labelCls = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start building habits that stick."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth" className="text-primary font-medium hover:underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="r-user" className={labelCls}>Username</Label>
          <Input
            id="r-user"
            placeholder="your_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="r-email" className={labelCls}>Email</Label>
          <Input
            id="r-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="r-pw" className={labelCls}>Password</Label>
          <Input
            id="r-pw"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="r-cf" className={labelCls}>Confirm password</Label>
          <Input
            id="r-cf"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            className={inputCls}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 font-medium shadow-[0_0_24px_-8px_oklch(0.82_0.18_175_/_0.8)] hover:shadow-[0_0_32px_-4px_oklch(0.82_0.18_175_/_1)] transition-all hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Creating account
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
