import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { MonthPickerModal } from './MonthPickerModal';

export const Header: React.FC = () => {
  const { summary, goToNextMonth, goToPrevMonth, isLiquidGlass } = usePayments();
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  return (
    <>
      <header className={`sticky top-0 z-30 pt-safe border-b shadow-xs ${
        isLiquidGlass
          ? 'backdrop-blur-2xl bg-white/50 dark:bg-[#040711]/80 border-white/60 dark:border-white/20'
          : 'bg-white/95 dark:bg-[#050812]/95 backdrop-blur-md border-slate-200/80 dark:border-slate-800'
      }`}>
        <div className="px-4 py-3 flex items-center justify-between">
          {/* App Identity */}
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm tracking-tighter shadow-md ${
              isLiquidGlass
                ? 'real-liquid-pill text-slate-900 dark:text-white dark:border-white/30'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 dark:from-orange-500 dark:to-amber-500 text-white'
            }`}>
              ₹
            </div>
            <div>
              <h1 className="font-black text-sm text-slate-900 dark:text-white tracking-tight leading-tight">
                PayTracker
              </h1>
              <span className={`text-[10px] font-extrabold ${
                isLiquidGlass
                  ? 'text-blue-600 dark:text-cyan-400'
                  : 'text-emerald-600 dark:text-orange-400'
              }`}>
                Commitment Tracker
              </span>
            </div>
          </div>

          {/* Month Selector Pill */}
          <div className={`flex items-center space-x-0.5 p-1 rounded-2xl shadow-2xs backdrop-blur-xl ${
            isLiquidGlass
              ? 'real-liquid-pill dark:border-white/20'
              : 'bg-slate-100 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-750'
          }`}>
            <button
              onClick={goToPrevMonth}
              className="p-1 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white active:scale-95 transition-all"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => setIsMonthPickerOpen(true)}
              className="px-2.5 py-0.5 font-black text-xs text-slate-900 dark:text-white flex items-center space-x-1 hover:opacity-80 transition-colors"
            >
              <span>{summary.monthName}</span>
            </button>

            <button
              onClick={goToNextMonth}
              className="p-1 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white active:scale-95 transition-all"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => setIsMonthPickerOpen(true)}
              className="p-1 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              aria-label="Open Month Picker"
            >
              <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      <MonthPickerModal
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
      />
    </>
  );
};
