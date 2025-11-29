import React, { useState, useRef, useEffect } from 'react';
import { ChartAnalysis, ChatMessage } from '../types';
import { chatWithAstrologer } from '../services/geminiService';
import { ZODIAC_CN } from '../constants';

interface ChatInterfaceProps {
  chartData: ChartAnalysis;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chartData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithAstrologer(history, userMessage.text, chartData);
      
      const botMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "与星辰的连接中断了。请重试。", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sunSignCN = ZODIAC_CN[chartData.bigThree.sun.sign] || chartData.bigThree.sun.sign;
  const risingSignCN = ZODIAC_CN[chartData.bigThree.rising.sign] || chartData.bigThree.rising.sign;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-600 overflow-hidden flex flex-col h-[500px] shadow-2xl">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="text-lg font-serif text-indigo-300 flex items-center gap-2">
            <span>✨</span> 询问星象
          </h3>
          <p className="text-xs text-slate-400">基于你的星盘询问事业、爱情或特定行运。</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 mt-12 italic">
              "我的金星在{sunSignCN}说明了什么爱情观？"<br/>
              "什么样的职业适合{risingSignCN}上升？"
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600'
                  } ${msg.isError ? 'bg-red-900/50 border-red-500' : ''}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-slate-700 text-slate-200 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s'}}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-700">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="询问关于你星盘的问题..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50 transition"
            >
              发送
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;