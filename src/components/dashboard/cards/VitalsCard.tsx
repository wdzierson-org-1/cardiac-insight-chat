import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LineChart, Activity, MoreHorizontal } from "lucide-react";

const VRow = ({ label, value, normal, dataKey }: { label: string; value: number; normal: string; dataKey: string }) => (
  <div className="grid grid-cols-3 items-center gap-3 py-2" data-field={dataKey} data-value={String(value)}>
    <div className="text-sm">{label}</div>
    <div className="col-span-2">
      <Progress value={Math.min(100, value)} />
      <div className="text-xs text-muted-foreground mt-1">Normal Range {normal} • {value}</div>
    </div>
  </div>
);

export const VitalsCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4" data-card-title>
      <CardHeader className="rounded-t-2xl bg-[hsl(var(--panel-green))] text-[hsl(var(--panel-foreground))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" aria-hidden />
            <CardTitle className="text-lg">Vitals</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-[hsl(var(--panel-foreground))]/90 hover:bg-white/10" aria-label="More">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Results</span>
          <Button variant="outline" size="sm" className="h-7 px-2">
            <LineChart className="h-3.5 w-3.5" /> Compare result trends
          </Button>
        </div>
        <VRow label="BMI" value={72} normal="18.5 - 24.9" dataKey="vital:bmi" />
        <VRow label="SpO2" value={89} normal=">= 94%" dataKey="vital:spo2" />
        <VRow label="BPM" value={58} normal="60 - 80 bpm" dataKey="vital:bpm" />
        <VRow label="BP Systolic" value={135} normal="< 130" dataKey="vital:bp_systolic" />
        <VRow label="BP Diastolic" value={93} normal="< 80" dataKey="vital:bp_diastolic" />
      </CardContent>
    </Card>
  );
};
