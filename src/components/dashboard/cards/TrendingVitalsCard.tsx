import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "01-24", systolic: 126, diastolic: 78 },
  { date: "02-24", systolic: 132, diastolic: 82 },
  { date: "03-24", systolic: 139, diastolic: 88 },
  { date: "04-24", systolic: 135, diastolic: 86 },
  { date: "05-24", systolic: 140, diastolic: 90 },
  { date: "06-24", systolic: 142, diastolic: 92 },
];

export const TrendingVitalsCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-8" data-card-title>
      <CardHeader>
        <CardTitle>Trending Vitals</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
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
      </CardContent>
    </Card>
  );
};
