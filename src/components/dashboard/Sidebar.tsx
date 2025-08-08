import { Home, MessageSquare, Activity, Stethoscope, Users, HeartPulse, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NavIcon = ({ icon: Icon, active = false, label }: { icon: any; active?: boolean; label: string }) => (
  <button
    aria-label={label}
    className={cn(
      "flex items-center justify-center h-12 w-12 rounded-xl border transition-transform",
      "border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
      active && "bg-sidebar-accent"
    )}
  >
    <Icon className="h-5 w-5" />
  </button>
);

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:flex-col gap-3 p-3 w-16 sticky top-0 h-screen border-r bg-sidebar text-sidebar-foreground">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
          PCP
        </div>
      </div>
      <nav className="mt-2 flex flex-col items-center gap-3">
        <NavIcon icon={Home} label="Home" active />
        <NavIcon icon={MessageSquare} label="Messages" />
        <NavIcon icon={Activity} label="Activity" />
        <NavIcon icon={Stethoscope} label="Clinical" />
        <NavIcon icon={Users} label="Patients" />
        <NavIcon icon={HeartPulse} label="Cardiology" />
      </nav>
      <div className="mt-auto flex flex-col items-center gap-3">
        <NavIcon icon={Settings} label="Settings" />
      </div>
    </aside>
  );
};
