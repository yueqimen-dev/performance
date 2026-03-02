import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { 
  X, 
  Send, 
  Sparkles, 
  User, 
  Bot,
  Maximize2
} from 'lucide-react';
import { useLayoutStore } from '../../store/useLayoutStore';

export function ChatSidebar() {
  const { isChatOpen, setChatOpen, setSidebarCollapsed, initialMessage, setInitialMessage } = useLayoutStore();
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hi! I can help analyze your performance data. Try asking about your traffic trends or visibility score.' }
  ]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Load initial message if present
  useEffect(() => {
    if (initialMessage && isChatOpen) {
      setInput(initialMessage);
      setInitialMessage(''); // Clear after loading
    }
  }, [initialMessage, isChatOpen, setInitialMessage]);

  // Close sidebar when chat is closed
  const handleClose = () => {
    setChatOpen(false);
    setSidebarCollapsed(false); // Restore main sidebar
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const currentInput = input;
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `I've analyzed the data for "${currentInput}". Based on recent trends, your visibility score has improved by 5% this week, mainly driven by better rankings on Perplexity.` 
      }]);
    }, 1000);
  };

  if (!isChatOpen) return null;

  return (
    <div 
      className={clsx(
        "fixed top-0 right-0 h-screen bg-white shadow-2xl border-l border-gray-200 z-50 transition-all duration-300 flex flex-col",
        isExpanded ? "w-[600px]" : "w-[400px]"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">AI Copilot</h3>
            <p className="text-xs text-gray-500">Performance Analyst</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={isExpanded ? "Collapse width" : "Expand width"}
          >
            <Maximize2 size={16} />
          </button>
          <button 
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={clsx("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'ai' ? "bg-purple-100 text-purple-600" : "bg-gray-200 text-gray-600"
            )}>
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={clsx(
              "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
              msg.role === 'ai' 
                ? "bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-none" 
                : "bg-purple-600 text-white rounded-tr-none"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about your data..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none text-sm min-h-[50px] max-h-[150px]"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 bottom-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-400">AI can make mistakes. Please double check important info.</p>
        </div>
      </div>
    </div>
  );
}
