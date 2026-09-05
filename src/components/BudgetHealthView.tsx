import React from 'react';
import { Target, AlertCircle, AlertTriangle, CheckCircle2, Edit3, ShieldAlert } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { getCategoryMeta, strokeWidth } from '../utils/categories';
import { formatCurrency } from '../utils/formatters';

interface BudgetHealthViewProps {
  onOpenBudgetModal: () => void;
}

export const BudgetHealthView: React.FC<BudgetHealthViewProps> = ({ onOpenBudgetModal }) => {
  const { 
    categoryBudgetSummaries, 
    totalBudget, 
    summary, 
    exceededCategoriesCount, 
    isLiquidGlass 
  } = usePayments();


  const totalSpent = summary.totalAmount;
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const warningCategoriesCount = categoryBudgetSummaries.filter(s => s.status === 'warning').length;

  return (
    <div className="space-y-4 animate-fadeIn pb-6">
      {/* Top Banner Header */}
      <div className="app-card p-5 overflow-hidden relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${
              exceededCategoriesCount > 0
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                : warningCategoriesCount > 0
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'
                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
            }`}>
              <Target className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Financial Health
              </span>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Monthly Budget Health
              </h2>
            </div>
          </div>

          <button
            onClick={onOpenBudgetModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
              isLiquidGlass
                ? 'real-liquid-button dark:text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 dark:bg-orange-500 dark:hover:bg-orange-400 text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Caps</span>
          </button>
        </div>

        {/* Status Badge Alert */}
        {exceededCategoriesCount > 0 ? (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-700 dark:text-rose-300 mb-4">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <div className="text-xs font-black leading-snug">
              <span>Attention Needed: Budget Exceeded</span>
              <p className="text-[10px] font-semibold text-rose-600/80 dark:text-rose-300/80 mt-0.5">
                {exceededCategoriesCount} {exceededCategoriesCount === 1 ? 'category has' : 'categories have'} gone over set spending limits.
              </p>
            </div>
          </div>
        ) : warningCategoriesCount > 0 ? (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-800 dark:text-amber-300 mb-4">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500" />
            <div className="text-xs font-black leading-snug">
              <span>Warning: Approaching Budget Limit</span>
              <p className="text-[10px] font-semibold text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                {warningCategoriesCount} {warningCategoriesCount === 1 ? 'category is' : 'categories are'} above 80% capacity.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 mb-4">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
            <div className="text-xs font-black leading-snug">
              <span>Budget Status Healthy</span>
              <p className="text-[10px] font-semibold text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
                All category commitments are strictly within set spending limits.
              </p>
            </div>
          </div>
        )}

        {/* 3 Metrics Overview */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className={`p-3 rounded-2xl ${
            isLiquidGlass
              ? 'bg-white/40 dark:bg-white/10 border border-white/70 dark:border-white/20 backdrop-blur-md'
              : 'bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-800'
          }`}>
            <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
              Total Budget
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {formatCurrency(totalBudget)}
            </span>
          </div>

          <div className={`p-3 rounded-2xl ${
            isLiquidGlass
              ? 'bg-white/40 dark:bg-white/10 border border-white/70 dark:border-white/20 backdrop-blur-md'
              : 'bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-800'
          }`}>
            <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
              Total Spent
            </span>
            <span className={`text-sm font-black ${
              overallPercentage > 100 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
            }`}>
              {formatCurrency(totalSpent)}
            </span>
          </div>

          <div className={`p-3 rounded-2xl ${
            isLiquidGlass
              ? 'bg-emerald-500/15 dark:bg-emerald-950/40 border border-emerald-400/40 backdrop-blur-md'
              : 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60'
          }`}>
            <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 block mb-0.5">
              Remaining
            </span>
            <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
              {formatCurrency(remainingBudget)}
            </span>
          </div>
        </div>

        {/* Global Health Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">
              Budget Capacity Used
            </span>
            <span className={`font-black ${
              overallPercentage > 100 
                ? 'text-rose-600 dark:text-rose-400' 
                : overallPercentage >= 80 
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {overallPercentage}%
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPercentage > 100
                  ? 'bg-rose-500'
                  : overallPercentage >= 80
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-orange-500 dark:to-amber-500'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Breakdown Detailed List Card */}
      <div className="app-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            All Category Budget Limits
          </h3>
          <span className="text-[11px] font-bold text-slate-400">
            {categoryBudgetSummaries.length} Categories Active
          </span>
        </div>

        <div className="space-y-3.5">
          {categoryBudgetSummaries.map(item => {
            const meta = getCategoryMeta(item.category);
            const Icon = meta.icon;

            return (
              <div key={item.category} className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#0D1322] border border-slate-200/60 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  {/* Category Name & Group */}
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${meta.colorClasses}`}>
                      <Icon className="w-4 h-4" style={{ strokeWidth }} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {meta.label}
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">
                        {meta.group}
                      </span>
                    </div>
                  </div>

                  {/* Spent vs Budget & Status Badge */}
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900 dark:text-white">
                      {formatCurrency(item.spentAmount)}
                      <span className="text-[10px] font-semibold text-slate-400 ml-1">
                        / {formatCurrency(item.budgetAmount)}
                      </span>
                    </div>

                    {item.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Savings Goal Complete! 🎯 ({item.percentage}%)
                      </span>
                    ) : item.status === 'exceeded' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 dark:text-rose-400 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> Exceeded by {formatCurrency(item.overAmount)}
                      </span>
                    ) : item.status === 'warning' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 mt-0.5">
                        <AlertTriangle className="w-3 h-3" /> Near Limit ({item.percentage}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> {item.percentage}% Used
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Meter Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === 'completed'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : item.status === 'exceeded'
                        ? 'bg-rose-500'
                        : item.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500 dark:bg-orange-400'
                    }`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
