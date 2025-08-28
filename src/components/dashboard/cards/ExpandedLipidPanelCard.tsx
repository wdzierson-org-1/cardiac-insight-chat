import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Row = ({ label, value, variant }: { label: string; value: string; variant: "good" | "warn" }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-sm font-medium">{label}</span>
    <span className={`text-sm font-semibold ${variant === "good" ? "text-green-600" : "text-amber-600"}`}>
      {value}
    </span>
  </div>
);

const MiniTrendChart = ({ data, color }: { data: Array<{ month: string; value: number }>; color: string }) => (
  <div className="h-16 w-full mt-2">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="month" hide />
        <YAxis hide />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2} 
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const buildTrendData = (baseValue: number, trend: "up" | "down" | "stable") => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month, i) => {
    let value = baseValue;
    if (trend === "up") value += (i * 2);
    else if (trend === "down") value -= (i * 1.5);
    else value += Math.sin(i * 0.5) * 3; // slight variation for stable
    return { month, value: Math.round(value) };
  });
};

export const ExpandedLipidPanelCard = () => {
  const triglyceridesData = buildTrendData(163, "up");
  const cholesterolData = buildTrendData(192, "up");
  const hdlData = buildTrendData(45, "stable");
  const ldlData = buildTrendData(110, "up");

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-8 transition-all duration-500" data-card-title>
      <CardHeader className="rounded-t-2xl bg-[hsl(var(--panel-blue))] text-[hsl(var(--panel-foreground))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" aria-hidden />
            <CardTitle className="text-base md:text-lg">Lipid Panel — Trending Analysis</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[hsl(var(--panel-foreground))]/90 hover:bg-white/10"
            aria-label="More"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Row label="Triglycerides" value="163 mg/dL" variant="warn" />
            <div className="text-xs text-muted-foreground">Normal: &lt;150 mg/dL</div>
            <MiniTrendChart data={triglyceridesData} color="hsl(var(--chart-1))" />
          </div>
          
          <div>
            <Row label="Total Cholesterol" value="192 mg/dL" variant="warn" />
            <div className="text-xs text-muted-foreground">Normal: &lt;200 mg/dL</div>
            <MiniTrendChart data={cholesterolData} color="hsl(var(--chart-2))" />
          </div>
          
          <div>
            <Row label="HDL Cholesterol" value="45 mg/dL" variant="warn" />
            <div className="text-xs text-muted-foreground">Normal: &gt;40 mg/dL (M), &gt;50 mg/dL (F)</div>
            <MiniTrendChart data={hdlData} color="hsl(var(--chart-3))" />
          </div>
          
          <div>
            <Row label="LDL Cholesterol" value="110 mg/dL" variant="warn" />
            <div className="text-xs text-muted-foreground">Normal: &lt;100 mg/dL</div>
            <MiniTrendChart data={ldlData} color="hsl(var(--chart-4))" />
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <Button variant="outline" className="w-full">
            View Detailed Trends
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};