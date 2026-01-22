
import React from 'react';
import { ColoringPage } from '../types';
import { Download, RefreshCw, AlertCircle, ImageIcon } from 'lucide-react';

interface ImageCardProps {
  page: ColoringPage;
  index: number;
  onGenerateImage: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ page, index, onGenerateImage }) => {
  const isPending = page.status === 'pending';
  const isGenerating = page.status === 'generating';
  const isCompleted = page.status === 'completed';
  const isFailed = page.status === 'failed';

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
        Page {index + 1}
      </div>

      <div className="aspect-[3/4] relative bg-gray-100 overflow-hidden flex items-center justify-center border-b border-gray-100">
        {isCompleted && page.imageUrl ? (
          <img
            src={page.imageUrl}
            alt={page.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-xs font-medium text-gray-400 animate-pulse">Sketching...</p>
          </div>
        ) : isFailed ? (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <AlertCircle className="text-red-400" size={32} />
            <p className="text-xs text-red-500 font-medium">Generation Failed</p>
            <button 
              onClick={() => onGenerateImage(page.id)}
              className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-300 group-hover:text-indigo-300 transition-colors">
            <ImageIcon size={48} strokeWidth={1} />
            <button
              onClick={() => onGenerateImage(page.id)}
              className="bg-white px-4 py-2 rounded-lg text-sm font-bold text-gray-600 shadow-sm border border-gray-200 hover:border-indigo-400 hover:text-indigo-600 transition-all"
            >
              Generate Image
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button 
              className="p-3 bg-white rounded-full text-gray-800 hover:scale-110 active:scale-95 transition-all shadow-lg"
              onClick={() => {
                const link = document.createElement('a');
                link.href = page.imageUrl!;
                link.download = `${page.title.replace(/\s+/g, '_')}.png`;
                link.click();
              }}
            >
              <Download size={20} />
            </button>
            <button 
              className="p-3 bg-white rounded-full text-gray-800 hover:scale-110 active:scale-95 transition-all shadow-lg"
              onClick={() => onGenerateImage(page.id)}
            >
              <RefreshCw size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {page.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic">
          "{page.prompt}"
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
