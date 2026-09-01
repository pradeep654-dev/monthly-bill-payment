import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Menu } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { MonthPickerModal } from './MonthPickerModal';

export const Header: React.FC = () => {
  const { summary, goToPrevMonth, goToNextMonth } = usePayments();
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-50/90 dark:bg-[#090D16]/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 pt-safe px-4 py-3 transition-colors duration-200">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Left Menu / Brand Icon */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMonthPickerOpen(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              title="Menu & Month Picker"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center Month Selector */}
          <div className="flex items-center space-x-1">
            <button
              onClick={goToPrevMonth}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMonthPickerOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl font-semibold text-slate-900 dark:text-orange-500 hover:bg-slate-200/50 dark:hover:bg-orange-500/10 transition-colors text-base tracking-tight"
            >
              <span>{summary.monthName}</span>
              <span className="text-xs opacity-70">▾</span>
            </button>

            <button
              onClick={goToNextMonth}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Calendar Action */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMonthPickerOpen(true)}
              className="p-2 rounded-xl text-emerald-600 dark:text-orange-500 hover:bg-emerald-50 dark:hover:bg-orange-500/10 transition-colors"
              title="Select Month"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Month Picker Modal */}
      <MonthPickerModal
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
      />
    </>
  );
};
