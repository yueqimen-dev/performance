import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { useLayoutStore } from '../../store/useLayoutStore';
import {
  TrendingUp,
  MessageSquare,
  ShoppingBag,
  Wrench,
  Search,
  BarChart2,
  Compass,
  Globe,
  User,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar() {
  const { role } = useUserStore();
  const { isSidebarCollapsed, setSidebarCollapsed } = useLayoutStore();

  const navGroups = [
    {
      label: 'Content Strategy',
      items: [
        { label: 'Growth Engine', path: '/content-strategy', icon: TrendingUp } // Simplified for now
      ]
    },
    {
      label: 'Reddit Management',
      items: [
        { label: 'Attract New Customers', path: '/reddit-management', icon: MessageSquare, badge: 'BETA' }
      ]
    },
    {
      label: 'Product Listing',
      items: [
        { label: 'Optimize Product Detail Page', path: '/product-listing', icon: ShoppingBag }
      ]
    },
    {
      label: 'Tech Assessment',
      items: [
        { label: 'Fix Critical Errors', path: '/tech-assessment', icon: Wrench }
      ]
    },
    {
      label: 'Website SEO',
      items: [
        { label: 'Rank Higher Only', path: '/website-seo', icon: Search, badge: 'Coming Soon' }
      ]
    },
    {
      label: 'Performance',
      items: [
        { label: 'Track Marketing Results', path: '/performance', icon: BarChart2, badge: role === 'free' ? 'Locked' : undefined }
      ]
    }
  ];

  return (
    <aside 
      className={clsx(
        "bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-50 transition-all duration-300 font-sans",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-black shadow-sm z-50 hidden group-hover:block transition-colors"
      >
        {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className={clsx("p-6 border-b border-gray-100", isSidebarCollapsed && "p-4 flex justify-center")}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold shadow-sm shrink-0">W</div>
          {!isSidebarCollapsed && <span className="font-display font-bold text-black text-lg whitespace-nowrap tracking-tight">workfxai</span>}
        </div>
      </div>

      {/* Status Counters */}
      {!isSidebarCollapsed && (
        <div className="grid grid-cols-3 gap-2 p-6 border-b border-gray-100">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
            <div className="text-sm font-bold text-black">0</div>
            <div className="text-[10px] text-gray-500 uppercase font-medium mt-1 tracking-wider">Total</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
            <div className="text-sm font-bold text-black">0</div>
            <div className="text-[10px] text-gray-500 uppercase font-medium mt-1 tracking-wider">Fixed</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
            <div className="text-sm font-bold text-black">0</div>
            <div className="text-[10px] text-gray-500 uppercase font-medium mt-1 tracking-wider">Pending</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={clsx("flex-1 py-6 space-y-8", isSidebarCollapsed ? "px-2" : "px-4")}>
        {navGroups.map((group, idx) => (
          <div key={idx}>
            {!isSidebarCollapsed && <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 px-3 tracking-widest">{group.label}</h3>}
            <div className="space-y-1">
              {group.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={({ isActive }) => clsx(
                    "flex items-center rounded-lg text-sm transition-all duration-200 group relative",
                    isSidebarCollapsed ? "justify-center p-3" : "justify-between px-3 py-2.5",
                    isActive 
                      ? "bg-black text-white font-medium shadow-md shadow-gray-200" 
                      : "text-gray-500 hover:bg-gray-100 hover:text-black"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className="shrink-0" strokeWidth={2} />
                    {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.badge && (
                    <span className={clsx(
                      "text-[10px] px-1.5 py-0.5 rounded border whitespace-nowrap ml-2 font-medium",
                      item.badge === 'BETA' ? "bg-gray-50 text-gray-700 border-gray-200" : "bg-gray-50 text-gray-400 border-gray-100"
                    )}>
                      {item.badge}
                    </span>
                  )}
                  {/* Dot indicator for badge when collapsed */}
                  {isSidebarCollapsed && item.badge && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        <div className={clsx("pt-4 mt-4 border-t border-gray-100", isSidebarCollapsed && "flex justify-center")}>
           <NavLink to="/explore" title="Explore" className={clsx("flex items-center gap-3 text-gray-500 hover:text-black group transition-colors", isSidebarCollapsed ? "p-2" : "px-3 py-2")}>
             <Compass size={20} className="group-hover:text-black transition-colors shrink-0" strokeWidth={2} />
             {!isSidebarCollapsed && <span className="text-sm font-medium">Explore WorkfxAI</span>}
           </NavLink>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className={clsx("bg-white border-t border-gray-200", isSidebarCollapsed ? "p-2" : "p-4")}>
        {!isSidebarCollapsed && role === 'free' && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-display font-bold text-black">Starter</span>
              <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:border-gray-300 font-medium transition-all bg-white shadow-sm">Upgrade</button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div className="bg-black h-1.5 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
              <span>Subscription: 0/2500</span>
              <span>EXP: 2026/02/26</span>
            </div>
          </div>
        )}

        {!isSidebarCollapsed && (
          <div className="flex items-center justify-between text-gray-500 mb-4 px-2 cursor-pointer hover:text-black transition-colors">
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <span className="text-sm font-medium">English</span>
            </div>
          </div>
        )}

        <div className={clsx("flex items-center gap-3 text-gray-700 cursor-pointer hover:text-black transition-colors", isSidebarCollapsed ? "justify-center" : "px-2")}>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shrink-0 text-gray-600">
            <User size={16} />
          </div>
          {!isSidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap">My account</span>}
        </div>
      </div>
    </aside>
  );
}
