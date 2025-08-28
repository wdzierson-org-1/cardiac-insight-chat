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
  const { 
    journeyInteracted, 
    expandedLipidPanel, 
    expandedVitalsPanel,
    showHeartDietEducation, 
    showExtraCardiologist 
  } = useAssistantUI();

  return (
    <div className="min-h-screen grid grid-cols-12">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-11">
        <Header />
        <main className="px-4 md:px-6 py-6 bg-subtle-grid">
          <section className="relative grid grid-cols-12 gap-5 md:gap-6">
            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 animate-fade-in [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
              <PatientSummaryCard />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 animate-fade-in [animation-delay:0.7s] opacity-0 [animation-fill-mode:forwards]">
              <MedicalHistoryCard />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
              {showExtraCardiologist ? <EnhancedCommunityCardiologistCard /> : <CommunityCardiologistCard />}
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 animate-fade-in [animation-delay:0.9s] opacity-0 [animation-fill-mode:forwards]">
              {showHeartDietEducation ? <EnhancedEducationCard /> : <EducationCard />}
            </div>
            <div className={`animate-fade-in [animation-delay:1.0s] opacity-0 [animation-fill-mode:forwards] ${expandedVitalsPanel ? 'absolute z-50 top-0 left-0 right-0' : 'col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4'}`}>
              <VitalsCard />
            </div>
            <div className={`animate-fade-in [animation-delay:1.1s] opacity-0 [animation-fill-mode:forwards] ${expandedLipidPanel ? 'col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-8' : 'col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4'} ${expandedVitalsPanel ? 'opacity-50' : ''}`}>
              {expandedLipidPanel ? <ExpandedLipidPanelCard /> : (journeyInteracted ? <EnhancedLipidPanelCard /> : <LipidPanelCard />)}
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
