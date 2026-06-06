import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset password — Consistency Tracker" },
      { name: "description", content: "Request a password reset link for your account." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    setSent(true);
    toast.success("If an account exists, a reset link has been sent.");
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a link to reset it."
      footer={
        <Link
          to="/auth"
          className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm text-foreground/90 leading-relaxed">
          Check your inbox. If an account exists for{" "}
          <span className="text-primary font-medium">{email}</span>, you'll receive a reset link shortly.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="f-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <Input
              id="f-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
                <Loader2 className="size-4 animate-spin" /> Sending
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
