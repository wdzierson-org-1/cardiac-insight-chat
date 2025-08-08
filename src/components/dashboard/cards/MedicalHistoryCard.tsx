import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MedicalHistoryCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4" data-card-title>
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium">Cardiovascular Disorders</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>
              <a className="underline" href="#">Coronary Artery Disease</a>
              <div>Diagnosed: 05/11/2015 • Status: Active</div>
            </li>
            <li>
              <a className="underline" href="#">Hypertension</a>
              <div>Diagnosed: 03/19/2008 • Status: Active</div>
            </li>
            <li>
              <a className="underline" href="#">Hyperlipidemia</a>
              <div>Diagnosed: 10/05/2010 • Status: Active</div>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Family & Social</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>Father: Coronary Artery Disease, CABG</li>
            <li>Mother: Myocardial Infarction</li>
            <li>Former smoker • Moderate, quit 10/2022</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
