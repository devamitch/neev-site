import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MapPin, Search, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getAI } from '@/lib/ai';
import { ThinkingLevel, GenerateContentResponse } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  sender: 'user' | 'guardian';
  text: string;
  time: string;
  links?: { title: string; uri: string }[];
}

export default function ChatTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'guardian',
      text: "Hello. I am your family's AI Guardian. How can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Toggles
  const [useFast, setUseFast] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = await getAI();
      
      let model = 'gemini-3.1-pro-preview';
      const config: any = {};
      
      if (useFast) {
        model = 'gemini-3.1-flash-lite-preview';
      } else if (useSearch) {
        model = 'gemini-3-flash-preview';
        config.tools = [{ googleSearch: {} }];
      } else if (useMaps) {
        model = 'gemini-2.5-flash';
        config.tools = [{ googleMaps: {} }];
        
        // Try to get user location for maps grounding
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          config.toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }
          };
        } catch (locErr) {
          console.warn("Could not get location for maps grounding", locErr);
        }
      } else if (useThinking) {
        model = 'gemini-3.1-pro-preview';
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      if (!chatRef.current || chatRef.current.model !== model) {
        chatRef.current = ai.chats.create({
          model,
          config
        });
        // Store the model name on the chat object to detect changes
        (chatRef.current as any).model = model;
      }

      const responseStream = await chatRef.current.sendMessageStream({ message: userText });
      
      const guardianMessageId = (Date.now() + 1).toString();
      setMessages(prev => [
        ...prev, 
        { 
          id: guardianMessageId, 
          sender: 'guardian', 
          text: '', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);

      let fullText = '';
      let links: { title: string; uri: string }[] = [];

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages(prev => prev.map(msg => 
            msg.id === guardianMessageId ? { ...msg, text: fullText } : msg
          ));
        }
        
        // Extract grounding links if available
        const chunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          chunks.forEach((chunk: any) => {
            if (chunk.web?.uri && chunk.web?.title) {
              links.push({ uri: chunk.web.uri, title: chunk.web.title });
            } else if (chunk.maps?.uri && chunk.maps?.title) {
              links.push({ uri: chunk.maps.uri, title: chunk.maps.title });
            }
          });
        }
      }

      if (links.length > 0) {
        // Deduplicate links
        const uniqueLinks = Array.from(new Map(links.map(item => [item.uri, item])).values());
        setMessages(prev => prev.map(msg => 
          msg.id === guardianMessageId ? { ...msg, links: uniqueLinks } : msg
        ));
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'guardian',
        text: "I'm sorry, I encountered an error. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-low/30 rounded-2xl border border-outline-variant/20 overflow-hidden">
      {/* Toggles */}
      <div className="p-4 border-b border-outline-variant/20 flex flex-wrap gap-3 bg-surface/50 backdrop-blur-md">
        <Button 
          variant={useFast ? "primary" : "outline"} 
          size="sm" 
          onClick={() => { setUseFast(!useFast); setUseThinking(false); chatRef.current = null; }}
          className="rounded-full text-xs"
        >
          <Zap className="w-3 h-3 mr-2" /> Fast Response
        </Button>
        <Button 
          variant={useThinking ? "primary" : "outline"} 
          size="sm" 
          onClick={() => { setUseThinking(!useThinking); setUseFast(false); chatRef.current = null; }}
          className="rounded-full text-xs"
        >
          <Brain className="w-3 h-3 mr-2" /> Deep Thinking
        </Button>
        <Button 
          variant={useSearch ? "primary" : "outline"} 
          size="sm" 
          onClick={() => { setUseSearch(!useSearch); setUseMaps(false); chatRef.current = null; }}
          className="rounded-full text-xs"
        >
          <Search className="w-3 h-3 mr-2" /> Web Search
        </Button>
        <Button 
          variant={useMaps ? "primary" : "outline"} 
          size="sm" 
          onClick={() => { setUseMaps(!useMaps); setUseSearch(false); chatRef.current = null; }}
          className="rounded-full text-xs"
        >
          <MapPin className="w-3 h-3 mr-2" /> Maps Data
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <Avatar className="w-10 h-10 border border-outline-variant/20 shadow-sm shrink-0">
              {msg.sender === 'guardian' ? (
                <AvatarFallback className="bg-primary-container text-primary"><Sparkles className="w-5 h-5" /></AvatarFallback>
              ) : (
                <AvatarFallback className="bg-secondary-container text-secondary">U</AvatarFallback>
              )}
            </Avatar>
            <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
              <div className={`p-4 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-primary text-on-primary rounded-tr-sm' 
                  : 'bg-surface border border-outline-variant/20 text-on-surface rounded-tl-sm shadow-sm'
              }`}>
                <div className="markdown-body text-sm font-sans leading-relaxed">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-outline-variant/20 flex flex-col gap-2">
                    <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Sources:</span>
                    {msg.links.map((link, idx) => (
                      <a key={idx} href={link.uri} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate max-w-full block">
                        {link.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[0.65rem] text-on-surface-variant mt-2 font-medium tracking-wider">{msg.time}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <Avatar className="w-10 h-10 border border-outline-variant/20 shadow-sm shrink-0">
              <AvatarFallback className="bg-primary-container text-primary"><Sparkles className="w-5 h-5" /></AvatarFallback>
            </Avatar>
            <div className="p-4 rounded-2xl bg-surface border border-outline-variant/20 rounded-tl-sm shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-outline-variant/20">
        <form onSubmit={handleSend} className="relative flex items-center">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask the Guardian..."
            className="w-full h-14 pl-6 pr-16 rounded-full bg-surface-container-low border-outline-variant/30 focus:bg-surface focus:border-primary transition-all font-sans"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-2 w-10 h-10 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-transform active:scale-95"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="w-4 h-4 ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
}
