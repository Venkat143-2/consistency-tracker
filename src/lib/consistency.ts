export type TaskRow = {
  id: string;
  user_id: string;
  title: string;
  task_date: string; // YYYY-MM-DD
  completed: boolean;
  created_at: string;
};

export function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dailyPct(tasks: TaskRow[]): number {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.completed).length;
  return Math.round((done / tasks.length) * 100);
}

/** Group tasks by date and compute per-day completion %. */
export function dailyMap(tasks: TaskRow[]): Map<string, number> {
  const byDate = new Map<string, TaskRow[]>();
  for (const t of tasks) {
    const arr = byDate.get(t.task_date) ?? [];
    arr.push(t);
    byDate.set(t.task_date, arr);
  }
  const out = new Map<string, number>();
  for (const [date, list] of byDate) out.set(date, dailyPct(list));
  return out;
}

export function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export function inMonth(dateStr: string, ref = new Date()): boolean {
  const d = new Date(dateStr + "T00:00:00");
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function inYear(dateStr: string, ref = new Date()): boolean {
  return new Date(dateStr + "T00:00:00").getFullYear() === ref.getFullYear();
}
