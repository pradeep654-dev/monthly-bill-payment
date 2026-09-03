import React, { useState } from 'react';
import { Target, AlertTriangle, AlertCircle, Edit3, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { getCategoryMeta, strokeWidth } from '../utils/categories';
import { formatCurrency } from '../utils/formatters';

interface CategoryBudgetCardProps {
  onOpenBudgetModal: () => void;
}

export const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({ onOpenBudgetModal }) => {
  const { 
    categoryBudgetSummaries, 
    totalBudget, 
    summary, 
    exceededCategoriesCount, 
    isLiquidGlass 
  } = usePayments();

  const [isExpanded, setIsExpanded] = useState(true);

  // Total spent across all current month payments
  const totalSpent = summary.totalAmount;
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Filter out categories with 0 spent AND 0 budget to keep card clean
  const activeSummaries = categoryBudgetSummaries.filter(s => s.spentAmount > 0 || s.budgetAmount > 0);

  return (
    <div className="app-card p-5 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${
            exceededCategoriesCount > 0 
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400' 
              : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400'
          }`}>
            <Target className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-300 block">
              Budget Health
            </span>
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              Category Limits
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenBudgetModal}
            className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all ${
              isLiquidGlass
                ? 'real-liquid-button-secondary dark:text-white'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manage</span>
          </button>

          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Toggle budget breakdown"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Top Banner Alert (If Exceeded or Warning) */}
      {exceededCategoriesCount > 0 ? (
        <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-700 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <div className="text-xs font-black tracking-tight leading-tight">
            <span>Budget Exceeded in {exceededCategoriesCount} {exceededCategoriesCount === 1 ? 'category' : 'categories'}!</span>
            <p className="text-[10px] font-semibold text-rose-600/80 dark:text-rose-300/80 mt-0.5">
              Review your category caps or adjust upcoming bill allocations.
            </p>
          </div>
        </div>
      ) : activeSummaries.some(s => s.status === 'warning') ? (
        <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500" />
          <div className="text-xs font-black tracking-tight leading-tight">
            <span>Close to Spending Limit!</span>
            <p className="text-[10px] font-semibold text-amber-700/80 dark:text-amber-300/80 mt-0.5">
              One or more categories have passed 80% of their monthly budget.
            </p>
          </div>
        </div>
      ) : null}

      {/* Overall Budget Progress Metric */}
      <div className={`p-3.5 rounded-2xl mb-4 ${
        isLiquidGlass
          ? 'bg-white/40 dark:bg-white/10 border border-white/70 dark:border-white/20 backdrop-blur-md'
          : 'bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
              Total Budgeted
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {formatCurrency(totalSpent)} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/ {formatCurrency(totalBudget)}</span>
            </span>
          </div>

          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
            overallPercentage > 100 
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300' 
              : overallPercentage >= 80 
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
          }`}>
            {overallPercentage}% Used
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
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

      {/* Category List Breakdown */}
      {isExpanded && (
        <div className="space-y-3 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
          {activeSummaries.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-2">
              No category limits configured yet. Click "Manage" to set caps!
            </p>
          ) : (
            activeSummaries.map(item => {
              const meta = getCategoryMeta(item.category);
              const Icon = meta.icon;

              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    {/* Category Icon & Name */}
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${meta.colorClasses}`}>
                        <Icon className="w-3.5 h-3.5" style={{ strokeWidth }} />
                      </div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">
                        {meta.label}
                      </span>
                    </div>

                    {/* Amount & Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-slate-100">
                        {formatCurrency(item.spentAmount)}
                        <span className="text-[10px] font-normal text-slate-400 ml-1">
                          / {formatCurrency(item.budgetAmount)}
                        </span>
                      </span>

                      {item.status === 'exceeded' ? (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700/60 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> Over!
                        </span>
                      ) : item.status === 'warning' ? (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> 80%+
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> OK
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Individual Category Progress Bar */}
                  <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.status === 'exceeded'
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
            })
          )}
        </div>
      )}
    </div>
  );
};
