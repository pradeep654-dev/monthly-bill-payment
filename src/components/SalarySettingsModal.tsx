import React, { useState, useEffect } from 'react';
import { X, Sliders, TrendingUp, ArrowRightLeft, Check, RefreshCcw } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';

interface SalarySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalarySettingsModal: React.FC<SalarySettingsModalProps> = ({ isOpen, onClose }) => {
  const { summary, salarySplitPercent, updateSalarySettings, runSalaryCreditAndSplit } = usePayments();
  const [incomeInput, setIncomeInput] = useState<string>(summary.monthlyIncome?.toString() || '80000');
  const [splitRatio, setSplitRatio] = useState<number>(salarySplitPercent || 50);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIncomeInput(summary.monthlyIncome?.toString() || '80000');
      setSplitRatio(salarySplitPercent || 50);
      setIsSaved(false);
    }
  }, [isOpen, summary.monthlyIncome, salarySplitPercent]);

  if (!isOpen) return null;

  const currentIncome = parseFloat(incomeInput) || 80000;
  const hdfcShare = Math.round((currentIncome * splitRatio) / 100);
  const sbiShare = currentIncome - hdfcShare;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalarySettings(currentIncome, splitRatio);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleRunCreditNow = () => {
    updateSalarySettings(currentIncome, splitRatio);
    runSalaryCreditAndSplit(currentIncome, splitRatio);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#0D1117] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4 p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md">
              <Sliders className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Salary Credit & Auto-Split ⚙️
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Configure SBI Salary & 50/50 HDFC Auto-Split
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Salary Hike Amount Input */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 inline mr-1" />
                Monthly Salary Amount (Salary Hike)
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black">
                AUTO-CREDITS TO SBI @ 1ST 11:55 PM
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₹</span>
              <input
                type="number"
                value={incomeInput}
                onChange={e => setIncomeInput(e.target.value)}
                placeholder="80000"
                className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black text-base focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* Auto-Split Ratio Controls */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-extrabold gap-1.5 whitespace-nowrap overflow-hidden">
              <span className="text-slate-800 dark:text-slate-200 flex items-center space-x-1 shrink-0">
                <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500 inline mr-1" />
                <span>Bank Auto-Split Ratio</span>
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-black shrink-0 whitespace-nowrap">
                {100 - splitRatio}% SBI / {splitRatio}% HDFC
              </span>
            </div>

            {/* Quick Ratio Preset Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[50, 40, 30, 0].map(ratio => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setSplitRatio(ratio)}
                  className={`py-2 rounded-xl text-xs font-black border transition-all ${
                    splitRatio === ratio
                      ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-black text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {100 - ratio}/{ratio}
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={splitRatio}
              onChange={e => setSplitRatio(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Auto-Split Live Preview Cards */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200/80 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-[10px] font-black uppercase text-cyan-700 dark:text-cyan-300 block">
                SBI Bank ({100 - splitRatio}%)
              </span>
              <span className="text-base font-black text-cyan-600 dark:text-cyan-400">
                {formatCurrency(sbiShare)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-300 block">
                HDFC Bank ({splitRatio}%)
              </span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400">
                {formatCurrency(hdfcShare)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm shadow-md shadow-blue-500/20 hover:opacity-95 transition-opacity flex items-center justify-center space-x-2"
            >
              {isSaved ? <Check className="w-4 h-4" /> : null}
              <span>{isSaved ? 'Settings Saved!' : 'Save Salary & Split Settings'}</span>
            </button>

            <button
              type="button"
              onClick={handleRunCreditNow}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center space-x-1.5"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Credit Salary & Split 50/50 Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
