import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mic, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAssistantUI } from "./assistant-ui-context";

const blobToBase64 = async (blob: Blob) => {
  const buffer = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    const sub = bytes.subarray(i, Math.min(i + chunk, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(sub));
  }
  return btoa(binary);
};

const scrollToCard = (title: string) => {
  const cards = Array.from(document.querySelectorAll("[data-card-title]"));
  for (const card of cards) {
    const h = card.querySelector("h3");
    if (h && h.textContent && h.textContent.toLowerCase().includes(title.toLowerCase())) {
      (card as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      break;
    }
  }
};

export const VoiceAssistant: React.FC = () => {
  const { toast } = useToast();
  const { showTrendingVitals, closeTrendingVitals } = useAssistantUI();
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  const handleCommand = useCallback((text: string) => {
    const t = text.toLowerCase();
    if (t.includes("open") && t.includes("trending vitals")) {
      showTrendingVitals();
      toast({ title: "Opening Trending Vitals" });
      return true;
    }
    if ((t.includes("close") || t.includes("hide")) && t.includes("trending")) {
      closeTrendingVitals();
      toast({ title: "Closing Trending Vitals" });
      return true;
    }
    if (t.includes("show") && t.includes("lipid")) {
      scrollToCard("Lipid Panel");
      toast({ title: "Navigating", description: "Scrolling to Lipid Panel" });
      return true;
    }
    if (t.includes("show") && t.includes("vitals")) {
      scrollToCard("Vitals");
      toast({ title: "Navigating", description: "Scrolling to Vitals" });
      return true;
    }
    return false;
  }, [showTrendingVitals, closeTrendingVitals, toast]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioBase64 = await blobToBase64(blob);

        toast({ title: "Transcribing…" });
        const { data: tData, error: tErr } = await supabase.functions.invoke("transcribe-audio", {
          body: { audioBase64 },
        });
        if (tErr) {
          toast({ title: "Transcription failed", description: String(tErr.message || tErr), variant: "destructive" });
          return;
        }
        const text = (tData as any)?.text || "";
        toast({ title: "You said", description: text });

        // Handle simple UI commands
        const handled = handleCommand(text);

        const system = 'You are Journey, a concise clinical assistant for this dashboard. If it sounds like a UI command, describe what you did; otherwise answer briefly.';
        const prompt = `User said: "${text}"`;
        const { data: gData, error: gErr } = await supabase.functions.invoke("generate-with-ai", {
          body: { prompt, system },
        });
        if (gErr) {
          toast({ title: "Journey error", description: String(gErr.message || gErr), variant: "destructive" });
          return;
        }
        const answer = (gData as any)?.generatedText || "Okay.";
        toast({ title: handled ? "Done" : "Journey", description: answer });

        const { data: sData, error: sErr } = await supabase.functions.invoke("text-to-speech", {
          body: { text: answer, voice: "alloy" },
        });
        if (sErr) return; // silently fail TTS
        const audioB64 = (sData as any)?.audioContent;
        if (audioB64 && audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${audioB64}`;
          audioRef.current.play();
        }
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
      toast({ title: "Listening…", description: "Tap to stop when you're done" });
    } catch (error: any) {
      toast({ title: "Mic access denied", description: error?.message || "Unable to start recording", variant: "destructive" });
    }
  }, [handleCommand, toast]);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={recording ? stopRecording : startRecording}
        size="lg"
        className={
          recording
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }
        aria-label={recording ? "Stop voice" : "Start voice"}
      >
        {recording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
    </div>
  );
};
