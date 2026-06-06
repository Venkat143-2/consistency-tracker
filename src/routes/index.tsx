import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  Trophy,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Consistency Tracker — Consistency matters." },
      {
        name: "description",
        content:
          "Build better habits, stay accountable, and create a life driven by steady progress. The habit tracker for people who finish what they start.",
      },
      { property: "og:title", content: "Consistency Tracker — Consistency matters." },
      {
        property: "og:description",
        content: "Small actions transform average into excellence. Build discipline, track growth, and turn consistency into a lifestyle.",
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
        <ProductShowcase />
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
          <a href="#showcase" className="hover:text-foreground transition-colors">Product</a>
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary mb-8 uppercase tracking-[0.2em]">
          <Sparkles className="size-3.5" />
          <span>Consistency Tracker</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
          <span className="text-primary text-glow">Consistency</span> matters.
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
          Small actions transform average into excellence. Build better habits, stay accountable,
          and create a life driven by steady progress. Every day you show up becomes part of your
          success story.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 px-6 text-base font-medium shadow-[0_0_32px_-8px_oklch(0.82_0.18_175_/_0.9)] hover:shadow-[0_0_40px_-4px_oklch(0.82_0.18_175_/_1)] transition-all hover:-translate-y-0.5"
          >
            <Link to="/register">
              Get Started <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base font-medium border-border/60 bg-background/40 backdrop-blur hover:bg-background/60">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>

        <div className="mt-20">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Hero Illustration --------------------------- */

function HeroIllustration() {
  return (
    <div className="relative mx-auto h-[460px] sm:h-[520px] max-w-4xl">
      {/* Soft backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[2rem] blur-2xl opacity-60"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.82 0.18 175 / 0.22), transparent 70%)" }}
      />

      {/* Center: Progress Circle */}
      <FloatCard className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center" delay="0s">
        <ProgressRing value={78} />
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Today</p>
      </FloatCard>

      {/* Top-left: Achievement Badge */}
      <FloatCard className="left-0 top-4 w-44 rounded-2xl p-4 hidden sm:block" delay="-2s">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center shadow-[0_0_24px_-4px_oklch(0.82_0.18_175_/_0.8)]">
            <Trophy className="size-5 text-background" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Unlocked</p>
            <p className="font-display text-sm font-semibold">7-Day Streak</p>
          </div>
        </div>
      </FloatCard>

      {/* Top-right: Mission Card */}
      <FloatCard className="right-0 top-0 w-48 rounded-2xl p-4 hidden sm:block" delay="-4s">
        <div className="flex items-center gap-2 mb-2">
          <Target className="size-4 text-primary" />
          <p className="text-xs font-medium">Active Mission</p>
        </div>
        <p className="font-display text-sm font-semibold mb-2">30 Day Discipline</p>
        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
          <div className="h-full w-[60%] bg-gradient-to-r from-primary/60 to-primary rounded-full" />
        </div>
        <p className="mt-1.5 text-[10px] text-muted-foreground">18 / 30 days</p>
      </FloatCard>

      {/* Bottom-left: Task Checklist */}
      <FloatCard className="left-2 bottom-2 w-52 rounded-2xl p-4 hidden sm:block" delay="-1s">
        <p className="text-xs font-medium mb-3">Today's focus</p>
        <ul className="space-y-2">
          {[{ t: "Morning workout", d: true }, { t: "Deep work · 2h", d: true }, { t: "Read 20 pages", d: false }].map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={`size-3.5 rounded-md border flex items-center justify-center ${r.d ? "bg-primary border-primary" : "border-border/80"}`}>
                {r.d && <CheckCircle2 className="size-2.5 text-background" strokeWidth={3} />}
              </span>
              <span className={`text-xs ${r.d ? "text-muted-foreground line-through" : "text-foreground"}`}>{r.t}</span>
            </li>
          ))}
        </ul>
      </FloatCard>

      {/* Bottom-right: Analytics Graph */}
      <FloatCard className="right-2 bottom-12 w-48 rounded-2xl p-4 hidden sm:block" delay="-3s">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium">Weekly</p>
          <TrendingUp className="size-3.5 text-primary" />
        </div>
        <div className="flex items-end gap-1.5 h-16">
          {[40, 65, 50, 80, 70, 90, 85].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${h}%` }} />
          ))}
        </div>
      </FloatCard>

      {/* Top-center floating: Calendar */}
      <FloatCard className="left-1/2 -translate-x-1/2 top-0 w-40 rounded-2xl p-3 hidden md:block" delay="-5s">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="size-3.5 text-primary" />
          <p className="text-[11px] font-medium">June 2026</p>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className={`size-3 rounded-[3px] ${i % 3 === 0 ? "bg-primary" : i % 4 === 0 ? "bg-primary/50" : "bg-muted/40"}`} />
          ))}
        </div>
      </FloatCard>

      {/* Bottom-center floating: Streak */}
      <FloatCard className="left-1/2 -translate-x-1/2 bottom-0 w-44 rounded-2xl p-3 hidden md:flex items-center gap-3" delay="-2.5s">
        <div className="size-10 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center">
          <Flame className="size-5 text-primary" />
        </div>
        <div>
          <p className="font-display text-xl font-bold leading-none">47</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Day streak</p>
        </div>
      </FloatCard>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-10px) }
        }
        @keyframes float-center {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) }
          50% { transform: translate(-50%, -50%) translateY(-8px) }
        }
        @keyframes float-x {
          0%, 100% { transform: translateX(-50%) translateY(0) }
          50% { transform: translateX(-50%) translateY(-10px) }
        }
      `}</style>
    </div>
  );
}

