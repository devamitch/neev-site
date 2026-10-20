import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Image as ImageIcon, Video, Mic, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import ChatTab from './guardian/ChatTab';
import VisionTab from './guardian/VisionTab';
import VideoTab from './guardian/VideoTab';
import VoiceTab from './guardian/VoiceTab';

export default function GuardianModule() {
  const [activeTab, setActiveTab] = useState<'chat' | 'vision' | 'video' | 'voice'>('chat');
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(headerRef.current?.children || [], {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from(contentRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'expo.out'
      }, "-=0.4");
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-[1160px] mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-ink mb-2">AI Guardian</h1>
          <p className="text-sm text-text-muted font-sans font-light">Your family's elder, always present, never intrusive.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-sage-mist text-sage-dim rounded-full text-[0.68rem] font-medium uppercase tracking-wider font-sans">
          <Sparkles className="w-4 h-4" />
          Active
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === 'chat' 
              ? 'bg-primary text-on-primary shadow-md' 
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-mid'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('vision')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === 'vision' 
              ? 'bg-primary text-on-primary shadow-md' 
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-mid'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Vision & Generate
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === 'video' 
              ? 'bg-primary text-on-primary shadow-md' 
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-mid'
          }`}
        >
          <Video className="w-4 h-4" />
          Veo Studio
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === 'voice' 
              ? 'bg-primary text-on-primary shadow-md' 
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-mid'
          }`}
        >
          <Mic className="w-4 h-4" />
          Voice & Speech
        </button>
      </div>

      {/* Tab Content */}
      <div ref={contentRef} className="flex-1 min-h-0">
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'vision' && <VisionTab />}
        {activeTab === 'video' && <VideoTab />}
        {activeTab === 'voice' && <VoiceTab />}
      </div>
    </div>
  );
}
