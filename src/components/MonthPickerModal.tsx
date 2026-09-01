import React from 'react';
import { X, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { INITIAL_MONTH } from '../data/initialData';

interface MonthPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({ isOpen, onClose }) => {
  const { currentMonthKey, setCurrentMonthKey, allMonthSummaries } = usePayments();

  if (!isOpen) return null;

  const [currentYearStr, currentMonthStr] = currentMonthKey.split('-');
  const selectedYear = parseInt(currentYearStr, 10);
  const selectedMonth = parseInt(currentMonthStr, 10);

  const months = [
    { num: 1, name: 'Jan' },
    { num: 2, name: 'Feb' },
    { num: 3, name: 'Mar' },
    { num: 4, name: 'Apr' },
    { num: 5, name: 'May' },
    { num: 6, name: 'Jun' },
    { num: 7, name: 'Jul' },
    { num: 8, name: 'Aug' },
    { num: 9, name: 'Sep' },
    { num: 10, name: 'Oct' },
    { num: 11, name: 'Nov' },
    { num: 12, name: 'Dec' },
  ];

  const years = [2025, 2026, 2027];

  const handleSelect = (year: number, monthNum: number) => {
    const formattedMonth = monthNum.toString().padStart(2, '0');
    setCurrentMonthKey(`${year}-${formattedMonth}`);
    onClose();
  };

  const handleJumpToInitial = () => {
    setCurrentMonthKey(INITIAL_MONTH);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-orange-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Select Month</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Year Selector */}
        <div className="mt-4 flex space-x-2 justify-center bg-slate-100 dark:bg-[#0D1117] p-1.5 rounded-2xl">
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => handleSelect(yr, selectedMonth)}
              className={`flex-1 py-1.5 rounded-xl font-semibold text-sm transition-all ${
                selectedYear === yr
                  ? 'bg-white dark:bg-[#1E2430] text-emerald-600 dark:text-orange-500 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Month Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {months.map(m => {
            const isSelected = selectedYear === selectedYear && selectedMonth === m.num;
            const mKey = `${selectedYear}-${m.num.toString().padStart(2, '0')}`;
            const hasData = allMonthSummaries.some(s => s.monthKey === mKey);

            return (
              <button
                key={m.num}
                onClick={() => handleSelect(selectedYear, m.num)}
                className={`py-3 px-2 rounded-2xl font-semibold text-sm transition-all flex flex-col items-center justify-center relative ${
                  isSelected
                    ? 'bg-emerald-500 dark:bg-orange-500 text-white shadow-lg shadow-emerald-500/20 dark:shadow-orange-500/20'
                    : 'bg-slate-50 dark:bg-[#1E2430] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{m.name}</span>
                {hasData && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected ? 'bg-white' : 'bg-emerald-500 dark:bg-orange-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Reset to September 2026 */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleJumpToInitial}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Go to September 2026</span>
          </button>
        </div>
      </div>
    </div>
  );
};
