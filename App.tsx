
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ImageCard from './components/ImageCard';
import { ColoringPage, CollectionConfig } from './types';
import { generatePrompts, generateImage } from './services/geminiService';
import { LayoutGrid, Download, Zap, Sparkles, Files } from 'lucide-react';

const App: React.FC = () => {
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [isPromptsLoading, setIsPromptsLoading] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  const handleGeneratePrompts = async (config: CollectionConfig) => {
    setIsPromptsLoading(true);
    try {
      const newPages = await generatePrompts(config);
      setPages(newPages);
    } catch (error) {
      console.error("Failed to generate prompts:", error);
      alert("Error generating prompts. Please check your API key.");
    } finally {
      setIsPromptsLoading(false);
    }
  };

  const handleGenerateImage = async (id: string) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, status: 'generating' } : p));
    
    try {
      const targetPage = pages.find(p => p.id === id);
      if (!targetPage) return;
      
      const imageUrl = await generateImage(targetPage.prompt);
      setPages(prev => prev.map(p => p.id === id ? { 
        ...p, 
        status: 'completed', 
        imageUrl 
      } : p));
    } catch (error) {
      console.error("Image gen failed for:", id, error);
      setPages(prev => prev.map(p => p.id === id ? { ...p, status: 'failed' } : p));
    }
  };

  const handleBatchGenerate = async () => {
    if (isBatchGenerating) return;
    setIsBatchGenerating(true);
    
    // Process in smaller chunks to avoid rate limits and UI lag
    const pendingIds = pages.filter(p => p.status === 'pending' || p.status === 'failed').map(p => p.id);
    
    for (const id of pendingIds) {
      await handleGenerateImage(id);
    }
    
    setIsBatchGenerating(false);
  };

  const handleDownloadAll = () => {
    // In a real app, we might zip these, but here we just trigger sequential downloads or alert
    const completed = pages.filter(p => p.status === 'completed' && p.imageUrl);
    if (completed.length === 0) {
      alert("No completed images to download.");
      return;
    }
    alert(`Downloading ${completed.length} images... Check your browser downloads folder.`);
    completed.forEach((page, i) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = page.imageUrl!;
        link.download = `kdp_page_${i + 1}.png`;
        link.click();
      }, i * 500); // Stagger downloads to not freeze UI
    });
  };

  const progress = pages.length > 0 
    ? Math.round((pages.filter(p => p.status === 'completed').length / pages.length) * 100)
    : 0;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar onGenerate={handleGeneratePrompts} isLoading={isPromptsLoading} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header/Utility Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Files size={18} />
              <span className="font-semibold text-sm">30 Pages Collection</span>
            </div>
            {pages.length > 0 && (
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{progress}% Done</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {pages.length > 0 && (
              <>
                <button
                  onClick={handleBatchGenerate}
                  disabled={isBatchGenerating || progress === 100}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                    isBatchGenerating || progress === 100
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                  }`}
                >
                  <Zap size={16} fill="currentColor" />
                  {isBatchGenerating ? 'Processing...' : 'Generate All Images'}
                </button>
                <button
                  onClick={handleDownloadAll}
                  disabled={progress === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                    progress === 0
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                  }`}
                >
                  <Download size={16} />
                  Download Bundle
                </button>
              </>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {pages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
                <Sparkles size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Masterpiece</h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Enter a theme in the sidebar to generate a professional 30-page coloring book collection ready for Amazon KDP.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white p-4 rounded-xl border border-dashed border-gray-300">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Step 1</p>
                  <p className="text-xs font-medium text-gray-600 italic">Generate unique AI prompts</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-dashed border-gray-300">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Step 2</p>
                  <p className="text-xs font-medium text-gray-600 italic">Render 4K line-art imagery</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {pages.map((page, index) => (
                <ImageCard 
                  key={page.id} 
                  page={page} 
                  index={index} 
                  onGenerateImage={handleGenerateImage} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Help Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="group relative">
            <button className="w-12 h-12 bg-white rounded-full shadow-2xl border border-gray-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300">
              <LayoutGrid size={24} />
            </button>
            <div className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all origin-bottom-right">
              <p className="text-sm font-bold text-gray-800 mb-2">Collection Overview</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Pages Generated:</span>
                  <span className="font-bold text-indigo-600">{pages.length} / 30</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Completed Art:</span>
                  <span className="font-bold text-emerald-600">{pages.filter(p => p.status === 'completed').length}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 leading-tight">
                    * Make sure all 30 pages are high-quality before uploading to KDP to reduce return rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
