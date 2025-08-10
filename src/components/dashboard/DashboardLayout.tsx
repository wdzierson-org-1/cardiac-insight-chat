import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PatientSummaryCard } from "./cards/PatientSummaryCard";
import { MedicalHistoryCard } from "./cards/MedicalHistoryCard";
import { LipidPanelCard } from "./cards/LipidPanelCard";
import { VitalsCard } from "./cards/VitalsCard";
import { EducationCard } from "./cards/EducationCard";
import { CommunityCardiologistCard } from "./cards/CommunityCardiologistCard";
import { AssistantUIProvider } from "./assistant-ui-context";
import { ChatDock } from "./ChatDock";
import { TrendingVitalsPanel } from "./TrendingVitalsPanel";

export const DashboardLayout = () => {
  return (
    <AssistantUIProvider>
      <div className="min-h-screen grid grid-cols-12">
        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="col-span-11">
          <Header />
          <main className="px-4 md:px-6 py-6 bg-subtle-grid">
            <section className="grid grid-cols-12 gap-5 md:gap-6">
              <PatientSummaryCard />
              <MedicalHistoryCard />
              <CommunityCardiologistCard />
              <EducationCard />
              <LipidPanelCard />
              <VitalsCard />
            </section>
          </main>
        </div>
        <ChatDock />
      </div>
      <TrendingVitalsPanel />
    </AssistantUIProvider>
  );
};
