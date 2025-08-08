import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Header = () => {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat(undefined, {
    year: "numeric", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).format(now);

  return (
    <header className={cn("sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b")}
      aria-label="Appointment Dashboard Header">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold" data-card-title>
            Appointment Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">{formatted}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">New Tile</Button>
          <Button variant="outline">Clean up board</Button>
        </div>
      </div>
    </header>
  );
};
