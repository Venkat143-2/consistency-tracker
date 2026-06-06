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
        .order("created_at", { ascending: true });
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
        .order("created_at", { ascending: true });
      if (error) throw error;
      if (todays && todays.length > 0) return todays as TaskRow[];

      // Auto-load yesterday's task titles as today's tasks (uncompleted)
      const { data: prev, error: prevErr } = await supabase
        .from("tasks")
        .select("title,task_date")
        .lt("task_date", today)
        .order("task_date", { ascending: false })
        .limit(50);
      if (prevErr) throw prevErr;
      if (!prev || prev.length === 0) return [];

      const lastDate = prev[0].task_date;
      const titles = Array.from(new Set(prev.filter((r) => r.task_date === lastDate).map((r) => r.title)));
      if (!titles.length) return [];

      const { data: inserted, error: insErr } = await supabase
        .from("tasks")
        .insert(titles.map((title) => ({ user_id: uid, title, task_date: today, completed: false })))
        .select();
      if (insErr) throw insErr;
      return (inserted ?? []) as TaskRow[];
    },
  });

  const addTask = useMutation({
    mutationFn: async (title: string) => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user!.id;
      const { error } = await supabase.from("tasks").insert({ user_id: uid, title, task_date: today });
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

  return { ...query, addTask, updateTask, deleteTask, toggleTask, today };
}