function FloatCard({
  children,
  className = "",
  delay = "0s",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}) {
  const isCenter = className.includes("-translate-x-1/2") && className.includes("-translate-y-1/2");
  const isXOnly = className.includes("-translate-x-1/2") && !className.includes("-translate-y-1/2");
  const animName = isCenter ? "float-center" : isXOnly ? "float-x" : "float-slow";

  return (
    <div
      className={`absolute glass-card shadow-2xl ${className}`}
      style={{
        animation: `${animName} 6s ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      {children}
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 72;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative size-44 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="oklch(0.3 0.02 240 / 0.4)" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="oklch(0.82 0.18 175)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 0 8px oklch(0.82 0.18 175 / 0.6))" }}
        />
      </svg>
      <div className="text-center">
        <p className="font-display text-5xl font-bold text-primary text-glow">{value}%</p>
      </div>
    </div>
  );
}

/* -------------------------------- Features ------------------------------- */

function Features() {
  const items = [
    {
      icon: ListChecks,
      title: "Smart Task Management",
      desc: "Create, organize, and complete your daily goals with a simple and distraction-free workflow.",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      desc: "Understand your growth through daily, monthly, yearly, and overall insights with beautiful visual reports.",
    },
    {
      icon: Award,
      title: "Achievement System",
      desc: "Unlock beautifully designed badges as you complete missions and build long-term discipline.",
    },
    {
      icon: Target,
      title: "Mission Challenges",
      desc: "Complete daily and long-term challenges that encourage consistency and reward commitment.",
    },
    {
      icon: Flame,
      title: "Streak Tracking",
      desc: "Build momentum one day at a time and watch your current and longest streaks grow.",
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
            A focused ecosystem for building discipline, tracking growth, and turning consistency
            into a lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      title: "Plan your day.",
      desc: "Create the few tasks that truly matter.",
    },
    {
      num: "02",
      title: "Take action.",
      desc: "Complete tasks and build momentum throughout the day.",
    },
    {
      num: "03",
      title: "Grow through consistency.",
      desc: "Watch your progress, streaks, achievements, and discipline evolve over time.",
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
            Three simple steps.
            <br />
            <span className="text-primary text-glow">A lifetime of progress.</span>
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

/* --------------------------- Product Showcase ---------------------------- */

function ProductShowcase() {
  const cards = [
    {
      icon: Target,
      emoji: "🎯",
      title: "Missions",
      desc: "Stay motivated with meaningful challenges.",
    },
    {
      icon: Trophy,
      emoji: "🏆",
      title: "Achievements",
      desc: "Unlock premium badges that celebrate your journey.",
    },
    {
      icon: BarChart3,
      emoji: "📈",
      title: "Analytics",
      desc: "See your growth through beautiful insights.",
    },
    {
      icon: CheckCircle2,
      emoji: "✅",
      title: "Daily Focus",
      desc: "Keep your attention on what matters most.",
    },
  ];

  return (
    <section id="showcase" className="relative z-10 px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Designed for people who <span className="text-primary text-glow">finish what they start.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map(({ icon: Icon, emoji, title, desc }) => (
            <div
              key={title}
              className="group glass-card rounded-3xl p-8 sm:p-10 transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_20px_60px_-20px_oklch(0.82_0.18_175_/_0.4)] relative overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute -top-20 -right-20 size-60 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle, oklch(0.82 0.18 175 / 0.5), transparent 70%)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-2xl transition-all group-hover:scale-110 group-hover:shadow-[0_0_32px_-4px_oklch(0.82_0.18_175_/_0.8)]">
                    <span aria-hidden>{emoji}</span>
                    <Icon className="size-6 text-primary sr-only" />
                  </div>
                  <h3 className="font-display font-semibold text-2xl">{title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">{desc}</p>
              </div>
            </div>
          ))}
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
                  Get Started <ArrowRight className="size-4" />
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
