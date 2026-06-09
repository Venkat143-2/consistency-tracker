import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { todayStr, type TaskRow } from "@/lib/consistency";

export function useAllTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async (): Promise<TaskRow[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("task_date", { ascending: false })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as TaskRow[];
    },
  });
}

export function useTodayTasks() {
  const qc = useQueryClient();
  const today = todayStr();
  const query = useQuery({
    queryKey: ["tasks", "today"],
    queryFn: async (): Promise<TaskRow[]> => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) return [];

      const { data: todays, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("task_date", today)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      if (todays && todays.length > 0) return todays as TaskRow[];

      const { data: prev, error: prevErr } = await supabase
        .from("tasks")
        .select("title,task_date,sort_order")
        .lt("task_date", today)
        .order("task_date", { ascending: false })
        .limit(50);
      if (prevErr) throw prevErr;
      if (!prev || prev.length === 0) return [];

      const lastDate = prev[0].task_date;
      const prevDay = prev.filter((r) => r.task_date === lastDate);
      const seen = new Set<string>();
      const titles: { title: string; sort_order: number }[] = [];
      for (const r of prevDay) {
        if (seen.has(r.title)) continue;
        seen.add(r.title);
        titles.push({ title: r.title, sort_order: r.sort_order ?? titles.length });
      }
      if (!titles.length) return [];

      const { data: inserted, error: insErr } = await supabase
        .from("tasks")
        .insert(titles.map((t) => ({ user_id: uid, title: t.title, task_date: today, completed: false, sort_order: t.sort_order })))
        .select();
      if (insErr) throw insErr;
      return (inserted ?? []) as TaskRow[];
    },
  });

  const addTask = useMutation({
    mutationFn: async (title: string) => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user!.id;
      const current = (qc.getQueryData<TaskRow[]>(["tasks", "today"]) ?? []);
      const nextOrder = current.length ? Math.max(...current.map((t) => t.sort_order ?? 0)) + 1 : 0;
      const { error } = await supabase.from("tasks").insert({ user_id: uid, title, task_date: today, sort_order: nextOrder });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { error } = await supabase.from("tasks").update({ title }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const reorderTasks = useMutation({
    mutationFn: async (ordered: TaskRow[]) => {
      // Update each row's sort_order. Run in parallel.
      const updates = ordered.map((t, idx) =>
        supabase.from("tasks").update({ sort_order: idx }).eq("id", t.id)
      );
      const results = await Promise.all(updates);
      const firstErr = results.find((r) => r.error);
      if (firstErr?.error) throw firstErr.error;
    },
    onMutate: async (ordered) => {
      await qc.cancelQueries({ queryKey: ["tasks", "today"] });
      const prev = qc.getQueryData<TaskRow[]>(["tasks", "today"]);
      qc.setQueryData<TaskRow[]>(["tasks", "today"], ordered.map((t, i) => ({ ...t, sort_order: i })));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["tasks", "today"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return { ...query, addTask, updateTask, deleteTask, toggleTask, reorderTasks, today };
}
