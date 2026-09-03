import React from 'react';
import { Home, CreditCard, PiggyBank, Target, Settings } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import type { ActiveTab } from '../types';

export const NavBar: React.FC = () => {
  const { activeTab, setActiveTab, isLiquidGlass } = usePayments();

  const navItems: { id: ActiveTab; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'commitments', label: 'Bills', icon: CreditCard },
    { id: 'savings', label: 'Savings', icon: PiggyBank },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];


  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-safe">
      {/* Ambient gradient shadow behind navbar to preserve readability while maintaining glass transparency */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-200/40 dark:from-black/80 via-slate-100/20 dark:via-black/40 to-transparent pointer-events-none -z-10" />

      <div className="max-w-md mx-auto px-4 pb-3">
        <div className={`pointer-events-auto relative overflow-hidden rounded-[28px] p-2 shadow-2xl flex items-center justify-around border transition-all duration-300 ${
          isLiquidGlass
            ? 'bg-white/55 dark:bg-black/60 backdrop-blur-[35px] backdrop-saturate-[220%] border-white/80 dark:border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
            : 'bg-white/95 dark:bg-[#0B0F19]/95 border-slate-200/90 dark:border-slate-800 backdrop-blur-2xl shadow-xl'
        }`}>
          {/* Top Specular Glare Line for 3D Bubble Glass effect */}
          {isLiquidGlass && (
            <div className="absolute top-0 inset-x-6 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/80 to-transparent pointer-events-none" />
          )}

          {navItems.map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex-1 py-2.5 px-3 rounded-[20px] flex flex-col items-center justify-center space-y-1 transition-all duration-200 active:scale-95 ${
                  isActive
                    ? isLiquidGlass
                      ? 'bg-white/90 dark:bg-white/25 text-slate-950 dark:text-white font-black shadow-[0_4px_25px_rgba(0,0,0,0.2)] dark:shadow-[0_0_25px_rgba(255,255,255,0.35)] border border-white/90 dark:border-white/50 backdrop-blur-2xl scale-105'
                      : 'bg-emerald-500 text-white dark:bg-orange-500 dark:text-white font-extrabold shadow-md shadow-emerald-500/25 dark:shadow-orange-500/30 scale-105'
                    : isLiquidGlass
                    ? 'text-slate-800 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold'
                }`}
              >
                {/* Active Indicator Glow Dot for 3D Liquid Glass */}
                {isActive && isLiquidGlass && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-white shadow-[0_0_10px_#ffffff]" />
                )}

                <IconComp className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2.2]'}`} />
                <span className="text-[11px] font-extrabold leading-none tracking-tight drop-shadow-xs">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
