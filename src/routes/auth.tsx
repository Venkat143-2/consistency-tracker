import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Consistency Tracker" },
      { name: "description", content: "Sign in to your Consistency Tracker account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        toast.error("Your email is not verified. Please verify your account.");
      } else {
        toast.error("Invalid email or password.");
      }
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue tracking your consistency."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="li-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Email
          </Label>
          <Input
            id="li-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-11 bg-background/40 border-border/60 focus-visible:border-primary/60 focus-visible:ring-primary/30 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="li-pw" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="li-pw"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="h-11 bg-background/40 border-border/60 focus-visible:border-primary/60 focus-visible:ring-primary/30 transition-colors"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 font-medium shadow-[0_0_24px_-8px_oklch(0.82_0.18_175_/_0.8)] hover:shadow-[0_0_32px_-4px_oklch(0.82_0.18_175_/_1)] transition-all hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Signing in
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
