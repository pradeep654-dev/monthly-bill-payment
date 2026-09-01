import React, { useState } from 'react';
import { PaymentProvider, usePayments } from './context/PaymentContext';
import { Header } from './components/Header';
import { OverviewCard } from './components/OverviewCard';
import { PaymentAccountsBar } from './components/PaymentAccountsBar';
import { PaymentList } from './components/PaymentList';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { NavBar } from './components/NavBar';
import { PaymentModal } from './components/PaymentModal';
import type { PaymentItem } from './types';

const MainContent: React.FC = () => {
  const { activeTab, deletePayment } = usePayments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentItem | null>(null);

  const handleAddPayment = () => {
    setEditingPayment(null);
    setIsModalOpen(true);
  };

  const handleEditPayment = (payment: PaymentItem) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  const handleDeletePayment = (id: string) => {
    deletePayment(id);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#06090F] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500/20 dark:selection:bg-orange-500/20">
      {/* App Shell Container */}
      <div className="w-full max-w-md mx-auto bg-slate-50 dark:bg-[#090D16] min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200/50 dark:border-slate-800/40">
        
        {/* Fixed Header */}
        <Header />

        {/* Dynamic View Body */}
        <main className="flex-1 px-4 pt-4 pb-28 space-y-4 overflow-y-auto">
          {activeTab === 'home' && (
            <>
              <OverviewCard />
              <PaymentAccountsBar />
              <PaymentList
                onAddPayment={handleAddPayment}
                onEditPayment={handleEditPayment}
                onDeletePayment={handleDeletePayment}
              />
            </>
          )}

          {activeTab === 'history' && <HistoryView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Fixed Bottom Nav */}
        <NavBar />

        {/* Modal for Add / Edit */}
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPayment(null);
          }}
          editingPayment={editingPayment}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <PaymentProvider>
      <MainContent />
    </PaymentProvider>
  );
}
