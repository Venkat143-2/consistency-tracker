import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Decorative radial gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[640px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, oklch(0.82 0.18 175 / 0.35), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 size-[520px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.18 230 / 0.4), transparent 70%)" }}
      />

      <div className="relative w-full max-w-[420px]">
        <Link
          to="/"
          className="group flex flex-col items-center mb-10 transition-transform hover:scale-[1.02]"
        >
          <div className="size-12 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center mb-4 shadow-[0_0_32px_-8px_oklch(0.82_0.18_175_/_0.6)] transition-shadow group-hover:shadow-[0_0_40px_-4px_oklch(0.82_0.18_175_/_0.8)]">
            <Zap className="size-6 text-primary" />
          </div>
          <span className="text-sm font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
            Consistency Tracker
          </span>
        </Link>

        <div className="glass-card rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="mb-8 space-y-2">
            <h1 className="text-2xl sm:text-[28px] font-display font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
            )}
          </div>

          {children}
        </div>

        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-8">{footer}</p>
        )}
      </div>
    </div>
  );
}
