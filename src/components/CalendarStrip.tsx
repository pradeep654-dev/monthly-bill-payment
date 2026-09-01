import React from 'react';
import { usePayments } from '../context/PaymentContext';
import { getUrgencyStatus } from '../utils/formatters';

interface CalendarStripProps {
  selectedDayFilter: number | null;
  onSelectDay: (day: number | null) => void;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  selectedDayFilter,
  onSelectDay
}) => {
  const { currentMonthPayments, currentMonthKey } = usePayments();

  // Get total days in current selected month
  const [yearStr, monthStr] = currentMonthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="mt-4 bg-white dark:bg-[#161B26] border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 tracking-tight">
          Monthly Commitment Calendar
        </h4>
        {selectedDayFilter !== null && (
          <button
            onClick={() => onSelectDay(null)}
            className="text-[11px] font-bold text-emerald-600 dark:text-orange-400 hover:underline"
          >
            Show All Days
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Days Strip */}
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {daysArray.map(day => {
          const billsOnDay = currentMonthPayments.filter(p => p.dueDay === day);
          const hasBills = billsOnDay.length > 0;
          const isSelected = selectedDayFilter === day;

          let dotColor = 'bg-transparent';
          if (hasBills) {
            const hasOverdue = billsOnDay.some(
              p => getUrgencyStatus(p.dueDay, currentMonthKey, p.isPaid).status === 'overdue'
            );
            const hasUnpaid = billsOnDay.some(p => !p.isPaid);

            if (hasOverdue) {
              dotColor = 'bg-rose-500 animate-pulse';
            } else if (hasUnpaid) {
              dotColor = 'bg-amber-500';
            } else {
              dotColor = 'bg-emerald-500';
            }
          }

          return (
            <button
              key={day}
              onClick={() => onSelectDay(isSelected ? null : day)}
              className={`flex-1 min-w-[38px] h-13 rounded-2xl flex flex-col items-center justify-between p-2.5 transition-all duration-200 shrink-0 relative ${
                isSelected
                  ? 'bg-emerald-500 dark:bg-orange-500 text-white shadow-md shadow-emerald-500/20 dark:shadow-orange-500/20 font-bold scale-105'
                  : hasBills
                  ? 'bg-slate-100 dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 font-bold hover:bg-slate-200 dark:hover:bg-slate-800'
                  : 'bg-slate-50 dark:bg-[#0D1117]/50 text-slate-400 dark:text-slate-600 font-medium opacity-60'
              }`}
            >
              <span className="text-[11px] leading-none">{day}</span>
              {hasBills && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-white' : dotColor
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
