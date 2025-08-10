import { supabase } from "@/integrations/supabase/client";

export class RealtimeChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;

  constructor(private onMessage: (message: any) => void) {
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
  }

  async init(instructions?: string) {
    try {
      // 1) Get ephemeral token from Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("openai-realtime-session", {
        body: { instructions },
      });
      if (error) throw error;

      const EPHEMERAL_KEY = (data as any)?.client_secret?.value;
      if (!EPHEMERAL_KEY) throw new Error("Failed to get ephemeral key from OpenAI session");

      // 2) Create peer connection
      this.pc = new RTCPeerConnection();

      // Remote audio track
      this.pc.ontrack = (e) => {
        this.audioEl.srcObject = e.streams[0];
      };

      // 3) Add local microphone track
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.pc.addTrack(ms.getTracks()[0]);

      // 4) Data channel for events
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.addEventListener("message", (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log("Realtime event:", event);
          this.onMessage?.(event);
        } catch {
          // Non-JSON events can be ignored
        }
      });

      // 5) Offer/answer exchange
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });
      const answer = { type: "answer" as RTCSdpType, sdp: await sdpResponse.text() };
      await this.pc.setRemoteDescription(answer);

      console.log("OpenAI Realtime WebRTC connected");
    } catch (err) {
      console.error("Error initializing RealtimeChat:", err);
      throw err;
    }
  }

  sendMessage(text: string) {
    if (!this.dc || this.dc.readyState !== "open") {
      throw new Error("Data channel is not open");
    }

    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text,
          },
        ],
      },
    };

    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({ type: "response.create" }));
  }

  disconnect() {
    try { this.dc?.close(); } catch {}
    try { this.pc?.close(); } catch {}
    this.dc = null;
    this.pc = null;
  }
}
