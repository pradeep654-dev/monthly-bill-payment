import React from 'react';
import { Check, Calendar, SkipForward, Sparkles, Landmark } from 'lucide-react';
import type { PaymentItem } from '../types';
import { usePayments, getEffectiveMethodId } from '../context/PaymentContext';
import { getCategoryMeta } from '../utils/categories';
import { formatCurrency, getUrgencyStatus, getUpiTargetAppInfo, formatDueDay, formatShortBankName } from '../utils/formatters';
import { trackUpiPaymentLaunch } from './UpiReturnPrompt';

interface PaymentItemCardProps {
  payment: PaymentItem;
  onEdit: (payment: PaymentItem) => void;
  onDelete: (id: string) => void;
}

export const PaymentItemCard: React.FC<PaymentItemCardProps> = ({
  payment,
  onEdit
}) => {
  const { togglePaid, toggleSkip, paymentMethods, currentMonthKey, categoryBudgetSummaries } = usePayments();
  const categoryMeta = getCategoryMeta(payment.category);
  const IconComponent = categoryMeta.icon;

  const effectiveMethodId = getEffectiveMethodId(payment, paymentMethods);
  const linkedAccount = paymentMethods.find(m => m.id === effectiveMethodId);
  const fullBankName = linkedAccount
    ? linkedAccount.name
    : (payment.commitmentType === 'savings' || categoryMeta.group === 'savings' ? 'SBI Bank' : 'HDFC Bank');
  const bankName = formatShortBankName(fullBankName);

  const urgency = getUrgencyStatus(payment.dueDay, currentMonthKey, payment.isPaid);
  const categoryBudget = categoryBudgetSummaries.find(s => s.category === payment.category);
  const isCategoryOverBudget = categoryBudget?.status === 'exceeded';
  const upiAppInfo = getUpiTargetAppInfo(payment.name, payment.amount, payment.upiId);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePaid(payment.id);
  };

  const handleUpiPayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackUpiPaymentLaunch(payment.id, payment.name, payment.amount);

    if (payment.upiId && payment.upiId.trim()) {
      try {
        navigator.clipboard?.writeText(payment.upiId.trim());
      } catch {
        // Fallback silently
      }
    }

    window.location.href = upiAppInfo.url;
  };

  return (
    <div
      onClick={() => onEdit(payment)}
      className={`group relative app-card rounded-[26px] p-4.5 flex flex-col justify-between space-y-3.5 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
        urgency.status === 'overdue'
          ? '!border-rose-400/60 !bg-rose-500/15 dark:!bg-rose-950/40'
          : ''
      } ${payment.isPaid ? 'opacity-85' : ''}`}
    >
      {/* Top Header Row: Left (Icon & Title) vs Right (Amount & Paid Status Badge) */}
      <div className="flex items-center justify-between">
        {/* Left: Icon & Commitment Name */}
        <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
          {/* Category Icon */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${categoryMeta.colorClasses}`}
          >
            <IconComponent className="w-6 h-6 stroke-[2.2]" />
          </div>

          {/* Commitment Title */}
          <h4
            className={`font-black text-xl tracking-tight leading-snug break-words ${
              payment.isPaid
                ? 'text-slate-400 dark:text-slate-400 line-through decoration-slate-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {payment.name}
          </h4>
        </div>

        {/* Top Right: Amount & Paid Status Badge + App Button Below */}
        <div className="flex flex-col items-end space-y-1.5 shrink-0">
          <div className="flex items-center space-x-2">
            <span
              className={`font-black text-xl tracking-tight ${
                payment.isPaid || payment.isSkipped
                  ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatCurrency(payment.amount)}
            </span>

            {/* Paid Status Pill Badge */}
            {payment.isSkipped ? (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                Skipped
              </span>
            ) : payment.isPaid ? (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                Paid
              </span>
            ) : (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shrink-0">
                Unpaid
              </span>
            )}
          </div>

          {/* Dynamic App Payment Brand Button */}
          {!payment.isPaid && !payment.isSkipped && !payment.isAutopayEnabled && (
            <div className="flex items-center space-x-1.5 pt-0.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Pay via
              </span>
              <button
                type="button"
                onClick={handleUpiPayClick}
                className={`px-3 py-1 rounded-full text-xs font-black ${upiAppInfo.badgeBg} ${upiAppInfo.badgeText} border ${upiAppInfo.badgeBorder} shadow-md transition-all shrink-0 active:scale-95 flex items-center justify-center`}
                title={`Pay directly via ${upiAppInfo.brandLabel} App`}
              >
                {upiAppInfo.appName === 'Paytm' ? (
                  <span className="tracking-tight flex items-center">
                    <span className="text-white font-extrabold">Pay</span>
                    <span className="text-[#00BAF2] font-black">tm</span>
                  </span>
                ) : upiAppInfo.appName === 'PhonePe' ? (
                  <span className="tracking-tight flex items-center font-black">
                    PhonePe
                  </span>
                ) : upiAppInfo.appName === 'GPay' ? (
                  <span className="tracking-tight flex items-center font-black">
                    GPay
                  </span>
                ) : (
                  <span className="tracking-tight flex items-center font-black">
                    UPI App
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle Row: Badges on Left vs Action Buttons (Skip & Checkbox) on Right */}
      <div className="flex items-center justify-between">
        {/* Left Column: Stacked Badges */}
        <div className="flex flex-col space-y-1.5 min-w-0 pr-2">
          {/* Row 1: Due Date Badge */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="inline-flex items-center space-x-1.5 text-xs font-black text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-[#1a2333] px-3 py-1 rounded-xl border border-slate-200 dark:border-[#2a364f] shrink-0">
              <Calendar className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400 shrink-0 stroke-[2.5]" />
              <span>{formatDueDay(payment.dueDay)}</span>
            </span>
          </div>

          {/* Row 2: Category, Bank & Metadata Badges */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            {/* Category Pill */}
            <span className={`text-xs font-black px-3 py-1 rounded-xl shrink-0 ${categoryMeta.colorClasses}`}>
              {categoryMeta.label}
            </span>

            {/* Bank / Payment Method Badge */}
            <span className="text-xs font-black px-3 py-1 rounded-xl shrink-0 bg-blue-500/10 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-400/30 flex items-center space-x-1">
              <Landmark className="w-3.5 h-3.5 stroke-[2.2] text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{bankName}</span>
            </span>

            {/* Autopay Badge */}
            {payment.isAutopayEnabled && (
              <span className="text-xs font-black px-3 py-1 rounded-xl shrink-0 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center space-x-1">
                <span>⚡ Auto Pay Active</span>
              </span>
            )}

            {/* Warnings */}
            {!payment.isPaid && !payment.isSkipped && linkedAccount && payment.amount > linkedAccount.balance && (
              <span className="text-xs font-black px-3 py-1 rounded-xl shrink-0 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                ⚠️ Account Shortage (Short by {formatCurrency(payment.amount - linkedAccount.balance)})
              </span>
            )}

            {isCategoryOverBudget && !payment.isSkipped && (
              <span className="text-xs font-black px-3 py-1 rounded-xl shrink-0 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                ⚠️ Budget Cap Exceeded
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Skip Button & Circular Paid Checkbox */}
        <div className="flex items-center space-x-2.5 shrink-0 pl-2">

          {/* Skip Button (▷ Skip) - Only shown when unpaid */}
          {!payment.isPaid && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSkip(payment.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black border transition-all shrink-0 active:scale-95 flex items-center space-x-1 ${
                payment.isSkipped
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a2333] text-slate-700 dark:text-white border-slate-200 dark:border-[#2a364f] hover:bg-amber-500/10 hover:text-amber-600'
              }`}
              title={payment.isSkipped ? 'Resume this item for the month' : 'Skip this item for this month'}
            >
              <SkipForward className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{payment.isSkipped ? 'Skipped' : 'Skip'}</span>
            </button>
          )}

          {/* Paid Checkbox Button: Solid White Circle with Check Icon */}
          <button
            type="button"
            onClick={handleCheckboxClick}
            aria-label={`Mark ${payment.name} as ${payment.isPaid ? 'unpaid' : 'paid'}`}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none shrink-0 ${
              payment.isPaid
                ? 'bg-white text-black shadow-md scale-105 active:scale-95'
                : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-400 hover:border-emerald-500 dark:hover:border-orange-500'
            }`}
          >
            <Check className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Bottom Footer Row: Notes on Left & Sparkle Icon on Bottom Right */}
      <div className="flex items-center justify-between pt-1">
        {payment.notes ? (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[280px]">
            • {payment.notes}
          </span>
        ) : (
          <div />
        )}

        <Sparkles className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-60 shrink-0" />
      </div>
    </div>
  );
};
