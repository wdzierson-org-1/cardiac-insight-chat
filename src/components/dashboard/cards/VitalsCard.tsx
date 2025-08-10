import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LineChart, Activity, MoreHorizontal } from "lucide-react";

const VRow = ({ label, value, normal, variant = "good" }: { label: string; value: number; normal: string; variant?: "good" | "warn" }) => {
  const indicatorLeft = variant === "warn" ? "75%" : "55%";
  const badgeClasses =
    (variant === "warn"
      ? "bg-destructive/90 text-destructive-foreground"
      : "bg-[hsl(var(--panel-green))] text-foreground") +
    " rounded-full px-2 py-0.5 text-[10px] md:text-xs font-medium";

  return (
    <div className="rounded-xl border border-[hsl(var(--panel-green))]/40 bg-background/60 p-3">
      <div className="mb-2 flex items-center justify-between text-xs md:text-sm">
        <div className="font-medium truncate">{label}</div>
        <div className="text-muted-foreground truncate">Normal Range {normal}</div>
      </div>
      <div className="relative h-6">
        <div className="absolute inset-0 rounded-full bg-[hsl(var(--panel-gold))]/70" />
        <div className="absolute left-[18%] right-[18%] top-0 bottom-0 rounded-full bg-[hsl(var(--panel-green))]" />
        <div className="absolute inset-y-0" style={{ left: indicatorLeft }}>
          <div className="h-full border-l border-dashed border-muted-foreground" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2">
          <span className={badgeClasses}>
            {variant === "warn" && (label.includes("SpO2") ? "LOW " : "HIGH ")}
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

export const VitalsCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4" data-card-title>
      <CardHeader className="rounded-t-2xl bg-[hsl(var(--panel-blue))] text-[hsl(var(--panel-foreground))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" aria-hidden />
            <CardTitle className="text-base md:text-lg">Vitals</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-[hsl(var(--panel-foreground))]/90 hover:bg-white/10" aria-label="More">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Results</span>
          <Button variant="outline" size="sm" className="h-7 px-2 uppercase tracking-wide bg-[hsl(var(--panel-blue))]/10 text-[hsl(var(--panel-blue))] border-[hsl(var(--panel-blue))]/30 hover:bg-[hsl(var(--panel-blue))]/15">
            <LineChart className="h-3.5 w-3.5 mr-1" /> Compare result trends
          </Button>
        </div>
        <VRow label="Weight" value={202} normal="160-180 lbs" variant="warn" />
        <VRow label="BMI" value={34} normal="18.5 - 24.9" variant="warn" />
        <VRow label="SpO2" value={89} normal=">= 94%" variant="warn" />
        <VRow label="BPM" value={122} normal="60 - 80 bpm" variant="warn" />
        <VRow label="BP Systolic" value={172} normal="< 130" variant="warn" />
        <VRow label="BP Diastolic" value={93} normal="< 80" variant="warn" />
      </CardContent>
    </Card>
  );
};
