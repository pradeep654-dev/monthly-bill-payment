import React from 'react';
import { Home, History, Settings } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import type { ActiveTab } from '../types';

export const NavBar: React.FC = () => {
  const { activeTab, setActiveTab } = usePayments();

  const navItems: { id: ActiveTab; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-safe">
      <div className="max-w-md mx-auto px-4 pb-2">
        <div className="pointer-events-auto backdrop-blur-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xl flex items-center justify-around">
          {navItems.map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 py-2 px-3 rounded-xl flex flex-col items-center justify-center space-y-1 transition-all active:scale-95 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:bg-orange-500/15 dark:text-orange-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <IconComp className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                <span className="text-xs leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
