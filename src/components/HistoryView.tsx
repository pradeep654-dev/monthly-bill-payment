import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';

export const HistoryView: React.FC = () => {
  const { allMonthSummaries, setCurrentMonthKey, setActiveTab, currentMonthKey } = usePayments();

  const handleSelectMonth = (monthKey: string) => {
    setCurrentMonthKey(monthKey);
    setActiveTab('home');
  };

  const grandTotal = allMonthSummaries.reduce((acc, m) => acc + m.totalAmount, 0);
  const grandPaid = allMonthSummaries.reduce((acc, m) => acc + m.paidAmount, 0);
  const grandPercentage = grandTotal > 0 ? Math.round((grandPaid / grandTotal) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* View Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Payment History
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review past monthly records and bill completion trends
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#161B26] dark:to-[#1E2430] text-white rounded-3xl p-5 shadow-lg border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            All-Time Summary
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {allMonthSummaries.length} {allMonthSummaries.length === 1 ? 'Month' : 'Months'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Total Bills Tracked</span>
            <span className="text-xl font-extrabold">{formatCurrency(grandTotal)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Total Amount Paid</span>
            <span className="text-xl font-extrabold text-emerald-400">{formatCurrency(grandPaid)}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-300">Overall Completion</span>
            <span className="text-emerald-400 font-bold">{grandPercentage}%</span>
          </div>
          <div className="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${grandPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Month-by-month List */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 tracking-tight">
          Monthly Logs
        </h3>

        <div className="space-y-3">
          {allMonthSummaries.map(m => {
            const isCurrent = m.monthKey === currentMonthKey;

            return (
              <div
                key={m.monthKey}
                onClick={() => handleSelectMonth(m.monthKey)}
                className={`bg-white dark:bg-[#161B26] border rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isCurrent
                    ? 'border-emerald-500/60 dark:border-orange-500/60 ring-1 ring-emerald-500/30 dark:ring-orange-500/30'
                    : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-orange-500" />
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                      {m.monthName}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-orange-950/40 dark:text-orange-400 border border-emerald-200 dark:border-orange-800/40">
                        Selected
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatCurrency(m.totalAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Paid</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(m.paidAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pending</span>
                    <span className="font-bold text-red-500 dark:text-orange-500">
                      {formatCurrency(m.pendingAmount)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-slate-100 dark:bg-[#262E3D] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 dark:bg-orange-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${m.percentagePaid}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    {m.percentagePaid}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
