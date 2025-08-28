import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAssistantUI } from "../assistant-ui-context";

export const EnhancedEducationCard = () => {
  const { showHeartDietEducation } = useAssistantUI();
  
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 transition-all duration-500" data-card-title>
      <CardHeader className="rounded-t-2xl bg-[hsl(var(--panel-green))] text-[hsl(var(--panel-foreground))]">
        <CardTitle className="text-base md:text-lg">Patient Education</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Checkbox id="edu-1" defaultChecked aria-label="Understanding Heart Failure" />
            <label htmlFor="edu-1" className="leading-snug">
              <a href="#" className="underline">Understanding Heart Failure: Treatment Options</a>
              <div className="text-xs text-muted-foreground">An overview of heart failure, including symptoms, causes and treatments.</div>
            </label>
          </li>
          <li className="flex items-start gap-2">
            <Checkbox id="edu-2" aria-label="Managing Fluid Buildup" />
            <label htmlFor="edu-2" className="leading-snug">
              <a href="#" className="underline">Managing Fluid Buildup: Sodium, Fluids, Weigh-Ins</a>
              <div className="text-xs text-muted-foreground">Practical guidance on reducing swelling and weight gain through sodium and fluid management.</div>
            </label>
          </li>
          <li className={`flex items-start gap-2 ${showHeartDietEducation ? 'animate-fade-in' : 'opacity-0 invisible'}`}>
            <Checkbox id="edu-3" aria-label="Heart-Healthy Diet" />
            <label htmlFor="edu-3" className="leading-snug">
              <a href="#" className="underline">Heart-Healthy Diet: DASH Diet for Heart Failure</a>
              <div className="text-xs text-muted-foreground">Nutritional guidelines for reducing sodium intake and supporting heart health through diet.</div>
            </label>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" className="h-9">See More</Button>
        <Button className="h-9">Send To Patient</Button>
      </CardFooter>
    </Card>
  );
};