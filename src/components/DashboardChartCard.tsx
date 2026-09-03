import React from 'react';
import { PieChart } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';
import { getCategoryMeta } from '../utils/categories';
import type { CategoryType } from '../types';

export const DashboardChartCard: React.FC = () => {
  const { summary, currentMonthPayments } = usePayments();

  const totalAllocated = summary.totalSavings + summary.totalExpense;
  const savingsPct = totalAllocated > 0 ? Math.round((summary.totalSavings / totalAllocated) * 100) : 0;
  const expensePct = totalAllocated > 0 ? Math.round((summary.totalExpense / totalAllocated) * 100) : 0;

  // Calculate top category spending
  const categoryTotals = currentMonthPayments.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.amount;
    return acc;
  }, {} as Record<CategoryType, number>);

  const sortedCategories = (Object.keys(categoryTotals) as CategoryType[])
    .map(cat => ({
      category: cat,
      amount: categoryTotals[cat],
      meta: getCategoryMeta(cat)
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4); // Top 4 categories

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Chart Card Container */}
      <div className="app-card p-5 space-y-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm">
              <PieChart className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Analytics & Ratios
              </span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Cashflow Allocation
              </h3>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-500/20">
            {savingsPct}% SAVINGS RATIO
          </span>
        </div>

        {/* Visual Allocation Bar Chart */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="font-extrabold text-slate-700 dark:text-slate-300">Savings ({savingsPct}%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              <span className="font-extrabold text-slate-700 dark:text-slate-300">Expenses ({expensePct}%)</span>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-4 rounded-2xl overflow-hidden p-0.5 flex space-x-1 border border-slate-200/60 dark:border-slate-700/60">
            {savingsPct > 0 && (
              <div
                className="h-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 shadow-xs"
                style={{ width: `${savingsPct}%` }}
                title={`Savings: ${formatCurrency(summary.totalSavings)}`}
              />
            )}
            {expensePct > 0 && (
              <div
                className="h-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 shadow-xs"
                style={{ width: `${expensePct}%` }}
                title={`Expenses: ${formatCurrency(summary.totalExpense)}`}
              />
            )}
          </div>
        </div>

        {/* Category Distribution Progress Bars */}
        {sortedCategories.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Top Monthly Spend Categories
            </h4>

            <div className="space-y-2.5">
              {sortedCategories.map(({ category, amount, meta }) => {
                const IconComponent = meta.icon;
                const categoryPct = summary.totalAmount > 0 ? Math.round((amount / summary.totalAmount) * 100) : 0;

                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-lg text-slate-800 dark:text-slate-200 ${meta.colorClasses}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-800 dark:text-slate-200 font-extrabold">{meta.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold">{categoryPct}%</span>
                        <span className="text-slate-900 dark:text-white font-black">{formatCurrency(amount)}</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-800 dark:bg-slate-300 rounded-full transition-all duration-300"
                        style={{ width: `${categoryPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
