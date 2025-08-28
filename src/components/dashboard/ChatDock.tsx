import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Mic, Send, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { useAssistantUI } from "./assistant-ui-context";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChat } from "@/utils/RealtimeAudio";
import { TrendModal } from "./TrendModal";

interface Message { role: "user" | "assistant"; content: string }

function collectScreenContext() {
  const titles = Array.from(document.querySelectorAll("[data-card-title]"))
    .map((el) => (el.textContent || "").trim())
    .filter(Boolean);
  const fields: Record<string, string> = {};
  Array.from(document.querySelectorAll<HTMLElement>("[data-field]"))
    .forEach((el) => {
      const key = el.dataset.field || "";
      const val = el.dataset.value || (el.textContent || "").trim();
      if (key) fields[key] = val;
    });
  return { visibleCards: titles, fields };
}

function mockAssistant(userText: string, ctx: ReturnType<typeof collectScreenContext>): string {
  const focus = ctx.visibleCards.join(", ");
  const bmi = ctx.fields["vital:bmi"]; const spo2 = ctx.fields["vital:spo2"]; const bpm = ctx.fields["vital:bpm"]; const sbp = ctx.fields["vital:bp_systolic"]; const dbp = ctx.fields["vital:bp_diastolic"];
  const concerns = Object.entries(ctx.fields)
    .filter(([k]) => k.startsWith("concern:"))
    .map(([, v]) => v)
    .join(", ");
  const vitals = [
    bmi ? `BMI ${bmi}` : null,
    spo2 ? `SpO2 ${spo2}%` : null,
    bpm ? `BPM ${bpm}` : null,
    sbp && dbp ? `BP ${sbp}/${dbp}` : null,
  ].filter(Boolean).join(" • ");
  return `I see tiles for: ${focus}. Key vitals: ${vitals || "n/a"}. Concerns: ${concerns || "n/a"}. For early heart failure risk, assess fluid status, BP trends, and lipids; advise daily weights and sodium restriction; optimize guideline-directed therapy. You asked: "${userText}"`;
}

export const ChatDock = () => {
  const [open, setOpen] = useState(true);
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 476 }); // bottom-left initially
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Good morning, Dr. Harlow. Upcoming appointment: WARREN MCGINNIS at 10:00 AM. On your dashboard: Diagnoses, Vitals, Lab reports. See Patient Education for resources. Ask me to explain this screen or open trending vitals on demand." },
  ]);
  const [input, setInput] = useState("");
const [listening, setListening] = useState(false);
const [speaking, setSpeaking] = useState(false);
const recognitionRef = useRef<any>(null);
const listeningRef = useRef(false);
const speakingRef = useRef(false);
const containerRef = useRef<HTMLDivElement>(null);
const { 
  showTrendingVitals, 
  setJourneyInteracted, 
  setShowHeartDietEducation, 
  setShowExtraCardiologist, 
  setExpandedLipidPanel,
  setExpandedVitalsPanel
} = useAssistantUI();
const audioRef = useRef<HTMLAudioElement | null>(null);
const recognizingRef = useRef(false);
const restartTimerRef = useRef<number | null>(null);
const realtimeRef = useRef<RealtimeChat | null>(null);
const [trendOpen, setTrendOpen] = useState(false);
const [trendMetric, setTrendMetric] = useState<"triglycerides" | "cholesterol" | "weight" | null>(null);
const [trendData, setTrendData] = useState<Array<{ date: string; value: number }>>([]);
const fnCallBufferRef = useRef<Record<string, string>>({});
const fnCallNameRef = useRef<Record<string, string>>({});
const windowRef = useRef<HTMLDivElement>(null);
const clearRestartTimer = () => {
  if (restartTimerRef.current) {
    clearTimeout(restartTimerRef.current);
    restartTimerRef.current = null;
  }
};

