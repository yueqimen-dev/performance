import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ExternalLink, 
  Zap,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function Dashboard() {
  const metrics = [
    { label: 'AI Citation Rate', score: 10, max: 25, status: 'warning' },
    { label: 'Content Authority', score: 10, max: 20, status: 'warning' },
    { label: 'Structured Data', score: 10, max: 20, status: 'warning' },
    { label: 'Content Richness', score: 14, max: 20, status: 'success' },
    { label: 'Semantic Optimization', score: 11, max: 15, status: 'success' },
  ];

  const competitors = [
    { rank: 1, name: 'TripleWhale', domain: 'triplewhale.com', scores: [18, 17, 16, 18, 10], total: 79, tier: 'A' },
    { rank: 2, name: 'AirOps', domain: 'airops.com', scores: [15, 15, 18, 15, 10], total: 73, tier: 'B' },
    { rank: 3, name: 'Jasper', domain: 'jasper.ai', scores: [13, 15, 14, 15, 9], total: 66, tier: 'B' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Let's check your website's performance</h1>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center text-black font-bold">W</div>
            <span className="font-bold text-xl text-gray-900">WorkfxAI</span>
            <button className="ml-4 bg-black text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Zap size={14} /> Change Settings
            </button>
          </div>
          <span className="text-sm text-gray-500">GEO Quick Evaluation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Score */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">GEO AI VISIBILITY SCORE</div>
            <div className="text-7xl font-bold text-gray-900 flex items-baseline">
              <span className="text-red-600">55</span>
              <span className="text-3xl text-gray-300 ml-1">/100</span>
            </div>
            <div className="mt-4 px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-sm font-bold">
              C Tier
            </div>
          </div>

          {/* Right: Metrics */}
          <div className="space-y-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  {metric.status === 'warning' ? (
                    <AlertTriangle size={18} className="text-amber-600" />
                  ) : (
                    <CheckCircle size={18} className="text-green-600" />
                  )}
                  <span className="text-gray-700 font-medium group-hover:text-black transition-colors cursor-help border-b border-dotted border-gray-300 group-hover:border-black">
                    {metric.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-bold">
                  <span className={metric.status === 'warning' ? 'text-amber-600' : 'text-green-600'}>
                    {metric.score}
                  </span>
                  <span className="text-gray-300">/{metric.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-center gap-3 text-gray-700">
        <Info size={20} className="shrink-0" />
        <span className="text-sm font-medium">
          <span className="font-bold">Tip:</span> Hover over a metric name (dotted underline) to see details.
        </span>
      </div>

      {/* Competitor Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 text-left w-16">#</th>
                <th className="px-6 py-4 text-left">Brand</th>
                <th className="px-4 py-4 text-center">AI Citation Rate <span className="text-gray-400 text-[10px] block font-normal">Weight 25</span></th>
                <th className="px-4 py-4 text-center">Content Authority <span className="text-gray-400 text-[10px] block font-normal">Weight 20</span></th>
                <th className="px-4 py-4 text-center">Structured Data <span className="text-gray-400 text-[10px] block font-normal">Weight 20</span></th>
                <th className="px-4 py-4 text-center">Content Richness <span className="text-gray-400 text-[10px] block font-normal">Weight 20</span></th>
                <th className="px-4 py-4 text-center">Semantic Optimization <span className="text-gray-400 text-[10px] block font-normal">Weight 15</span></th>
                <th className="px-6 py-4 text-center">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {competitors.map((comp, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={clsx(
                      "w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white",
                      idx === 0 ? "bg-warning" : idx === 1 ? "bg-gray-400" : "bg-orange-400"
                    )}>
                      {comp.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{comp.name}</div>
                    <a href={`https://${comp.domain}`} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-primary flex items-center gap-1">
                      {comp.domain} <ExternalLink size={10} />
                    </a>
                  </td>
                  {comp.scores.map((score, sIdx) => (
                    <td key={sIdx} className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Visual representation - simplified dots */}
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, dIdx) => (
                            <div 
                              key={dIdx} 
                              className={clsx(
                                "w-1.5 h-1.5 rounded-full",
                        dIdx < Math.round(score / 5) ? "bg-black" : "bg-gray-200"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium ml-1 text-gray-600">{score}</span>
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900 text-lg">{comp.total}</span>
                      <span className={clsx(
                        "text-[10px] px-1.5 rounded font-bold",
                      comp.tier === 'A' ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      )}>
                        {comp.tier} Tier
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Callout */}
      <div className="bg-gray-50 p-6 flex items-center justify-between border-t border-gray-200">
          <div className="font-bold text-gray-800">Seize traffic opportunities and crush your competitors!</div>
        <button className="bg-black text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-800 transition-all flex items-center gap-2">
            <Zap size={16} /> Generate Content Strategy
          </button>
        </div>
      </div>
    </div>
  );
}
