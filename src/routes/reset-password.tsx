import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Set new password — Consistency Tracker" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [cf, setCf] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return toast.error("Password must be at least 6 characters");
    if (pw !== cf) return toast.error("Passwords don't match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. Please sign in.");
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const inputCls =
    "h-11 bg-background/40 border-border/60 focus-visible:border-primary/60 focus-visible:ring-primary/30 transition-colors";
  const labelCls = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password to secure your account.">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="np" className={labelCls}>New password</Label>
          <Input id="np" type="password" placeholder="At least 6 characters" value={pw} onChange={(e) => setPw(e.target.value)} required autoComplete="new-password" className={inputCls} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cp" className={labelCls}>Confirm password</Label>
          <Input id="cp" type="password" placeholder="••••••••" value={cf} onChange={(e) => setCf(e.target.value)} required autoComplete="new-password" className={inputCls} />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 font-medium shadow-[0_0_24px_-8px_oklch(0.82_0.18_175_/_0.8)] hover:shadow-[0_0_32px_-4px_oklch(0.82_0.18_175_/_1)] transition-all hover:-translate-y-0.5"
        >
          {loading ? (<><Loader2 className="size-4 animate-spin" /> Updating</>) : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}
