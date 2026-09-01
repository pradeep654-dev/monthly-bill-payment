import React from 'react';
import { Check } from 'lucide-react';
import type { PaymentItem } from '../types';
import { usePayments } from '../context/PaymentContext';
import { getCategoryMeta } from '../utils/categories';
import { formatCurrency, formatDueDay } from '../utils/formatters';

interface PaymentItemCardProps {
  payment: PaymentItem;
  onEdit: (payment: PaymentItem) => void;
  onDelete: (id: string) => void;
}

export const PaymentItemCard: React.FC<PaymentItemCardProps> = ({
  payment,
  onEdit
}) => {
  const { togglePaid } = usePayments();
  const categoryMeta = getCategoryMeta(payment.category);
  const IconComponent = categoryMeta.icon;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePaid(payment.id);
  };

  return (
    <div
      onClick={() => onEdit(payment)}
      className={`group relative bg-white dark:bg-[#161B26] border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-md dark:hover:border-slate-700 transition-all duration-200 cursor-pointer ${
        payment.isPaid ? 'opacity-90 dark:opacity-85' : ''
      }`}
    >
      {/* Left Icon & Details */}
      <div className="flex items-center space-x-3.5 min-w-0 pr-2">
        {/* Category Icon */}
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${categoryMeta.colorClasses}`}
        >
          <IconComponent className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Text details */}
        <div className="min-w-0">
          <h4
            className={`font-bold text-base tracking-tight truncate ${
              payment.isPaid
                ? 'text-slate-700 dark:text-slate-300 line-through decoration-slate-300 dark:decoration-slate-600'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {payment.name}
          </h4>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {formatDueDay(payment.dueDay)}
          </p>
        </div>
      </div>

      {/* Right Amount & Checkbox */}
      <div className="flex items-center space-x-3.5 shrink-0">
        <span
          className={`font-bold text-base tracking-tight ${
            payment.isPaid
              ? 'text-slate-500 dark:text-slate-400'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {formatCurrency(payment.amount)}
        </span>

        {/* Paid Checkbox Button */}
        <button
          type="button"
          onClick={handleCheckboxClick}
          aria-label={`Mark ${payment.name} as ${payment.isPaid ? 'unpaid' : 'paid'}`}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:focus:ring-orange-500/40 ${
            payment.isPaid
              ? 'bg-emerald-500 dark:bg-orange-500 text-white shadow-sm shadow-emerald-500/20 dark:shadow-orange-500/20 animate-check'
              : 'bg-slate-50 dark:bg-[#1E2430] border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-orange-500'
          }`}
        >
          {payment.isPaid && <Check className="w-4 h-4 stroke-[3.5]" />}
        </button>
      </div>
    </div>
  );
};
