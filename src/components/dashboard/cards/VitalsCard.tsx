import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LineChart, Activity, MoreHorizontal } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useAssistantUI } from "../assistant-ui-context";

// Sample data for each vital sign - updated to match medical review image
const weightData = [
  { date: "1/25", value: 188 },
  { date: "2/25", value: 195 },
  { date: "3/25", value: 197 },
  { date: "4/25", value: 195 },
  { date: "5/25", value: 198 },
  { date: "6/25", value: 202 },
];

const bmiData = [
  { date: "1/25", value: 24 },
  { date: "2/25", value: 28 },
  { date: "3/25", value: 28 },
  { date: "4/25", value: 27 },
  { date: "5/25", value: 32 },
  { date: "6/25", value: 34 },
];

const spo2Data = [
  { date: "1/25", value: 95 },
  { date: "2/25", value: 95 },
  { date: "3/25", value: 94 },
  { date: "4/25", value: 94 },
  { date: "5/25", value: 92 },
  { date: "6/25", value: 89 },
];

const bpmData = [
  { date: "1/25", value: 88 },
  { date: "2/25", value: 88 },
  { date: "3/25", value: 90 },
  { date: "4/25", value: 90 },
  { date: "5/25", value: 115 },
  { date: "6/25", value: 122 },
];

const systolicData = [
  { date: "1/25", value: 142 },
  { date: "2/25", value: 158 },
  { date: "3/25", value: 152 },
  { date: "4/25", value: 157 },
  { date: "5/25", value: 165 },
  { date: "6/25", value: 172 },
];

const diastolicData = [
  { date: "1/25", value: 78 },
  { date: "2/25", value: 79 },
  { date: "3/25", value: 83 },
  { date: "4/25", value: 83 },
  { date: "5/25", value: 88 },
  { date: "6/25", value: 93 },
];

const VRow = ({ 
  label, 
  value, 
  normal, 
  variant = "good", 
  data, 
  expanded 
}: { 
  label: string; 
  value: number; 
  normal: string; 
  variant?: "good" | "warn";
  data?: any[];
  expanded?: boolean;
}) => {
  const indicatorLeft = variant === "warn" ? "75%" : "55%";
  const badgeClasses =
    (variant === "warn"
      ? "bg-destructive/90 text-destructive-foreground"
      : "bg-[hsl(var(--panel-green))] text-foreground") +
    " rounded-full px-2 py-0.5 text-[10px] md:text-xs font-medium";

  if (expanded && data) {
    return (
      <div className="rounded-xl border border-[hsl(var(--panel-green))]/40 bg-background/60 p-3 mb-3">
        <div className="flex items-center gap-4">
          {/* Left side - Label and bar (50% width) */}
          <div className="flex-1 min-w-0 max-w-[50%]">
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
          
          {/* Right side - Chart (50% width) */}
          <div className="flex-1 h-16 min-w-0 max-w-[50%]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={variant === "warn" ? "hsl(var(--destructive))" : "hsl(var(--panel-green))"} 
                  strokeWidth={2}
                  dot={{ r: 3, fill: variant === "warn" ? "hsl(var(--destructive))" : "hsl(var(--panel-green))" }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="mb-2 flex items-center justify-between text-xs md:text-sm">
        <div className="font-medium text-muted-foreground">{label}</div>
        <div className="text-xs font-medium">
          {variant === "warn" && (label.includes("SpO2") ? "LOW " : "HIGH ")}
          {value}
        </div>
      </div>
      <Progress value={75} variant={variant} />
      <div className="text-xs text-muted-foreground mt-1 text-center">
        Normal Range {normal}
      </div>
    </div>
  );
};

export const VitalsCard = () => {
  const { expandedVitalsPanel } = useAssistantUI();

  return (
    <Card className={`transition-all duration-500 ${expandedVitalsPanel ? 'relative z-50 col-span-4 lg:col-span-8 xl:col-span-12' : ''}`} data-card-title>
      <CardHeader className="rounded-t-2xl bg-[hsl(var(--panel-blue))] text-[hsl(var(--panel-foreground))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" aria-hidden />
            <CardTitle className="text-base md:text-lg">
              {expandedVitalsPanel ? "Vitals - Last Year Trends" : "Vitals"}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-[hsl(var(--panel-foreground))]/90 hover:bg-white/10" aria-label="More">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {!expandedVitalsPanel && (
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Results</span>
            <Button variant="outline" size="sm" className="h-7 px-2 uppercase tracking-wide bg-[hsl(var(--panel-blue))]/10 text-[hsl(var(--panel-blue))] border-[hsl(var(--panel-blue))]/30 hover:bg-[hsl(var(--panel-blue))]/15">
              <LineChart className="h-3.5 w-3.5 mr-1" /> Compare result trends
            </Button>
          </div>
        )}
        
        {expandedVitalsPanel ? (
          <div>
            <VRow label="Weight" value={202} normal="160-180 lbs" variant="warn" data={weightData} expanded />
            <VRow label="BMI" value={34} normal="18.5-24.9" variant="warn" data={bmiData} expanded />
            <VRow label="SpO2" value={89} normal="≥94%" variant="warn" data={spo2Data} expanded />
            <VRow label="BPM" value={122} normal="60-80 bpm" variant="warn" data={bpmData} expanded />
            <VRow label="BP Systolic" value={172} normal="<130" variant="warn" data={systolicData} expanded />
            <VRow label="BP Diastolic" value={93} normal="<80" variant="warn" data={diastolicData} expanded />
          </div>
        ) : (
          <div>
            <VRow label="Weight" value={202} normal="160-180 lbs" variant="warn" />
            <VRow label="BMI" value={34} normal="18.5 - 24.9" variant="warn" />
            <VRow label="SpO2" value={89} normal=">= 94%" variant="warn" />
            <VRow label="BPM" value={122} normal="60 - 80 bpm" variant="warn" />
            <VRow label="BP Systolic" value={172} normal="< 130" variant="warn" />
            <VRow label="BP Diastolic" value={93} normal="< 80" variant="warn" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
