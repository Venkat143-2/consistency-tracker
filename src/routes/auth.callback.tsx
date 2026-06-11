import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({ meta: [{ title: "Verifying — Consistency Tracker" }] }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const type =
          url.searchParams.get("type") ??
          url.hash.match(/type=([^&]+)/)?.[1] ??
          "";

        if (code) {
          await supabase.auth.exchangeCodeForSession(window.location.href);
        }

        if (cancelled) return;

        // Email verification / magic link flows: sign out and redirect to login
        const emailFlowTypes = ["signup", "email_change", "magiclink"];
        if (type && emailFlowTypes.includes(type)) {
          await supabase.auth.signOut({ scope: "local" });
          navigate({
            to: "/auth/login",
            search: { verified: "true" },
            replace: true,
          });
          return;
        }

        // OAuth or other flows: proceed to dashboard if signed in
        const { data } = await supabase.auth.getUser();
        if (cancelled) return;
        if (data.user) {
          toast.success("Signed in successfully!");
          navigate({ to: "/dashboard", replace: true });
        } else {
          toast.error("Verification link expired. Please sign in.");
          navigate({ to: "/auth/login", replace: true });
        }
      } catch (e: any) {
        if (cancelled) return;
        toast.error(e?.message ?? "Verification failed.");
        navigate({ to: "/auth/login", replace: true });
      }
    }

    finish();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="text-sm">Verifying your account…</p>
    </div>
  );
}
