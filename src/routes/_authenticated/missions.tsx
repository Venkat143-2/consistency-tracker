import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge3D } from "@/components/Badge3D";
import { useMissionEngine } from "@/hooks/useMissions";
import { categoryLabels, progressFor, type MissionCategory } from "@/lib/missions";
import { Target } from "lucide-react";

export const Route = createFileRoute("/_authenticated/missions")({
  component: MissionsPage,
});

function StatusPill({ status }: { status: "Locked" | "In Progress" | "Completed" }) {
  const styles = {
    Locked: "bg-muted text-muted-foreground border-border",
    "In Progress": "bg-primary/15 text-primary border-primary/40",
    Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  } as const;
  return (
    <span className={`inline-flex items-center text-[11px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md border ${styles[status]}`}>
      {status}
    </span>
  );
}

function MissionsPage() {
  const { missions, stats, unlockedIds, isLoading } = useMissionEngine();

  if (isLoading) {
    return <div className="text-muted-foreground">Loading missions…</div>;
  }

  const grouped = new Map<MissionCategory, typeof missions>();
  for (const m of missions) {
    const arr = grouped.get(m.category as MissionCategory) ?? [];
    arr.push(m);
    grouped.set(m.category as MissionCategory, arr);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center">
            <Target className="size-5 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold">Missions</h1>
        </div>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Long-term goals that build real discipline. Progress updates as you complete tasks each day.
        </p>
      </div>

      {Array.from(grouped.entries()).map(([cat, list]) => (
        <section key={cat} className="space-y-4">
          <h2 className="text-xl font-display font-semibold">{categoryLabels[cat]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.map((m) => {
              const prog = progressFor(m, stats);
              const pct = Math.round((prog / m.target) * 100);
              const unlocked = unlockedIds.has(m.id);
              const status: "Locked" | "In Progress" | "Completed" = unlocked
                ? "Completed"
                : prog > 0
                ? "In Progress"
                : "Locked";

              return (
                <Card key={m.id} className="glass-card p-5 flex gap-4">
                  <Badge3D tier={m.tier} icon={m.icon} unlocked={unlocked} size={72} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold text-base leading-tight">{m.title}</h3>
                      <StatusPill status={status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.description}</p>
                    <div className="mt-3">
                      <Progress value={pct} />
                      <div className="flex items-center justify-between text-xs mt-1.5">
                        <span className="text-muted-foreground">
                          {prog} / {m.target}
                        </span>
                        <span className="text-primary font-medium">{m.badge_name}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
