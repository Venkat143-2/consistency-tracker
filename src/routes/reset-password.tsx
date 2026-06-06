import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Reset password — Consistency Tracker" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [cf, setCf] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return toast.error("Min 6 characters");
    if (pw !== cf) return toast.error("Passwords don't match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. Please log in.");
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md glass-card rounded-2xl p-8 space-y-4">
        <h1 className="text-2xl font-display font-bold text-glow text-primary text-center">Create New Password</h1>
        <div className="space-y-2">
          <Label htmlFor="np">New Password</Label>
          <Input id="np" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cp">Confirm Password</Label>
          <Input id="cp" type="password" value={cf} onChange={(e) => setCf(e.target.value)} required />
        </div>
        <Button className="w-full" disabled={loading}>{loading ? "Updating..." : "Update Password"}</Button>
      </form>
    </div>
  );
}
