import React, { createContext, useCallback, useContext, useState } from "react";

interface AssistantUIState {
  trendingVitalsOpen: boolean;
  showTrendingVitals: () => void;
  closeTrendingVitals: () => void;
  journeyInteracted: boolean;
  setJourneyInteracted: (interacted: boolean) => void;
  showHeartDietEducation: boolean;
  setShowHeartDietEducation: (show: boolean) => void;
  showExtraCardiologist: boolean;
  setShowExtraCardiologist: (show: boolean) => void;
  expandedLipidPanel: boolean;
  setExpandedLipidPanel: (expanded: boolean) => void;
  expandedVitalsPanel: boolean;
  setExpandedVitalsPanel: (expanded: boolean) => void;
}

const AssistantUIContext = createContext<AssistantUIState | undefined>(undefined);

export const AssistantUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trendingVitalsOpen, setTrendingVitalsOpen] = useState(false);
  const [journeyInteracted, setJourneyInteracted] = useState(false);
  const [showHeartDietEducation, setShowHeartDietEducation] = useState(false);
  const [showExtraCardiologist, setShowExtraCardiologist] = useState(false);
  const [expandedLipidPanel, setExpandedLipidPanel] = useState(false);
  const [expandedVitalsPanel, setExpandedVitalsPanel] = useState(false);

  const showTrendingVitals = useCallback(() => setTrendingVitalsOpen(true), []);
  const closeTrendingVitals = useCallback(() => setTrendingVitalsOpen(false), []);

  return (
    <AssistantUIContext.Provider value={{ 
      trendingVitalsOpen, 
      showTrendingVitals, 
      closeTrendingVitals, 
      journeyInteracted, 
      setJourneyInteracted,
      showHeartDietEducation,
      setShowHeartDietEducation,
      showExtraCardiologist,
      setShowExtraCardiologist,
      expandedLipidPanel,
      setExpandedLipidPanel,
      expandedVitalsPanel,
      setExpandedVitalsPanel
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
