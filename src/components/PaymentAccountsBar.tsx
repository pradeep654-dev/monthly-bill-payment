import React, { useState } from 'react';
import { Landmark, Wallet, CreditCard, Banknote, Plus, X, Trash2 } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { formatCurrency } from '../utils/formatters';
import type { PaymentMethod, AccountType } from '../types';

export const PaymentAccountsBar: React.FC = () => {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = usePayments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState('');

  const openAddModal = () => {
    setEditingMethod(null);
    setName('');
    setType('bank');
    setBalance('');
    setIsModalOpen(true);
  };

  const openEditModal = (method: PaymentMethod) => {
    setEditingMethod(method);
    setName(method.name);
    setType(method.type);
    setBalance(method.balance.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const numBalance = parseFloat(balance) || 0;

    if (editingMethod) {
      updatePaymentMethod(editingMethod.id, {
        name: name.trim(),
        type,
        balance: numBalance
      });
    } else {
      addPaymentMethod({
        name: name.trim(),
        type,
        balance: numBalance,
        initialBalance: numBalance
      });
    }
    setIsModalOpen(false);
  };

  const getAccountIcon = (accType: AccountType) => {
    switch (accType) {
      case 'bank': return Landmark;
      case 'wallet': return Wallet;
      case 'card': return CreditCard;
      case 'cash': return Banknote;
      default: return Landmark;
    }
  };

  return (
    <div className="mt-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base tracking-tight">
          Payment Accounts & Balances
        </h3>
        <button
          onClick={openAddModal}
          className="text-xs font-bold text-emerald-600 dark:text-orange-400 hover:underline flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Account</span>
        </button>
      </div>

      {/* Cards List */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {paymentMethods.map(method => {
          const IconComp = getAccountIcon(method.type);

          return (
            <div
              key={method.id}
              onClick={() => openEditModal(method)}
              className="bg-white dark:bg-[#161B26] border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 min-w-[150px] shrink-0 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-orange-500">
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {method.type}
                </span>
              </div>

              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate mb-1">
                {method.name}
              </h4>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight block">
                {formatCurrency(method.balance)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {editingMethod ? 'Edit Account' : 'Add Payment Account'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Bank, GPay Wallet"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Account Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as AccountType)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="bank">Bank</option>
                    <option value="wallet">Wallet / UPI</option>
                    <option value="card">Credit Card</option>
                    <option value="cash">Cash / Savings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Balance (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="50000"
                    value={balance}
                    onChange={e => setBalance(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                {editingMethod && (
                  <button
                    type="button"
                    onClick={() => {
                      deletePaymentMethod(editingMethod.id);
                      setIsModalOpen(false);
                    }}
                    className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-emerald-500 dark:bg-orange-500 text-white font-bold text-xs"
                >
                  {editingMethod ? 'Save Account' : 'Add Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
