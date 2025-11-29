import React from 'react';
import { ChartAnalysis } from '../types';
import NatalChart from './NatalChart';
import { ZODIAC_CN, ELEMENT_CN } from '../constants';

interface AnalysisViewProps {
  data: ChartAnalysis;
}

const StatCard: React.FC<{ label: string; value: string; sub?: string; color: string }> = ({ label, value, sub, color }) => (
  <div className={`p-4 rounded-xl bg-slate-800/40 border border-slate-700 backdrop-blur-sm flex flex-col items-center text-center border-l-4`} style={{ borderLeftColor: color }}>
    <span className="text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</span>
    <span className="text-xl font-serif font-bold text-slate-100">{value}</span>
    {sub && <span className="text-xs text-slate-500 mt-1 line-clamp-2">{sub}</span>}
  </div>
);

const AnalysisView: React.FC<AnalysisViewProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="太阳星座" 
          value={ZODIAC_CN[data.bigThree.sun.sign] || data.bigThree.sun.sign} 
          sub={data.bigThree.sun.summary}
          color="#f59e0b"
        />
        <StatCard 
          label="月亮星座" 
          value={ZODIAC_CN[data.bigThree.moon.sign] || data.bigThree.moon.sign} 
          sub={data.bigThree.moon.summary}
          color="#e2e8f0"
        />
        <StatCard 
          label="上升星座" 
          value={ZODIAC_CN[data.bigThree.rising.sign] || data.bigThree.rising.sign} 
          sub={data.bigThree.rising.summary}
          color="#6366f1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Chart Visualization */}
        <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 flex flex-col items-center">
          <h3 className="text-lg font-serif text-slate-300 mb-2">本命星盘</h3>
          <NatalChart data={data} />
          
          {/* Elemental Balance - Simple Bars */}
          <div className="w-full mt-4 px-4 space-y-2">
            <h4 className="text-xs uppercase text-slate-500 font-bold tracking-widest mb-2">元素平衡</h4>
            {Object.entries(data.elementalBalance).map(([element, value]) => (
              <div key={element} className="flex items-center gap-2">
                <span className="w-12 text-xs capitalize text-slate-400">{ELEMENT_CN[element] || element}</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      element === 'fire' ? 'bg-red-500' :
                      element === 'earth' ? 'bg-green-500' :
                      element === 'air' ? 'bg-yellow-400' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-8 text-right">{value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Textual Analysis */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <h3 className="text-2xl font-serif text-indigo-300 mb-4">星盘解读</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {data.overview}
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 max-h-[400px] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-serif text-purple-300 mb-4">行星位置</h3>
            <div className="space-y-3">
              {data.planets.map((planet, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition border border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-serif font-bold text-slate-400 text-xs">
                      {planet.name.substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{planet.name}</div>
                      <div className="text-xs text-slate-500">{planet.house} 宫 {planet.isRetrograde && '• 逆行'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-indigo-300">{ZODIAC_CN[planet.sign] || planet.sign}</div>
                    <div className="text-xs text-slate-600">{planet.degree.toFixed(2)}°</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;