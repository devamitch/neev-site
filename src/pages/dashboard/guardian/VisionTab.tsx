import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Video, Upload, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getAI } from '@/lib/ai';
import ReactMarkdown from 'react-markdown';

export default function VisionTab() {
  const [mode, setMode] = useState<'generate' | 'analyze'>('generate');
  
  // Generate State
  const [genPrompt, setGenPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');
  const [useFastGen, setUseFastGen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Analyze State
  const [analyzePrompt, setAnalyzePrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const ai = await getAI(true); // requires paid key
      
      const model = useFastGen ? 'gemini-3.1-flash-image-preview' : 'gemini-3-pro-image-preview';
      
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [{ text: genPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: imageSize
          }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setGeneratedImage(`data:${part.inlineData.mimeType};base64,${base64EncodeString}`);
          break;
        }
      }
    } catch (error) {
      console.error("Image generation error:", error);
      alert("Failed to generate image. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !analyzePrompt.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const ai = await getAI(); // Use free key for analysis
      
      // Convert file to base64
      const base64Data = filePreview?.split(',')[1];
      if (!base64Data) throw new Error("Invalid file data");

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: selectedFile.type,
              },
            },
            { text: analyzePrompt },
          ],
        },
      });

      setAnalysisResult(response.text || "No analysis provided.");
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisResult("Failed to analyze the media. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-low/30 rounded-2xl border border-outline-variant/20 overflow-hidden">
      {/* Mode Toggle */}
      <div className="flex border-b border-outline-variant/20">
        <button 
          className={`flex-1 py-4 text-sm font-medium tracking-wider uppercase transition-colors ${mode === 'generate' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-mid'}`}
          onClick={() => setMode('generate')}
        >
          Generate Image
        </button>
        <button 
          className={`flex-1 py-4 text-sm font-medium tracking-wider uppercase transition-colors ${mode === 'analyze' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-mid'}`}
          onClick={() => setMode('analyze')}
        >
          Analyze Media
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6">
        {mode === 'generate' ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Prompt</label>
                <Input 
                  value={genPrompt}
                  onChange={(e) => setGenPrompt(e.target.value)}
                  placeholder="A hyper-realistic portrait of an Indian family..."
                  className="h-14 bg-surface"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Aspect Ratio</label>
                  <select 
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full h-12 px-4 rounded-md bg-surface border border-outline-variant/30 text-on-surface focus:border-primary outline-none"
                  >
                    {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(ar => (
                      <option key={ar} value={ar}>{ar}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Size</label>
                  <select 
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value)}
                    className="w-full h-12 px-4 rounded-md bg-surface border border-outline-variant/30 text-on-surface focus:border-primary outline-none"
                  >
                    {['1K', '2K', '4K'].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  type="button"
                  variant={useFastGen ? "primary" : "outline"}
                  onClick={() => setUseFastGen(!useFastGen)}
                  className="rounded-full text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-2" /> {useFastGen ? "Fast Generation (3.1 Flash)" : "Pro Generation (3.0 Pro)"}
                </Button>
                <p className="text-[0.65rem] text-on-surface-variant italic">
                  {useFastGen ? "Optimized for speed and editing." : "Optimized for high-quality artistic results."}
                </p>
              </div>

              <Button type="submit" disabled={!genPrompt.trim() || isGenerating} className="w-full h-12 bg-primary text-on-primary">
                {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5 mr-2" /> Generate Image</>}
              </Button>
            </form>

            {generatedImage && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl">
                <img src={generatedImage} alt="Generated" className="w-full h-auto object-contain bg-surface-container-lowest" />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 max-w-3xl mx-auto">
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Upload Image or Video</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-outline-variant/50 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-mid transition-colors bg-surface"
                >
                  {filePreview ? (
                    selectedFile?.type.startsWith('video/') ? (
                      <video src={filePreview} className="max-h-64 rounded-lg" controls />
                    ) : (
                      <img src={filePreview} alt="Preview" className="max-h-64 rounded-lg object-contain" />
                    )
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-on-surface-variant/50 mb-4" />
                      <p className="text-on-surface-variant font-medium">Click to upload media</p>
                      <p className="text-xs text-on-surface-variant/60 mt-2">Supports JPG, PNG, MP4</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    accept="image/*,video/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">What would you like to know?</label>
                <Input 
                  value={analyzePrompt}
                  onChange={(e) => setAnalyzePrompt(e.target.value)}
                  placeholder="Describe this image in detail..."
                  className="h-14 bg-surface"
                />
              </div>

              <Button type="submit" disabled={!selectedFile || !analyzePrompt.trim() || isAnalyzing} className="w-full h-12 bg-primary text-on-primary">
                {isAnalyzing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</> : <><Sparkles className="w-5 h-5 mr-2" /> Analyze Media</>}
              </Button>
            </form>

            {analysisResult && (
              <Card className="p-6 bg-surface border-outline-variant/20 shadow-lg">
                <h3 className="font-serif text-xl mb-4 text-primary">Analysis Result</h3>
                <div className="markdown-body text-sm font-sans leading-relaxed text-on-surface">
                  <ReactMarkdown>{analysisResult}</ReactMarkdown>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
