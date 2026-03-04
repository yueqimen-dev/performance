import React from 'react';
import { useUserStore, UserRole } from '../../store/useUserStore';
import { clsx } from 'clsx';

export function DebugButton() {
  const { role, setRole, setGA4Connected } = useUserStore();

  const roles: { id: UserRole; label: string }[] = [
    { id: 'free', label: 'Free' },
    { id: 'pending', label: 'Pending' },
    { id: 'active', label: 'Active' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg border border-gray-200">
      {roles.map((r) => (
        <button
          key={r.id}
          onClick={() => {
            setRole(r.id);
            if (r.id === 'pending') {
              setGA4Connected(false);
            }
            if (r.id === 'active') {
              setGA4Connected(true);
            }
          }}
          className={clsx(
            "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
            role === r.id 
              ? "bg-purple-600 text-white shadow-md transform scale-105" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
