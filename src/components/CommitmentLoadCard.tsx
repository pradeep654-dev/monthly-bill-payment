import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';

const STORAGE_KEY_SALARY = 'paytracker_salary_v1';

export const CommitmentLoadCard: React.FC = () => {
  const { summary, isLiquidGlass } = usePayments();
  const [salary, setSalary] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SALARY);
    return saved ? parseFloat(saved) : 80000;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState(salary.toString());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SALARY, salary.toString());
  }, [salary]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(inputVal);
    if (!isNaN(num) && num > 0) {
      setSalary(num);
    }
    setIsEditing(false);
  };

  const commitmentRatio = salary > 0 ? Math.round((summary.totalAmount / salary) * 100) : 0;
  const remainingCashflow = Math.max(0, salary - summary.totalAmount);

  return (
    <div className="app-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-2xl ${
            isLiquidGlass
              ? 'real-liquid-pill text-slate-900 dark:text-white dark:border-white/30'
              : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40'
          }`}>
            <Briefcase className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="font-black text-xs text-slate-900 dark:text-white tracking-tight">
              Commitment Load Ratio
            </h4>
            <p className="text-[11px] font-extrabold text-slate-600 dark:text-slate-200">
              {commitmentRatio}% of your income is locked in fixed bills
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setInputVal(salary.toString());
            setIsEditing(!isEditing);
          }}
          className="text-xs font-black text-emerald-600 dark:text-orange-400 hover:underline p-1 active:scale-95 transition-all"
        >
          {isEditing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Salary Edit Input */}
      {isEditing && (
        <form onSubmit={handleSave} className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex space-x-2">
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Monthly Income (₹)"
            className="flex-1 px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-2xl bg-emerald-500 dark:bg-orange-500 text-white font-black text-xs shadow-md active:scale-95"
          >
            Save
          </button>
        </form>
      )}

      {/* Load Meter */}
      <div className="mt-3">
        <div className="flex justify-between items-center text-[11px] font-extrabold mb-1.5">
          <span className="text-slate-700 dark:text-slate-300">
            Committed: <strong className="text-slate-900 dark:text-white font-black">{formatCurrency(summary.totalAmount)}</strong>
          </span>
          <span className="text-emerald-600 dark:text-emerald-300 font-black">
            Free Cashflow: {formatCurrency(remainingCashflow)}
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              commitmentRatio > 70
                ? 'bg-gradient-to-r from-rose-500 to-red-400'
                : commitmentRatio > 50
                ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-orange-500 dark:to-amber-400'
            }`}
            style={{ width: `${Math.min(100, commitmentRatio)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
