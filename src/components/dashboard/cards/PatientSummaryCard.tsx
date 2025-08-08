import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import patientAvatar from "@/assets/patient-avatar.jpg";

export const PatientSummaryCard = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4" aria-label="Patient Summary" data-card-title>
      <CardHeader>
        <CardTitle>Thursday, June 12</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <img src={patientAvatar} alt="Warren McGinnis patient avatar" className="h-16 w-16 rounded-full object-cover" loading="lazy" />
          <div>
            <div className="font-semibold" data-field="patient:name">Warren McGinnis</div>
            <div className="text-sm text-muted-foreground" data-field="patient:demographics" data-value="Age 72 • Male">Age 72 • Male</div>
            <a className="text-sm text-primary underline" href="#">HealthSAFE →</a>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl border bg-card">
          <p className="text-sm mb-2">Good morning Dr. Harlow. You have an upcoming appointment:</p>
          <p className="text-sm font-semibold">WARREN MCGINNIS AT 10:00 AM</p>
          <a className="text-sm text-primary underline" href="#">Online intake triage →</a>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <div className="font-medium mb-1">Presenting concerns</div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li data-field="concern:edema">Lower extremity swelling</li>
                <li data-field="concern:weight_gain">Weight gain of 10 lbs in two weeks</li>
                <li data-field="concern:sob">Shortness of breath</li>
                <li data-field="concern:orthopnea">Difficulty lying flat at night</li>
              </ul>
            </div>
            <div>
              <div className="font-medium mb-1">History</div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li data-field="hx:cad"><a className="underline" href="#">Coronary Artery Disease</a></li>
                <li data-field="hx:htn"><a className="underline" href="#">Hypertension</a></li>
                <li data-field="hx:hyperlipidemia"><a className="underline" href="#">Hyperlipidemia</a></li>
                <li data-field="hx:dm"><a className="underline" href="#">Diabetes</a></li>
                <li data-field="hx:smoker"><a className="underline" href="#">Prior smoker</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">Diagnoses</Badge>
            <Badge variant="secondary">Vitals</Badge>
            <Badge variant="secondary">Lab reports</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
