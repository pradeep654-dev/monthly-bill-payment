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
        <h3 className="text-slate-900 dark:text-white font-black text-base tracking-tight">
          Payment Accounts & Balances
        </h3>

        {/* Deep White High Contrast + Add Account Button */}
        <button
          onClick={openAddModal}
          className="text-xs font-black bg-white text-slate-950 shadow-md shadow-white/10 border border-white hover:bg-slate-100 flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Account</span>
        </button>
      </div>

      {/* Horizontal List of Accounts */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {paymentMethods.map(method => {
          const IconComp = getAccountIcon(method.type);

          return (
            <div
              key={method.id}
              onClick={() => openEditModal(method)}
              className="app-card rounded-[22px] p-4 min-w-[160px] shrink-0 cursor-pointer active:scale-95 transition-all duration-200 border border-white/20 dark:bg-[#080E1B]"
            >
              <div className="flex items-center justify-between mb-2.5">
                {/* Deep White Icon Capsule */}
                <div className="p-2 rounded-2xl bg-white text-slate-950 shadow-xs border border-white">
                  <IconComp className="w-4 h-4 stroke-[2.5]" />
                </div>

                {/* Deep White Account Type Badge */}
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-slate-950 border border-white shadow-2xs">
                  {method.type}
                </span>
              </div>

              <h4 className="font-black text-xs text-slate-900 dark:text-white truncate mb-1">
                {method.name}
              </h4>
              <span className="font-black text-base text-slate-900 dark:text-white tracking-tight block">
                {formatCurrency(method.balance)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="app-card rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-white/30 dark:bg-[#070C18]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h4 className="font-black text-slate-900 dark:text-white text-base">
                {editingMethod ? 'Edit Account' : 'Add Payment Account'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Bank, GPay Wallet"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Account Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as AccountType)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-black"
                  >
                    <option value="bank">Bank</option>
                    <option value="wallet">Wallet / UPI</option>
                    <option value="card">Credit Card</option>
                    <option value="cash">Cash / Savings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Current Balance (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="50000"
                    value={balance}
                    onChange={e => setBalance(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-750 text-slate-900 dark:text-white text-xs font-black"
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
                    className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.2]" />
                  </button>
                )}

                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-white text-slate-950 font-black text-xs shadow-md border border-white active:scale-95"
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
