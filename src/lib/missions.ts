import { dailyMap, type TaskRow, todayStr } from "./consistency";

export type MissionCategory = "login_streak" | "task_streak" | "total_tasks" | "consistency";

export type Mission = {
  id: string;
  key: string;
  title: string;
  description: string;
  category: MissionCategory;
  target: number;
  badge_name: string;
  tier: string;
  icon: string;
  sort_order: number;
};

export type Achievement = {
  id: string;
  user_id: string;
  mission_id: string;
  badge_name: string;
  unlocked_at: string;
};

function addDays(d: Date, n: number): Date {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export type ProgressStats = {
  totalCompleted: number;
  loginStreak: number;
  taskStreak: number;
  consistencyStreak: number;
  hit100Once: number;
};

export function computeStats(tasks: TaskRow[]): ProgressStats {
  const totalCompleted = tasks.filter((t) => t.completed).length;

  // Days with at least one completed task
  const daysWithCompleted = new Set<string>();
  for (const t of tasks) if (t.completed) daysWithCompleted.add(t.task_date);

  // Days with 100% completion
  const perDay = dailyMap(tasks);
  const perfectDays = new Set<string>();
  for (const [date, pct] of perDay) if (pct === 100) perfectDays.add(date);

  const today = new Date(todayStr() + "T00:00:00");

  // Login streak: consecutive days ending today or yesterday
  let loginStreak = 0;
  let cursor = daysWithCompleted.has(fmt(today)) ? today : addDays(today, -1);
  while (daysWithCompleted.has(fmt(cursor))) {
    loginStreak++;
    cursor = addDays(cursor, -1);
  }

  // Task / consistency streak: consecutive perfect days
  let taskStreak = 0;
  cursor = perfectDays.has(fmt(today)) ? today : addDays(today, -1);
  while (perfectDays.has(fmt(cursor))) {
    taskStreak++;
    cursor = addDays(cursor, -1);
  }

  return {
    totalCompleted,
    loginStreak,
    taskStreak,
    consistencyStreak: taskStreak,
    hit100Once: perfectDays.size > 0 ? 1 : 0,
  };
}

export function progressFor(mission: Mission, stats: ProgressStats): number {
  switch (mission.category) {
    case "login_streak":
      return Math.min(stats.loginStreak, mission.target);
    case "task_streak":
      return Math.min(stats.taskStreak, mission.target);
    case "total_tasks":
      return Math.min(stats.totalCompleted, mission.target);
    case "consistency":
      if (mission.key === "cons_once") return stats.hit100Once;
      return Math.min(stats.consistencyStreak, mission.target);
  }
}

export type TierKey = "bronze" | "silver" | "gold" | "diamond" | "legendary" | "champion";

export const tierStyles: Record<TierKey, { gradient: string; ring: string; glow: string; label: string }> = {
  bronze: {
    gradient: "linear-gradient(135deg, #b06b2a, #7a3f12)",
    ring: "rgba(255,140,60,0.55)",
    glow: "0 0 24px rgba(255,140,60,0.45)",
    label: "Bronze",
  },
  silver: {
    gradient: "linear-gradient(135deg, #d8dde6, #8a93a6)",
    ring: "rgba(220,230,245,0.6)",
    glow: "0 0 24px rgba(220,230,245,0.45)",
    label: "Silver",
  },
  gold: {
    gradient: "linear-gradient(135deg, #f5d061, #b8860b)",
    ring: "rgba(255,215,80,0.6)",
    glow: "0 0 28px rgba(255,215,80,0.5)",
    label: "Gold",
  },
  diamond: {
    gradient: "linear-gradient(135deg, #6ee7ff, #2563eb)",
    ring: "rgba(110,231,255,0.6)",
    glow: "0 0 28px rgba(110,231,255,0.55)",
    label: "Diamond",
  },
  legendary: {
    gradient: "linear-gradient(135deg, #a855f7, #f59e0b)",
    ring: "rgba(245,158,11,0.6)",
    glow: "0 0 32px rgba(168,85,247,0.55)",
    label: "Legendary",
  },
  champion: {
    gradient: "linear-gradient(135deg, #10b981, #facc15)",
    ring: "rgba(250,204,21,0.6)",
    glow: "0 0 32px rgba(16,185,129,0.55)",
    label: "Champion",
  },
};

export const categoryLabels: Record<MissionCategory, string> = {
  login_streak: "Login Streak",
  task_streak: "Task Streak",
  total_tasks: "Total Tasks",
  consistency: "Consistency",
};
