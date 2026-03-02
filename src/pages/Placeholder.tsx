import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

export default function Placeholder() {
  const location = useLocation();
  const pageName = location.pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')).join(' ') || 'Home';

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
      <Construction size={64} className="mb-6 opacity-20" />
      <h1 className="text-3xl font-bold mb-2 text-gray-300">{pageName}</h1>
      <p className="text-gray-400">This module is coming soon.</p>
    </div>
  );
}
