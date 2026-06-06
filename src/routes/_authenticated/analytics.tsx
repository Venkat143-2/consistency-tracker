import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAllTasks, useTodayTasks } from "@/hooks/useTasks";
import { dailyMap, dailyPct, inMonth, inYear } from "@/lib/consistency";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/analytics")({ component: AnalyticsPage });

function pctColor(pct: number | undefined) {
  if (pct === undefined) return "oklch(0.26 0.04 235)";
  if (pct === 0) return "oklch(0.26 0.04 235)";
  if (pct < 34) return "oklch(0.45 0.12 165)";
  if (pct < 67) return "oklch(0.6 0.16 165)";
  if (pct < 100) return "oklch(0.72 0.18 165)";
  return "oklch(0.82 0.2 165)";
}

function AnalyticsPage() {
  const { data: today = [] } = useTodayTasks();
  const { data: all = [] } = useAllTasks();

  const completed = today.filter((t) => t.completed).length;
  const pending = today.length - completed;
  const dailyPctNow = dailyPct(today);

  const map = dailyMap(all);
  const monthVals: number[] = [], yearVals: number[] = [];
  for (const [date, pct] of map) {
    if (inMonth(date)) monthVals.push(pct);
    if (inYear(date)) yearVals.push(pct);
  }
  const monthly = monthVals.length ? Math.round(monthVals.reduce((a, b) => a + b, 0) / monthVals.length) : 0;
  const yearly = yearVals.length ? Math.round(yearVals.reduce((a, b) => a + b, 0) / yearVals.length) : 0;

  // Chart: chronological daily %
  const chartData = useMemo(() => {
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, pct]) => ({ date: date.slice(5), pct }));
  }, [map]);

  // Heatmap: last ~17 weeks
  const heatmap = useMemo(() => {
    const days: { date: string; pct: number | undefined }[] = [];
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 17 * 7 + 1);
    // align to Monday
    const dow = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - dow);
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const ds = d.toISOString().slice(0, 10);
      days.push({ date: ds, pct: map.get(ds) });
    }
    // group into weeks of 7
    const weeks: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    return weeks;
  }, [map]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-display font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">Your consistency at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Completed Today" value={completed} />
        <Stat label="Pending Today" value={pending} />
        <Stat label="Today" value={`${dailyPctNow}%`} accent />
        <Stat label="Month" value={`${monthly}%`} />
        <Stat label="Year" value={`${yearly}%`} />
      </div>

      <Card className="glass-card p-6">
        <h2 className="font-display font-semibold mb-4">Consistency over time</h2>
        <div className="h-72">
          {chartData.length === 0 ? (
            <p className="text-muted-foreground text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid stroke="oklch(0.3 0.04 235)" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="oklch(0.7 0.03 200)" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="oklch(0.7 0.03 200)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.045 235)", border: "1px solid oklch(0.4 0.05 200 / 0.3)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="pct" stroke="oklch(0.82 0.18 175)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.82 0.18 175)" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="glass-card p-6">
        <h2 className="font-display font-semibold mb-4">Contribution heatmap</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-[3px]">
            {heatmap.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((d) => (
                  <div
                    key={d.date}
                    title={`${d.date} · ${d.pct ?? 0}%`}
                    className="size-3 rounded-[3px] border border-border/30"
                    style={{ background: pctColor(d.pct) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          {[undefined, 20, 50, 80, 100].map((v, i) => (
            <div key={i} className="size-3 rounded-[3px]" style={{ background: pctColor(v) }} />
          ))}
          <span>More</span>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <Card className="glass-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-display font-bold ${accent ? "text-primary text-glow" : ""}`}>{value}</p>
    </Card>
  );
}
