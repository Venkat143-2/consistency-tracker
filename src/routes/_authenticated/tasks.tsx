import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTodayTasks } from "@/hooks/useTasks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Check, X, GripVertical } from "lucide-react";
import type { TaskRow } from "@/lib/consistency";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/_authenticated/tasks")({ component: TasksPage });

function TasksPage() {
  const { data: serverTasks = [], addTask, updateTask, deleteTask, reorderTasks, isLoading } = useTodayTasks();
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [items, setItems] = useState<TaskRow[]>(serverTasks);

  useEffect(() => {
    setItems(serverTasks);
  }, [serverTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const t = newTitle.trim();
    if (!t) return;
    if (t.length > 200) return toast.error("Max 200 chars");
    await addTask.mutateAsync(t);
    setNewTitle("");
    toast.success("Task added");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((t) => t.id === active.id);
    const newIndex = items.findIndex((t) => t.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    reorderTasks.mutate(next);
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-4xl font-display font-bold">Tasks</h1>
        <p className="text-muted-foreground mt-2">
          Today's plan. Drag tasks to reorder — your custom order is saved automatically.
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
        {!isLoading && items.length === 0 && (
          <Card className="glass-card p-8 text-center text-muted-foreground">
            No tasks yet. Add your first one above.
          </Card>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={items.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {items.map((t) => (
              <SortableTaskRow
                key={t.id}
                task={t}
                isEditing={editingId === t.id}
                editTitle={editTitle}
                onEditChange={setEditTitle}
                onStartEdit={() => { setEditingId(t.id); setEditTitle(t.title); }}
                onCancelEdit={() => setEditingId(null)}
                onSaveEdit={async () => {
                  if (!editTitle.trim()) return;
                  await updateTask.mutateAsync({ id: t.id, title: editTitle.trim() });
                  setEditingId(null);
                  toast.success("Updated");
                }}
                onDelete={async () => {
                  await deleteTask.mutateAsync(t.id);
                  toast.success("Deleted");
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function SortableTaskRow({
  task,
  isEditing,
  editTitle,
  onEditChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: {
  task: TaskRow;
  isEditing: boolean;
  editTitle: string;
  onEditChange: (v: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {isOver && !isDragging && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]" />
      )}
      <Card
        className={`glass-card p-4 flex items-center gap-2 transition-shadow ${
          isDragging ? "shadow-2xl ring-1 ring-primary/40 opacity-90" : ""
        }`}
      >
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="touch-none text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/40 transition-colors"
        >
          <GripVertical className="size-4" />
        </button>
        <div className={`size-2 rounded-full ${task.completed ? "bg-primary" : "bg-muted-foreground/40"}`} />
        {isEditing ? (
          <>
            <Input value={editTitle} onChange={(e) => onEditChange(e.target.value)} maxLength={200} className="flex-1" />
            <Button size="icon" variant="ghost" onClick={onSaveEdit}><Check className="size-4" /></Button>
            <Button size="icon" variant="ghost" onClick={onCancelEdit}><X className="size-4" /></Button>
          </>
        ) : (
          <>
            <span className="flex-1 font-medium">{task.title}</span>
            <Button size="icon" variant="ghost" onClick={onStartEdit}>
              <Pencil className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onDelete}>
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
