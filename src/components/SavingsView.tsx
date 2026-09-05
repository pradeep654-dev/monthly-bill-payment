import React from 'react';
import { PiggyBank, Plus } from 'lucide-react';
import { usePayments, getEffectiveMethodId } from '../context/PaymentContext';
import { PaymentItemCard } from './PaymentItemCard';
import type { PaymentItem } from '../types';
import { formatCurrency, sortByUpcomingAndDate } from '../utils/formatters';
import { getCategoryMeta } from '../utils/categories';
import { BankBadge } from '../utils/bankBrands';

interface SavingsViewProps {
  onAddSavings: () => void;
  onEditPayment: (payment: PaymentItem) => void;
  onDeletePayment: (id: string) => void;
}

export const SavingsView: React.FC<SavingsViewProps> = ({
  onAddSavings,
  onEditPayment,
  onDeletePayment
}) => {
  const { currentMonthPayments, summary, paymentMethods, isLiquidGlass } = usePayments();

  // Filter savings items (upcoming cards on top, sorted date-wise)
  const savingsItems = sortByUpcomingAndDate(
    currentMonthPayments.filter(
      p => p.commitmentType === 'savings' || getCategoryMeta(p.category).group === 'savings'
    )
  );

  const totalSavingsAmount = savingsItems.reduce((sum, p) => sum + p.amount, 0);
  const paidSavingsAmount = savingsItems.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0);
  const pendingSavingsAmount = totalSavingsAmount - paidSavingsAmount;

  // Breakdown by linked payment account
  const accountBreakdown = paymentMethods.map(m => {
    const allocated = savingsItems
      .filter(p => getEffectiveMethodId(p, paymentMethods) === m.id)
      .reduce((sum, p) => sum + p.amount, 0);
    return { ...m, allocated };
  }).filter(m => m.allocated > 0);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Banner Card */}
      <div className={`app-card p-5 overflow-hidden relative transition-all ${
        isLiquidGlass
          ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-400/40 backdrop-blur-md text-slate-900 dark:text-white'
          : 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white border-emerald-700/60 shadow-lg'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
              <PiggyBank className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider block ${
                isLiquidGlass
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-emerald-300'
              }`}>
                Wealth & Deposits
              </span>
              <h2 className={`text-base font-black tracking-tight ${
                isLiquidGlass
                  ? 'text-slate-900 dark:text-white'
                  : 'text-white'
              }`}>
                {summary.monthName} Savings
              </h2>
            </div>
          </div>

          <button
            onClick={onAddSavings}
            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Savings</span>
          </button>
        </div>

        {/* Primary Metric: Total Monthly Savings */}
        <div className={`mt-3 p-4 rounded-2xl border backdrop-blur-md flex items-center justify-between ${
          isLiquidGlass
            ? 'bg-white/60 dark:bg-white/5 border-emerald-200 dark:border-white/15'
            : 'bg-white/10 border-white/15'
        }`}>
          <div>
            <span className={`text-[11px] font-black uppercase tracking-wider block mb-0.5 ${
              isLiquidGlass
                ? 'text-emerald-800 dark:text-emerald-300'
                : 'text-emerald-200'
            }`}>
              Total Monthly Savings
            </span>
            <span className={`text-2xl font-black tracking-tight block ${
              isLiquidGlass
                ? 'text-slate-900 dark:text-white'
                : 'text-white'
            }`}>
              {formatCurrency(totalSavingsAmount)}
            </span>
            <span className={`block text-[11px] font-bold mt-1 ${
              isLiquidGlass
                ? 'text-slate-600 dark:text-slate-300'
                : 'text-emerald-200/80'
            }`}>
              {savingsItems.length} active investments
            </span>
          </div>
        </div>

        {/* Paid vs Pending Breakdown */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isLiquidGlass
              ? 'bg-emerald-100/80 dark:bg-emerald-500/20 border-emerald-300/80 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
              : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200'
          }`}>
            <span className="font-extrabold text-[11px]">Deposited (Paid)</span>
            <span className="font-black">{formatCurrency(paidSavingsAmount)}</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            isLiquidGlass
              ? 'bg-amber-100/80 dark:bg-amber-500/20 border-amber-300/80 dark:border-amber-500/30 text-amber-900 dark:text-amber-200'
              : 'bg-amber-500/20 border-amber-500/30 text-amber-200'
          }`}>
            <span className="font-extrabold text-[11px]">Pending Deposit</span>
            <span className="font-black">{formatCurrency(pendingSavingsAmount)}</span>
          </div>
        </div>
      </div>

      {/* Account Allocation Breakdown */}
      {accountBreakdown.length > 0 && (
        <div className="app-card p-4 space-y-2.5">
          <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Savings Account Allocation
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {accountBreakdown.map(acc => (
              <div
                key={acc.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-800/80 flex flex-col space-y-2"
              >
                {/* Bank Badge with Logo */}
                <div className="flex items-center justify-between">
                  <BankBadge bankName={acc.name} showFullName />
                </div>

                {/* Amount Allocated displayed cleanly below bank name */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Allocated Savings
                  </span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                    {formatCurrency(acc.allocated)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Savings List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight">
            Active Savings & SIPs ({savingsItems.length})
          </h3>
        </div>

        {savingsItems.length === 0 ? (
          <div className="app-card p-8 text-center my-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
              <PiggyBank className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h4 className="font-extrabold text-slate-800 dark:text-white text-base mb-1">
              No savings configured
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs mb-4 max-w-xs mx-auto font-medium">
              Start building your wealth by setting up monthly SIPs, recurring deposits, or emergency savings.
            </p>
            <button
              onClick={onAddSavings}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-500 text-white text-xs font-black shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Your First Savings</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {savingsItems.map(payment => (
              <PaymentItemCard
                key={payment.id}
                payment={payment}
                onEdit={onEditPayment}
                onDelete={onDeletePayment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
