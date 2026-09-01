import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';

const STORAGE_KEY_SALARY = 'paytracker_salary_v1';

export const CommitmentLoadCard: React.FC = () => {
  const { summary } = usePayments();
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
    <div className="bg-white dark:bg-[#161B26] border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 tracking-tight">
              Commitment Load Ratio
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {commitmentRatio}% of your income is locked in fixed bills
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setInputVal(salary.toString());
            setIsEditing(!isEditing);
          }}
          className="text-xs font-bold text-emerald-600 dark:text-orange-400 hover:underline"
        >
          {isEditing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Salary Edit Input */}
      {isEditing && (
        <form onSubmit={handleSave} className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex space-x-2">
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Monthly Income (₹)"
            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-emerald-500 dark:bg-orange-500 text-white font-bold text-xs"
          >
            Save
          </button>
        </form>
      )}

      {/* Load Meter */}
      <div className="mt-3">
        <div className="flex justify-between items-center text-[11px] font-semibold mb-1">
          <span className="text-slate-600 dark:text-slate-400">
            Committed: {formatCurrency(summary.totalAmount)}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            Free Cashflow: {formatCurrency(remainingCashflow)}
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-[#262E3D] h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              commitmentRatio > 70
                ? 'bg-rose-500'
                : commitmentRatio > 50
                ? 'bg-amber-500'
                : 'bg-emerald-500 dark:bg-orange-500'
            }`}
            style={{ width: `${Math.min(100, commitmentRatio)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
