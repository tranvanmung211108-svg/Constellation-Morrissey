import React, { useState, useEffect, useMemo } from 'react';
import { BirthDetails } from '../types';

interface BirthFormProps {
  onSubmit: (details: BirthDetails) => void;
  isLoading: boolean;
}

const MONTHS = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月"
];

const BirthForm: React.FC<BirthFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<BirthDetails>({
    name: '',
    date: '',
    time: '',
    location: '',
  });

  // Date selection state
  const [year, setYear] = useState<number | ''>('');
  const [month, setMonth] = useState<number | ''>(''); // 0-11
  const [day, setDay] = useState<number | ''>('');

  // Generate years (1900 - Current)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 125 }, (_, i) => currentYear - i);
  }, []);

  // Calculate days in month based on year and month
  const daysInMonth = useMemo(() => {
    if (year === '' || month === '') return 31; // Default max
    // Create date for next month day 0 (which is last day of current month)
    // Month in Date constructor is 0-indexed.
    return new Date(Number(year), Number(month) + 1, 0).getDate();
  }, [year, month]);

  // Sync date parts to formData.date
  useEffect(() => {
    if (year !== '' && month !== '' && day !== '') {
      const y = year;
      const m = String(Number(month) + 1).padStart(2, '0');
      const d = String(day).padStart(2, '0');
      setFormData(prev => ({ ...prev, date: `${y}-${m}-${d}` }));
    } else {
      setFormData(prev => ({ ...prev, date: '' }));
    }
  }, [year, month, day]);

  // Reset day if it exceeds the new month's max days
  useEffect(() => {
    if (day !== '' && day > daysInMonth) {
      setDay('');
    }
  }, [daysInMonth, day]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.date && formData.location) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700 shadow-2xl">
      <h2 className="text-2xl font-serif text-center mb-6 text-indigo-300">揭示你的星际蓝图</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">姓名</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="请输入姓名"
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">出生日期</label>
          <div className="grid grid-cols-3 gap-2">
            {/* Year Selector */}
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>年</option>
                {years.map(y => (
                  <option key={y} value={y} className="bg-slate-800">{y}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            {/* Month Selector */}
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : '')}
                disabled={year === ''}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                required
              >
                <option value="" disabled>月</option>
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx} className="bg-slate-800">{m}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            {/* Day Selector */}
            <div className="relative">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value ? Number(e.target.value) : '')}
                disabled={year === '' || month === ''}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                required
              >
                <option value="" disabled>日</option>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d} className="bg-slate-800">{d}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">出生时间</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">出生地点</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="城市, 国家"
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02]
            ${isLoading 
              ? 'bg-indigo-900 cursor-wait opacity-80' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在咨询星辰...
            </span>
          ) : '生成星盘'}
        </button>
      </form>
    </div>
  );
};

export default BirthForm;