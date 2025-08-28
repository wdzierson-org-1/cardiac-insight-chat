import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PatientSummaryCard } from "./cards/PatientSummaryCard";
import { MedicalHistoryCard } from "./cards/MedicalHistoryCard";
import { LipidPanelCard } from "./cards/LipidPanelCard";
import { EnhancedLipidPanelCard } from "./cards/EnhancedLipidPanelCard";
import { ExpandedLipidPanelCard } from "./cards/ExpandedLipidPanelCard";
import { VitalsCard } from "./cards/VitalsCard";
import { EducationCard } from "./cards/EducationCard";
import { EnhancedEducationCard } from "./cards/EnhancedEducationCard";
import { CommunityCardiologistCard } from "./cards/CommunityCardiologistCard";
import { EnhancedCommunityCardiologistCard } from "./cards/EnhancedCommunityCardiologistCard";
import { AssistantUIProvider, useAssistantUI } from "./assistant-ui-context";
import { ChatDock } from "./ChatDock";
import { TrendingVitalsPanel } from "./TrendingVitalsPanel";
import { VoiceAssistant } from "./VoiceAssistant";

const DashboardContent = () => {
  const { journeyInteracted, expandedLipidPanel } = useAssistantUI();

  return (
    <div className="min-h-screen grid grid-cols-12">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-11">
        <Header />
        <main className="px-4 md:px-6 py-6 bg-subtle-grid">
          <section className="grid grid-cols-12 gap-5 md:gap-6">
            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 transition-all duration-500">
              <PatientSummaryCard />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 transition-all duration-500 delay-100">
              <MedicalHistoryCard />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 transition-all duration-500 delay-200">
              {journeyInteracted ? <EnhancedCommunityCardiologistCard /> : <CommunityCardiologistCard />}
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 transition-all duration-500 delay-300">
              {journeyInteracted ? <EnhancedEducationCard /> : <EducationCard />}
            </div>
            <div className={`transition-all duration-500 delay-400 ${expandedLipidPanel ? 'col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-8' : 'col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4'}`}>
              {expandedLipidPanel ? <ExpandedLipidPanelCard /> : (journeyInteracted ? <EnhancedLipidPanelCard /> : <LipidPanelCard />)}
            </div>
            <div className={`transition-all duration-500 delay-500 ${expandedLipidPanel ? 'col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4' : 'col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4'}`}>
              <VitalsCard />
            </div>
          </section>
        </main>
      </div>
      <ChatDock />
    </div>
  );
};

export const DashboardLayout = () => {
  return (
    <AssistantUIProvider>
      <DashboardContent />
      <TrendingVitalsPanel />
      <VoiceAssistant />
    </AssistantUIProvider>
  );
};
