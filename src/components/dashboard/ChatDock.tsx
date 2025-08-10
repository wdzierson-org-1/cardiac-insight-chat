import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Mic, Send, Brain, Sparkles } from "lucide-react";
import { useAssistantUI } from "./assistant-ui-context";

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
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Good morning, Dr. Harlow. Upcoming appointment: WARREN MCGINNIS at 10:00 AM. On your dashboard: Diagnoses, Vitals, Lab reports. See Patient Education for resources. Ask me to explain this screen or open trending vitals on demand." },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { showTrendingVitals } = useAssistantUI();

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

const onSend = async (customText?: string) => {
  const text = (customText ?? input).trim();
  if (!text) return;
  const user = { role: "user" as const, content: text };
  setMessages((m) => [...m, user]);

  const ctx = collectScreenContext();
  // Simple action detection until server AI is connected
  if (/trending\s+vitals/i.test(text)) {
    showTrendingVitals();
  }

  // Placeholder until Supabase + OpenAI proxy is connected
  const reply = mockAssistant(text, ctx);
  setMessages((m) => [...m, { role: "assistant", content: reply }]);
  setInput("");
};

  const startVoice = async () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    const rec: any = new SR();
    recognitionRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (ev: any) => {
      const t = ev.results[0][0].transcript;
      setInput((p) => (p ? p + " " + t : t));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setListening(true);
      rec.start();
    } catch (e) {
      console.error(e);
    }
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className={cn("fixed left-4 bottom-4 z-30")}
      aria-live="polite" aria-label="Clinical Assistant Dock">
      <div className={cn(
        "w-[350px] sm:w-[380px] rounded-2xl border border-[hsl(var(--chat-border))] bg-[hsl(var(--chat-bg))] shadow-lg transition-all",
        open ? "h-[460px]" : "h-14",
      )}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-[hsl(var(--chat-border))]">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-[hsl(var(--brand-2))]" />
            <span className="font-medium">Clinical Assistant</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} aria-label="Toggle chat">
            {open ? "Minimize" : "Open"}
          </Button>
        </div>

        {open && (
          <>
            <div ref={containerRef} className="h-[340px] overflow-y-auto p-3 space-y-3">
              <div className="rounded-lg bg-[hsl(var(--chat-bubble))] border border-[hsl(var(--chat-border))] p-2 text-xs">
                Connect Supabase to enable secure OpenAI access and RAG. In this demo, responses are simulated.
              </div>
              {messages.map((m, i) => (
                <Card key={i} className={cn("p-2 text-sm border-0 shadow-none", m.role === "assistant" ? "bg-[hsl(var(--chat-bubble))]" : "bg-[hsl(var(--chat-user-bubble))]")}>{m.content}</Card>
              ))}
            </div>
            <div className="p-3 border-t border-[hsl(var(--chat-border))]">
              <div className="flex items-center gap-2">
                <Button type="button" variant={listening ? "secondary" : "outline"} size="icon" onClick={listening ? stopVoice : startVoice} aria-label="Voice input">
                  <Mic className={cn("h-4 w-4", listening && "animate-pulse")}/>
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
<div className="mt-2 flex items-center gap-3">
  <button
    onClick={() => onSend("Explain the on-screen data for care planning.")}
    className="text-xs text-primary underline inline-flex items-center gap-1"
  >
    <Sparkles className="h-3 w-3" /> Explain this screen
  </button>
  <button
    onClick={() => onSend("Show trending vitals for the last 6 months")}
    className="text-xs text-primary underline"
  >
    Show trending vitals
  </button>
  <button
    onClick={() => onSend("Summarize the lipid panel in one sentence")}
    className="text-xs text-primary underline"
  >
    Summarize lipids
  </button>
</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
