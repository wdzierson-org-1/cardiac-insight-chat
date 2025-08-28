import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LineChart, FlaskConical, MoreHorizontal, TrendingUp } from "lucide-react";

const Row = ({ label, value, normal, variant = "good" }: { label: string; value: number; normal: string; variant?: "good" | "warn" }) => {
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
            {variant === "warn" ? "HIGH " : ""}
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

const TrendMiniChart = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  const trendColors = {
    up: "text-destructive",
    down: "text-[hsl(var(--panel-green))]",
    stable: "text-muted-foreground"
  };
  
  return (
    <div className={`flex items-center gap-1 text-xs ${trendColors[trend]}`}>
      <TrendingUp className={`h-3 w-3 ${trend === "down" ? "rotate-180" : trend === "stable" ? "rotate-90" : ""}`} />
      <span className="capitalize">{trend}</span>
    </div>
  );
};

export const EnhancedLipidPanelCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 transition-all duration-500" data-card-title>
      <CardHeader className="rounded-t-2xl bg-[hsl(var(--panel-blue))] text-[hsl(var(--panel-foreground))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" aria-hidden />
            <CardTitle className="text-base md:text-lg">Lipid Panel</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-[hsl(var(--panel-foreground))]/90 hover:bg-white/10" aria-label="More">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Results with 12-month trends</span>
          <Button variant="outline" size="sm" className="h-7 px-2 uppercase tracking-wide bg-[hsl(var(--panel-blue))]/10 text-[hsl(var(--panel-blue))] border-[hsl(var(--panel-blue))]/30 hover:bg-[hsl(var(--panel-blue))]/15">
            <LineChart className="h-3.5 w-3.5 mr-1" /> Compare result trends
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Row label="Cholesterol" value={192} normal="100-199 mg/dL" variant="warn" />
            <TrendMiniChart trend="up" />
          </div>
          
          <div className="flex items-center justify-between">
            <Row label="Triglycerides" value={163} normal="0-149 mg/dL" variant="warn" />
            <TrendMiniChart trend="up" />
          </div>
          
          <div className="flex items-center justify-between">
            <Row label="HDL Cholesterol" value={67} normal=">39 mg/dL" variant="good" />
            <TrendMiniChart trend="stable" />
          </div>
          
          <div className="flex items-center justify-between">
            <Row label="VLDLc Calc" value={28} normal="5-40 mg/dL" variant="good" />
            <TrendMiniChart trend="down" />
          </div>
          
          <div className="flex items-center justify-between">
            <Row label="LDLc Calc (NIH)" value={97} normal="0-99 mg/dL" variant="good" />
            <TrendMiniChart trend="stable" />
          </div>
          
          <div className="flex items-center justify-between">
            <Row label="Non-HDL Chol" value={125} normal="0-129 mg/dL" variant="good" />
            <TrendMiniChart trend="up" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};