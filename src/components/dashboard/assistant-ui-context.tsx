import React, { createContext, useCallback, useContext, useState } from "react";

interface AssistantUIState {
  trendingVitalsOpen: boolean;
  showTrendingVitals: () => void;
  closeTrendingVitals: () => void;
  journeyInteracted: boolean;
  setJourneyInteracted: (interacted: boolean) => void;
}

const AssistantUIContext = createContext<AssistantUIState | undefined>(undefined);

export const AssistantUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trendingVitalsOpen, setTrendingVitalsOpen] = useState(false);
  const [journeyInteracted, setJourneyInteracted] = useState(false);

  const showTrendingVitals = useCallback(() => setTrendingVitalsOpen(true), []);
  const closeTrendingVitals = useCallback(() => setTrendingVitalsOpen(false), []);

  return (
    <AssistantUIContext.Provider value={{ 
      trendingVitalsOpen, 
      showTrendingVitals, 
      closeTrendingVitals, 
      journeyInteracted, 
      setJourneyInteracted 
    }}>
      {children}
    </AssistantUIContext.Provider>
  );
};

export const useAssistantUI = () => {
  const ctx = useContext(AssistantUIContext);
  if (!ctx) throw new Error("useAssistantUI must be used within AssistantUIProvider");
  return ctx;
};
