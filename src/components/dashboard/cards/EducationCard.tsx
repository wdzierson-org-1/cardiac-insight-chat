import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const EducationCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4" data-card-title>
      <CardHeader>
        <CardTitle>Patient Education</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <ul className="space-y-2">
          <li><a href="#" className="underline">Understanding Heart Failure: What It Is and How It’s Treated</a></li>
          <li><a href="#" className="underline">Managing Fluid Buildup: Sodium, Fluids, and Daily Weigh-Ins</a></li>
          <li><a href="#" className="underline">Recognizing Worsening Heart Failure: When to Call Your Doctor</a></li>
        </ul>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">See More</Button>
        <Button>Send To Patient</Button>
      </CardFooter>
    </Card>
  );
};
