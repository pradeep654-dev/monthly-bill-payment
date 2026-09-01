import React, { useState } from 'react';
import { PaymentProvider, usePayments } from './context/PaymentContext';
import { Header } from './components/Header';
import { OverviewCard } from './components/OverviewCard';
import { PaymentAccountsBar } from './components/PaymentAccountsBar';
import { CommitmentLoadCard } from './components/CommitmentLoadCard';
import { PaymentList } from './components/PaymentList';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { NavBar } from './components/NavBar';
import { PaymentModal } from './components/PaymentModal';
import type { PaymentItem } from './types';

const MainContent: React.FC = () => {
  const { activeTab, deletePayment, isLiquidGlass } = usePayments();
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
    <div className={`h-screen h-[100dvh] w-full text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500/20 dark:selection:bg-orange-500/20 overflow-hidden ${
      isLiquidGlass ? 'app-bg-light dark:app-bg-dark' : 'bg-slate-100 dark:bg-[#000000]'
    }`}>
      {/* Mobile Shell Container */}
      <div className={`w-full max-w-md mx-auto h-full flex flex-col relative z-10 shadow-2xl overflow-hidden border-x ${
        isLiquidGlass 
          ? 'border-white/40 dark:border-white/10 backdrop-blur-md dark:bg-black/40' 
          : 'bg-slate-50 dark:bg-[#000000] border-slate-200/50 dark:border-slate-800/40'
      }`}>
        
        {/* Header */}
        <Header />

        {/* Dynamic View Scrollable Body */}
        <main className="flex-1 px-4 pt-4 pb-32 space-y-4 overflow-y-auto overscroll-contain">
          {activeTab === 'home' && (
            <>
              <OverviewCard />
              <CommitmentLoadCard />
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

        {/* Sticky Bottom Nav Bar */}
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
