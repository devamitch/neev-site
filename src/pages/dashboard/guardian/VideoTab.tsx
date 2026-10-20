import React, { useState, useRef } from 'react';
import { Video, Upload, Sparkles, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getAI } from '@/lib/ai';

export default function VideoTab() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('720p');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedVideoUrl(null);
    setStatusMessage("Initializing video generation...");

    try {
      const ai = await getAI(true); // Requires paid key for Veo
      
      const config: any = {
        numberOfVideos: 1,
        resolution: resolution,
        aspectRatio: aspectRatio
      };

      const requestPayload: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config
      };

      if (selectedImage && imagePreview) {
        const base64Data = imagePreview.split(',')[1];
        requestPayload.image = {
          imageBytes: base64Data,
          mimeType: selectedImage.type
        };
      }

      setStatusMessage("Sending request to Veo 3...");
      let operation = await ai.models.generateVideos(requestPayload);

      setStatusMessage("Generating video... This may take a few minutes.");
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        setStatusMessage("Still generating... Please wait.");
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // Fetch the video with the API key
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': apiKey || '',
          },
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setGeneratedVideoUrl(url);
          setStatusMessage("Video generated successfully!");
        } else {
          throw new Error("Failed to fetch the generated video.");
        }
      } else {
        throw new Error("No video URL returned from the operation.");
      }

    } catch (error) {
      console.error("Video generation error:", error);
      setStatusMessage("Failed to generate video. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-low/30 rounded-2xl border border-outline-variant/20 overflow-hidden p-6">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-primary flex items-center gap-3">
            <Video className="w-8 h-8" />
            Veo Video Studio
          </h2>
          <p className="text-on-surface-variant font-sans font-light">Transform text and images into stunning videos using Veo 3.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Prompt</label>
            <Input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic drone shot of a futuristic Indian city..."
              className="h-14 bg-surface"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Starting Image (Optional)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-mid transition-colors bg-surface"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-on-surface-variant/50 mb-2" />
                  <p className="text-sm text-on-surface-variant font-medium">Click to upload starting image</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSelect} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Aspect Ratio</label>
              <select 
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full h-12 px-4 rounded-md bg-surface border border-outline-variant/30 text-on-surface focus:border-primary outline-none"
              >
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Resolution</label>
              <select 
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full h-12 px-4 rounded-md bg-surface border border-outline-variant/30 text-on-surface focus:border-primary outline-none"
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>
          </div>

          <Button type="submit" disabled={!prompt.trim() || isGenerating} className="w-full h-12 bg-primary text-on-primary">
            {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5 mr-2" /> Generate Video</>}
          </Button>
        </form>

        {statusMessage && (
          <div className="p-4 rounded-lg bg-surface-container-mid text-center text-sm font-medium text-on-surface-variant">
            {statusMessage}
          </div>
        )}

        {generatedVideoUrl && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl bg-black">
            <video src={generatedVideoUrl} controls className="w-full h-auto max-h-[60vh] object-contain" autoPlay loop />
          </div>
        )}
      </div>
    </div>
  );
}
