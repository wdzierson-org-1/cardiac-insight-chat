import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export type TrendMetric = "triglycerides" | "cholesterol" | "weight";
type LipidMetric = Extract<TrendMetric, "triglycerides" | "cholesterol">;

interface TrendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric?: TrendMetric | null;
  data?: Array<{ date: string; value: number }>;
  compare?: LipidMetric[] | null;
  compareData?: Record<LipidMetric, Array<{ date: string; value: number }>>;
}

export const TrendModal = ({ open, onOpenChange, metric = null, data = [], compare = null, compareData }: TrendModalProps) => {
  const lineColor = "hsl(var(--brand))";
  const altLineColor = "hsl(var(--brand-2))";

  // Comparison mode: triglycerides vs cholesterol
  if (compare && compare.length === 2 && compareData) {
    const [m1, m2] = compare;
    const a = compareData[m1] || [];
    const b = compareData[m2] || [];

    const allDates = Array.from(new Set([...(a?.map((d) => d.date) || []), ...(b?.map((d) => d.date) || [])])).sort();
    const combined = allDates.map((date) => ({
      date,
      triglycerides: a.find((p) => p.date === date)?.value ?? null,
      cholesterol: b.find((p) => p.date === date)?.value ?? null,
    }));

    const unit = "mg/dL";
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lipids Comparison — 2022 to Present</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground mb-2">Irregular testing intervals shown</p>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combined} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: unit, angle: -90, position: 'insideLeft', offset: 10 }} />
                <Tooltip formatter={(value: any, name: any) => [`${value} ${unit}`, name === "triglycerides" ? "Triglycerides" : "Cholesterol"]} />
                <Line type="monotone" dataKey="triglycerides" name="Triglycerides" stroke={lineColor} strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="cholesterol" name="Cholesterol" stroke={altLineColor} strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!metric) return null;

  const titleMap: Record<TrendMetric, string> = {
    triglycerides: "Triglycerides — 2022 to Present",
    cholesterol: "Cholesterol — 2022 to Present",
    weight: "Weight — Last 12 Months",
  };

  const unit = metric === "weight" ? "lbs" : "mg/dL";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{titleMap[metric]}</DialogTitle>
        </DialogHeader>
        {metric !== "weight" && (
          <p className="text-xs text-muted-foreground mb-2">Irregular testing intervals shown</p>
        )}
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: unit, angle: -90, position: 'insideLeft', offset: 10 }} />
              <Tooltip formatter={(value: any) => [`${value} ${unit}`, metric]} />
              <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};
