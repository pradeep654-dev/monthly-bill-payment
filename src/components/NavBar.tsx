import React from 'react';
import { Home, History, Settings } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import type { ActiveTab } from '../types';

export const NavBar: React.FC = () => {
  const { activeTab, setActiveTab } = usePayments();

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-lg border-t border-slate-200/60 dark:border-slate-800/80 pb-safe transition-colors duration-200">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 transition-all duration-200 relative ${
                isActive
                  ? 'text-emerald-600 dark:text-orange-500 font-bold scale-105'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.2] mb-1" />
              <span className="text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute top-1.5 w-1 h-1 rounded-full bg-emerald-500 dark:bg-orange-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
