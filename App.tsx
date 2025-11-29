import React, { useState } from 'react';
import BirthForm from './components/BirthForm';
import AnalysisView from './components/AnalysisView';
import ChatInterface from './components/ChatInterface';
import { generateChartData } from './services/geminiService';
import { BirthDetails, ChartAnalysis } from './types';

const App: React.FC = () => {
  const [chartData, setChartData] = useState<ChartAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (details: BirthDetails) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateChartData(details);
      setChartData(data);
    } catch (e: any) {
      setError(e.message || "无法生成星盘");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setChartData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      <header className="p-6 text-center">
        <h1 className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-white drop-shadow-lg mb-2 cursor-pointer" onClick={handleReset}>
          星际洞察
        </h1>
        <p className="text-slate-400 text-sm font-light tracking-widest uppercase">
          AI 驱动的占星助手
        </p>
      </header>

      <main className="flex-1 px-4 w-full max-w-7xl mx-auto flex flex-col items-center">
        {error && (
           <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg backdrop-blur-md max-w-md text-center">
             {error}
           </div>
        )}

        {!chartData ? (
          <div className="w-full flex flex-col items-center justify-center flex-1 min-h-[500px] animate-fade-in">
             <div className="text-center mb-8 max-w-xl text-slate-300">
               <p className="mb-4">
                 解锁星辰的秘密。输入你的出生信息以生成详细的本命盘，
                 可视化你的行星位置，并与 AI 占星师探讨你的命运。
               </p>
             </div>
             <BirthForm onSubmit={handleGenerate} isLoading={loading} />
          </div>
        ) : (
          <div className="w-full animate-fade-in space-y-12">
            <div className="flex justify-between items-center px-4">
              <h2 className="text-xl text-slate-300">分析结果</h2>
              <button 
                onClick={handleReset} 
                className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                创建新星盘
              </button>
            </div>
            
            <AnalysisView data={chartData} />
            <ChatInterface chartData={chartData} />
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-slate-600 text-xs py-4">
        <p>Powered by Gemini 2.5 Flash • 普拉西德宫位制 (近似计算)</p>
      </footer>

      {/* Tailwind Utility for Custom Animations if needed, usually in config, simulating here via style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.4);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.6);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;