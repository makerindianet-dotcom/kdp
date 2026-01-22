
import React, { useState } from 'react';
import { PageStyle, CollectionConfig } from '../types';
import { BookOpen, Sparkles, User, Palette } from 'lucide-react';

interface SidebarProps {
  onGenerate: (config: CollectionConfig) => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onGenerate, isLoading }) => {
  const [config, setConfig] = useState<CollectionConfig>({
    theme: 'Enchanted Forest Animals',
    style: PageStyle.Simple,
    targetAudience: 'Children aged 4-8'
  });

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2 text-indigo-600 mb-2">
        <BookOpen size={24} strokeWidth={2.5} />
        <h1 className="text-xl font-bold tracking-tight">KDP Canvas AI</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-500" /> Book Theme
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="e.g. Space Dinosaurs"
            value={config.theme}
            onChange={(e) => setConfig({ ...config, theme: e.target.value })}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <Palette size={16} className="text-indigo-500" /> Art Style
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={config.style}
            onChange={(e) => setConfig({ ...config, style: e.target.value as PageStyle })}
            disabled={isLoading}
          >
            {Object.values(PageStyle).map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <User size={16} className="text-indigo-500" /> Target Audience
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="e.g. Teens and Adults"
            value={config.targetAudience}
            onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
            disabled={isLoading}
          />
        </div>

        <button
          onClick={() => onGenerate(config)}
          disabled={isLoading || !config.theme}
          className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
            isLoading || !config.theme 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Generate 30 Prompts</>
          )}
        </button>
      </div>

      <div className="mt-auto p-4 bg-indigo-50 rounded-xl border border-indigo-100">
        <p className="text-xs text-indigo-700 font-medium uppercase tracking-wider mb-1">KDP Tips</p>
        <p className="text-xs text-indigo-600 leading-relaxed">
          Consistent art styles help your coloring books rank higher on Amazon. Use the "Mandala" style for adult meditative books.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
