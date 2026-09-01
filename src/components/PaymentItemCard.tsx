import React from 'react';
import { Check, ArrowUpRight, Smartphone, Calendar } from 'lucide-react';
import type { PaymentItem } from '../types';
import { usePayments } from '../context/PaymentContext';
import { getCategoryMeta } from '../utils/categories';
import { formatCurrency, getUrgencyStatus, generateUpiUrl, formatDueDay } from '../utils/formatters';

interface PaymentItemCardProps {
  payment: PaymentItem;
  onEdit: (payment: PaymentItem) => void;
  onDelete: (id: string) => void;
}

export const PaymentItemCard: React.FC<PaymentItemCardProps> = ({
  payment,
  onEdit
}) => {
  const { togglePaid, paymentMethods, currentMonthKey } = usePayments();
  const categoryMeta = getCategoryMeta(payment.category);
  const IconComponent = categoryMeta.icon;

  const linkedAccount = paymentMethods.find(m => m.id === payment.paymentMethodId);
  const urgency = getUrgencyStatus(payment.dueDay, currentMonthKey, payment.isPaid);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePaid(payment.id);
  };

  const handleUpiPayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const upiUrl = generateUpiUrl(payment.name, payment.amount, payment.upiId);
    window.location.href = upiUrl;
  };

  return (
    <div
      onClick={() => onEdit(payment)}
      className={`group relative bg-white dark:bg-[#161B26] border rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer ${
        urgency.status === 'overdue'
          ? 'border-rose-300 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10'
          : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
      } ${payment.isPaid ? 'opacity-90 dark:opacity-85' : ''}`}
    >
      {/* Left Icon & Details */}
      <div className="flex items-center space-x-3.5 min-w-0 pr-2">
        {/* Category Icon */}
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${categoryMeta.colorClasses}`}
        >
          <IconComponent className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Text Details Stack */}
        <div className="min-w-0 space-y-1">
          {/* Row 1: Commitment Name & Urgency Tag */}
          <div className="flex items-center space-x-2">
            <h4
              className={`font-bold text-base tracking-tight truncate ${
                payment.isPaid
                  ? 'text-slate-700 dark:text-slate-300 line-through decoration-slate-300 dark:decoration-slate-600'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {payment.name}
            </h4>

            {/* Urgency Badge */}
            <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${urgency.colorClass}`}>
              {urgency.label}
            </span>
          </div>

          {/* Row 2: Date + Account + Notes in Single Sub-Row Below Commitment Title */}
          <div className="flex items-center space-x-2 flex-wrap text-xs">
            {/* Due Date Indicator */}
            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
              <Calendar className="w-3 h-3 text-emerald-600 dark:text-orange-400 shrink-0" />
              <span>{formatDueDay(payment.dueDay)}</span>
            </span>

            {/* Linked Account Badge */}
            {linkedAccount && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {linkedAccount.name}
              </span>
            )}

            {/* Notes */}
            {payment.notes && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[110px]">
                • {payment.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Amount, UPI Pay & Checkbox */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="text-right">
          <span
            className={`font-bold text-base tracking-tight block ${
              payment.isPaid
                ? 'text-slate-500 dark:text-slate-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {formatCurrency(payment.amount)}
          </span>

          {/* UPI Pay Action Button if Unpaid */}
          {!payment.isPaid && (
            <button
              type="button"
              onClick={handleUpiPayClick}
              className="mt-0.5 inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-600 dark:text-orange-400 hover:underline"
              title="Pay via UPI App (GPay / PhonePe / Paytm)"
            >
              <Smartphone className="w-3 h-3" />
              <span>Pay UPI</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>

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
