import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Activity, MoreHorizontal } from "lucide-react";

// Sample data for each vital sign
const weightData = [
  { date: "Jan", value: 205 },
  { date: "Feb", value: 203 },
  { date: "Mar", value: 202 },
  { date: "Apr", value: 201 },
  { date: "May", value: 203 },
  { date: "Jun", value: 202 },
];

const bmiData = [
  { date: "Jan", value: 35 },
  { date: "Feb", value: 34.5 },
  { date: "Mar", value: 34.2 },
  { date: "Apr", value: 34 },
  { date: "May", value: 34.3 },
  { date: "Jun", value: 34 },
];

const spo2Data = [
  { date: "Jan", value: 92 },
  { date: "Feb", value: 91 },
  { date: "Mar", value: 89 },
  { date: "Apr", value: 90 },
  { date: "May", value: 88 },
  { date: "Jun", value: 89 },
];

const bpmData = [
  { date: "Jan", value: 118 },
  { date: "Feb", value: 120 },
  { date: "Mar", value: 122 },
  { date: "Apr", value: 119 },
  { date: "May", value: 121 },
  { date: "Jun", value: 122 },
];

const systolicData = [
  { date: "Jan", value: 168 },
  { date: "Feb", value: 170 },
  { date: "Mar", value: 172 },
  { date: "Apr", value: 169 },
  { date: "May", value: 171 },
  { date: "Jun", value: 172 },
];

const diastolicData = [
  { date: "Jan", value: 90 },
  { date: "Feb", value: 92 },
  { date: "Mar", value: 93 },
  { date: "Apr", value: 91 },
  { date: "May", value: 92 },
  { date: "Jun", value: 93 },
];

const VitalChart = ({ 
  title, 
  value, 
  unit, 
  data, 
  normal, 
  variant = "warn" 
}: { 
  title: string; 
  value: number; 
  unit: string; 
  data: any[]; 
  normal: string; 
  variant?: "good" | "warn";
}) => {
  const badgeClasses = variant === "warn"
    ? "bg-destructive/90 text-destructive-foreground"
    : "bg-[hsl(var(--panel-green))] text-foreground";

  return (
    <div className="rounded-xl border border-[hsl(var(--panel-blue))]/40 bg-background/60 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">Normal: {normal}</p>
        </div>
        <div className={`${badgeClasses} rounded-full px-2 py-1 text-xs font-medium`}>
          {variant === "warn" && (title.includes("SpO2") ? "LOW " : "HIGH ")}
          {value} {unit}
        </div>
      </div>
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={variant === "warn" ? "hsl(var(--destructive))" : "hsl(var(--panel-green))"} 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ExpandedVitalsCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-8 transition-all duration-500" data-card-title>
      <CardHeader className="rounded-t-2xl bg-[hsl(var(--panel-blue))] text-[hsl(var(--panel-foreground))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" aria-hidden />
            <CardTitle className="text-base md:text-lg">Vitals - Last Year Trends</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-[hsl(var(--panel-foreground))]/90 hover:bg-white/10" aria-label="More">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <VitalChart
            title="Weight"
            value={202}
            unit="lbs"
            data={weightData}
            normal="160-180 lbs"
            variant="warn"
          />
          <VitalChart
            title="BMI"
            value={34}
            unit=""
            data={bmiData}
            normal="18.5-24.9"
            variant="warn"
          />
          <VitalChart
            title="SpO2"
            value={89}
            unit="%"
            data={spo2Data}
            normal="≥94%"
            variant="warn"
          />
          <VitalChart
            title="Heart Rate"
            value={122}
            unit="bpm"
            data={bpmData}
            normal="60-80 bpm"
            variant="warn"
          />
          <VitalChart
            title="BP Systolic"
            value={172}
            unit="mmHg"
            data={systolicData}
            normal="<130"
            variant="warn"
          />
          <VitalChart
            title="BP Diastolic"
            value={93}
            unit="mmHg"
            data={diastolicData}
            normal="<80"
            variant="warn"
          />
        </div>
      </CardContent>
    </Card>
  );
};