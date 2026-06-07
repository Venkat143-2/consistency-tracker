import { createFileRoute, Link } from "@tanstack/react-router";
import { useAllTasks, useTodayTasks } from "@/hooks/useTasks";
import { useMissionEngine } from "@/hooks/useMissions";
import { Badge3D } from "@/components/Badge3D";
import { Progress } from "@/components/ui/progress";
import { progressFor } from "@/lib/missions";
import { dailyMap, dailyPct, inMonth, inYear, todayStr } from "@/lib/consistency";
import { Card } from "@/components/ui/card";
import { ListTodo, CheckCircle2, Circle, Flame, CalendarDays, TrendingUp, BarChart3, User, Target, Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string | number; icon: any; accent?: boolean }) {
  return (
    <Card className="glass-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className={`mt-2 text-3xl font-display font-bold ${accent ? "text-primary text-glow" : ""}`}>{value}</p>
        </div>
        <div className="size-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Icon className="size-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}

function Dashboard() {
  const today = useTodayTasks();
  const all = useAllTasks();

  const todays = today.data ?? [];
  const completed = todays.filter((t) => t.completed).length;
  const pending = todays.length - completed;
  const daily = dailyPct(todays);

  const map = dailyMap(all.data ?? []);
  const monthVals: number[] = [];
  const yearVals: number[] = [];
  for (const [date, pct] of map) {
    if (inMonth(date)) monthVals.push(pct);
    if (inYear(date)) yearVals.push(pct);
  }
  const monthly = monthVals.length ? Math.round(monthVals.reduce((a, b) => a + b, 0) / monthVals.length) : 0;
  const yearly = yearVals.length ? Math.round(yearVals.reduce((a, b) => a + b, 0) / yearVals.length) : 0;

  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const quickNav = [
    { to: "/tasks", label: "Tasks", icon: ListTodo, desc: "Plan today's tasks" },
    { to: "/mapping", label: "Mapping", icon: CheckCircle2, desc: "Mark them complete" },
    { to: "/analytics", label: "Analytics", icon: BarChart3, desc: "See your trends" },
    { to: "/profile", label: "Profile", icon: User, desc: "Account & overall" },
  ] as const;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <p className="text-sm text-muted-foreground">{dateLabel}</p>
        <h1 className="text-4xl font-display font-bold mt-1">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Today is {todayStr()} — keep the streak alive.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Tasks" value={todays.length} icon={ListTodo} />
        <StatCard label="Completed" value={completed} icon={CheckCircle2} />
        <StatCard label="Pending" value={pending} icon={Circle} />
        <StatCard label="Daily" value={`${daily}%`} icon={Flame} accent />
        <StatCard label="Monthly" value={`${monthly}%`} icon={CalendarDays} />
        <StatCard label="Yearly" value={`${yearly}%`} icon={TrendingUp} />
      </div>

      <div>
        <h2 className="text-xl font-display font-semibold mb-4">Quick navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickNav.map((q) => (
            <Link key={q.to} to={q.to} className="group">
              <Card className="glass-card p-5 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_oklch(0.82_0.18_175/0.2)]">
                <q.icon className="size-6 text-primary mb-3" />
                <p className="font-display font-semibold">{q.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{q.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <MissionsAndAchievementsRow />
    </div>
  );
}

function MissionsAndAchievementsRow() {
  const { missions, achievements, stats, isLoading } = useMissionEngine();
  if (isLoading) return null;

  // "Active" = mission not currently satisfied. Pick the closest one to completion.
  const notDone = missions.filter((m) => progressFor(m, stats) < m.target);
  notDone.sort((a, b) => progressFor(b, stats) / b.target - progressFor(a, stats) / a.target);
  const nextMission = notDone[0];
  const latest = achievements[0];
  const latestMission = latest ? missions.find((m) => m.id === latest.mission_id) : undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link to="/missions" className="group">
        <Card className="glass-card p-5 h-full transition-all hover:border-primary/50 hover:shadow-[0_0_30px_oklch(0.82_0.18_175/0.2)]">
          <div className="flex items-center gap-2 mb-3">
            <Target className="size-5 text-primary" />
            <p className="font-display font-semibold">Active Mission</p>
          </div>
          {nextMission ? (
            <div className="flex items-center gap-4">
              <Badge3D tier={nextMission.tier} icon={nextMission.icon} unlocked={false} size={56} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{nextMission.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{nextMission.description}</p>
                <div className="mt-2">
                  <Progress value={Math.min(100, Math.round((progressFor(nextMission, stats) / nextMission.target) * 100))} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {progressFor(nextMission, stats)} / {nextMission.target}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">All missions complete — legendary work.</p>
          )}
        </Card>
      </Link>

      <Link to="/achievements" className="group">
        <Card className="glass-card p-5 h-full transition-all hover:border-primary/50 hover:shadow-[0_0_30px_oklch(0.82_0.18_175/0.2)]">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="size-5 text-primary" />
            <p className="font-display font-semibold">Latest Achievement</p>
          </div>
          {latestMission ? (
            <div className="flex items-center gap-4">
              <Badge3D tier={latestMission.tier} icon={latestMission.icon} unlocked size={56} />
              <div>
                <p className="font-semibold">{latestMission.badge_name}</p>
                <p className="text-xs text-muted-foreground">
                  Unlocked {new Date(latest.unlocked_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Complete tasks to unlock your first badge.
            </p>
          )}
        </Card>
      </Link>
    </div>
  );
}
