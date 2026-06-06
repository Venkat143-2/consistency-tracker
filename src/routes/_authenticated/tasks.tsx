import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useTodayTasks } from "@/hooks/useTasks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/tasks")({ component: TasksPage });

function TasksPage() {
  const { data: tasks = [], addTask, updateTask, deleteTask, isLoading } = useTodayTasks();
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const t = newTitle.trim();
    if (!t) return;
    if (t.length > 200) return toast.error("Max 200 chars");
    await addTask.mutateAsync(t);
    setNewTitle("");
    toast.success("Task added");
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-4xl font-display font-bold">Tasks</h1>
        <p className="text-muted-foreground mt-2">
          Today's plan. If you didn't add anything, yesterday's tasks were carried over automatically.
        </p>
      </div>

      <Card className="glass-card p-5">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            placeholder="Add a new task — e.g. DSA, Java, Communication Skills"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            maxLength={200}
          />
          <Button type="submit" disabled={addTask.isPending}>
            <Plus className="size-4" /> Add
          </Button>
        </form>
      </Card>

      <div className="space-y-2">
        {isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
        {!isLoading && tasks.length === 0 && (
          <Card className="glass-card p-8 text-center text-muted-foreground">
            No tasks yet. Add your first one above.
          </Card>
        )}
        {tasks.map((t) => (
          <Card key={t.id} className="glass-card p-4 flex items-center gap-3">
            <div className={`size-2 rounded-full ${t.completed ? "bg-primary" : "bg-muted-foreground/40"}`} />
            {editingId === t.id ? (
              <>
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} maxLength={200} className="flex-1" />
                <Button size="icon" variant="ghost" onClick={async () => {
                  if (!editTitle.trim()) return;
                  await updateTask.mutateAsync({ id: t.id, title: editTitle.trim() });
                  setEditingId(null);
                  toast.success("Updated");
                }}><Check className="size-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}><X className="size-4" /></Button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{t.title}</span>
                <Button size="icon" variant="ghost" onClick={() => { setEditingId(t.id); setEditTitle(t.title); }}>
                  <Pencil className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={async () => {
                  await deleteTask.mutateAsync(t.id);
                  toast.success("Deleted");
                }}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
