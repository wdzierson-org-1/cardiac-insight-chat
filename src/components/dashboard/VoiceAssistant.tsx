import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mic, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

export const VoiceAssistant: React.FC = () => {
  // This component is now the Scribe (transcribe + summarize only, no TTS)
  const { toast } = useToast();
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];

      mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
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
        setTranscript(text);

        toast({ title: "Summarizing…" });
        const system = 'You are a meticulous medical scribe. Create a concise, clinically useful summary of the transcript suitable for charting. Use bullet points, include problems, pertinent positives/negatives, meds, vitals, and a brief plan. Keep under 8 bullets.';
        const prompt = `Transcript to summarize for the chart (doctor-patient conversation):\n\n${text}`;
        const { data: gData, error: gErr } = await supabase.functions.invoke("generate-with-ai", {
          body: { prompt, system },
        });
        if (gErr) {
          toast({ title: "Summarization failed", description: String(gErr.message || gErr), variant: "destructive" });
          return;
        }
        const sum = (gData as any)?.generatedText || "";
        setSummary(sum);
        setModalOpen(true);
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
      toast({ title: "Scribe listening…", description: "Tap to stop when done. Journey will not speak in scribe mode." });
    } catch (error: any) {
      toast({ title: "Mic access denied", description: error?.message || "Unable to start recording", variant: "destructive" });
    }
  }, [toast]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied` });
    } catch (e) {
      toast({ title: `Failed to copy ${label.toLowerCase()}`, variant: "destructive" });
    }
  };

  const saveNote = async () => {
    try {
      setSaving(true);
      const title = `Scribe Note — ${new Date().toLocaleString()}`;
      const { error } = await supabase.from("scribe_notes").insert({ title, transcript, summary });
      if (error) throw error;
      toast({ title: "Saved scribe note" });
      setModalOpen(false);
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message || String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed top-6 right-6 z-40">
        <Button
          onClick={recording ? stopRecording : startRecording}
          size="lg"
          className={recording ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}
          aria-label={recording ? "Stop scribe" : "Start scribe"}
        >
          {recording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scribe output</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <section>
              <h4 className="text-sm font-medium mb-1">Transcript</h4>
              <div className="rounded-md border bg-background p-3 max-h-48 overflow-auto text-sm whitespace-pre-wrap">{transcript || "(empty)"}</div>
            </section>
            <section>
              <h4 className="text-sm font-medium mb-1">Summary</h4>
              <div className="rounded-md border bg-background p-3 max-h-56 overflow-auto text-sm whitespace-pre-wrap">{summary || "(empty)"}</div>
            </section>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => copyToClipboard(transcript, "Transcript")}>Copy Transcript</Button>
            <Button variant="outline" onClick={() => copyToClipboard(summary, "Summary")}>Copy Summary</Button>
            <Button onClick={saveNote} disabled={saving}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
