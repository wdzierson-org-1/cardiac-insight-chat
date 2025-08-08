import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PatientSummaryCard } from "./cards/PatientSummaryCard";
import { MedicalHistoryCard } from "./cards/MedicalHistoryCard";
import { LipidPanelCard } from "./cards/LipidPanelCard";
import { VitalsCard } from "./cards/VitalsCard";
import { EducationCard } from "./cards/EducationCard";
import { TrendingVitalsCard } from "./cards/TrendingVitalsCard";
import { ChatDock } from "./ChatDock";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-12">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-11">
        <Header />
        <main className="px-4 md:px-6 py-6">
          <section className="grid grid-cols-12 gap-4">
            <PatientSummaryCard />
            <MedicalHistoryCard />
            <EducationCard />
            <LipidPanelCard />
            <VitalsCard />
            <TrendingVitalsCard />
          </section>
        </main>
      </div>
      <ChatDock />
    </div>
  );
};
