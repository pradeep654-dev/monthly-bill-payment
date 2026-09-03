import React, { useState, useEffect } from 'react';
import { X, Target, Save, RotateCcw } from 'lucide-react';

import { usePayments } from '../context/PaymentContext';
import { CATEGORY_MAP, getCategoryMeta, strokeWidth } from '../utils/categories';
import type { CategoryType, CategoryBudgets } from '../types';
import { DEFAULT_CATEGORY_BUDGETS } from '../data/initialData';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const { categoryBudgets, updateAllCategoryBudgets, isLiquidGlass } = usePayments();
  const [formBudgets, setFormBudgets] = useState<CategoryBudgets>({ ...categoryBudgets });

  useEffect(() => {
    if (isOpen) {
      setFormBudgets({ ...categoryBudgets });
    }
  }, [isOpen, categoryBudgets]);

  if (!isOpen) return null;

  const handleInputChange = (category: CategoryType, value: string) => {
    const num = parseFloat(value) || 0;
    setFormBudgets(prev => ({
      ...prev,
      [category]: Math.max(0, num)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAllCategoryBudgets(formBudgets);
    onClose();
  };

  const handleResetDefaults = () => {
    setFormBudgets({ ...DEFAULT_CATEGORY_BUDGETS });
  };

  const categoriesList = Object.keys(CATEGORY_MAP) as CategoryType[];

  const totalFormBudget = Object.values(formBudgets).reduce((acc, v) => acc + (v || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border ${
        isLiquidGlass
          ? 'real-liquid-card dark:bg-black/90 text-slate-900 dark:text-white border-white/40 dark:border-white/20'
          : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
      }`}>
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Category Budget Caps</h2>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Set monthly spending limits for each category
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable inputs */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
          {/* Total Budget Summary Header Bar */}
          <div className="px-5 py-3 bg-slate-50 dark:bg-[#0D1322] border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-600 dark:text-slate-300">
              Total Budget Limit:
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              ₹{totalFormBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex-1 p-5 space-y-3.5 overflow-y-auto overscroll-contain">
            {categoriesList.map(cat => {
              const meta = getCategoryMeta(cat);
              const Icon = meta.icon;
              const currentVal = formBudgets[cat] ?? 0;

              return (
                <div key={cat} className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/40 border border-slate-200/50 dark:border-slate-800/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-xl flex-shrink-0 ${meta.colorClasses}`}>
                      <Icon className="w-4 h-4" style={{ strokeWidth }} />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-black block truncate text-slate-800 dark:text-slate-200">
                        {meta.label}
                      </span>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
                        {meta.group}
                      </span>
                    </div>
                  </div>

                  {/* Budget Limit Input */}
                  <div className="relative flex-shrink-0 w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={currentVal || ''}
                      onChange={e => handleInputChange(cat, e.target.value)}
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-1.5 rounded-xl text-xs font-black text-right bg-white dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Footer Controls */}
          <div className="px-5 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#0D1322]/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transition-all ${
                  isLiquidGlass
                    ? 'real-liquid-button dark:text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 dark:bg-orange-500 dark:hover:bg-orange-400 text-white'
                }`}
              >
                <Save className="w-4 h-4" />
                Save Caps
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
