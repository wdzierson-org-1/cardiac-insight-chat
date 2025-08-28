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
    <div className="fixed top-8 right-8 z-40 flex items-center gap-3">
      {!isConnected ? (
        <Button 
          onClick={start} 
          variant="outline"
          className={speaking ? "animate-pulse" : ""}
        >
          Start Conversational Voice
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={end}
            className={speaking ? "animate-pulse" : ""}
          >
            End
          </Button>
          {speaking && (
            <span className="animate-pulse text-muted-foreground">Jenny speaking…</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RealtimeVoiceInterface;
