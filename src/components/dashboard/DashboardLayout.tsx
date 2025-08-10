import { useEffect, useState } from "react";
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
import { VoiceAssistant } from "./VoiceAssistant";

export const DashboardLayout = () => {
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowAssistant(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AssistantUIProvider>
      <div className="min-h-screen grid grid-cols-12">
        <div className="col-span-1">
          <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
            <Sidebar />
          </div>
        </div>
        <div className="col-span-11">
          <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
            <Header />
          </div>
          <main className="px-4 md:px-6 py-6 bg-subtle-grid">
            <section className="grid grid-cols-12 gap-5 md:gap-6">
              <div className="animate-fade-in" style={{ animationDelay: "250ms" }}><PatientSummaryCard /></div>
              <div className="animate-fade-in" style={{ animationDelay: "300ms" }}><MedicalHistoryCard /></div>
              <div className="animate-fade-in" style={{ animationDelay: "350ms" }}><CommunityCardiologistCard /></div>
              <div className="animate-fade-in" style={{ animationDelay: "400ms" }}><EducationCard /></div>
              <div className="animate-fade-in" style={{ animationDelay: "450ms" }}><LipidPanelCard /></div>
              <div className="animate-fade-in" style={{ animationDelay: "500ms" }}><VitalsCard /></div>
            </section>
          </main>
        </div>
        {showAssistant && <ChatDock />}
      </div>
      <TrendingVitalsPanel />
      <VoiceAssistant />
      
    </AssistantUIProvider>
  );
};
