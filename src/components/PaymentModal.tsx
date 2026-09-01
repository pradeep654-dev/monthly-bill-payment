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

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState<number>(5);
  const [category, setCategory] = useState<CategoryType>('other');
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const [upiId, setUpiId] = useState('');
  const [isRecurring, setIsRecurring] = useState(true);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingPayment) {
      setName(editingPayment.name);
      setAmount(editingPayment.amount.toString());
      setDueDay(editingPayment.dueDay);
      setCategory(editingPayment.category);
      setPaymentMethodId(editingPayment.paymentMethodId || (paymentMethods[0]?.id || ''));
      setUpiId(editingPayment.upiId || '');
      setIsRecurring(editingPayment.isRecurring);
      setNotes(editingPayment.notes || '');
    } else {
      setName('');
      setAmount('');
      setDueDay(5);
      setCategory('housing');
      setPaymentMethodId(paymentMethods[0]?.id || '');
      setUpiId('');
      setIsRecurring(true);
      setNotes('');
    }
    setError('');
  }, [editingPayment, isOpen, paymentMethods]);

  if (!isOpen) return null;

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

    if (editingPayment) {
      updatePayment(editingPayment.id, {
        name: name.trim(),
        amount: numAmount,
        dueDay,
        category,
        paymentMethodId,
        upiId: upiId.trim(),
        isRecurring,
        notes: notes.trim()
      });
    } else {
      addPayment({
        name: name.trim(),
        amount: numAmount,
        dueDay,
        category,
        paymentMethodId,
        upiId: upiId.trim(),
        isRecurring,
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
            {editingPayment ? 'Edit Payment' : 'Add New Payment'}
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
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Payment Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rent, Electricity, Internet"
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
                  placeholder="15000"
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
                UPI ID (Optional)
              </label>
              <input
                type="text"
                placeholder="landlord@upi"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category & Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(CATEGORY_MAP) as CategoryType[]).map(catKey => {
                const meta = CATEGORY_MAP[catKey];
                const IconComp = meta.icon;
                const isSelected = category === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:border-orange-500 dark:bg-orange-950/40 text-emerald-600 dark:text-orange-400 font-bold shadow-xs'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-500 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <IconComp className="w-5 h-5 mb-1" />
                    <span className="text-[10px] leading-tight text-center truncate w-full">
                      {meta.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recurring Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-100 dark:border-slate-800">
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Recurring Monthly
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                Automatically add to every new month
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsRecurring(!isRecurring)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 flex items-center ${
                isRecurring ? 'bg-emerald-500 dark:bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-md ${
                  isRecurring ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
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
