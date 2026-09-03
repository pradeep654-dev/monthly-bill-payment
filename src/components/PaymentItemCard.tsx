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
  const { togglePaid, paymentMethods, currentMonthKey, isLiquidGlass, categoryBudgetSummaries } = usePayments();
  const categoryMeta = getCategoryMeta(payment.category);
  const IconComponent = categoryMeta.icon;

  const linkedAccount = paymentMethods.find(m => m.id === payment.paymentMethodId);
  const urgency = getUrgencyStatus(payment.dueDay, currentMonthKey, payment.isPaid);
  const categoryBudget = categoryBudgetSummaries.find(s => s.category === payment.category);
  const isCategoryOverBudget = categoryBudget?.status === 'exceeded';


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
      <div className="flex items-start space-x-3.5 min-w-0 pr-2 flex-1">
        {/* Category Icon */}
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors mt-0.5 ${categoryMeta.colorClasses}`}
        >
          <IconComponent className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Text Details Stack */}
        <div className="min-w-0 space-y-1 flex-1">
          {/* Row 1: Full Commitment Name */}
          <h4
            className={`font-black text-base tracking-tight leading-snug break-words ${
              payment.isPaid
                ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {payment.name}
          </h4>

          {/* Row 2: Below Full Name - Due Date, Category, Urgency & Payment Details */}
          <div className="flex items-center space-x-2 gap-y-1.5 flex-wrap text-xs pt-0.5">
            {/* Due Date Indicator */}
            <span className="inline-flex items-center space-x-1 text-[11px] font-black text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-orange-400 shrink-0 stroke-[2.5]" />
              <span>{formatDueDay(payment.dueDay)}</span>
            </span>

            {/* Category Badge */}
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${categoryMeta.colorClasses}`}>
              {categoryMeta.label}
            </span>

            {/* Recurrence & Type Badge */}
            {payment.commitmentType === 'savings' || categoryMeta.group === 'savings' ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/60">
                🏦 Savings • Auto Every Month
              </span>
            ) : payment.isRecurring ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                🔁 Every Month
              </span>
            ) : (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                📌 Current Month Only
              </span>
            )}

            {/* Autopay Badge */}
            {payment.isAutopayEnabled && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center space-x-1">
                <span>⚡ Autopay @ 11:55 PM</span>
              </span>
            )}

            {/* Over Budget Category Warning Badge */}
            {isCategoryOverBudget && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                ⚠️ Budget Cap Exceeded
              </span>
            )}

            {/* Urgency Badge */}
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full shrink-0 font-black ${urgency.colorClass}`}>
              {urgency.label}
            </span>


            {/* Linked Account Badge */}
            {linkedAccount && (
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shrink-0 ${
                isLiquidGlass
                  ? 'bg-slate-900/10 dark:bg-white/15 text-slate-800 dark:text-slate-100 border-slate-300/50 dark:border-white/20 shadow-2xs backdrop-blur-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
              }`}>
                {linkedAccount.name}
              </span>
            )}

            {/* Notes */}
            {payment.notes && (
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[160px]">
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
