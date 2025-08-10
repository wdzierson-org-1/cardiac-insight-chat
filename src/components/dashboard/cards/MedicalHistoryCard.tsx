import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MedicalHistoryCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4" data-card-title>
      <CardHeader className="rounded-t-2xl bg-[hsl(var(--panel-blue))] text-[hsl(var(--panel-foreground))]">
        <CardTitle className="text-base md:text-lg">Medical History</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium">Cardiovascular Disorders</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li data-field="dx:cad" data-value="Active">
              <a className="underline" href="#">Coronary Artery Disease</a>
              <div>Diagnosed: 05/11/2015 • Status: Active • Stage: Multi-vessel disease</div>
            </li>
            <li data-field="dx:htn" data-value="Active">
              <a className="underline" href="#">Hypertension</a>
              <div>Diagnosed: 03/19/2008 • Status: Active • Stage: Controlled on medication</div>
            </li>
            <li data-field="dx:hyperlipidemia" data-value="Active">
              <a className="underline" href="#">Hyperlipidemia</a>
              <div>Diagnosed: 10/05/2010 • Status: Active • Stage: LDL &gt; 160 prior to statin</div>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Family Medical History</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li data-field="family:father" data-value="CAD, CABG">Father: Coronary Artery Disease, CABG</li>
            <li data-field="family:mother" data-value="MI">Mother: Myocardial Infarction</li>
            <li data-field="social:smoker" data-value="former">Former smoker • Moderate cigarette smoker, 10-19/day • 2009 - 2022 / Date Quit 10/20/2022</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
