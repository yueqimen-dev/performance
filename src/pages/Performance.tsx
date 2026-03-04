import React, { useState, useEffect, useRef } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useLayoutStore } from '../store/useLayoutStore';
import { 
  BarChart2, 
  MessageSquare, 
  Settings, 
  Lock,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Clock,
  Info,
  HelpCircle,
  Save,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  X,
  Zap,
  PenTool,
  Minus,
  Users,
  Plus,
  Trash2,
  Edit2,
  Play, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Check,
  Sparkles,
  History,
  Download,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

type PlatformStatus = 'mentioned' | 'not_mentioned' | 'negative';
type PlatformId = 'ChatGPT' | 'Claude' | 'Perplexity' | 'Gemini' | 'SearchGPT';

type TabId = 'data' | 'query' | 'setting';
type Tab = { id: TabId; label: string; icon: LucideIcon };

interface Query {
  id: string;
  text: string;
  platforms: Record<string, PlatformStatus>;
  positions?: Record<PlatformId, number | null>;
}

interface KeywordGroup {
  id: string;
  keyword: string;
  queries: Query[];
}

export default function Performance() {
  const { role, isGA4Connected, setGA4Connected, setRole } = useUserStore();
  const { setChatOpen, setSidebarCollapsed, setInitialMessage } = useLayoutStore();
  const [activeTab, setActiveTab] = useState<TabId>('data');
  const ga4SectionRef = useRef<HTMLDivElement | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [timeMenuOpen, setTimeMenuOpen] = useState(false);
  const [chartSettingsOpen, setChartSettingsOpen] = useState(false);
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const getTimeRangeLabel = () => {
    if (isCustomRange && customStartDate && customEndDate) {
      return `${customStartDate} — ${customEndDate}`;
    }
    switch (timeRange) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'this_week_to_today': return 'This week (Sun to today)';
      case 'last_week': return 'Last week (Sun to Sat)';
      case '7d': return 'Last 7 days';
      case '28d': return 'Last 28 days';
      case '30d': return 'Last 30 days';
      case 'this_month': return 'This month';
      case 'last_month': return 'Last month';
      case '90d': return 'Last 90 days';
      default: return 'Last 7 days';
    }
  };
  const [isVisibilityConfigured, setIsVisibilityConfigured] = useState(false);
  const isVisibilityActive = role === 'active' || isVisibilityConfigured;
  const [visConfigOpen, setVisConfigOpen] = useState(false);
  const [visFrequency, setVisFrequency] = useState<'1' | '3' | '7'>('3');
  const [visPlatforms, setVisPlatforms] = useState<Record<PlatformId, boolean>>({
    ChatGPT: true,
    Claude: true,
    Perplexity: true,
    Gemini: false,
    SearchGPT: false,
  });
  const [visFrequencyDraft, setVisFrequencyDraft] = useState<'1' | '3' | '7'>(visFrequency);
  const [visPlatformsDraft, setVisPlatformsDraft] = useState<Record<PlatformId, boolean>>(visPlatforms);
  useEffect(() => {
    if (visConfigOpen) {
      setVisFrequencyDraft(visFrequency);
      setVisPlatformsDraft(visPlatforms);
    }
  }, [visConfigOpen, visFrequency, visPlatforms]);
  const [expandedKeywords, setExpandedKeywords] = useState<string[]>(['k1', 'k2']);
  const [selectedCell, setSelectedCell] = useState<{keyword: string, query: string, platform: string, status: string} | null>(null);
  const lastUpdated = new Date().toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

  // Keyword Management State
  const [keywords, setKeywords] = useState<{id: string, term: string, queries: string[]}[]>([
    { id: 'k1', term: 'Best AI Dashboard', queries: ['What is the best AI analytics dashboard?', 'Top tools for tracking AI traffic', 'WorkfxAI reviews and features'] },
    { id: 'k2', term: 'AI Traffic Analytics', queries: ['How to track traffic from ChatGPT?', 'Is WorkfxAI good for SEO?'] },
    { id: 'k3', term: 'Brand Reputation Monitoring', queries: ['Best brand monitoring tools 2024', 'WorkfxAI vs Competitors'] }
  ]);
  const [editingKeyword, setEditingKeyword] = useState<string | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // removed toast UI; keep no local toast state
  const [gaDebugOpen, setGaDebugOpen] = useState(false);
  const [gaDebugStatus, setGaDebugStatus] = useState<'not_connected' | 'needs_change' | 'linking'>('not_connected');
  

  

  const [isEditMode, setIsEditMode] = useState(false);
  
  
  // Debug State
  const [hasKeywords, setHasKeywords] = useState(true);
  const [setupKeywords, setSetupKeywords] = useState<{id: string, term: string}[]>([]); // New Setup Mode state
  const [activeMetric, setActiveMetric] = useState<'visibility' | 'sentiment' | 'position'>('visibility');
  const [activeTrafficSource, setActiveTrafficSource] = useState<'organic' | 'ai' | 'social'>('organic');
  const trafficTitleMap = { organic: 'ORGANIC', ai: 'AI Search', social: 'Social Media' };
  const [chatInput, setChatInput] = useState('');
  const [showChatSuggestions, setShowChatSuggestions] = useState(false);
  const [trafficSettingsOpen, setTrafficSettingsOpen] = useState(false);
  const [trafficJFChoice, setTrafficJFChoice] = useState<'has' | 'no' | null>(null);

  // Mock Data for Query Attribution
  const initialAttributionData: KeywordGroup[] = [
    {
      id: 'k1',
      keyword: 'Best AI Dashboard',
      queries: [
        { id: 'q1-1', text: 'What is the best AI analytics dashboard?', platforms: { ChatGPT: 'mentioned', Claude: 'mentioned', Perplexity: 'negative', Gemini: 'not_mentioned', SearchGPT: 'mentioned' }, positions: { ChatGPT: 2, Claude: 3, Perplexity: 4, Gemini: null, SearchGPT: 2 } },
        { id: 'q1-2', text: 'Top tools for tracking AI traffic', platforms: { ChatGPT: 'mentioned', Claude: 'not_mentioned', Perplexity: 'mentioned', Gemini: 'not_mentioned', SearchGPT: 'not_mentioned' }, positions: { ChatGPT: 3, Claude: null, Perplexity: 2, Gemini: null, SearchGPT: null } },
        { id: 'q1-3', text: 'WorkfxAI reviews and features', platforms: { ChatGPT: 'negative', Claude: 'mentioned', Perplexity: 'mentioned', Gemini: 'mentioned', SearchGPT: 'mentioned' }, positions: { ChatGPT: 5, Claude: 4, Perplexity: 3, Gemini: 2, SearchGPT: 2 } },
      ]
    },
    {
      id: 'k2',
      keyword: 'AI Traffic Analytics',
      queries: [
        { id: 'q2-1', text: 'How to track traffic from ChatGPT?', platforms: { ChatGPT: 'mentioned', Claude: 'mentioned', Perplexity: 'mentioned', Gemini: 'mentioned', SearchGPT: 'mentioned' }, positions: { ChatGPT: 1, Claude: 2, Perplexity: 1, Gemini: 3, SearchGPT: 2 } },
        { id: 'q2-2', text: 'Is WorkfxAI good for SEO?', platforms: { ChatGPT: 'not_mentioned', Claude: 'not_mentioned', Perplexity: 'mentioned', Gemini: 'not_mentioned', SearchGPT: 'not_mentioned' }, positions: { ChatGPT: null, Claude: null, Perplexity: 3, Gemini: null, SearchGPT: null } },
      ]
    },
    {
      id: 'k3',
      keyword: 'Brand Reputation Monitoring',
      queries: [
        { id: 'q3-1', text: 'Best brand monitoring tools 2024', platforms: { ChatGPT: 'mentioned', Claude: 'mentioned', Perplexity: 'not_mentioned', Gemini: 'mentioned', SearchGPT: 'mentioned' }, positions: { ChatGPT: 2, Claude: 3, Perplexity: null, Gemini: 2, SearchGPT: 2 } },
        { id: 'q3-2', text: 'WorkfxAI vs Competitors', platforms: { ChatGPT: 'mentioned', Claude: 'negative', Perplexity: 'mentioned', Gemini: 'not_mentioned', SearchGPT: 'mentioned' }, positions: { ChatGPT: 3, Claude: 4, Perplexity: 2, Gemini: null, SearchGPT: 3 } },
      ]
    },
  ];
  const [attributionData, setAttributionData] = useState<KeywordGroup[]>(initialAttributionData);
  const [dataDraft, setDataDraft] = useState<KeywordGroup[] | null>(null);
  const [hasDraftChanges, setHasDraftChanges] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupValue, setEditingGroupValue] = useState('');
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);
  const [editingQueryValue, setEditingQueryValue] = useState('');
  const [addingQueryGroupId, setAddingQueryGroupId] = useState<string | null>(null);
  const [addingQueryValue, setAddingQueryValue] = useState('');
  const [newlyAddedQueryIds, setNewlyAddedQueryIds] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistoryQuery, setSelectedHistoryQuery] = useState<{id: string, text: string} | null>(null);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [newGroupTerm, setNewGroupTerm] = useState('');
  const [newQueryInput, setNewQueryInput] = useState('');
  const [newQueries, setNewQueries] = useState<{ id: string; text: string }[]>([]);
  const [updateIntervalDays, setUpdateIntervalDays] = useState(3);
  
  const platforms: { id: PlatformId; label: string; icon: LucideIcon }[] = [
    { id: 'ChatGPT', label: 'ChatGPT', icon: MessageSquare },
    { id: 'Claude', label: 'Claude', icon: MessageSquare },
    { id: 'Perplexity', label: 'Perplexity', icon: MessageSquare },
    { id: 'Gemini', label: 'Gemini', icon: MessageSquare },
    { id: 'SearchGPT', label: 'SearchGPT', icon: MessageSquare }
  ];
  
  const makeDraft = (data: KeywordGroup[]) => JSON.parse(JSON.stringify(data));
  
  const handleStartEditGroup = (g: KeywordGroup) => {
    setEditingGroupId(g.id);
    setEditingGroupValue(g.keyword);
  };
  const handleApplyEditGroup = () => {
    if (!dataDraft || !editingGroupId) return;
    const val = editingGroupValue.trim();
    if (!val) return;
    setDataDraft(dataDraft.map(g => g.id === editingGroupId ? { ...g, keyword: val } : g));
    setHasDraftChanges(true);
    setEditingGroupId(null);
    setEditingGroupValue('');
  };
  const handleDeleteGroup = (id: string) => {
    if (!dataDraft) return;
    setDataDraft(dataDraft.filter(g => g.id !== id));
    setHasDraftChanges(true);
    if (editingGroupId === id) {
      setEditingGroupId(null);
      setEditingGroupValue('');
    }
  };
  const handleStartEditQuery = (q: Query) => {
    setEditingQueryId(q.id);
    setEditingQueryValue(q.text);
  };
  const handleApplyEditQuery = (groupId: string) => {
    if (!dataDraft || !editingQueryId) return;
    const val = editingQueryValue.trim();
    if (!val) return;
    setDataDraft(dataDraft.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        queries: g.queries.map(q => q.id === editingQueryId ? { ...q, text: val } : q)
      };
    }));
    setHasDraftChanges(true);
    setEditingQueryId(null);
    setEditingQueryValue('');
  };
  const handleDeleteQuery = (groupId: string, queryId: string) => {
    if (!dataDraft) return;
    setDataDraft(dataDraft.map(g => {
      if (g.id !== groupId) return g;
      return { ...g, queries: g.queries.filter(q => q.id !== queryId) };
    }));
    setHasDraftChanges(true);
    if (editingQueryId === queryId) {
      setEditingQueryId(null);
      setEditingQueryValue('');
    }
  };
  const handleAddQueryToGroup = (groupId: string) => {
    setAddingQueryGroupId(groupId);
    setAddingQueryValue('');
  };
  
  const handleConfirmAddQueryToGroup = () => {
    if (!dataDraft || !addingQueryGroupId) return;
    const newQueryText = addingQueryValue.trim();
    if (!newQueryText) return;
    
    const newQueryId = `q-${Date.now()}-${Math.random()}`;
    
    const newData = dataDraft.map(g => {
      if (g.id === addingQueryGroupId) {
        return {
          ...g,
          queries: [...g.queries, {
            id: newQueryId,
            text: newQueryText,
            platforms: {},
            positions: undefined
          }]
        };
      }
      return g;
    });
    setDataDraft(newData);
    setHasDraftChanges(true);
    setNewlyAddedQueryIds(prev => new Set(prev).add(newQueryId));
    setAddingQueryGroupId(null);
    setAddingQueryValue('');
  };

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
    setNewGroupTerm('');
    setNewQueryInput('');
    setNewQueries([]);
  };
  const handleAddNewQuery = () => {
    const t = newQueryInput.trim();
    if (!t) return;
    if (newQueries.find(q => q.text === t)) return;
    setNewQueries([...newQueries, { id: `tmpq-${Date.now()}-${Math.random()}`, text: t }]);
    setNewQueryInput('');
  };
  const handleRemoveNewQuery = (id: string) => {
    setNewQueries(newQueries.filter(q => q.id !== id));
  };
  const handleConfirmAddGroup = () => {
    if (!dataDraft) return;
    const term = newGroupTerm.trim();
    if (!term || newQueries.length === 0) return;

    const queriesToAdd = newQueries.map(q => ({
      id: `q-${Date.now()}-${Math.random()}-${q.id}`,
      text: q.text,
      platforms: {},
      positions: undefined
    }));

    const newGroup: KeywordGroup = {
      id: `k${Date.now()}-${Math.random()}`,
      keyword: term,
      queries: queriesToAdd
    };

    setDataDraft([...dataDraft, newGroup]);
    setHasDraftChanges(true);

    // Add new query IDs to the set so they show the NEW badge
    setNewlyAddedQueryIds(prev => {
      const newSet = new Set(prev);
      queriesToAdd.forEach(q => newSet.add(q.id));
      return newSet;
    });

    setIsAddModalOpen(false);
  };
  const handleSaveDraft = () => {
    if (!dataDraft) return;
    setAttributionData(makeDraft(dataDraft));
    setHasDraftChanges(false);
  };
  const handleConfirmSaveNow = () => {
    handleSaveDraft();
    setIsSaveConfirmOpen(false);
    setIsEditMode(false);
  };
  const handleConfirmSaveAuto = () => {
    handleSaveDraft();
    setIsSaveConfirmOpen(false);
    setIsEditMode(false);
  };
  const handleDiscardDraft = () => {
    setDataDraft(makeDraft(attributionData));
    setHasDraftChanges(false);
    setEditingGroupId(null);
    setEditingGroupValue('');
    setEditingQueryId(null);
    setEditingQueryValue('');
  };
  
  useEffect(() => {
    if (isEditMode) {
      setDataDraft(makeDraft(attributionData));
      setHasDraftChanges(false);
      setEditingGroupId(null);
      setEditingQueryId(null);
    } else {
      setDataDraft(null);
      setEditingGroupId(null);
      setEditingQueryId(null);
    }
  }, [isEditMode, attributionData]);

  const toggleKeyword = (id: string) => {
    setExpandedKeywords(prev => 
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    );
  };

  const handleAddKeyword = (keywordToAdd?: string) => {
    const term = keywordToAdd || newKeyword;
    if (term.trim()) {
      if (keywords.length === 0) {
        // In Setup Mode: Add to temporary selection list
        if (!setupKeywords.find(k => k.term === term)) {
          setSetupKeywords([...setupKeywords, { id: `sk${Date.now()}`, term }]);
        }
      } else {
        // Normal Mode: Add directly
        setKeywords([...keywords, { 
          id: `k${Date.now()}`, 
          term: term, 
          queries: [`${term} review`, `Best ${term} tool`] 
        }]);
      }
      setNewKeyword('');
    }
  };

  const toggleSetupKeyword = (term: string) => {
    if (setupKeywords.find(k => k.term === term)) {
      setSetupKeywords(setupKeywords.filter(k => k.term !== term));
    } else {
      setSetupKeywords([...setupKeywords, { id: `sk${Date.now()}`, term }]);
    }
  };

  const handleRemoveSetupKeyword = (term: string) => {
    setSetupKeywords(setupKeywords.filter(k => k.term !== term));
  };

  const handleConfirmSetup = () => {
    const newKeywordsList = setupKeywords.map(sk => ({
      id: `k${Date.now()}-${Math.random()}`,
      term: sk.term,
      queries: [`${sk.term} review`, `Best ${sk.term} tool`]
    }));
    setKeywords(newKeywordsList);
    setHasKeywords(true); // Switch out of empty state
  };

  const handleDeleteKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const handleUpdateQuery = (keywordId: string, queryIndex: number, newValue: string) => {
    setKeywords(keywords.map(k => {
      if (k.id === keywordId) {
        const newQueries = [...k.queries];
        newQueries[queryIndex] = newValue;
        return { ...k, queries: newQueries };
      }
      return k;
    }));
  };

  const handleRunUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 2000); // Mock update delay
  };

  // Mock Data for Chart
  const getChartData = () => {
    switch(timeRange) {
      case '24h':
        return [
          { name: '00:00', organic: 120, ai: 12, social: 5 },
          { name: '04:00', organic: 80, ai: 8, social: 3 },
          { name: '08:00', organic: 250, ai: 25, social: 15 },
          { name: '12:00', organic: 400, ai: 45, social: 28 },
          { name: '16:00', organic: 350, ai: 38, social: 22 },
          { name: '20:00', organic: 300, ai: 30, social: 18 },
        ];
      case '3d':
        return [
          { name: 'Day 1', organic: 2500, ai: 180, social: 90 },
          { name: 'Day 2', organic: 3100, ai: 220, social: 150 },
          { name: 'Day 3', organic: 2800, ai: 200, social: 120 },
        ];
      case '7d':
      default:
        return [
          { name: 'Day 1', organic: 4000, ai: 240, social: 100 },
          { name: 'Day 2', organic: 3500, ai: 200, social: 180 },
          { name: 'Day 3', organic: 3000, ai: 139, social: 221 },
          { name: 'Day 4', organic: 3200, ai: 280, social: 150 },
          { name: 'Day 5', organic: 2000, ai: 980, social: 229 },
          { name: 'Day 6', organic: 2780, ai: 390, social: 200 },
          { name: 'Day 7', organic: 3490, ai: 430, social: 210 },
        ];
    }
  };

  const chartData = getChartData();

  const tabs: Tab[] = [
    { id: 'data', label: 'Data Display', icon: BarChart2 },
    { id: 'query', label: 'Query Attribution', icon: MessageSquare },
  ];

  const renderContent = () => {
    if (role === 'free') {
       return (
         <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
           <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center max-w-md">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
               <Lock size={32} />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock Full Insights</h2>
             <p className="text-gray-500 mb-6">Subscribe to our Pro plan to view detailed performance analytics and AI attribution data.</p>
             <button className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
               Subscribe Now
             </button>
           </div>
         </div>
       );
    }

    if (role === 'pending' && activeTab === 'data') {
      return (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
           <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center max-w-md">
             <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4 text-warning">
               <AlertTriangle size={32} />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Source Not Connected</h2>
             <p className="text-gray-500 mb-6">Please connect your GA4 account to start tracking performance data.</p>
             <button 
               onClick={() => {
                 setActiveTab('setting');
                 setTimeout(() => {
                   ga4SectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                 }, 50);
               }}
               className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
             >
               Connect GA4 <ArrowRight size={18} />
             </button>
           </div>
         </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 relative min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Performance Center</h1>
        
        <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Copilot Input - SaaS Dashboard Style */}
      {(activeTab === 'data' || activeTab === 'query') && role !== 'free' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm relative z-20 group transition-all duration-300 hover:shadow-md hover:border-purple-200">
          <div className="relative flex items-center p-1">
            <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mr-3 shrink-0 transition-colors group-hover:bg-purple-100">
              <Sparkles size={18} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onFocus={() => {
                setShowChatSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && chatInput.trim()) {
                  setInitialMessage(chatInput);
                  setChatInput('');
                  setChatOpen(true);
                  setSidebarCollapsed(true);
                  setShowChatSuggestions(false);
                }
              }}
              placeholder="Ask AI Copilot about trends, attribution, or optimization..."
              className="flex-1 outline-none text-sm font-medium text-gray-700 placeholder-gray-400 bg-transparent h-9"
            />
            <div className="flex items-center gap-2">
               <span className="hidden md:inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-xs text-gray-400 font-medium border border-gray-100">
                 ⌘ K
               </span>
              <button 
                onClick={() => {
                  if (chatInput.trim()) {
                    setInitialMessage(chatInput);
                    setChatInput('');
                  }
                  setChatOpen(true);
                  setSidebarCollapsed(true);
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-600 transition-all duration-200"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Chat Suggestions Dropdown */}
          {showChatSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg p-3 z-20 animate-in fade-in slide-in-from-top-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Suggested Questions</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "Why did my organic traffic drop yesterday?",
                  "How can I improve my Visibility Score?",
                  "Which keywords have the highest negative sentiment?",
                  "Analyze the impact of my recent content update"
                ].map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setInitialMessage(q);
                      setChatOpen(true);
                      setSidebarCollapsed(true);
                      setShowChatSuggestions(false);
                    }}
                    className="text-left text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <MessageSquare size={14} className="opacity-50" />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Click Overlay (Optional: if we want click anywhere to open, but let's stick to explicit actions) */}
          {/* <div className="absolute inset-0 z-10 cursor-text" onClick={() => { setChatOpen(true); setSidebarCollapsed(true); }}></div> */}
        </div>
      )}

      {/* Main Content Area - Darker Background for Contrast */}
      <div>
        {/* Overlay for Free states only */}
        {(role === 'free') && renderContent()}

        {/* Tab Content */}
        {activeTab === 'data' && (<React.Fragment>
          <div className={clsx((role === 'free') && "filter blur-sm select-none pointer-events-none")}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column: Traffic Analytics */}
              <div className="space-y-6 relative">
                <div className={clsx((role === 'free') && "filter blur-sm select-none pointer-events-none")}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
                        <BarChart2 size={20} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">Traffic Sources</h3>
                    </div>
                  </div>
                </div>

                {role !== 'pending' && <div className="text-[11px] text-gray-400 mb-2">Last updated: {lastUpdated}</div>}

                <div className="grid grid-cols-3 gap-4">
                  <div 
                    onClick={() => setActiveTrafficSource('organic')}
                    className={clsx(
                      "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
                      activeTrafficSource === 'organic' && "ring-2 ring-blue-400 border-blue-200 shadow-md"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="inline-flex items-center gap-1">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">ORGANIC</div>
                        <span className="relative group inline-flex items-center">
                          <HelpCircle size={12} className="text-gray-400" />
                          <span className="absolute top-full left-0 mt-1 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded shadow">占位</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 tracking-tight">{(!isGA4Connected) ? '?' : '12,500'}</div>
                    
                  </div>
                  <div 
                    onClick={() => setActiveTrafficSource('ai')}
                    className={clsx(
                      "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
                      activeTrafficSource === 'ai' && "ring-2 ring-green-400 border-green-200 shadow-md"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="inline-flex items-center gap-1">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">AI SEARCH</div>
                        <span className="relative group inline-flex items-center">
                          <HelpCircle size={12} className="text-gray-400" />
                          <span className="absolute top-full left-0 mt-1 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded shadow">占位</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 tracking-tight">{(!isGA4Connected) ? '?' : '1,200'}</div>
                    
                  </div>
                  <div 
                    onClick={() => setActiveTrafficSource('social')}
                    className={clsx(
                      "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
                      activeTrafficSource === 'social' && "ring-2 ring-purple-400 border-purple-200 shadow-md"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <div className="inline-flex items-center gap-1">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">SOCIAL MEDIA</div>
                        <span className="relative group inline-flex items-center">
                          <HelpCircle size={12} className="text-gray-400" />
                          <span className="absolute top-full left-0 mt-1 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded shadow">占位</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 tracking-tight">{(!isGA4Connected) ? '?' : '850'}</div>
                    
                  </div>
                </div>
                <div className="h-[500px] w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 opacity-20"></div>
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                        <BarChart2 size={16} />
                      </div>
                      {trafficTitleMap[activeTrafficSource]}
                    </h4>
                    <div className="relative flex items-center gap-2">
                      
                      <button
                        onClick={() => setTimeMenuOpen((v) => !v)}
                        className="text-xs font-medium border border-gray-200 bg-gray-50 rounded-lg px-3 py-1.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-700 transition-all cursor-pointer hover:bg-white hover:shadow-sm"
                        title="Choose date range"
                      >
                        {getTimeRangeLabel()}
                      </button>
                      <button
                        onClick={() => setTrafficSettingsOpen(true)}
                        className="ml-2 p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                        title="Traffic Source Settings"
                      >
                        <Settings size={16} />
                      </button>
                      
                      {timeMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-30">
                          <div className="py-2 max-h-64 overflow-y-auto">
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => {
                                setIsCustomRange(true);
                              }}
                            >
                              Custom
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsCustomRange(false); setTimeRange('today'); setTimeMenuOpen(false); }}>
                              Today
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsCustomRange(false); setTimeRange('yesterday'); setTimeMenuOpen(false); }}>
                              Yesterday
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsCustomRange(false); setTimeRange('this_week_to_today'); setTimeMenuOpen(false); }}>
                              This week (Sun to today)
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsCustomRange(false); setTimeRange('7d'); setTimeMenuOpen(false); }}>
                              Last 7 days
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsCustomRange(false); setTimeRange('last_week'); setTimeMenuOpen(false); }}>
                              Last week (Sun to Sat)
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsCustomRange(false); setTimeRange('28d'); setTimeMenuOpen(false); }}>
                              Last 28 days
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsCustomRange(false); setTimeRange('30d'); setTimeMenuOpen(false); }}>
                              Last 30 days
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsCustomRange(false); setTimeRange('this_month'); setTimeMenuOpen(false); }}>
                              This month
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsCustomRange(false); setTimeRange('last_month'); setTimeMenuOpen(false); }}>
                              Last month
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setIsCustomRange(false); setTimeRange('90d'); setTimeMenuOpen(false); }}>
                              Last 90 days
                            </button>
                          </div>
                          {isCustomRange && (
                            <div className="border-t border-gray-200 p-3 space-y-2">
                              <div className="text-[11px] text-gray-500 font-medium">Start date — End date</div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="date"
                                  value={customStartDate}
                                  onChange={(e) => setCustomStartDate(e.target.value)}
                                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm"
                                />
                                <span className="text-gray-400">—</span>
                                <input
                                  type="date"
                                  value={customEndDate}
                                  onChange={(e) => setCustomEndDate(e.target.value)}
                                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm"
                                />
                              </div>
                              <div className="flex justify-end">
                                <button
                                  disabled={!customStartDate || !customEndDate}
                                  className={clsx(
                                    "px-3 py-1.5 rounded-lg text-sm font-bold",
                                    customStartDate && customEndDate ? "bg-primary text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  )}
                                  onClick={() => {
                                    if (customStartDate && customEndDate) {
                                      setIsCustomRange(true);
                                      setTimeRange('custom');
                                      setTimeMenuOpen(false);
                                    }
                                  }}
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      
                  </div></div>
                  {role === 'pending' ? (
                    <div className="absolute inset-0 z-20 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300">
                      <button
                        onClick={() => setTrafficSettingsOpen(true)}
                        className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 shadow-lg active:scale-95 flex items-center gap-2 transition-all"
                      >
                        <Settings size={18} /> Link Google Analytics
                      </button>
                    </div>
                  ) : (
                    !isGA4Connected && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
                        <button
                          onClick={() => setTrafficSettingsOpen(true)}
                          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg active:scale-95 flex items-center gap-2"
                        >
                          <Settings size={16} /> Link Google Analytics
                        </button>
                      </div>
                    )
                  )}
                  
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '12px' }}
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      {activeTrafficSource === 'organic' && (
                        <Line yAxisId="left" type="monotone" dataKey="organic" name="Total Traffic" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                      )}
                      {activeTrafficSource === 'ai' && (
                        <Line yAxisId="right" type="monotone" dataKey="ai" name="AI Traffic" stroke="#10b981" strokeWidth={3} dot={false} />
                      )}
                      {activeTrafficSource === 'social' && (
                        <Line yAxisId="right" type="monotone" dataKey="social" name="Social Traffic" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              </div>

              {/* Right Column: Visibility & Sentiment */}
              <div className="space-y-6 relative">

                <div className={clsx((role === 'free') && "filter blur-sm select-none pointer-events-none")}>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Zap className="text-orange-500" size={20} />
                  AI Visibility
                </h3>
                {role !== 'pending' && <div className="text-[11px] text-gray-400">Last updated: {lastUpdated}</div>}
                
                <div className="grid grid-cols-3 gap-4 h-[140px]">
                  <div 
                    onClick={() => setActiveMetric('visibility')}
                    className={clsx(
                      "p-5 rounded-2xl border relative overflow-hidden group flex flex-col justify-between cursor-pointer transition-all duration-300",
                      activeMetric === 'visibility' 
                        ? "bg-white border-orange-200 shadow-md ring-1 ring-orange-100" 
                        : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100"
                    )}
                  >
                    <div className="flex justify-between items-start z-10">
                       <div className="flex items-center gap-2">
                         <div className={clsx("p-2 rounded-lg transition-colors", activeMetric === 'visibility' ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-600")}>
                           <Zap size={18} />
                         </div>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">VISIBILITY</span>
                         <span className="relative group inline-flex items-center">
                           <HelpCircle size={12} className="text-gray-400" />
                           <span className="absolute top-full left-0 mt-1 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded shadow">占位</span>
                         </span>
                       </div>
                       {activeMetric === 'visibility' && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>}
                    </div>
                    
                    <div className="relative z-10 mt-2">
                      <div className="flex items-end justify-between">
                      <div className="text-3xl font-bold text-gray-900 tracking-tight">{isVisibilityActive ? '72%' : '?'}</div>
                      <div className="text-xs font-medium text-gray-400 mb-1">
                        {isVisibilityActive ? '252/350' : '-/-'}
                      </div>
                    </div>
                      
                    </div>
                    
                    {/* Decor */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  <div 
                    onClick={() => setActiveMetric('sentiment')}
                    className={clsx(
                      "p-5 rounded-2xl border relative overflow-hidden group flex flex-col justify-between cursor-pointer transition-all duration-300",
                      activeMetric === 'sentiment' 
                        ? "bg-white border-indigo-200 shadow-md ring-1 ring-indigo-100" 
                        : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100"
                    )}
                  >
                    <div className="flex justify-between items-start z-10">
                       <div className="flex items-center gap-2">
                         <div className={clsx("p-2 rounded-lg transition-colors", activeMetric === 'sentiment' ? "bg-indigo-50 text-indigo-600" : "bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600")}>
                           <MessageSquare size={18} />
                         </div>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">POSITIVE SENTIMENT</span>
                         <span className="relative group inline-flex items-center">
                           <HelpCircle size={12} className="text-gray-400" />
                           <span className="absolute top-full left-0 mt-1 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded shadow">占位</span>
                         </span>
                       </div>
                       {activeMetric === 'sentiment' && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>}
                    </div>

                    <div className="relative z-10 mt-2">
                      <div className="text-3xl font-bold text-gray-900 tracking-tight">{isVisibilityActive ? '85%' : '?'}</div>
                      
                    </div>

                    {/* Decor */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  <div 
                    onClick={() => setActiveMetric('position')}
                    className={clsx(
                      "p-5 rounded-2xl border relative overflow-hidden group flex flex-col justify-between cursor-pointer transition-all duration-300",
                      activeMetric === 'position' 
                        ? "bg-white border-purple-200 shadow-md ring-1 ring-purple-100" 
                        : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100"
                    )}
                  >
                    <div className="flex justify-between items-start z-10">
                       <div className="flex items-center gap-2">
                         <div className={clsx("p-2 rounded-lg transition-colors", activeMetric === 'position' ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600")}>
                           <Target size={18} />
                         </div>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">POSITION</span>
                         <span className="relative group inline-flex items-center">
                           <HelpCircle size={12} className="text-gray-400" />
                           <span className="absolute top-full left-0 mt-1 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded shadow">占位</span>
                         </span>
                       </div>
                       {activeMetric === 'position' && <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>}
                    </div>
                    <div className="relative z-10 mt-2">
                      <div className="text-3xl font-bold text-gray-900 tracking-tight">{isVisibilityActive ? '#2.8' : '?'}</div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                {/* Trend Chart Area - SaaS Style */}
                <div className="h-[400px] bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300 relative overflow-visible">
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <div className={clsx("p-1.5 rounded-lg", activeMetric === 'visibility' ? "bg-orange-100 text-orange-600" : "bg-indigo-100 text-indigo-600")}>
                        {activeMetric === 'visibility' ? <TrendingUp size={16} /> : <MessageSquare size={16} />}
                      </div>
                      {activeMetric === 'visibility' ? 'Visibility Trend' : activeMetric === 'sentiment' ? 'Sentiment Trend' : 'Position Trend'}
                      
                    </h4>
                    <div className="relative flex items-center gap-2">
                      <select className="text-xs font-medium border border-gray-200 bg-gray-50 rounded-lg px-3 py-1.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-700 transition-all cursor-pointer hover:bg-white hover:shadow-sm">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                      </select>
                      <button
                        onClick={() => setVisConfigOpen((v) => !v)}
                        className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                        title="Visibility Settings"
                      >
                        <Settings size={16} />
                      </button>
                      
                    </div>
                  </div>
                  
                <div className="h-[300px] w-full relative z-10">
                  {activeMetric === 'visibility' && !isVisibilityActive && !visConfigOpen && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20" style={{ height: '400px', paddingLeft: 0, paddingRight: 0, marginTop: '-55px', marginBottom: '-55px' }}>
                      <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg active:scale-95 flex items-center gap-2">
                        <Settings size={16} /> Configure AI Visibility
                      </button>
                    </div>
                  )}
                    {(() => {
                      const baseVisibility = [
                        { date: 'Mon', chatgpt: 45, claude: 30, perplexity: 55 },
                        { date: 'Tue', chatgpt: 50, claude: 35, perplexity: 52 },
                        { date: 'Wed', chatgpt: 55, claude: 40, perplexity: 58 },
                        { date: 'Thu', chatgpt: 60, claude: 45, perplexity: 62 },
                        { date: 'Fri', chatgpt: 65, claude: 42, perplexity: 65 },
                        { date: 'Sat', chatgpt: null, claude: null, perplexity: null },
                        { date: 'Sun', chatgpt: null, claude: null, perplexity: null },
                      ];
                      const baseSentiment = [
                        { date: 'Mon', positive: 70, neutral: 20, negative: 10 },
                        { date: 'Tue', positive: 72, neutral: 18, negative: 10 },
                        { date: 'Wed', positive: 68, neutral: 25, negative: 7 },
                        { date: 'Thu', positive: 75, neutral: 20, negative: 5 },
                        { date: 'Fri', positive: 78, neutral: 15, negative: 7 },
                        { date: 'Sat', positive: null, neutral: null, negative: null },
                        { date: 'Sun', positive: null, neutral: null, negative: null },
                      ];
                      const basePosition = [
                        { date: 'Mon', position: 3.2 },
                        { date: 'Tue', position: 2.8 },
                        { date: 'Wed', position: 3.5 },
                        { date: 'Thu', position: 2.4 },
                        { date: 'Fri', position: 2.1 },
                        { date: 'Sat', position: null },
                        { date: 'Sun', position: null },
                      ];
                      const chartData = activeMetric === 'visibility' ? baseVisibility : activeMetric === 'sentiment' ? baseSentiment : basePosition;
                      const keys = activeMetric === 'visibility' ? ['chatgpt','claude','perplexity'] : activeMetric === 'sentiment' ? ['positive','neutral','negative'] : ['position'];
                      const lastNonNullIndex = [...chartData].reverse().findIndex((d) => keys.some((k) => (d as unknown as Record<string, number | undefined>)[k] != null));
                      const resolvedLastIndex = lastNonNullIndex === -1 ? -1 : chartData.length - 1 - lastNonNullIndex;
                      const missingStartIndex = resolvedLastIndex >= 0 && resolvedLastIndex < chartData.length - 1 ? resolvedLastIndex + 1 : -1;
                      const lastUpdateLabel = resolvedLastIndex >= 0 ? chartData[resolvedLastIndex].date : null;
                      const missingLeftPct = missingStartIndex >= 0 ? (missingStartIndex / chartData.length) * 100 : 0;
                      const missingWidthPct = missingStartIndex >= 0 ? ((chartData.length - missingStartIndex) / chartData.length) * 100 : 0;
                      return (
                        <>
                          {missingStartIndex >= 0 && role !== 'pending' && (
                            <div
                              className="absolute top-0 bottom-0 right-0 bg-gray-100/70 z-20 pointer-events-none"
                              style={{ left: `${missingLeftPct}%`, width: `${missingWidthPct}%` }}
                            >
                              <div className="absolute top-2 left-2 text-[10px] text-gray-500">Not sampled</div>
                            </div>
                          )}
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart 
                              data={chartData}
                              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '12px' }}
                          cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 500 }} iconType="circle" />
                        
                        {activeMetric === 'visibility' ? (
                          <>
                            {visPlatforms.ChatGPT && (
                              <Line type="monotone" dataKey="chatgpt" name="ChatGPT" stroke="#10a37f" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            )}
                            {visPlatforms.Claude && (
                              <Line type="monotone" dataKey="claude" name="Claude" stroke="#d97757" strokeWidth={3} dot={false} />
                            )}
                            {visPlatforms.Perplexity && (
                              <Line type="monotone" dataKey="perplexity" name="Gemini" stroke="#22b8cf" strokeWidth={3} dot={false} />
                            )}
                          </>
                        ) : activeMetric === 'sentiment' ? (
                          <>
                            <Line type="monotone" dataKey="positive" name="Positive %" stroke="#4f46e5" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            <Line type="monotone" dataKey="neutral" name="Neutral %" stroke="#9ca3af" strokeWidth={3} dot={false} />
                            <Line type="monotone" dataKey="negative" name="Negative %" stroke="#ef4444" strokeWidth={3} dot={false} />
                          </>
                        ) : (
                          <>
                            <Line type="monotone" dataKey="position" name="Average Position" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                          </>
                        )}
                            </LineChart>
                          </ResponsiveContainer>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="mt-8 space-y-8"></div>
        </React.Fragment>)}
        {isEditMode && isSaveConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => { setIsSaveConfirmOpen(false); setIsEditMode(false); }}></div>
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Save Confirmation</h3>
                <button
                  onClick={() => { setIsSaveConfirmOpen(false); setIsEditMode(false); }}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">We will monitor AI visibility of these items.</p>
              <div className="space-y-3">
                <button
                  onClick={handleConfirmSaveNow}
                  className="w-full bg-black text-white py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-colors flex flex-col items-center justify-center gap-1"
                >
                  <span>Update Data Now</span>
                  <span className="text-[10px] font-normal text-gray-400">
                    Estimated cost: ~150 tokens
                  </span>
                </button>
                <button
                  onClick={handleConfirmSaveAuto}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-1"
                >
                  <span>Auto-Update Later</span>
                  <span className="text-[10px] font-normal text-gray-400">
                    Currently updates every {updateIntervalDays} days, next update {new Date(Date.now() + updateIntervalDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </button>
                <button
                  onClick={() => { handleDiscardDraft(); setIsSaveConfirmOpen(false); setIsEditMode(false); }}
                  className="w-full bg-white text-gray-700 font-bold py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >Cancel</button>
              </div>
            </div>
          </div>
        )}
        {trafficSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => {
                setTrafficSettingsOpen(false);
                setTrafficJFChoice(null);
              }}
            ></div>
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{isGA4Connected ? 'Change Google Analytics Account' : 'Connect Google Analytics'}</h3>
                <button
                  onClick={() => {
                    setTrafficSettingsOpen(false);
                    setTrafficJFChoice(null);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
              {isGA4Connected ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    You are currently connected to Google Analytics. Click the button below to switch accounts.
                  </div>
                  <button
                    onClick={() => { window.open('https://analytics.google.com/', '_blank'); }}
                    className="w-full bg-black text-white py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Change Account
                  </button>
                </div>
              ) : (
                <>
              {!trafficJFChoice && (
                <div className="space-y-3">
                  <button
                    onClick={() => setTrafficJFChoice('has')}
                    className="w-full bg-black text-white py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                  >I have a Google Analytics account</button>
                  <button
                    onClick={() => setTrafficJFChoice('no')}
                    className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                  >I don't have a Google Analytics account</button>
                </div>
              )}
              {trafficJFChoice === 'has' && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    You will be redirected to Google Analytics to complete the authorization.
                  </div>
                  <button
                    onClick={() => { window.open('https://analytics.google.com/', '_blank'); }}
                    className="w-full bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} /> Connect Google Analytics
                  </button>
                </div>
              )}
              {trafficJFChoice === 'no' && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">Please follow the instructions below to complete the binding.</div>
                  <button
                    onClick={() => window.open('https://vxqhv8tzaua.feishu.cn/wiki/FVSOwGJG1i1wY3kqNt3ctEUhnmc', '_blank')}
                    className="w-full bg-black text-white py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >View Method</button>
                </div>
              )}
                </>
              )}
            </div>
          </div>
        )}
        
      </div>

        {activeTab === 'query' && (
           <div className={clsx(role === 'free' && "filter blur-sm select-none pointer-events-none")}>
               <div className="flex items-center justify-between mb-4 relative z-10">
                 <h4 className="font-bold text-gray-900 flex items-center gap-2">
                   <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
                     <MessageSquare size={16} />
                   </div>
                   Query Attribution
                 </h4>
                 {!isEditMode && (
                    <button
                      onClick={() => {
                        setIsEditMode(true);
                        setDataDraft(makeDraft(attributionData));
                      }}
                      className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors flex items-center gap-2"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                 )}
               </div>
               <div className="flex justify-between items-center mb-2">
                 <div className="text-xs text-gray-400">Last updated: {lastUpdated}</div>
               </div>
               <div className={clsx("overflow-x-auto", isEditMode && "ring-1 ring-purple-300 rounded-xl")}>
                 <table className="w-full text-left border-collapse">
                 <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-4 font-semibold text-gray-500 text-sm min-w-[300px]">Keyword / Query</th>
                    <th className="p-3 font-semibold text-gray-500 text-sm text-center min-w-[180px]">AI Platforms</th>
                    <th className="p-3 font-semibold text-gray-500 text-sm text-center min-w-[120px]">Sentiment</th>
                    <th className="p-3 font-semibold text-gray-500 text-sm text-center min-w-[140px]">Visibility Score</th>
                    <th className="p-3 font-semibold text-gray-500 text-sm text-center min-w-[120px]">Average Position</th>
                    <th className="p-3 font-semibold text-gray-500 text-sm text-center min-w-[80px]"></th>
                  </tr>
                 </thead>
                 <tbody>
                 {(isEditMode && dataDraft ? dataDraft : attributionData).map(group => {
                   let gMentioned = 0;
                   let gNegative = 0;
                   let gTotal = 0;
                   let gPosSum = 0;
                   let gPosCount = 0;
                   group.queries.forEach(q => {
                     platforms.forEach(p => {
                       const st = q.platforms?.[p.id];
                       gTotal++;
                       if (st && st !== 'not_mentioned') {
                         gMentioned++;
                         const pos = q.positions?.[p.id] ?? null;
                         if (typeof pos === 'number') {
                           gPosSum += pos;
                           gPosCount++;
                         }
                       }
                       if (st === 'negative') gNegative++;
                     });
                   });
                   const groupVisibility = gTotal > 0 ? Math.round((gMentioned / gTotal) * 100) : 0;
                   const groupAvgPosition = gPosCount > 0 ? (gPosSum / gPosCount) : null;
                   let groupSentiment: 'Positive' | 'Negative' = 'Positive';
                   if (gNegative > gMentioned) {
                     groupSentiment = 'Negative';
                   } else {
                     groupSentiment = 'Positive';
                   }
                    return (
                     <React.Fragment key={group.id}>
                       {/* Keyword Row */}
                       <tr 
                         className="bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition-colors"
                         onClick={() => toggleKeyword(group.id)}
                       >
                        <td colSpan={6} className="p-4 font-bold text-gray-800">
                          <div className="grid grid-cols-[minmax(300px,1fr)_180px_120px_140px_120px_80px] items-center gap-3">
                            <div className="flex items-center gap-2">
                              {expandedKeywords.includes(group.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              {isEditMode && editingGroupId === group.id ? (
                                <input
                                  value={editingGroupValue}
                                  onChange={(e) => setEditingGroupValue(e.target.value)}
                                  onBlur={handleApplyEditGroup}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleApplyEditGroup(); }}
                                  className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                                />
                              ) : (
                                <>
                                  {group.keyword}
                                  <span className="text-xs font-normal text-gray-400 ml-2">({group.queries.length} queries)</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              {isEditMode && (
                                <>
                                  <button
                                    className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddQueryToGroup(group.id);
                                    }}
                                    title="Add query"
                                  >
                                    <Plus size={14} />
                                  </button>
                                  <button
                                    className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                                    onClick={() => handleStartEditGroup(group)}
                                    title="Edit group"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    className="p-1.5 border border-gray-200 rounded-lg text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteGroup(group.id)}
                                    title="Delete group"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                            <div>
                              <span className={clsx(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                groupSentiment === 'Positive' && "bg-green-50 text-green-700 border-green-200",
                                groupSentiment === 'Negative' && "bg-red-50 text-red-700 border-red-200"
                              )}>
                                {groupSentiment}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-700">{groupVisibility}%</span>
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={clsx(
                                    "h-full rounded-full transition-all duration-500",
                                    groupVisibility >= 80 ? "bg-green-500" : 
                                    groupVisibility >= 50 ? "bg-yellow-500" : "bg-red-500"
                                  )} 
                                  style={{ width: `${groupVisibility}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="text-xs font-bold text-gray-700">
                              {groupAvgPosition != null ? `#${groupAvgPosition.toFixed(1)}` : '—'}
                            </div>
                          </div>
                        </td>
                       </tr>
                       
                       {/* Query Rows */}
                       {expandedKeywords.includes(group.id) && group.queries.map(query => {
                         const isRowSelected = selectedCell?.query === query.text;
                         
                         // Calculate Query-level Visibility
                         let qMentioned = 0;
                         let qTotal = 0;
                         let qNegative = 0;
                         platforms.forEach(p => {
                           const st = query.platforms?.[p.id];
                           if (st !== 'not_mentioned') qMentioned++;
                           if (st === 'negative') qNegative++;
                           qTotal++;
                         });
                         const queryVisibility = qTotal > 0 ? Math.round((qMentioned / qTotal) * 100) : 0;
                         let posSum = 0;
                         let posCount = 0;
                         platforms.forEach(p => {
                           const st = query.platforms?.[p.id];
                           const pos = query.positions?.[p.id] ?? null;
                           if (st !== 'not_mentioned' && typeof pos === 'number') {
                             posSum += pos;
                             posCount++;
                           }
                         });
                         const queryAvgPosition = posCount > 0 ? (posSum / posCount) : null;
                         
                         // Derive simple Sentiment label
                         let sentimentLabel: 'Positive' | 'Negative' = 'Positive';
                         if (qNegative > qMentioned) {
                           sentimentLabel = 'Negative';
                         } else {
                           sentimentLabel = 'Positive';
                         }
                         
                         const isNewQuery = newlyAddedQueryIds.has(query.id);
                         
                         return (
                           <React.Fragment key={query.id}>
                             <tr className={clsx(
                               "border-b border-gray-50 transition-colors",
                               isRowSelected ? "bg-blue-50/50" : "hover:bg-blue-50/30"
                             )}>
                               <td className="p-4 pl-12 text-sm text-gray-600 font-medium border-r border-gray-50 align-middle">
                                 {isEditMode && editingQueryId === query.id ? (
                                   <input
                                     value={editingQueryValue}
                                     onChange={(e) => setEditingQueryValue(e.target.value)}
                                     onBlur={() => handleApplyEditQuery(group.id)}
                                     onKeyDown={(e) => { if (e.key === 'Enter') handleApplyEditQuery(group.id); }}
                                     className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                     autoFocus
                                   />
                                 ) : (
                                   <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-2">
                                       {isNewQuery && (
                                         <span className="text-[10px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded">NEW</span>
                                       )}
                                       <span>{query.text}</span>
                                     </div>
                                     {isEditMode && (
                                       <div className="flex items-center gap-1 ml-2">
                                         <button
                                           className="p-1 border border-gray-200 rounded-lg text-red-600 hover:bg-red-50"
                                           onClick={() => handleDeleteQuery(group.id, query.id)}
                                           title="Delete query"
                                         >
                                           <Trash2 size={12} />
                                         </button>
                                       </div>
                                     )}
                                   </div>
                                 )}
                               </td>
                              {/* AI Platforms */}
                              <td className="p-4 align-middle">
                               {isNewQuery ? (
                                 <div className="flex justify-center text-gray-400 text-sm">—</div>
                               ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="flex items-center justify-center gap-1">
                                  {(['Gemini','ChatGPT','Claude'] as PlatformId[]).map((pid) => {
                                    const platform = platforms.find(p => p.id === pid)!;
                                    const status = query.platforms?.[platform.id] || 'not_mentioned';
                                    const isCellSelected = isRowSelected && selectedCell?.platform === platform.id;
                                    return (
                                      <button
                                        key={`${query.id}-${platform.id}`}
                                        onClick={() => {
                                          if (isCellSelected) {
                                            setSelectedCell(null);
                                          } else {
                                            setSelectedCell({
                                              keyword: group.keyword,
                                              query: query.text,
                                              platform: platform.id,
                                              status
                                            });
                                          }
                                        }}
                                        className={clsx(
                                          "w-7 h-7 rounded-lg flex items-center justify-center transition-all relative group/icon",
                                          status === 'mentioned' && "bg-green-100 text-green-600 hover:bg-green-200",
                                          status === 'negative' && "bg-red-100 text-red-600 hover:bg-red-200",
                                          status === 'not_mentioned' && "bg-gray-100 text-gray-300 hover:bg-gray-200",
                                          isCellSelected && "ring-2 ring-primary ring-offset-1 z-10 scale-105"
                                        )}
                                        title={`${platform.label}: ${status.replace('_', ' ')}`}
                                      >
                                        <div className="text-[10px] font-bold">
                                          {platform.label.charAt(0)}
                                        </div>
                                        <div className={clsx(
                                          "absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-white",
                                          status === 'mentioned' && "bg-green-500",
                                          status === 'negative' && "bg-red-500",
                                          status === 'not_mentioned' && "hidden"
                                        )}></div>
                                      </button>
                                    );
                                  })}
                                  </div>
                                 </div>
                               )}
                              </td>
                              {/* Sentiment */}
                              <td className="p-4 align-middle text-center">
                               {isNewQuery ? (
                                 <div className="text-gray-400 text-sm">—</div>
                               ) : (
                                <span className={clsx(
                                  "text-xs font-bold px-2 py-1 rounded-full border",
                                  sentimentLabel === 'Positive' && "bg-green-50 text-green-700 border-green-200",
                                  sentimentLabel === 'Negative' && "bg-red-50 text-red-700 border-red-200"
                                )}>
                                  {sentimentLabel}
                                </span>
                               )}
                              </td>
                               {/* Visibility Score */}
                               <td className="p-4 align-middle">
                               {isNewQuery ? (
                                 <div className="flex justify-center text-gray-400 text-sm">—</div>
                               ) : (
                                 <div className="flex flex-col items-center gap-2">
                                   <div className="flex items-center gap-2 w-full max-w-[120px]">
                                     <div className="text-xs font-bold text-gray-700 w-8 text-right">{queryVisibility}%</div>
                                     <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                       <div 
                                         className={clsx(
                                           "h-full rounded-full transition-all duration-500",
                                           queryVisibility >= 80 ? "bg-green-500" : 
                                           queryVisibility >= 50 ? "bg-yellow-500" : "bg-red-500"
                                         )} 
                                         style={{ width: `${queryVisibility}%` }}
                                       ></div>
                                     </div>
                                   </div>
                                 </div>
                               )}
                               </td>
                               {/* Average Position */}
                               <td className="p-4 align-middle text-center">
                                 <span className="text-sm font-bold text-gray-800">
                                   {isNewQuery ? '—' : (queryAvgPosition != null ? `#${queryAvgPosition.toFixed(1)}` : '—')}
                                 </span>
                               </td>
                               {/* Actions */}
                               <td className="p-4 align-middle text-center">
                                 <button 
                                   className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     setSelectedHistoryQuery({ id: query.id, text: query.text });
                                     setHistoryModalOpen(true);
                                   }}
                                   title="View History"
                                 >
                                   <History size={16} />
                                 </button>
                               </td>
                              </tr>

                             {/* Expandable Detail Panel */}
                             {isRowSelected && selectedCell && (
                               <tr className="animate-in fade-in zoom-in duration-200">
                                 <td colSpan={6} className="p-0 border-b border-gray-200">
                                   <div className="bg-white p-6 border-l-4 border-primary relative shadow-inner">
                                      <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                          <div className="bg-blue-100 p-2 rounded-lg text-primary">
                                            <MessageSquare size={20} />
                                          </div>
                                          <div>
                                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                              {selectedCell.platform} Analysis
                                              <span className={clsx(
                                                "text-xs px-2 py-0.5 rounded-full border font-medium",
                                                selectedCell.status === 'mentioned' && "bg-green-50 text-green-700 border-green-200",
                                                selectedCell.status === 'negative' && "bg-red-50 text-red-700 border-red-200",
                                                selectedCell.status === 'not_mentioned' && "bg-gray-50 text-gray-600 border-gray-200"
                                              )}>
                                                {selectedCell.status.toUpperCase().replace('_', ' ')}
                                              </span>
                                            </h3>
                                            <p className="text-sm text-gray-500">Query: "{selectedCell.query}"</p>
                                          </div>
                                        </div>
                                        <button 
                                          onClick={() => setSelectedCell(null)}
                                          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                                        >
                                          <X size={20} />
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-12 gap-8">
                                        {/* Left Column: Snapshot & Links */}
                                        <div className="col-span-7 space-y-6 border-r border-gray-100 pr-8">
                                          <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                              <Info size={14} /> AI Response Snapshot
                                            </h4>
                                            {selectedCell.status !== 'not_mentioned' ? (
                                              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-gray-700 leading-relaxed font-serif relative">
                                                <div className="absolute -left-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-primary shadow-sm">
                                                  <MessageSquare size={12} />
                                                </div>
                                                <p className="mb-3">"...when evaluating dashboard tools, <span className="bg-yellow-100 px-1 font-medium">WorkfxAI stands out for its specific focus on AI traffic sources</span>. Unlike traditional analytics, it breaks down visibility across ChatGPT and Perplexity..."</p>
                                                <p className="text-sm text-gray-500 mt-2 italic">— Generated by {selectedCell.platform} (May 24, 2024)</p>
                                              </div>
                                            ) : (
                                              <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-200 text-center text-gray-400">
                                                No mention detected in recent sampling.
                                              </div>
                                            )}
                                          </div>

                                          {selectedCell.status !== 'not_mentioned' && (
                                            <div>
                                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Citations & Sources</h4>
                                              <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary/30 transition-colors group">
                                                  <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                                                      <CheckCircle size={16} />
                                                    </div>
                                                    <div className="min-w-0">
                                                      <div className="text-sm font-medium text-gray-900 truncate">Best AI Analytics Tools for 2024</div>
                                                      <div className="text-xs text-gray-400 truncate">reddit.com/r/marketing/comments/18x...</div>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                      Positive
                                                    </span>
                                                    <button className="text-primary opacity-0 group-hover:opacity-100 p-1.5 hover:bg-primary/5 rounded-md transition-all" title="Open Link">
                                                      <ExternalLink size={14} />
                                                    </button>
                                                  </div>
                                                </div>

                                                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary/30 transition-colors group">
                                                  <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-8 h-8 bg-gray-50 text-gray-500 rounded-lg flex items-center justify-center shrink-0">
                                                      <Minus size={16} />
                                                    </div>
                                                    <div className="min-w-0">
                                                      <div className="text-sm font-medium text-gray-900 truncate">Marketing Tech Stack Discussion</div>
                                                      <div className="text-xs text-gray-400 truncate">twitter.com/tech_influencer/status...</div>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">Neutral</span>
                                                    <button className="text-primary opacity-0 group-hover:opacity-100 p-1.5 hover:bg-primary/5 rounded-md transition-all" title="Open Link">
                                                      <ExternalLink size={14} />
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Right Column: Analysis & Action */}
                                        <div className="col-span-5 space-y-6">
                                          {selectedCell.status !== 'not_mentioned' && (
                                            <div>
                                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <Users size={14} /> Competitor Mentions
                                              </h4>
                                              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
                                                  <span className="text-xs text-gray-500 font-medium">Rank in Answer</span>
                                                  <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">#1 Top Pick</span>
                                                </div>
                                                <div className="space-y-3">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                                      <span className="text-sm font-bold text-gray-900">WorkfxAI</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">Your Brand</span>
                                                  </div>
                                                  <div className="flex items-center justify-between opacity-60">
                                                    <div className="flex items-center gap-2">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                                      <span className="text-sm font-medium text-gray-700">Competitor A</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">Mentioned</span>
                                                  </div>
                                                  <div className="flex items-center justify-between opacity-60">
                                                    <div className="flex items-center gap-2">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                                      <span className="text-sm font-medium text-gray-700">Competitor B</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">Mentioned</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                              <Zap size={16} className="text-yellow-500" /> Recommended Action
                                            </h4>
                                            
                                            {selectedCell.status === 'mentioned' ? (
                                              <>
                                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                  High visibility detected! This query is driving traffic. Create a dedicated blog post or case study to dominate this topic further.
                                                </p>
                                                <button className="w-full bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary/20">
                                                  <PenTool size={16} /> Generate Content Brief
                                                </button>
                                              </>
                                            ) : selectedCell.status === 'negative' ? (
                                              <>
                                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                  Negative sentiment detected. It's recommended to draft an official response addressing the concerns raised in the source links.
                                                </p>
                                                <button className="w-full bg-red-600 text-white py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-200">
                                                  <AlertTriangle size={16} /> Draft Response
                                                </button>
                                              </>
                                            ) : (
                                              <>
                                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                  No mentions found yet. Consider optimizing your site content for this specific query to start ranking in AI results.
                                                </p>
                                                <button className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                                  <RefreshCw size={16} /> Optimize Content
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                   </div>
                                 </td>
                               </tr>
                             )}
                           </React.Fragment>
                         );
                       })}
                       
                       {/* Add New Query Input Row */}
                       {isEditMode && addingQueryGroupId === group.id && (
                         <tr>
                           <td className="p-4 pl-12 text-sm text-gray-600 font-medium border-r border-gray-50 align-middle" colSpan={6}>
                             <input
                               value={addingQueryValue}
                               onChange={(e) => setAddingQueryValue(e.target.value)}
                               onBlur={handleConfirmAddQueryToGroup}
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter') handleConfirmAddQueryToGroup();
                                 if (e.key === 'Escape') {
                                   setAddingQueryGroupId(null);
                                   setAddingQueryValue('');
                                 }
                               }}
                               placeholder="Type new query and press Enter..."
                               className="w-full px-2 py-1 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                               autoFocus
                             />
                           </td>
                         </tr>
                       )}
                     </React.Fragment>
                   );
                   })}
                 </tbody>
               </table>
             </div>
            {isEditMode && (
              <div className="mt-4 flex justify-between items-center gap-3 bg-white p-4 rounded-xl border border-purple-200 shadow-sm sticky bottom-0 z-20">
                <button
                  onClick={handleAddModalOpen}
                  className="px-4 py-2 bg-black text-white rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 text-sm transition-colors"
                >
                  <Plus size={16} /> Add Keyword
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 mr-2">
                    {hasDraftChanges ? "Unsaved changes" : "No changes"}
                  </span>
                  <button
                    onClick={() => { handleDiscardDraft(); setIsEditMode(false); }}
                    className="px-4 py-2 rounded-lg font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsSaveConfirmOpen(true)}
                    disabled={!hasDraftChanges}
                    className={clsx(
                      "px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all text-sm",
                      hasDraftChanges ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            )}
           </div>
        )}
        {isEditMode && isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Add Semantic Block & Queries</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">Semantic Block (Keyword)</label>
                  <input
                    value={newGroupTerm}
                    onChange={(e) => setNewGroupTerm(e.target.value)}
                    placeholder="Enter keyword to track"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Queries</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      value={newQueryInput}
                      onChange={(e) => setNewQueryInput(e.target.value)}
                      placeholder="Add a query text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNewQuery()}
                    />
                    <button
                      onClick={handleAddNewQuery}
                      className="px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {newQueries.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {newQueries.map((q) => (
                        <div key={q.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                          <span>{q.text}</span>
                          <button
                            onClick={() => handleRemoveNewQuery(q.id)}
                            className="p-1 rounded hover:bg-gray-200 text-gray-500"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAddGroup}
                  disabled={!newGroupTerm.trim() || newQueries.length === 0}
                  className={clsx(
                    "px-4 py-2 rounded-lg font-bold",
                    newGroupTerm.trim() && newQueries.length > 0 ? "bg-black text-white hover:bg-gray-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'setting' && (<React.Fragment>
           <div className={clsx(role === 'free' && "filter blur-sm select-none pointer-events-none")}>
             <div className="max-w-2xl mx-auto space-y-8">
               {/* Keywords & Queries Management */}
               <div className="bg-white border border-gray-200 rounded-xl p-6 relative">
                 <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                     <h3 className="font-bold text-lg flex items-center gap-2">
                       <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                         <Edit2 size={18} />
                       </div>
                       Keywords & Queries Management
                     </h3>
                     {/* Debug Toggle */}
                     <button
                       onClick={() => {
                         const newState = !hasKeywords;
                         setHasKeywords(newState);
                         if (newState) {
                           setKeywords([
                             { id: 'k1', term: 'Best AI Dashboard', queries: ['What is the best AI analytics dashboard?', 'Top tools for tracking AI traffic', 'WorkfxAI reviews and features'] },
                             { id: 'k2', term: 'AI Traffic Analytics', queries: ['How to track traffic from ChatGPT?', 'Is WorkfxAI good for SEO?'] },
                             { id: 'k3', term: 'Brand Reputation Monitoring', queries: ['Best brand monitoring tools 2024', 'WorkfxAI vs Competitors'] }
                           ]);
                         } else {
                           setKeywords([]);
                           setSetupKeywords([]);
                         }
                       }}
                       className="text-[10px] bg-gray-100 border border-gray-300 px-2 py-0.5 rounded text-gray-500 hover:bg-gray-200"
                     >
                       Debug: {hasKeywords ? 'Full' : 'Empty'}
                     </button>
                   </div>
                   
                   <button 
                     onClick={handleRunUpdate}
                     disabled={isUpdating || keywords.length === 0}
                     className={clsx(
                       "px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm",
                       isUpdating || keywords.length === 0
                         ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                         : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                     )}
                   >
                     <Play size={16} className={clsx(isUpdating && "animate-spin")} />
                     {isUpdating ? 'Updating...' : 'Run Update Now'}
                   </button>
                 </div>

                 {/* Empty State */}
                  {keywords.length === 0 ? (
                    <div className="space-y-6">
                      {/* Minimal Input Bar */}
                      <div className="max-w-lg mx-auto flex gap-2 pt-2">
                        <input
                          type="text"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Enter brand or keyword to track..."
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                          autoFocus
                        />
                        <button 
                          onClick={() => handleAddKeyword()}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center gap-2 text-sm shadow-sm whitespace-nowrap"
                        >
                          <Plus size={16} /> Add
                        </button>
                      </div>

                      {/* Selected Keywords Tags (Setup Mode) */}
                      {setupKeywords.length > 0 && (
                        <div className="max-w-lg mx-auto animate-in fade-in slide-in-from-top-2">
                          <div className="flex flex-wrap gap-2 mb-4 justify-center">
                            {setupKeywords.map((sk) => (
                              <div key={sk.id} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 border border-purple-100 shadow-sm animate-in zoom-in-95 duration-200">
                                {sk.term}
                                <button 
                                  onClick={() => handleRemoveSetupKeyword(sk.term)}
                                  className="hover:bg-purple-100 p-0.5 rounded-full transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <button 
                            onClick={handleConfirmSetup}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            Confirm & Start Tracking ({setupKeywords.length}) <ArrowRight size={18} />
                          </button>
                        </div>
                      )}

                     {/* Recommended Opportunities */}
                     <div>
                       <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                         <Target size={18} className="text-primary" />
                         AI-Recommended Opportunities
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* Opportunity Card 1 */}
                         <div 
                           onClick={() => toggleSetupKeyword('Artificial Intelligence Agency')}
                           className={clsx(
                             "border rounded-xl p-5 cursor-pointer transition-all group relative overflow-hidden",
                             setupKeywords.find(k => k.term === 'Artificial Intelligence Agency') 
                               ? "border-purple-500 ring-1 ring-purple-500 bg-purple-50/30" 
                               : "border-gray-200 hover:border-purple-200 hover:shadow-md bg-white"
                           )}
                         >
                           {setupKeywords.find(k => k.term === 'Artificial Intelligence Agency') && (
                             <div className="absolute top-0 right-0 p-2">
                               <div className="bg-purple-500 text-white rounded-full p-1 shadow-sm">
                                 <Check size={12} strokeWidth={3} />
                               </div>
                             </div>
                           )}
                           <div className="flex justify-between items-start mb-3">
                             <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                               <TrendingUp size={12} /> HIGH POTENTIAL
                             </div>
                           </div>
                           <h5 className="font-bold text-gray-900 mb-2">Artificial Intelligence Agency</h5>
                           <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                             Competitors haven't optimized for this yet. High chance to rank #1 with low effort.
                           </p>
                           
                           <div className="grid grid-cols-2 gap-2 bg-white/50 rounded-lg p-3 border border-gray-100">
                             <div>
                               <div className="text-[10px] text-gray-400 uppercase font-bold">Monthly Traffic</div>
                               <div className="text-lg font-bold text-gray-900">60,500</div>
                             </div>
                             <div>
                               <div className="text-[10px] text-gray-400 uppercase font-bold">Cost Savings</div>
                               <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                                 100% <span className="text-[10px] font-normal text-gray-400">vs Ads</span>
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Opportunity Card 2 */}
                         <div 
                           onClick={() => toggleSetupKeyword('AI Marketing Solutions')}
                           className={clsx(
                             "border rounded-xl p-5 cursor-pointer transition-all group relative overflow-hidden",
                             setupKeywords.find(k => k.term === 'AI Marketing Solutions') 
                               ? "border-purple-500 ring-1 ring-purple-500 bg-purple-50/30" 
                               : "border-gray-200 hover:border-purple-200 hover:shadow-md bg-white"
                           )}
                         >
                           {setupKeywords.find(k => k.term === 'AI Marketing Solutions') && (
                             <div className="absolute top-0 right-0 p-2">
                               <div className="bg-purple-500 text-white rounded-full p-1 shadow-sm">
                                 <Check size={12} strokeWidth={3} />
                               </div>
                             </div>
                           )}
                           <div className="flex justify-between items-start mb-3">
                             <div className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                               <DollarSign size={12} /> HIGH VALUE
                             </div>
                           </div>
                           <h5 className="font-bold text-gray-900 mb-2">AI Marketing Solutions</h5>
                           <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                             High conversion intent. Capture businesses actively evaluating solutions.
                           </p>
                           
                           <div className="grid grid-cols-2 gap-2 bg-white/50 rounded-lg p-3 border border-gray-100">
                             <div>
                               <div className="text-[10px] text-gray-400 uppercase font-bold">CPC Value</div>
                               <div className="text-lg font-bold text-gray-900">$22.83</div>
                             </div>
                             <div>
                               <div className="text-[10px] text-gray-400 uppercase font-bold">Competition</div>
                               <div className="text-lg font-bold text-orange-500 flex items-center gap-1">
                                 Medium <span className="text-[10px] font-normal text-gray-400">(62/100)</span>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 ) : (
                   <>
                     {/* Add New Keyword (Top Bar) */}
                     <div className="flex gap-2 mb-6">
                       <input
                         type="text"
                         value={newKeyword}
                         onChange={(e) => setNewKeyword(e.target.value)}
                         placeholder="Enter new keyword to track..."
                         className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                         onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                       />
                       <button 
                         onClick={() => handleAddKeyword()}
                         className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                       >
                         <Plus size={18} /> Add
                       </button>
                     </div>

                     {/* Keywords List */}
                     <div className="space-y-4">
                       {keywords.map((keyword) => (
                         <div key={keyword.id} className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-purple-200">
                           <div className="bg-gray-50 p-4 flex items-center justify-between group">
                             <div className="font-bold text-gray-900 flex items-center gap-2">
                               {keyword.term}
                               <span className="text-xs font-normal text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                                 {keyword.queries.length} queries
                               </span>
                             </div>
                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => setEditingKeyword(editingKeyword === keyword.id ? null : keyword.id)}
                                 className={clsx(
                                   "p-2 rounded-lg transition-colors",
                                   editingKeyword === keyword.id ? "bg-purple-100 text-purple-700" : "hover:bg-gray-200 text-gray-500"
                                 )}
                               >
                                 <Edit2 size={16} />
                               </button>
                               <button 
                                 onClick={() => handleDeleteKeyword(keyword.id)}
                                 className="p-2 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </div>
                           
                           {/* Queries Edit Panel */}
                           {editingKeyword === keyword.id && (
                             <div className="p-4 bg-purple-50/30 border-t border-gray-200 space-y-3 animate-in slide-in-from-top-2">
                               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tracking Queries</h4>
                               {keyword.queries.map((query, idx) => (
                                 <div key={idx} className="flex gap-2">
                                   <input
                                     type="text"
                                     value={query}
                                     onChange={(e) => handleUpdateQuery(keyword.id, idx, e.target.value)}
                                     className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-purple-400 outline-none"
                                   />
                                 </div>
                               ))}
                               <button className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-2">
                                 <Plus size={14} /> Add Query Variant
                               </button>
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
                   </>
                 )}
               </div>

              {/* GA4 Connection */}
              <div ref={ga4SectionRef} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                    <BarChart2 size={18} />
                  </div>
                  GA4 Data Authorization
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Connect your Google Analytics 4 account</p>
                      <p className="text-xs text-gray-400">Required for organic traffic tracking</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {!isGA4Connected ? (
                        <button
                          onClick={() => {
                            setGaDebugStatus('linking');
                            setTimeout(() => {
                              setGA4Connected(true);
                              setRole('active');
                              setGaDebugStatus('needs_change');
                            }, 800);
                          }}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90"
                        >
                          连接 GA4
                        </button>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">已连接</span>
                      )}
                      
                      <div className="relative">
                        <button
                          className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 inline-flex items-center gap-1"
                          onClick={() => setGaDebugOpen(v => !v)}
                          aria-haspopup="menu"
                          aria-expanded={gaDebugOpen}
                          title="Debug GA4 status"
                        >
                          <Settings size={14} />
                          Debug
                        </button>
                        <span
                          className={
                            gaDebugStatus === 'not_connected'
                              ? 'ml-2 text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100'
                              : gaDebugStatus === 'needs_change'
                              ? 'ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100'
                              : 'ml-2 text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100'
                          }
                        >
                          {gaDebugStatus === 'not_connected' ? 'Not connected' : gaDebugStatus === 'needs_change' ? 'Connected (needs changes)' : 'Linking'}
                        </span>
                        {gaDebugOpen && (
                          <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                              onClick={() => {
                                setGaDebugStatus('not_connected');
                                setGaDebugOpen(false);
                              }}
                            >
                              Not connected
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                              onClick={() => {
                                setGaDebugStatus('needs_change');
                                setGaDebugOpen(false);
                              }}
                            >
                              Connected (needs changes)
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                              onClick={() => {
                                setGaDebugStatus('linking');
                                setGaDebugOpen(false);
                              }}
                            >
                              Linking
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  
                </div>
              </div>

               {/* AI Platforms */}

               {/* AI Platforms */}
               <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Monitoring Platforms</h3>
                <div className="space-y-3">
                  {['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'SearchGPT'].map(platform => (
                    <label key={platform} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="font-medium text-gray-700">{platform}</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Monitoring Frequency */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  Monitoring Frequency
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 text-blue-800 text-sm p-3 rounded-lg flex items-start gap-2">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <p>AI visibility scores typically don't change drastically day-to-day. We recommend a <span className="font-bold">3-day cycle</span> to optimize token usage and costs.</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: '1', label: 'Daily', desc: 'High frequency' },
                      { value: '3', label: 'Every 3 Days', desc: 'Recommended' },
                      { value: '7', label: 'Weekly', desc: 'Low frequency' }
                    ].map((option) => (
                      <label key={option.value} className="cursor-pointer relative group">
                        <input type="radio" name="frequency" value={option.value} defaultChecked={option.value === '3'} className="peer sr-only" />
                        <div className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary transition-all text-center h-full">
                          <div className="font-bold text-gray-900 mb-1">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.desc}</div>
                        </div>
                        {option.value === '3' && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            BEST VALUE
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 pb-2">
                <button 
                  onClick={() => setIsVisibilityConfigured(true)}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                >
                  <Save size={18} />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>)}

      {visConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setVisConfigOpen(false)}></div>
          <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-gray-900">Visibility Settings</h4>
              <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500" onClick={() => setVisConfigOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Update Frequency</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: '1', label: 'Daily' },
                    { value: '3', label: 'Every 3 Days' },
                    { value: '7', label: 'Weekly' },
                  ].map((opt) => (
                    <label key={opt.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="visFrequencyModal"
                        className="sr-only peer"
                        value={opt.value}
                        checked={visFrequencyDraft === opt.value}
                        onChange={() => setVisFrequencyDraft(opt.value as '1' | '3' | '7')}
                      />
                      <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5">
                        {opt.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-4 left-0 text-[10px] text-gray-400">（后续是否作为升级项）</div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">MONITOR PLATFORMS</div>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((p) => (
                    <label key={p.id} className="flex items-center justify-between p-2 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm text-gray-700">{p.label}</span>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary rounded border-gray-300"
                        checked={!!visPlatformsDraft[p.id]}
                        onChange={(e) =>
                          setVisPlatformsDraft((prev) => ({ ...prev, [p.id]: e.target.checked }))
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setVisFrequency(visFrequencyDraft);
                    setVisPlatforms(visPlatformsDraft);
                    setIsVisibilityConfigured(true);
                    setVisConfigOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {historyModalOpen && selectedHistoryQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setHistoryModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl max-w-5xl w-full p-6 m-4 animate-in zoom-in-95 duration-200 h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4 shrink-0">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <History size={20} className="text-gray-500" />
                  Query History
                </h3>
                <p className="text-xl font-semibold text-gray-800 mb-1">"{selectedHistoryQuery.text}"</p>
                <p className="text-xs text-gray-400">Only showing the last 30 query records</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors"
                  onClick={() => {
                    // Placeholder for export functionality
                    alert("Exporting history for: " + selectedHistoryQuery.text);
                  }}
                >
                  <Download size={14} />
                  Export
                </button>
                <button 
                  onClick={() => setHistoryModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors ml-2"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600 w-32">Date</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 w-32">Platform</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 w-24 text-center">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 w-24 text-center">Rank</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 w-28 text-center">Sentiment</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 w-48">Competitors Mentioned</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Mention Snippet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { 
                      date: 'May 24, 2024', 
                      platforms: [
                        { name: 'ChatGPT', status: 'mentioned', rank: 2, sentiment: 85, competitors: ['Competitor A', 'Competitor B'], snippet: '"WorkfxAI is a strong contender in the AI analytics space, offering unique visibility metrics..."' },
                        { name: 'Claude', status: 'mentioned', rank: 3, sentiment: 78, competitors: ['Competitor A'], snippet: '"While Competitor A is popular, WorkfxAI provides more granular data on AI traffic sources."' },
                        { name: 'Gemini', status: 'not_mentioned', rank: null, sentiment: null, competitors: ['Competitor A', 'Competitor C'], snippet: '—' }
                      ]
                    },
                    { 
                      date: 'May 17, 2024', 
                      platforms: [
                        { name: 'ChatGPT', status: 'mentioned', rank: 3, sentiment: 82, competitors: ['Competitor A'], snippet: '"Tools like WorkfxAI help marketers track dark social traffic effectively."' },
                        { name: 'Claude', status: 'not_mentioned', rank: null, sentiment: null, competitors: ['Competitor A', 'Competitor B'], snippet: '—' },
                        { name: 'Gemini', status: 'negative', rank: 5, sentiment: 35, competitors: ['Competitor C'], snippet: '"Some users report that WorkfxAI has a steeper learning curve compared to Competitor C."' }
                      ]
                    },
                    { 
                      date: 'May 10, 2024', 
                      platforms: [
                        { name: 'ChatGPT', status: 'not_mentioned', rank: null, sentiment: null, competitors: ['Competitor A', 'Competitor B'], snippet: '—' },
                        { name: 'Claude', status: 'not_mentioned', rank: null, sentiment: null, competitors: ['Competitor A'], snippet: '—' },
                        { name: 'Gemini', status: 'not_mentioned', rank: null, sentiment: null, competitors: ['Competitor C'], snippet: '—' }
                      ]
                    }
                  ].map((row, i) => (
                    <React.Fragment key={i}>
                      {row.platforms.map((platform, j) => (
                        <tr key={`${i}-${j}`} className={clsx("hover:bg-gray-50 transition-colors", j === 0 ? "border-t border-gray-200" : "")}>
                          {j === 0 && (
                            <td className="px-4 py-3 text-gray-900 font-bold border-r border-gray-100 align-top bg-gray-50/50" rowSpan={row.platforms.length}>
                              {row.date}
                            </td>
                          )}
                          <td className="px-4 py-3 font-medium text-gray-700 align-top">
                            {platform.name}
                          </td>
                          <td className="px-4 py-3 text-center align-top">
                            <span className={clsx(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block",
                              platform.status === 'mentioned' && "bg-green-50 text-green-700 border-green-200",
                              platform.status === 'negative' && "bg-red-50 text-red-700 border-red-200",
                              platform.status === 'not_mentioned' && "bg-gray-50 text-gray-500 border-gray-200"
                            )}>
                              {platform.status === 'mentioned' ? 'Mentioned' : platform.status === 'negative' ? 'Negative' : 'Not Mentioned'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-gray-700 align-top">
                            {platform.rank ? `#${platform.rank}` : '—'}
                          </td>
                          <td className="px-4 py-3 text-center align-top">
                            {platform.sentiment !== null ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className={clsx(
                                  "text-xs font-bold",
                                  platform.sentiment >= 70 ? "text-green-600" :
                                  platform.sentiment >= 40 ? "text-yellow-600" : "text-red-600"
                                )}>
                                  {platform.sentiment}%
                                </span>
                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className={clsx(
                                      "h-full rounded-full",
                                      platform.sentiment >= 70 ? "bg-green-500" : 
                                      platform.sentiment >= 40 ? "bg-yellow-500" : "bg-red-500"
                                    )} 
                                    style={{ width: `${platform.sentiment}%` }}
                                  ></div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 align-top">
                            {platform.competitors.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {platform.competitors.map((comp, k) => (
                                  <span key={k} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] border border-gray-200">
                                    {comp}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 italic align-top">
                            {platform.snippet}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end shrink-0">
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
