import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Square, Sparkles, Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getAI } from '@/lib/ai';
import { Modality, LiveServerMessage } from '@google/genai';

export default function VoiceTab() {
  const [mode, setMode] = useState<'live' | 'tts'>('live');
  
  // Live API State
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);
  const sessionPromiseRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // TTS State
  const [ttsText, setTtsText] = useState('');
  const [isGeneratingTts, setIsGeneratingTts] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);

  // Live API Functions
  const playNextAudio = () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0 || !audioContextRef.current) return;
    
    isPlayingRef.current = true;
    const float32 = audioQueueRef.current.shift()!;
    
    const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      isPlayingRef.current = false;
      playNextAudio();
    };
    sourceNodeRef.current = source;
    source.start();
  };

  const startLiveSession = async () => {
    setIsLiveConnecting(true);
    try {
      const ai = await getAI();
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      processor.onaudioprocess = (e) => {
        if (!isLiveConnected) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
        }
        
        // Convert to base64
        const buffer = new ArrayBuffer(pcm16.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < pcm16.length; i++) {
          view.setInt16(i * 2, pcm16[i], true);
        }
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = btoa(binary);

        if (sessionPromiseRef.current) {
          sessionPromiseRef.current.then((session: any) => {
            session.sendRealtimeInput({
              audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
            });
          });
        }
      };

      sessionPromiseRef.current = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        callbacks: {
          onopen: () => {
            setIsLiveConnected(true);
            setIsLiveConnecting(false);
            setLiveTranscript(prev => [...prev, "Connected to Guardian Voice."]);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              // Decode base64 to Float32Array
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const pcm16 = new Int16Array(bytes.buffer);
              const float32 = new Float32Array(pcm16.length);
              for (let i = 0; i < pcm16.length; i++) {
                float32[i] = pcm16[i] / 32768.0;
              }
              
              audioQueueRef.current.push(float32);
              playNextAudio();
            }
            
            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              if (sourceNodeRef.current) {
                sourceNodeRef.current.stop();
              }
            }
          },
          onerror: (err: any) => {
            console.error("Live API Error:", err);
            stopLiveSession();
          },
          onclose: () => {
            stopLiveSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are NEEV's AI Guardian, a wise and helpful family assistant. Keep answers brief and conversational.",
        },
      });

    } catch (err) {
      console.error("Failed to start live session:", err);
      setIsLiveConnecting(false);
    }
  };

  const stopLiveSession = () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then((session: any) => session.close());
      sessionPromiseRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsLiveConnected(false);
    setIsLiveConnecting(false);
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setLiveTranscript(prev => [...prev, "Disconnected."]);
  };

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  // TTS Functions
  const handleGenerateTts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ttsText.trim() || isGeneratingTts) return;

    setIsGeneratingTts(true);
    setTtsAudioUrl(null);

    try {
      const ai = await getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: ttsText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioSrc = `data:audio/wav;base64,${base64Audio}`;
        setTtsAudioUrl(audioSrc);
      }
    } catch (err) {
      console.error("TTS Error:", err);
      alert("Failed to generate speech.");
    } finally {
      setIsGeneratingTts(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-low/30 rounded-2xl border border-outline-variant/20 overflow-hidden">
      <div className="flex border-b border-outline-variant/20">
        <button 
          className={`flex-1 py-4 text-sm font-medium tracking-wider uppercase transition-colors ${mode === 'live' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-mid'}`}
          onClick={() => setMode('live')}
        >
          Conversational Voice
        </button>
        <button 
          className={`flex-1 py-4 text-sm font-medium tracking-wider uppercase transition-colors ${mode === 'tts' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-mid'}`}
          onClick={() => setMode('tts')}
        >
          Text to Speech
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6">
        {mode === 'live' ? (
          <div className="flex flex-col items-center justify-center h-full space-y-8 max-w-2xl mx-auto text-center">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl text-primary">Live Voice Conversation</h2>
              <p className="text-on-surface-variant font-light">Speak naturally with the Guardian AI in real-time.</p>
            </div>

            <div className="relative">
              <div className={`absolute inset-0 bg-primary/20 rounded-full blur-xl transition-all duration-1000 ${isLiveConnected ? 'scale-150 opacity-100 animate-pulse' : 'scale-100 opacity-0'}`}></div>
              <Button 
                onClick={isLiveConnected ? stopLiveSession : startLiveSession}
                disabled={isLiveConnecting}
                className={`w-32 h-32 rounded-full relative z-10 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${
                  isLiveConnected 
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_40px_rgba(220,38,38,0.4)]' 
                    : 'bg-primary text-on-primary hover:bg-primary/90 shadow-xl shadow-primary/20'
                }`}
              >
                {isLiveConnecting ? (
                  <Loader2 className="w-10 h-10 animate-spin" />
                ) : isLiveConnected ? (
                  <>
                    <Square className="w-10 h-10 fill-current" />
                    <span className="text-xs font-bold tracking-widest uppercase">Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10" />
                    <span className="text-xs font-bold tracking-widest uppercase">Start</span>
                  </>
                )}
              </Button>
            </div>

            <div className="w-full max-w-md h-48 bg-surface border border-outline-variant/20 rounded-xl p-4 overflow-y-auto text-left space-y-2 shadow-inner">
              {liveTranscript.length === 0 ? (
                <p className="text-sm text-on-surface-variant/50 italic text-center mt-16">Status logs will appear here...</p>
              ) : (
                liveTranscript.map((log, i) => (
                  <p key={i} className="text-sm text-on-surface-variant font-mono">{log}</p>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl text-primary flex items-center gap-3">
                <Volume2 className="w-8 h-8" />
                Speech Synthesis
              </h2>
              <p className="text-on-surface-variant font-light">Generate natural-sounding speech from text.</p>
            </div>

            <form onSubmit={handleGenerateTts} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Text to Speak</label>
                <textarea 
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  placeholder="Type the message you want the Guardian to speak..."
                  className="w-full h-32 p-4 rounded-xl bg-surface border border-outline-variant/30 text-on-surface focus:border-primary outline-none resize-none font-sans"
                  required
                />
              </div>

              <Button type="submit" disabled={!ttsText.trim() || isGeneratingTts} className="w-full h-12 bg-primary text-on-primary">
                {isGeneratingTts ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5 mr-2" /> Generate Speech</>}
              </Button>
            </form>

            {ttsAudioUrl && (
              <Card className="p-6 bg-surface border-outline-variant/20 shadow-lg flex flex-col items-center gap-4">
                <h3 className="font-serif text-xl text-primary">Generated Audio</h3>
                <audio src={ttsAudioUrl} controls className="w-full max-w-md" autoPlay />
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
