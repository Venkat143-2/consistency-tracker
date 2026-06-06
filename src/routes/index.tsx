import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Zap,
  CheckCircle2,
  BarChart3,
  Calendar,
  Flame,
  ArrowRight,
  Github,
  Twitter,
  ListChecks,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Consistency Tracker — Build discipline. Measure progress." },
      {
        name: "description",
        content:
          "A modern habit tracker that helps you build discipline, measure consistency, and visualize progress with a GitHub-style heatmap.",
      },
      { property: "og:title", content: "Consistency Tracker — Build discipline. Measure progress." },
      {
        property: "og:description",
        content: "Build discipline. Measure progress. Track tasks daily and watch your consistency grow.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        navigate({ to: "/dashboard" });
      } else {
        setChecking(false);
      }
    });
  }, [navigate]);

  if (checking) {
    return <div className="min-h-screen" aria-hidden />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundGlow />
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <DashboardMockup />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------- Background ------------------------------- */

function BackgroundGlow() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, oklch(0.82 0.18 175 / 0.35), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] -left-40 size-[600px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.18 230 / 0.4), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 size-[700px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, oklch(0.82 0.18 175 / 0.3), transparent 70%)" }}
      />
    </>
  );
}

/* --------------------------------- Header -------------------------------- */

function Header() {
  return (
    <header className="relative z-10 border-b border-border/40 backdrop-blur-md bg-background/40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center transition-shadow group-hover:shadow-[0_0_24px_-4px_oklch(0.82_0.18_175_/_0.8)]">
            <Zap className="size-4.5 text-primary" />
          </div>
          <span className="font-display font-semibold tracking-tight">Consistency Tracker</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#preview" className="hover:text-foreground transition-colors">Preview</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="shadow-[0_0_24px_-8px_oklch(0.82_0.18_175_/_0.8)]">
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section className="relative z-10 px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary mb-8">
          <Sparkles className="size-3.5" />
          <span>New: GitHub-style consistency heatmap</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
          Build discipline.
          <br />
          <span className="text-primary text-glow">Measure progress.</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
          Track daily tasks, visualize consistency, and turn small wins into lifelong habits. The
          habit tracker built for people who actually finish what they start.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 px-6 text-base font-medium shadow-[0_0_32px_-8px_oklch(0.82_0.18_175_/_0.9)] hover:shadow-[0_0_40px_-4px_oklch(0.82_0.18_175_/_1)] transition-all hover:-translate-y-0.5"
          >
            <Link to="/register">
              Get Started Free <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base font-medium border-border/60 bg-background/40 backdrop-blur hover:bg-background/60">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Free forever. No credit card. Setup in under a minute.
        </p>

        <div className="mt-16">
          <HeatmapPreview />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Heatmap -------------------------------- */

function HeatmapPreview() {
  // 53 weeks x 7 days
  const cells = useMemo(() => {
    const arr: number[] = [];
    let seed = 7;
    for (let i = 0; i < 53 * 7; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const r = seed / 233280;
      // Bias toward recent activity & weekday consistency
      const week = Math.floor(i / 7);
      const dayOfWeek = i % 7;
      const weekend = dayOfWeek === 0 || dayOfWeek === 6 ? 0.35 : 1;
      const recency = 0.4 + (week / 53) * 0.6;
      const v = r * weekend * recency;
      if (v < 0.15) arr.push(0);
      else if (v < 0.3) arr.push(1);
      else if (v < 0.5) arr.push(2);
      else if (v < 0.7) arr.push(3);
      else arr.push(4);
    }
    return arr;
  }, []);

  const levelClass = (lvl: number) => {
    switch (lvl) {
      case 0: return "bg-muted/40";
      case 1: return "bg-primary/20";
      case 2: return "bg-primary/40";
      case 3: return "bg-primary/70";
      default: return "bg-primary shadow-[0_0_6px_oklch(0.82_0.18_175_/_0.6)]";
    }
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-7 shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <div className="text-left">
          <p className="text-sm font-medium">Your year of consistency</p>
          <p className="text-xs text-muted-foreground mt-0.5">342 active days · longest streak 47</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={`size-2.5 rounded-[3px] ${levelClass(l)}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-12 gap-1 text-[10px] text-muted-foreground mb-2 px-1">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {cells.map((lvl, i) => (
              <div
                key={i}
                className={`size-2.5 sm:size-3 rounded-[3px] ${levelClass(lvl)} transition-transform hover:scale-150`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Features ------------------------------- */

function Features() {
  const items = [
    {
      icon: ListChecks,
      title: "Task Tracking",
      desc: "Add daily tasks and check them off. Yesterday's tasks roll forward automatically so you never lose momentum.",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      desc: "Daily, monthly, yearly, and overall consistency — all calculated automatically with clean charts.",
    },
    {
      icon: Calendar,
      title: "Heatmap",
      desc: "GitHub-style contribution grid that turns a year of effort into a single, satisfying picture.",
    },
    {
      icon: Flame,
      title: "Streaks",
      desc: "Watch your current and longest streaks grow. Small wins, compounded into real discipline.",
    },
  ];

  return (
    <section id="features" className="relative z-10 px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Everything you need. Nothing you don't.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A focused toolkit for building habits that stick — without the bloat of a productivity suite.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass-card rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/40 group"
            >
              <div className="size-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center mb-4 transition-shadow group-hover:shadow-[0_0_24px_-4px_oklch(0.82_0.18_175_/_0.8)]">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- How It Works ------------------------------ */

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Add your daily tasks",
      desc: "List the few things that move the needle. We carry them forward each day automatically.",
    },
    {
      num: "02",
      title: "Map them as you go",
      desc: "Tick off what you completed. Daily consistency is calculated the moment you finish.",
    },
    {
      num: "03",
      title: "Watch the streak grow",
      desc: "See your week, month, and year light up. Consistency, finally measurable.",
    },
  ];

  return (
    <section id="how-it-works" className="relative z-10 px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3">
            How it works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Three steps to a sharper you
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div key={s.num} className="relative">
              <div className="glass-card rounded-2xl p-7 h-full">
                <div className="font-display text-5xl font-bold text-primary/30 mb-4">{s.num}</div>
                <h3 className="font-display font-semibold text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight
                  aria-hidden
                  className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 size-5 text-primary/50"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Dashboard Mockup ---------------------------- */

function DashboardMockup() {
  return (
    <section id="preview" className="relative z-10 px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Your dashboard at a glance
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A calm, focused command center for tracking what matters every day.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-3 sm:p-4 shadow-2xl">
          <div className="rounded-xl border border-border/60 bg-background/60 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 h-9 border-b border-border/60 bg-background/40">
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-warning/60" />
              <span className="size-2.5 rounded-full bg-success/60" />
              <span className="ml-3 text-[11px] text-muted-foreground font-mono">
                consistency.app/dashboard
              </span>
            </div>

            <div className="grid grid-cols-12 gap-4 p-5">
              {/* Stats */}
              {[
                { label: "Today", value: "80%", icon: CheckCircle2 },
                { label: "This month", value: "72%", icon: BarChart3 },
                { label: "Current streak", value: "12 days", icon: Flame },
                { label: "Overall", value: "68%", icon: Sparkles },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="col-span-6 lg:col-span-3 rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs uppercase tracking-wider">{label}</span>
                    <Icon className="size-4 text-primary" />
                  </div>
                  <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
                </div>
              ))}

              {/* Task list */}
              <div className="col-span-12 lg:col-span-7 rounded-xl border border-border/60 bg-background/40 p-5">
                <p className="text-sm font-medium mb-4">Today's tasks</p>
                <ul className="space-y-2.5">
                  {[
                    { t: "Morning workout — 30 min", done: true },
                    { t: "Read 20 pages", done: true },
                    { t: "Deep work block — 2 hours", done: true },
                    { t: "Spanish lesson", done: false },
                    { t: "Journal", done: true },
                  ].map((row, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background/40 border border-border/40"
                    >
                      <span
                        className={`size-4 rounded-md border flex items-center justify-center ${
                          row.done
                            ? "bg-primary border-primary"
                            : "border-border/80"
                        }`}
                      >
                        {row.done && (
                          <svg viewBox="0 0 16 16" className="size-3 text-primary-foreground">
                            <path
                              fill="currentColor"
                              d="M13.5 4.5l-7 7-3-3 1-1 2 2 6-6z"
                            />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm ${row.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {row.t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mini chart */}
              <div className="col-span-12 lg:col-span-5 rounded-xl border border-border/60 bg-background/40 p-5">
                <p className="text-sm font-medium mb-4">7-day consistency</p>
                <div className="flex items-end justify-between gap-2 h-32">
                  {[40, 60, 55, 80, 70, 90, 80].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-md bg-gradient-to-t from-primary/40 to-primary"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {["M", "T", "W", "T", "F", "S", "S"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Final CTA ------------------------------ */

function FinalCTA() {
  return (
    <section className="relative z-10 px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="relative glass-card rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{ background: "radial-gradient(circle at center, oklch(0.82 0.18 175 / 0.25), transparent 70%)" }}
          />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight">
              Start your first <span className="text-primary text-glow">streak</span> today.
            </h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Free forever. Your tasks, your data, your discipline.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 px-6 text-base font-medium shadow-[0_0_32px_-8px_oklch(0.82_0.18_175_/_0.9)] hover:shadow-[0_0_40px_-4px_oklch(0.82_0.18_175_/_1)] transition-all hover:-translate-y-0.5"
              >
                <Link to="/register">
                  Get Started Free <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-12 px-6 text-base">
                <Link to="/auth">I already have an account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Footer -------------------------------- */

function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/40 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="size-7 rounded-md bg-primary/15 border border-primary/40 flex items-center justify-center">
            <Zap className="size-3.5 text-primary" />
          </div>
          <span>© {new Date().getFullYear()} Consistency Tracker</span>
        </div>
        <div className="flex items-center gap-5 text-muted-foreground">
          <a href="#" aria-label="GitHub" className="hover:text-primary transition-colors">
            <Github className="size-4" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
            <Twitter className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
