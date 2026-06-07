import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAllTasks } from "@/hooks/useTasks";
import { computeStats, progressFor, type Mission, type Achievement } from "@/lib/missions";

export function useMissions() {
  return useQuery({
    queryKey: ["missions"],
    queryFn: async (): Promise<Mission[]> => {
      const { data, error } = await supabase
        .from("missions" as any)
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Mission[];
    },
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: async (): Promise<Achievement[]> => {
      const { data, error } = await supabase
        .from("achievements" as any)
        .select("*")
        .order("unlocked_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Achievement[];
    },
  });
}

/** Auto-unlock missions whose progress has hit the target. */
export function useMissionEngine() {
  const tasks = useAllTasks();
  const missions = useMissions();
  const achievements = useAchievements();
  const qc = useQueryClient();

  const stats = computeStats(tasks.data ?? []);
  const unlockedIds = new Set((achievements.data ?? []).map((a) => a.mission_id));

  useEffect(() => {
    if (!missions.data || !achievements.data || !tasks.data) return;
    const toUnlock = missions.data.filter(
      (m) => !unlockedIds.has(m.id) && progressFor(m, stats) >= m.target,
    );
    if (toUnlock.length === 0) return;

    (async () => {
      for (const m of toUnlock) {
        const { error } = await supabase.rpc("claim_achievement" as any, {
          _mission_id: m.id,
        });
        if (error) {
          // Server rejected (requirements not actually met) — stop trying
          console.warn("claim_achievement failed", m.key, error.message);
        }
      }
      qc.invalidateQueries({ queryKey: ["achievements"] });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missions.data, achievements.data, tasks.data]);

  return {
    missions: missions.data ?? [],
    achievements: achievements.data ?? [],
    stats,
    unlockedIds,
    isLoading: missions.isLoading || achievements.isLoading || tasks.isLoading,
  };
}
