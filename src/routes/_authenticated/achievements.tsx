import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge3D } from "@/components/Badge3D";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMissionEngine } from "@/hooks/useMissions";
import { categoryLabels, type Mission, type MissionCategory } from "@/lib/missions";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const { missions, achievements, unlockedIds, isLoading } = useMissionEngine();
  const [selected, setSelected] = useState<Mission | null>(null);

  if (isLoading) return <div className="text-muted-foreground">Loading achievements…</div>;

  const unlockedAt = new Map(achievements.map((a) => [a.mission_id, a.unlocked_at]));
  const unlockedCount = unlockedIds.size;

  const grouped = new Map<MissionCategory, typeof missions>();
  for (const m of missions) {
    const arr = grouped.get(m.category as MissionCategory) ?? [];
    arr.push(m);
    grouped.set(m.category as MissionCategory, arr);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center">
              <Trophy className="size-5 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold">Achievements</h1>
          </div>
          <p className="text-muted-foreground mt-2">Your personal trophy gallery.</p>
        </div>
        <Card className="glass-card px-5 py-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Unlocked</p>
          <p className="text-3xl font-display font-bold text-primary text-glow">
            {unlockedCount} <span className="text-base text-muted-foreground font-normal">/ {missions.length}</span>
          </p>
        </Card>
      </div>

      {Array.from(grouped.entries()).map(([cat, list]) => (
        <section key={cat} className="space-y-4">
          <h2 className="text-xl font-display font-semibold">{categoryLabels[cat]}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {list.map((m) => {
              const unlocked = unlockedIds.has(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className="group flex flex-col items-center text-center gap-2 focus:outline-none"
                >
                  <Badge3D tier={m.tier} icon={m.icon} unlocked={unlocked} size={84} />
                  <span className={`text-xs font-medium leading-tight ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                    {m.badge_name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="glass-card max-w-sm">
          {selected && (
            <>
              <div className="flex justify-center pt-2">
                <Badge3D tier={selected.tier} icon={selected.icon} unlocked={unlockedIds.has(selected.id)} size={120} />
              </div>
              <DialogHeader className="text-center">
                <DialogTitle className="font-display text-2xl text-center">{selected.badge_name}</DialogTitle>
                <DialogDescription className="text-center">{selected.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-t border-border/50 pt-3">
                  <span className="text-muted-foreground">Requirement</span>
                  <span className="font-medium">{selected.target} {selected.category === "total_tasks" ? "tasks" : "days"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">
                    {unlockedIds.has(selected.id)
                      ? `Unlocked ${new Date(unlockedAt.get(selected.id)!).toLocaleDateString()}`
                      : "Locked"}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
