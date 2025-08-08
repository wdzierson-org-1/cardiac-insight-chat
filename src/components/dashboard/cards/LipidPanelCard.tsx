import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Row = ({ label, value, normal, dataKey }: { label: string; value: number; normal: string; dataKey: string }) => (
  <div className="grid grid-cols-3 items-center gap-3 py-2" data-field={dataKey} data-value={String(value)}>
    <div className="text-sm">{label}</div>
    <div className="col-span-2">
      <Progress value={Math.min(100, value)} />
      <div className="text-xs text-muted-foreground mt-1">Normal Range {normal} • {value}</div>
    </div>
  </div>
);

export const LipidPanelCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4" data-card-title>
      <CardHeader>
        <CardTitle>Lipid Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Row label="Cholesterol" value={60} normal="100-199 mg/dL" dataKey="lipid:chol" />
        <Row label="Triglycerides" value={80} normal="0-149 mg/dL" dataKey="lipid:trig" />
        <Row label="HDL Cholesterol" value={35} normal=">=39 mg/dL" dataKey="lipid:hdl" />
        <Row label="LDL Calc (NIH)" value={75} normal="0-99 mg/dL" dataKey="lipid:ldl" />
        <Row label="Non-HDL Chol" value={65} normal="0-129 mg/dL" dataKey="lipid:non_hdl" />
      </CardContent>
    </Card>
  );
};