const buildLipidTrend = (metric: "triglycerides" | "cholesterol") => {
  const points = [
    { date: "2022-03", value: metric === "triglycerides" ? 120 : 165 },
    { date: "2022-08", value: metric === "triglycerides" ? 128 : 168 },
    { date: "2023-01", value: metric === "triglycerides" ? 136 : 173 },
    { date: "2023-06", value: metric === "triglycerides" ? 145 : 178 },
    { date: "2023-12", value: metric === "triglycerides" ? 151 : 183 },
    { date: "2024-05", value: metric === "triglycerides" ? 156 : 186 },
    { date: "2024-11", value: metric === "triglycerides" ? 160 : 189 },
    { date: "2025-04", value: metric === "triglycerides" ? 163 : 192 },
  ];
  return points;
};

const buildWeightTrend = () => {
  const end = 202; // Match Vitals panel current value
  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${yyyy}-${mm}`);
  }
  const start = end - 8; // modest upward trend
  const data = months.map((date, idx) => ({
    date,
    value: Math.round(start + (idx * (end - start)) / (months.length - 1)),
  }));
  return data;
};

const openTrend = (metric: "triglycerides" | "cholesterol" | "weight") => {
  setTrendMetric(metric);
  const data = metric === "weight" ? buildWeightTrend() : buildLipidTrend(metric as "triglycerides" | "cholesterol");
  setTrendData(data);
  setTrendOpen(true);
};

const scheduleStart = (ms = 200) => {
  clearRestartTimer();
  restartTimerRef.current = setTimeout(() => safeStart(0), ms) as unknown as number;
};

const safeStart = (delay = 0) => {
  const attempt = () => {
    if (!listeningRef.current || speakingRef.current) return;
    const rec = recognitionRef.current;
    if (!rec) return;
    if (recognizingRef.current) return;
    try {
      rec.start();
    } catch (err: any) {
      console.log("rec.start error", err);
      if (err?.name === "InvalidStateError") {
        scheduleStart(300);
      }
    }
  };

  if (delay > 0) {
    scheduleStart(delay);
  } else {
    attempt();
  }
};

const safeAbort = () => {
  const rec = recognitionRef.current;
  if (!rec) return;
  try {
    rec.abort?.();
  } catch {
    try { rec.stop?.(); } catch {}
  } finally {
    recognizingRef.current = false;
  }
};

// keep refs in sync with state
useEffect(() => { listeningRef.current = listening; }, [listening]);
useEffect(() => { speakingRef.current = speaking; }, [speaking]);

// single audio element with handlers to manage speaking/listening turns
useEffect(() => { 
  const el = new Audio();
  audioRef.current = el; 
  el.onplay = () => {
    setSpeaking(true);
    safeAbort();
  };
  el.onended = () => {
    setSpeaking(false);
    if (listeningRef.current) {
      scheduleStart(250);
    }
  };
  return () => {
    el.onplay = null;
    el.onended = null;
  };
}, []);
  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

const onSend = async (customText?: string) => {
  const text = (customText ?? input).trim();
  if (!text) return;
  
  // Mark that user has interacted with Journey
  setJourneyInteracted(true);
  
  const user = { role: "user" as const, content: text };
  setMessages((m) => [...m, user]);
  setInput("");

  // Detect trend requests first
  const lipidMatch = text.match(/(?:year\s*trend.*(triglycerides|cholesterol)|(triglycerides|cholesterol).*?(?:year|last\s*year))/i);
  if (lipidMatch) {
    const metric = (lipidMatch[1] || lipidMatch[2] || "").toLowerCase() as "triglycerides" | "cholesterol";
    if (metric) {
      openTrend(metric);
      return;
    }
  }
  if (/(weight).*(last\s*year|year)|(?:trend).*weight/i.test(text)) {
    openTrend("weight");
    return;
  }

  // If in voice mode, route to realtime and return
  if (listening && realtimeRef.current) {
    try {
      realtimeRef.current.sendMessage(text);
    } catch (e) {
      console.error("Realtime send error", e);
    }
    return;
  }

  const ctx = collectScreenContext();
  // Simple action detection until richer tooling
  if (/trending\s+vitals/i.test(text)) {
    showTrendingVitals();
  }
  if (/lipid\s+panel/i.test(text)) {
    const cards = Array.from(document.querySelectorAll("[data-card-title]"));
    for (const card of cards) {
      const h = card.querySelector("h3");
      if (h && h.textContent && /lipid panel/i.test(h.textContent)) {
        (card as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      }
    }
  }

  try {
    const system = 'You are Journey, a friendly, concise clinical dashboard assistant. Reference on-screen context when helpful and keep replies under 2 sentences.';
    const { data: gData, error: gErr } = await supabase.functions.invoke("generate-with-ai", {
      body: { prompt: `User: ${text}\nScreen context: ${JSON.stringify(ctx).slice(0, 2000)}`, system },
    });
    if (gErr) throw gErr;
    const answer = (gData as any)?.generatedText || "Okay.";
    setMessages((m) => [...m, { role: "assistant", content: answer }]);

    // Speak the answer back using an OpenAI standard voice
    const { data: sData } = await supabase.functions.invoke("text-to-speech", {
      body: { text: answer, voice: "alloy" },
    });
    const audioB64 = (sData as any)?.audioContent;
    if (audioB64 && audioRef.current) {
      audioRef.current.src = `data:audio/mp3;base64,${audioB64}`;
      safeAbort();
      audioRef.current.play();
    }
  } catch (e) {
    console.error("Assistant error", e);
  }
};

const startVoice = async () => {
  try {
    const ctx = collectScreenContext();
    const instructions =
      'You are Journey, a friendly, concise clinical dashboard assistant. Reference on-screen context when helpful and keep replies under 2 sentences.' +
      ` Context: ${JSON.stringify(ctx).slice(0, 2000)}`;
    const chat = new RealtimeChat((event) => {
      // Audio speaking state
      if (event?.type === "response.audio.delta") {
        setSpeaking(true);
        return;
      }
      if (event?.type === "response.audio.done") {
        setSpeaking(false);
        return;
      }

      // Tool call name created (some variants use different event names)
      if (event?.type === "response.function_call.created" || event?.type === "response.tool_call.created") {
        const callId = event?.call_id || event?.id;
        if (callId && event?.name) {
          fnCallNameRef.current[callId] = event.name;
        }
        return;
      }

      // Accumulate function-call arguments
      if (event?.type === "response.function_call_arguments.delta") {
        const callId = event?.call_id;
        if (callId && typeof event?.delta === "string") {
          fnCallBufferRef.current[callId] = (fnCallBufferRef.current[callId] || "") + event.delta;
        }
        return;
      }

      if (event?.type === "response.function_call_arguments.done") {
        const callId = event?.call_id;
        const name = (callId && fnCallNameRef.current[callId]) || event?.name;
        const argStr = (callId && fnCallBufferRef.current[callId]) || event?.arguments || "";
        // cleanup
        if (callId) {
          delete fnCallBufferRef.current[callId];
          delete fnCallNameRef.current[callId];
        }
        try {
          console.log("Function call received:", { name, arguments: argStr });
          const args = argStr ? JSON.parse(argStr) : {};
          const metric = args?.metric as "triglycerides" | "cholesterol" | "weight" | undefined;
          if ((name === "show_trend" || args?.metric) && metric) {
            console.log("Opening trend for metric:", metric);
            openTrend(metric);
          } else if (name === "add_education_item") {
            console.log("Adding heart-healthy diet education item");
            setShowHeartDietEducation(true);
          } else if (name === "add_cardiologist") {
            console.log("Adding extra cardiologist");
            setShowExtraCardiologist(true);
          } else if (name === "expand_vitals_panel") {
            console.log("Expanding vitals panel");
            setExpandedVitalsPanel(true);
          }
        } catch (err) {
          console.warn("Failed to parse function args", err, argStr);
        }
        return;
      }
    });
    realtimeRef.current = chat;
    await chat.init(instructions);
    setListening(true);
  } catch (e) {
    console.error("startVoice error", e);
  }
};

const stopVoice = () => {
  setListening(false);
  try { realtimeRef.current?.disconnect(); } catch {}
  setSpeaking(false);
  clearRestartTimer();
  safeAbort();
  try { audioRef.current?.pause(); } catch {}
  recognizingRef.current = false;
};

// Drag functionality
const handleMouseDown = (e: React.MouseEvent) => {
  if (e.target instanceof HTMLElement && e.target.closest('button, input')) return;
  setIsDragging(true);
  const rect = windowRef.current?.getBoundingClientRect();
  if (rect) {
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging) return;
  
  const newX = e.clientX - dragStart.x;
  const newY = e.clientY - dragStart.y;
  
  // Keep window within viewport bounds
  const maxX = window.innerWidth - (open ? 380 : 280);
  const maxY = window.innerHeight - (open ? 460 : 48);
  
  setPosition({
    x: Math.max(0, Math.min(maxX, newX)),
    y: Math.max(0, Math.min(maxY, newY)),
  });
};

const handleMouseUp = () => {
  setIsDragging(false);
};

// Add global mouse event listeners for dragging
useEffect(() => {
  if (isDragging) {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }
}, [isDragging, dragStart, open]);
  return (
    <div 
      ref={windowRef}
      className={cn("fixed z-30 animate-slide-in-left [animation-delay:1.2s] opacity-0 [animation-fill-mode:forwards]", isDragging && "select-none")}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      aria-live="polite" 
      aria-label="Clinical Assistant Dock"
    >
      <div className={cn(
        "rounded-2xl border border-[hsl(var(--chat-border))] bg-[hsl(var(--chat-bg))] shadow-lg transition-all",
        open ? "w-[350px] sm:w-[380px] h-[460px]" : "w-[280px] h-12",
      )}>
        <div 
          className="flex items-center justify-between px-3 py-2 border-b border-[hsl(var(--chat-border))] bg-[hsl(var(--chat-bubble))] cursor-grab active:cursor-grabbing rounded-t-2xl"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full bg-purple-600 transition-all duration-300",
              !open && (speaking || listening) && "animate-pulse-opacity"
            )} />
            <span className="font-medium">Journey</span>
            <GripVertical className="h-3 w-3 text-muted-foreground ml-1" />
          </div>
          <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} aria-label="Toggle chat">
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>

        {open && (
          <>
            <div ref={containerRef} className="h-[340px] overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <Card key={i} className={cn("p-2 text-sm border-0 shadow-none", m.role === "assistant" ? "bg-[hsl(var(--chat-bubble))]" : "bg-[hsl(var(--chat-bubble-user))]")}>{m.content}</Card>
              ))}
            </div>
            <div className="p-3 border-t border-[hsl(var(--chat-border))]">
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  size="icon" 
                  onClick={listening ? stopVoice : startVoice} 
                  aria-label="Voice input"
                  className={cn(
                    "bg-purple-600 hover:bg-purple-700 text-white border-0",
                    listening && "animate-pulse"
                  )}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Ask about this patient, or say "Explain this screen"'
                  onKeyDown={(e) => { if (e.key === 'Enter') onSend(); }}
                  aria-label="Chat input"
                  className="bg-white/70 focus-visible:ring-[hsl(var(--chat-accent))] placeholder:text-muted-foreground"
                />
                <Button onClick={() => onSend()} aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <TrendModal
        open={trendOpen}
        onOpenChange={setTrendOpen}
        metric={trendMetric}
        data={trendData}
      />
    </div>
  );
};
