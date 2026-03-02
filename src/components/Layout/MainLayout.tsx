import React from 'react';
import { Sidebar } from './Sidebar';
import { ChatSidebar } from '../Chat/ChatSidebar';
import { Outlet } from 'react-router-dom';
import { DebugButton } from '../Debug/DebugButton';
import { useLayoutStore } from '../../store/useLayoutStore';
import { clsx } from 'clsx';

export function MainLayout() {
  const { isSidebarCollapsed, isChatOpen } = useLayoutStore();

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      <main 
        className={clsx(
          "flex-1 p-8 transition-all duration-300",
          isSidebarCollapsed ? "ml-20" : "ml-64",
          isChatOpen ? "mr-[400px]" : ""
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <ChatSidebar />
      <DebugButton />
    </div>
  );
}
