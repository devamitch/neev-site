import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, Mic,
  Paperclip, Brain, Lightbulb,
  ShieldCheck, Heart, Star, Info, Settings, Clock, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import gsap from 'gsap';
import { getAI } from '../lib/ai';
import { useAuth } from '../contexts/AuthContext';

type Message = { text: string; isUser: boolean; timestamp: string; streaming?: boolean };

const SYSTEM_PROMPT = `You are the NEEV Family Guardian AI — a warm, wise, deeply empathetic AI assistant for families, especially parents managing childcare. You help with:
- Childcare advice (health, education, emotional wellbeing of children)
- Parenting tips grounded in child development science
- Family scheduling, coordination, and planning
- Medical guidance (when to see a doctor, vaccine schedules, nutrition)
- School and homework support strategies
- Family legacy and memory preservation
- Emotional support for parents

You speak with warmth, clarity, and cultural sensitivity. You respect Indian family values while being progressive and evidence-based. Keep responses concise (2-4 paragraphs max) unless asked for detail. When discussing medical topics, always remind the user to consult a qualified doctor for serious concerns.`;

function MessageBubble({ msg }: { msg: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex gap-4 max-w-[85%] ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className="w-10 h-10 border-none shrink-0 mt-0.5">
          {!msg.isUser && <AvatarImage src="/images/neev_real_guardian.png" className="object-cover" />}
          {msg.isUser ? (
            <AvatarFallback className="bg-primary text-on-primary font-sans text-sm font-bold">U</AvatarFallback>
          ) : (
            <AvatarFallback className="bg-primary-container text-primary font-serif text-lg">G</AvatarFallback>
          )}
        </Avatar>
        <div className={`p-5 rounded-2xl ${msg.isUser ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}>
          <p className="text-sm md:text-base font-sans leading-relaxed font-light opacity-90 whitespace-pre-wrap">
            {msg.text}
            {msg.streaming && <span className="inline-block w-1.5 h-4 bg-current ml-1 animate-pulse" />}
          </p>
          <div className={`flex items-center gap-2 mt-3 opacity-40 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[10px] font-sans uppercase tracking-widest font-bold">{msg.timestamp}</span>
            {!msg.isUser && <Sparkles className="w-2.5 h-2.5 text-primary" />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GuidancePage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const [messages, setMessages] = useState<Message[]>([
    {
      text: `Hello, ${firstName}! I'm your NEEV Family Guardian. I'm here to help with anything your family needs — childcare, health, school planning, parenting advice, or just a thoughtful conversation. How can I support you today?`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<{ role: string; parts: { text: string }[] }[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline()
        .from(headerRef.current?.children || [], { y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
        .from(chatAreaRef.current, { x: -30, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.4')
        .from(sidebarRef.current?.children || [], { x: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out' }, '-=0.6');
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = {
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    // Add to chat history for context
    chatHistoryRef.current.push({ role: 'user', parts: [{ text }] });

    // Placeholder streaming message
    const placeholderIdx = messages.length + 1; // will be appended
    const streamingMsg: Message = {
      text: '',
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      streaming: true,
    };
    setMessages(prev => [...prev, streamingMsg]);

    try {
      const ai = await getAI();
      const chat = ai.chats.create({
        model: 'gemini-2.0-flash',
        config: { systemInstruction: SYSTEM_PROMPT },
        history: chatHistoryRef.current.slice(0, -1), // all except last user msg
      });

      let fullText = '';
      const stream = await chat.sendMessageStream({ message: text });

      for await (const chunk of stream) {
        const delta = chunk.text ?? '';
        fullText += delta;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], text: fullText, streaming: true };
          return updated;
        });
      }

      // Mark streaming done
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], text: fullText, streaming: false };
        return updated;
      });

      // Record assistant response in history
      chatHistoryRef.current.push({ role: 'model', parts: [{ text: fullText }] });

    } catch (err: any) {
      const errMsg = err?.message?.includes('API key') ? 'API key not configured. Please add GEMINI_API_KEY.' : 'Something went wrong. Please try again.';
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: errMsg,
          streaming: false,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const suggestions = [
    { icon: Brain, label: 'Child Development', prompt: 'My child is 5 years old. What developmental milestones should I watch for?' },
    { icon: Lightbulb, label: 'Parenting Tip', prompt: 'Give me an evidence-based parenting tip for managing screen time.' },
    { icon: Heart, label: 'Health Question', prompt: 'What vaccines does a 2-year-old need? When should they be given?' },
    { icon: Star, label: 'School Help', prompt: 'My child is struggling with reading. How can I help at home?' },
  ];

  const wisdomCards = [
    {
      title: 'Responsive Parenting',
      description: 'Children whose emotions are acknowledged develop stronger emotional regulation and resilience. Validating feelings builds trust.',
      icon: Heart,
    },
    {
      title: 'Sleep & Learning',
      description: 'A well-rested child learns 40% more effectively. Consistent bedtime routines improve both sleep quality and academic performance.',
      icon: Clock,
    },
    {
      title: 'Digital Balance',
      description: 'The AAP recommends less than 1 hour of screen time for ages 2-5, and consistent limits for older children with content oversight.',
      icon: Brain,
    },
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col max-w-[1160px] mx-auto p-6 md:p-10 selection:bg-primary-container selection:text-on-surface relative overflow-hidden">
      {/* Header */}
      <div ref={headerRef} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
            <img src="/images/neev_real_guardian.png" alt="Guardian" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-0.5">
            <h1 className="font-serif text-3xl text-on-surface tracking-tight">AI <span className="italic text-primary/70">Guardian</span></h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-amber-400 animate-pulse' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-sans font-bold">
                {isStreaming ? 'Thinking…' : 'Always here for your family'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-10 h-10 text-on-surface-variant hover:text-on-surface rounded-full" onClick={() => {
            chatHistoryRef.current = [];
            setMessages([{
              text: `Hello again, ${firstName}! Fresh start — how can I help?`,
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }]);
          }}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Chat Area */}
        <div ref={chatAreaRef} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto no-scrollbar mb-4 pr-2" ref={scrollRef}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <div key={i}>
                  <MessageBubble msg={msg} />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="bg-surface-container p-4 rounded-2xl space-y-4">
            {/* Quick suggestion chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInput(s.prompt)} disabled={isStreaming}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container/40 hover:bg-primary hover:text-on-primary transition-all whitespace-nowrap text-xs font-sans font-semibold uppercase tracking-wider disabled:opacity-50">
                  <s.icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Input box */}
            <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-2">
              <Input
                placeholder="Ask your Guardian anything…"
                className="bg-transparent border-none h-12 focus:ring-0 font-sans text-on-surface placeholder:text-on-surface-variant/30 text-base"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                disabled={isStreaming}
              />
              <Button onClick={handleSend} disabled={isStreaming || !input.trim()}
                className="bg-primary text-on-primary hover:bg-primary/90 w-12 h-12 p-0 rounded-xl flex items-center justify-center shrink-0">
                {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>

            <p className="text-[10px] text-center text-on-surface-variant font-sans opacity-40 uppercase tracking-[0.3em] font-bold">
              Powered by Gemini · NEEV AI · Private
            </p>
          </div>
        </div>

        {/* Sidebar — Wisdom Cards */}
        <div ref={sidebarRef} className="hidden lg:flex flex-col w-[300px] gap-6 overflow-y-auto no-scrollbar">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-px bg-primary" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-sans font-bold">Evidence-Based Wisdom</span>
            </div>
            <h3 className="font-serif text-xl text-on-surface">Parenting Insights</h3>
          </div>
          <div className="space-y-4">
            {wisdomCards.map((card, i) => (
              <button key={i} onClick={() => setInput(`Tell me more about: ${card.title}`)}
                className="w-full text-left bg-surface-container rounded-2xl p-5 hover:bg-surface-container-low transition-all duration-300 cursor-pointer group border-none">
                <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-serif text-base text-on-surface mb-1 group-hover:text-primary transition-colors">{card.title}</h4>
                <p className="text-xs text-on-surface-variant font-sans font-light leading-relaxed opacity-80">{card.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <Card className="bg-primary-container rounded-2xl p-5 border-none">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-surface-container rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[10px] font-sans font-bold text-primary uppercase tracking-widest">Private & Secure</span>
              </div>
              <p className="text-xs text-on-surface-variant font-sans font-light leading-relaxed opacity-90">
                Your conversations are private. Chat history lives only in this session and is never stored on our servers.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
