import { Home, MessageSquare, Activity, Stethoscope, Users, HeartPulse, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const colorVariants = {
  blue: {
    text: "text-[hsl(var(--nav-blue))]",
    hoverBg: "hover:bg-[hsl(var(--nav-blue))]/10",
    border: "border-[hsl(var(--nav-blue))]/20",
    ring: "hover:ring-[hsl(var(--nav-blue))]",
    active: "bg-[hsl(var(--nav-blue))]/10 ring-1 ring-[hsl(var(--nav-blue))]/50",
  },
  teal: {
    text: "text-[hsl(var(--nav-teal))]",
    hoverBg: "hover:bg-[hsl(var(--nav-teal))]/10",
    border: "border-[hsl(var(--nav-teal))]/20",
    ring: "hover:ring-[hsl(var(--nav-teal))]",
    active: "bg-[hsl(var(--nav-teal))]/10 ring-1 ring-[hsl(var(--nav-teal))]/50",
  },
  green: {
    text: "text-[hsl(var(--nav-green))]",
    hoverBg: "hover:bg-[hsl(var(--nav-green))]/10",
    border: "border-[hsl(var(--nav-green))]/20",
    ring: "hover:ring-[hsl(var(--nav-green))]",
    active: "bg-[hsl(var(--nav-green))]/10 ring-1 ring-[hsl(var(--nav-green))]/50",
  },
  pink: {
    text: "text-[hsl(var(--nav-pink))]",
    hoverBg: "hover:bg-[hsl(var(--nav-pink))]/10",
    border: "border-[hsl(var(--nav-pink))]/20",
    ring: "hover:ring-[hsl(var(--nav-pink))]",
    active: "bg-[hsl(var(--nav-pink))]/10 ring-1 ring-[hsl(var(--nav-pink))]/50",
  },
  purple: {
    text: "text-[hsl(var(--nav-purple))]",
    hoverBg: "hover:bg-[hsl(var(--nav-purple))]/10",
    border: "border-[hsl(var(--nav-purple))]/20",
    ring: "hover:ring-[hsl(var(--nav-purple))]",
    active: "bg-[hsl(var(--nav-purple))]/10 ring-1 ring-[hsl(var(--nav-purple))]/50",
  },
} as const;

type VariantKey = keyof typeof colorVariants;

const NavIcon = ({ icon: Icon, active = false, label, variant }: { icon: any; active?: boolean; label: string; variant: VariantKey }) => {
  const v = colorVariants[variant];
  return (
    <button
      aria-label={label}
      className={cn(
        "flex items-center justify-center h-12 w-12 rounded-xl border shadow-sm transition-colors",
        v.border, v.text, v.hoverBg, v.ring, active && v.active
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col gap-3 p-3 w-16 sticky top-0 h-screen border-r bg-sidebar text-sidebar-foreground">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] shadow flex items-center justify-center text-primary-foreground font-bold">
          PCP
        </div>
      </div>
      <nav className="mt-2 flex flex-col items-center gap-3">
        <NavIcon icon={Home} label="Home" active variant="blue" />
        <NavIcon icon={MessageSquare} label="Messages" variant="teal" />
        <NavIcon icon={Activity} label="Activity" variant="purple" />
        <NavIcon icon={Stethoscope} label="Clinical" variant="green" />
        <NavIcon icon={Users} label="Patients" variant="pink" />
        <NavIcon icon={HeartPulse} label="Cardiology" variant="purple" />
      </nav>
      <div className="mt-auto flex flex-col items-center gap-3">
        <NavIcon icon={Settings} label="Settings" variant="blue" />
      </div>
    </aside>
  );
};
