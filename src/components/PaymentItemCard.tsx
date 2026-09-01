import React from 'react';
import { Check, ArrowUpRight, Smartphone, Calendar } from 'lucide-react';
import type { PaymentItem } from '../types';
import { usePayments } from '../context/PaymentContext';
import { getCategoryMeta } from '../utils/categories';
import { formatCurrency, getUrgencyStatus, generateUpiUrl, generateGenericUpiUrl, formatDueDay } from '../utils/formatters';

interface PaymentItemCardProps {
  payment: PaymentItem;
  onEdit: (payment: PaymentItem) => void;
  onDelete: (id: string) => void;
}

export const PaymentItemCard: React.FC<PaymentItemCardProps> = ({
  payment,
  onEdit
}) => {
  const { togglePaid, paymentMethods, currentMonthKey, isLiquidGlass } = usePayments();
  const categoryMeta = getCategoryMeta(payment.category);
  const IconComponent = categoryMeta.icon;

  const linkedAccount = paymentMethods.find(m => m.id === payment.paymentMethodId);
  const urgency = getUrgencyStatus(payment.dueDay, currentMonthKey, payment.isPaid);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePaid(payment.id);
  };

  const handlePaytmPayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const paytmUrl = generateUpiUrl(payment.name, payment.amount, payment.upiId);
    const genericUpiUrl = generateGenericUpiUrl(payment.name, payment.amount, payment.upiId);
    
    const start = Date.now();
    window.location.href = paytmUrl;

    // Graceful fallback to generic UPI handler if Paytm deep link is not handled
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.location.href = genericUpiUrl;
      }
    }, 1200);
  };

  return (
    <div
      onClick={() => onEdit(payment)}
      className={`group relative app-card rounded-[22px] p-4 flex items-center justify-between transition-all duration-200 cursor-pointer active:scale-[0.98] ${
        urgency.status === 'overdue'
          ? '!border-rose-400/60 !bg-rose-500/15 dark:!bg-rose-950/40'
          : ''
      } ${payment.isPaid ? 'opacity-85' : ''}`}
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
        <div className="min-w-0 space-y-1.5">
          {/* Row 1: Commitment Name & Urgency Tag */}
          <div className="flex items-center space-x-2">
            <h4
              className={`font-black text-base tracking-tight truncate ${
                payment.isPaid
                  ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {payment.name}
            </h4>

            {/* Urgency Badge */}
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full shrink-0 font-black ${urgency.colorClass}`}>
              {urgency.label}
            </span>
          </div>

          {/* Row 2: Ample Spacing Between Due Date, Payment Mode (Account) & Notes */}
          <div className="flex items-center space-x-3 gap-y-1 flex-wrap text-xs pt-0.5">
            {/* Due Date Indicator */}
            <span className="inline-flex items-center space-x-1 text-[11px] font-black text-slate-800 dark:text-slate-100 pr-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-orange-400 shrink-0 stroke-[2.5]" />
              <span>{formatDueDay(payment.dueDay)}</span>
            </span>

            {/* Linked Account (Payment Mode) Badge */}
            {linkedAccount && (
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                isLiquidGlass
                  ? 'bg-white/80 text-slate-950 dark:bg-white dark:text-slate-950 border-white font-black shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
              }`}>
                {linkedAccount.name}
              </span>
            )}

            {/* Notes */}
            {payment.notes && (
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
                • {payment.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Amount, Paytm Pay & Checkbox */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="text-right">
          <span
            className={`font-black text-base tracking-tight block ${
              payment.isPaid
                ? 'text-slate-500 dark:text-slate-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {formatCurrency(payment.amount)}
          </span>

          {/* Paytm UPI Direct Pay Button */}
          {!payment.isPaid && (
            <button
              type="button"
              onClick={handlePaytmPayClick}
              className="mt-0.5 inline-flex items-center space-x-1 text-[10px] font-black text-sky-600 dark:text-sky-400 hover:underline active:scale-95 transition-all"
              title="Pay directly via Paytm UPI App"
            >
              <Smartphone className="w-3 h-3 stroke-[2.5]" />
              <span>Paytm UPI</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Paid Checkbox Button */}
        <button
          type="button"
          onClick={handleCheckboxClick}
          aria-label={`Mark ${payment.name} as ${payment.isPaid ? 'unpaid' : 'paid'}`}
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none ${
            payment.isPaid
              ? isLiquidGlass
                ? 'bg-white text-slate-950 border border-white animate-check scale-105 shadow-md font-black'
                : 'bg-emerald-500 dark:bg-orange-500 text-white shadow-md shadow-emerald-500/20 dark:shadow-orange-500/20 animate-check'
              : 'bg-slate-100 dark:bg-[#0D1322] border-2 border-slate-300 dark:border-slate-650 hover:border-emerald-500 dark:hover:border-orange-500'
          }`}
        >
          {payment.isPaid && <Check className="w-4 h-4 stroke-[3.5]" />}
        </button>
      </div>
    </div>
  );
};
