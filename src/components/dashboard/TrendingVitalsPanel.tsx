import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAssistantUI } from "./assistant-ui-context";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { date: "01-24", systolic: 126, diastolic: 78 },
  { date: "02-24", systolic: 132, diastolic: 82 },
  { date: "03-24", systolic: 139, diastolic: 88 },
  { date: "04-24", systolic: 135, diastolic: 86 },
  { date: "05-24", systolic: 140, diastolic: 90 },
  { date: "06-24", systolic: 142, diastolic: 92 },
];

export const TrendingVitalsPanel = () => {
  const { trendingVitalsOpen, closeTrendingVitals } = useAssistantUI();
  return (
    <Sheet open={trendingVitalsOpen} onOpenChange={(o) => !o && closeTrendingVitals()}>
      <SheetContent side="right" className="w-full sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Trending Vitals</SheetTitle>
        </SheetHeader>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SheetContent>
    </Sheet>
  );
};
