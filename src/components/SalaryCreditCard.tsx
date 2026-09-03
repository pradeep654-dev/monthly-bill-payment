import React from 'react';
import { Banknote, CheckCircle2 } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';

export const SalaryCreditCard: React.FC = () => {
  const { summary } = usePayments();

  return (
    <div className="app-card p-5 relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
            <Banknote className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Salary Credit Engine
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[9px] font-black">
                AUTO 1ST OF MONTH
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Monthly Salary Credit (₹80,000)
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Credited to HDFC</span>
        </div>
      </div>

      {/* Salary & Leftover Allocation Stats Grid */}
      <div className="grid grid-cols-2 gap-3 pt-3">
        <div className="p-3 rounded-2xl bg-white/60 dark:bg-[#0D1117]/80 border border-slate-200/60 dark:border-slate-800">
          <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block">
            Monthly Payday Income
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {formatCurrency(summary.monthlyIncome || 80000)}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 block">
            Leftover Disposable Cash
          </span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary.leftoverIncome || 51493)}
          </span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <span>Reserves: {formatCurrency(summary.totalAmount)} for bills & SIPs</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">₹80,000 / Mo</span>
      </div>
    </div>
  );
};
