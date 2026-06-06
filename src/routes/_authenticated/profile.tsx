import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAllTasks } from "@/hooks/useTasks";
import { dailyMap } from "@/lib/consistency";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Mail, CalendarDays, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({ component: ProfilePage });

function ProfilePage() {
  const navigate = useNavigate();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
      return data;
    },
  });
  const { data: all = [] } = useAllTasks();

  const map = dailyMap(all);
  const overall = map.size === 0 ? 0 : Math.round(Array.from(map.values()).reduce((a, b) => a + b, 0) / map.size);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const created = profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-4xl font-display font-bold">Profile</h1>

      <Card className="glass-card p-6 space-y-4">
        <Row icon={UserIcon} label="Username" value={profile?.username ?? "—"} />
        <Row icon={Mail} label="Email" value={profile?.email ?? "—"} />
        <Row icon={CalendarDays} label="Member since" value={created} />
        <Row icon={TrendingUp} label="Overall consistency" value={`${overall}%`} accent />
      </Card>

      <Button variant="destructive" onClick={handleLogout} className="w-full">
        <LogOut className="size-4" /> Logout
      </Button>
    </div>
  );
}

function Row({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Icon className="size-4 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className={`font-display font-semibold ${accent ? "text-primary text-glow text-xl" : ""}`}>{value}</span>
    </div>
  );
}
