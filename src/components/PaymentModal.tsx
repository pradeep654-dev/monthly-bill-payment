import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { PaymentItem, CategoryType } from '../types';
import { CATEGORY_MAP } from '../utils/categories';
import { usePayments } from '../context/PaymentContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPayment?: PaymentItem | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  editingPayment
}) => {
  const { addPayment, updatePayment, deletePayment, paymentMethods } = usePayments();

  const [commitmentType, setCommitmentType] = useState<'savings' | 'commitment'>('commitment');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState<number>(5);
  const [category, setCategory] = useState<CategoryType>('housing');
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const [upiId, setUpiId] = useState('');
  const [isRecurring, setIsRecurring] = useState(true);
  const [isAutopayEnabled, setIsAutopayEnabled] = useState(false);
  const [isMandatory, setIsMandatory] = useState(true);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingPayment) {
      const type = editingPayment.commitmentType || (CATEGORY_MAP[editingPayment.category]?.group === 'savings' ? 'savings' : 'commitment');
      setCommitmentType(type);
      setName(editingPayment.name);
      setAmount(editingPayment.amount.toString());
      setDueDay(editingPayment.dueDay);
      setCategory(editingPayment.category);
      setPaymentMethodId(editingPayment.paymentMethodId || (paymentMethods[0]?.id || ''));
      setUpiId(editingPayment.upiId || '');
      setIsRecurring(type === 'savings' ? true : editingPayment.isRecurring);
      setIsAutopayEnabled(editingPayment.isAutopayEnabled ?? (type === 'savings'));
      setIsMandatory(editingPayment.isMandatory !== false);
      setNotes(editingPayment.notes || '');
    } else {
      setCommitmentType('commitment');
      setName('');
      setAmount('');
      setDueDay(5);
      setCategory('housing');
      setPaymentMethodId(paymentMethods[0]?.id || '');
      setUpiId('');
      setIsRecurring(true);
      setIsAutopayEnabled(false);
      setIsMandatory(true);
      setNotes('');
    }
    setError('');
  }, [editingPayment, isOpen, paymentMethods]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: 'savings' | 'commitment') => {
    setCommitmentType(newType);
    if (newType === 'savings') {
      setIsRecurring(true);
      setIsAutopayEnabled(true);
      setIsMandatory(true);
      if (category !== 'savings' && category !== 'investment') {
        setCategory('savings');
      }
    }
  };

  const handleCategorySelect = (catKey: CategoryType) => {
    setCategory(catKey);
    const meta = CATEGORY_MAP[catKey];
    if (meta.group === 'savings') {
      setCommitmentType('savings');
      setIsRecurring(true);
      setIsAutopayEnabled(true);
      setIsMandatory(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a payment name.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    const finalIsRecurring = commitmentType === 'savings' ? true : isRecurring;

    if (editingPayment) {
      updatePayment(editingPayment.id, {
        name: name.trim(),
        amount: numAmount,
        dueDay,
        category,
        commitmentType,
        paymentMethodId,
        upiId: upiId.trim(),
        isRecurring: finalIsRecurring,
        isAutopayEnabled,
        isMandatory,
        notes: notes.trim()
      });
    } else {
      addPayment({
        name: name.trim(),
        amount: numAmount,
        dueDay,
        category,
        commitmentType,
        paymentMethodId,
        upiId: upiId.trim(),
        isRecurring: finalIsRecurring,
        isAutopayEnabled,
        isMandatory,
        notes: notes.trim()
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (editingPayment && confirm(`Delete "${editingPayment.name}" from this month?`)) {
      deletePayment(editingPayment.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
            {editingPayment ? 'Edit Entry' : 'Add New Entry'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Section Selector: Savings vs Commitment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Entry Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleTypeChange('commitment')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                  commitmentType === 'commitment'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border border-slate-200/60 dark:border-slate-700'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>💳 Commitment to Pay</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('savings')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                  commitmentType === 'savings'
                    ? 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 border border-emerald-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>🏦 Savings</span>
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {commitmentType === 'savings' ? 'Savings Name' : 'Payment Name'}
            </label>
            <input
              type="text"
              required
              placeholder={commitmentType === 'savings' ? 'e.g. SIP Index Fund, RD, Emergency Savings' : 'e.g. Rent, Electricity, Internet'}
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:focus:ring-orange-500/40 font-medium"
            />
          </div>

          {/* Amount & Due Day */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 dark:text-slate-500 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="5000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:focus:ring-orange-500/40 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Due Day of Month
              </label>
              <select
                value={dueDay}
                onChange={e => setDueDay(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:focus:ring-orange-500/40 font-semibold"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>
                    {day}
                    {day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of month
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Account & UPI VPA */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Payment Account
              </label>
              <select
                value={paymentMethodId}
                onChange={e => setPaymentMethodId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold"
              >
                {paymentMethods.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                UPI ID or Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. 9876543210 or payee@paytm"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              />
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                Enter 10-digit mobile number or UPI ID for direct 1-tap Paytm redirect
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category & Icon
            </label>
            <div className="max-h-48 overflow-y-auto pr-1 p-0.5 grid grid-cols-4 gap-2 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-slate-50/50 dark:bg-[#0D1117]/50">
              {(Object.keys(CATEGORY_MAP) as CategoryType[]).map(catKey => {
                const meta = CATEGORY_MAP[catKey];
                const IconComp = meta.icon;
                const isSelected = category === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => handleCategorySelect(catKey)}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:border-orange-500 dark:bg-orange-950/40 text-emerald-600 dark:text-orange-400 font-bold shadow-xs'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-500 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <IconComp className="w-5 h-5 mb-1" />
                    <span className="text-[10px] leading-tight text-center truncate w-full font-bold">
                      {meta.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recurrence Selection */}
          {commitmentType === 'savings' ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
              <div>
                <span className="block font-extrabold text-xs">🔁 Auto Every Month</span>
                <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Savings items automatically repeat every month</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black">AUTOMATIC</span>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Commitment Recurrence
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecurring(true)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isRecurring
                      ? 'bg-emerald-50 dark:bg-orange-950/40 border-emerald-500 dark:border-orange-500 text-emerald-800 dark:text-orange-300 font-black shadow-xs'
                      : 'bg-slate-50 dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="block text-xs font-black">🔁 Every Month</span>
                  <span className="block text-[10px] opacity-80 font-medium mt-0.5">Repeats every month automatically</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRecurring(false)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    !isRecurring
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500 text-amber-900 dark:text-amber-300 font-black shadow-xs'
                      : 'bg-slate-50 dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="block text-xs font-black">📌 Current Month Only</span>
                  <span className="block text-[10px] opacity-80 font-medium mt-0.5">One-off payment for this month</span>
                </button>
              </div>
            </div>
          )}

          {/* Autopay Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20">
            <div>
              <span className="block text-xs font-black text-slate-900 dark:text-white">
                ⚡ Autopay / Bank Auto-Debit
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Auto-mark paid on due date (Auto Pay Active)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsAutopayEnabled(!isAutopayEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 flex items-center shrink-0 ${
                isAutopayEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-md ${
                  isAutopayEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Mandatory vs Discretionary Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Expense Priority Nature
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsMandatory(true)}
                className={`p-2.5 rounded-2xl border text-center font-extrabold text-xs transition-all ${
                  isMandatory
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'bg-slate-50 dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                🔒 Mandatory (Survival)
              </button>
              <button
                type="button"
                onClick={() => setIsMandatory(false)}
                className={`p-2.5 rounded-2xl border text-center font-extrabold text-xs transition-all ${
                  !isMandatory
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'bg-slate-50 dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                🎨 Discretionary (Flexible)
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via PhonePe / Auto-debit"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-normal"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex space-x-3">
            {editingPayment && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                title="Delete Payment"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 dark:bg-orange-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 dark:shadow-orange-500/20 hover:opacity-95 transition-opacity"
            >
              {editingPayment ? 'Save Changes' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
