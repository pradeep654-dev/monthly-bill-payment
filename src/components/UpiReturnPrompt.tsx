import React, { useState, useEffect } from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';

const STORAGE_KEY_PENDING_UPI = 'paytracker_pending_upi_v1';

export interface PendingUpiPayment {
  paymentId: string;
  paymentName: string;
  amount: number;
  launchedAt: number;
}

export const UpiReturnPrompt: React.FC = () => {
  const { togglePaid, payments, isLiquidGlass } = usePayments();
  const [pendingPayment, setPendingPayment] = useState<PendingUpiPayment | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_PENDING_UPI);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore fallback
    }
    return null;
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Check and listen for app focus / return from Paytm app
  useEffect(() => {
    const handleReturn = () => {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY_PENDING_UPI);
        if (saved) {
          const parsed: PendingUpiPayment = JSON.parse(saved);
          // Only show prompt if payment was launched in the last 5 minutes (300,000 ms)
          const isRecent = Date.now() - parsed.launchedAt < 300000;
          
          // Check if item is already paid
          const currentItem = payments.find(p => p.id === parsed.paymentId);
          if (isRecent && currentItem && !currentItem.isPaid) {
            setPendingPayment(parsed);
            setIsVisible(true);
          } else {
            sessionStorage.removeItem(STORAGE_KEY_PENDING_UPI);
            setPendingPayment(null);
            setIsVisible(false);
          }
        }
      } catch (err) {
        console.warn('Failed to load pending UPI payment from sessionStorage', err);
      }
    };

    // Listen to visibilitychange and focus events
    document.addEventListener('visibilitychange', handleReturn);
    window.addEventListener('focus', handleReturn);

    // Initial check on mount
    handleReturn();

    return () => {
      document.removeEventListener('visibilitychange', handleReturn);
      window.removeEventListener('focus', handleReturn);
    };
  }, [payments]);

  if (!pendingPayment || !isVisible) return null;

  const handleConfirmPaid = () => {
    togglePaid(pendingPayment.paymentId);
    sessionStorage.removeItem(STORAGE_KEY_PENDING_UPI);
    setIsVisible(false);

    // Trigger feedback toast
    setShowSuccessToast(`Marked ${pendingPayment.paymentName} (${formatCurrency(pendingPayment.amount)}) as Paid!`);
    setTimeout(() => {
      setShowSuccessToast(null);
      setPendingPayment(null);
    }, 3000);
  };

  const handleDismiss = () => {
    sessionStorage.removeItem(STORAGE_KEY_PENDING_UPI);
    setIsVisible(false);
    setPendingPayment(null);
  };

  return (
    <>
      {/* Toast Popup after marking paid */}
      {showSuccessToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce-in w-full max-w-sm px-4">
          <div className="p-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center space-x-2 border border-emerald-400">
            <ShieldCheck className="w-5 h-5 stroke-[2.5] text-emerald-200 shrink-0" />
            <span className="truncate">{showSuccessToast}</span>
          </div>
        </div>
      )}

      {/* Slide-Up Return Banner */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-up">
        <div className={`p-4 rounded-[26px] shadow-2xl border transition-all ${
          isLiquidGlass
            ? 'real-liquid-card dark:bg-[#070D1B]/95 text-slate-900 dark:text-white border-white/40 dark:border-white/20 backdrop-blur-2xl'
            : 'bg-slate-900 text-white dark:bg-[#080E1C] border-slate-700 shadow-emerald-500/10'
        }`}>
          {/* Top Capsule Badge & Close Button */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#002970] border border-[#00BAF2]/60 text-white text-[10px] font-black uppercase tracking-wider">
              <span className="text-[#00BAF2] font-black">Paytm</span>
              <span>Payment Confirmation</span>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 rounded-full text-slate-400 hover:text-white active:scale-95 transition-all"
              aria-label="Dismiss payment prompt"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Prompt Message */}
          <div className="space-y-1 mb-3.5">
            <h4 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
              Did you complete your UPI payment?
            </h4>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-snug">
              Mark <span className="font-black text-slate-900 dark:text-white underline decoration-emerald-400">{pendingPayment.paymentName}</span> ({formatCurrency(pendingPayment.amount)}) as Paid & deduct from bank balance?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDismiss}
              className="py-2.5 px-3 rounded-2xl font-extrabold text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 active:scale-95 transition-all text-center"
            >
              No, Keep Unpaid
            </button>

            <button
              onClick={handleConfirmPaid}
              className="py-2.5 px-3 rounded-2xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Yes, Mark Paid</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const trackUpiPaymentLaunch = (paymentId: string, paymentName: string, amount: number) => {
  try {
    const payload: PendingUpiPayment = {
      paymentId,
      paymentName,
      amount,
      launchedAt: Date.now()
    };
    sessionStorage.setItem(STORAGE_KEY_PENDING_UPI, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save pending UPI payment to sessionStorage', err);
  }
};
