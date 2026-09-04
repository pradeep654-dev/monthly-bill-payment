import React, { useState } from 'react';
import { Banknote, CheckCircle2, Sliders } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';
import { SalarySettingsModal } from './SalarySettingsModal';

export const SalaryCreditCard: React.FC = () => {
  const { summary } = usePayments();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="app-card p-5 relative overflow-hidden bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 dark:border-cyan-500/30 space-y-3.5">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-cyan-500/15">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2.5 rounded-2xl bg-cyan-500 text-white shadow-md shadow-cyan-500/20 shrink-0">
              <Banknote className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                SBI Salary Engine
              </span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                Monthly Salary ({formatCurrency(summary.monthlyIncome)})
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center space-x-1.5 text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 border border-blue-500/20 hover:scale-105 active:scale-95 shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Hike & Split</span>
          </button>
        </div>



        {/* Salary & Leftover Allocation Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-[#0D1117]/80 border border-slate-200/60 dark:border-slate-800 min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block truncate tracking-tight">
              Payday Income
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white block mt-0.5 truncate">
              {formatCurrency(summary.monthlyIncome || 80000)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 block truncate tracking-tight" title="Free Disposable Cash">
              Free Disposable Cash
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 block mt-0.5 truncate">
              {formatCurrency(summary.leftoverIncome ?? 0)}
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-1 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium gap-2">
          <span className="truncate">Reserves: {formatCurrency(summary.totalAmount)} for bills & SIPs</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-500" />
            <span>Auto-Split</span>
          </span>
        </div>
      </div>

      <SalarySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
