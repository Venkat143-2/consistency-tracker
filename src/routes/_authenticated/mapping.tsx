import { createFileRoute } from "@tanstack/react-router";
import { useTodayTasks } from "@/hooks/useTasks";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { dailyPct } from "@/lib/consistency";

export const Route = createFileRoute("/_authenticated/mapping")({ component: MappingPage });

function MappingPage() {
  const { data: tasks = [], toggleTask, isLoading } = useTodayTasks();
  const completed = tasks.filter((t) => t.completed);
  const pending = tasks.filter((t) => !t.completed);
  const pct = dailyPct(tasks);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold">Mapping</h1>
          <p className="text-muted-foreground mt-2">Tick what you've done. Consistency updates instantly.</p>
        </div>
        <div className="glass-card rounded-xl px-5 py-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Today</p>
          <p className="text-3xl font-display font-bold text-primary text-glow">{pct}%</p>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
      {!isLoading && tasks.length === 0 && (
        <Card className="glass-card p-8 text-center text-muted-foreground">
          No tasks for today. Add some in Tasks.
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Pending" tasks={pending} onToggle={(id) => toggleTask.mutate({ id, completed: true })} />
        <Section title="Completed" tasks={completed} done onToggle={(id) => toggleTask.mutate({ id, completed: false })} />
      </div>
    </div>
  );
}

function Section({ title, tasks, done, onToggle }: { title: string; tasks: { id: string; title: string; completed: boolean }[]; done?: boolean; onToggle: (id: string) => void }) {
  return (
    <div>
      <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">{title} · {tasks.length}</h2>
      <div className="space-y-2">
        {tasks.length === 0 && <p className="text-sm text-muted-foreground italic">Nothing here.</p>}
        {tasks.map((t) => (
          <Card key={t.id} className="glass-card p-4 flex items-center gap-3">
            <Checkbox checked={t.completed} onCheckedChange={() => onToggle(t.id)} />
            <span className={`flex-1 ${done ? "line-through text-muted-foreground" : "font-medium"}`}>{t.title}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
