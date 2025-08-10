import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RealtimeChat } from "@/utils/RealtimeAudio";

const RealtimeVoiceInterface: React.FC = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    // Basic speaking detection via audio events (optional)
    if (event?.type === "response.audio.delta") setSpeaking(true);
    if (event?.type === "response.audio.done") setSpeaking(false);
  };

  const start = async () => {
    try {
      chatRef.current = new RealtimeChat(handleMessage);
      await chatRef.current.init(
        "You are Jenny, a helpful clinical assistant. Be concise and conversational."
      );
      setIsConnected(true);
      toast({ title: "Connected", description: "Jenny is listening." });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Unable to start voice session",
        variant: "destructive",
      });
    }
  };

  const end = () => {
    chatRef.current?.disconnect();
    chatRef.current = null;
    setIsConnected(false);
    setSpeaking(false);
  };

  useEffect(() => () => end(), []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
      {!isConnected ? (
        <Button onClick={start} className="bg-primary text-primary-foreground">
          Start Conversational Voice
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={end}>End</Button>
          {speaking && (
            <span className="animate-pulse text-muted-foreground">Jenny speaking…</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RealtimeVoiceInterface;
