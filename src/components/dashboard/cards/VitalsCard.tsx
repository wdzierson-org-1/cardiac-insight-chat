import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const VRow = ({ label, value, normal }: { label: string; value: number; normal: string }) => (
  <div className="grid grid-cols-3 items-center gap-3 py-2">
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
      <CardHeader>
        <CardTitle>Vitals</CardTitle>
      </CardHeader>
      <CardContent>
        <VRow label="BMI" value={72} normal="18.5 - 24.9" />
        <VRow label="SpO2" value={89} normal=">= 94%" />
        <VRow label="BPM" value={58} normal="60 - 80 bpm" />
        <VRow label="BP Systolic" value={135} normal="< 130" />
        <VRow label="BP Diastolic" value={93} normal="< 80" />
      </CardContent>
    </Card>
  );
};
