import { Flame, Gem, Crown, Trophy, Sprout, Zap, Shield, Dumbbell, Rocket, Star, BookOpen, CircleCheck, Sparkles, Lock, type LucideIcon } from "lucide-react";
import { tierStyles, type TierKey } from "@/lib/missions";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  flame: Flame,
  gem: Gem,
  crown: Crown,
  trophy: Trophy,
  sprout: Sprout,
  zap: Zap,
  shield: Shield,
  dumbbell: Dumbbell,
  rocket: Rocket,
  star: Star,
  book: BookOpen,
  "circle-check": CircleCheck,
  sparkles: Sparkles,
  galaxy: Sparkles,
};

type Props = {
  tier: string;
  icon: string;
  unlocked: boolean;
  size?: number;
  className?: string;
};

export function Badge3D({ tier, icon, unlocked, size = 96, className }: Props) {
  const style = tierStyles[(tier as TierKey) in tierStyles ? (tier as TierKey) : "bronze"];
  const Icon = icons[icon] ?? Flame;

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center transition-all duration-300",
        unlocked ? "hover:scale-105" : "opacity-40 grayscale",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: unlocked ? style.gradient : "linear-gradient(135deg, #2a2f3a, #1a1d24)",
        boxShadow: unlocked
          ? `${style.glow}, inset 0 2px 6px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(0,0,0,0.45)`
          : "inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -4px 10px rgba(0,0,0,0.4)",
        border: `2px solid ${unlocked ? style.ring : "rgba(120,130,150,0.25)"}`,
      }}
    >
      <div
        className="absolute inset-1 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35), transparent 55%)",
        }}
      />
      {unlocked ? (
        <Icon className="text-white drop-shadow-lg" style={{ width: size * 0.42, height: size * 0.42 }} />
      ) : (
        <Lock className="text-muted-foreground" style={{ width: size * 0.36, height: size * 0.36 }} />
      )}
    </div>
  );
}
