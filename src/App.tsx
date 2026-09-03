import React, { useState } from 'react';
import { Sparkles, IndianRupee } from 'lucide-react';
import { PaymentProvider, usePayments } from './context/PaymentContext';
import { Header } from './components/Header';
import { OverviewCard } from './components/OverviewCard';
import { PaymentAccountsBar } from './components/PaymentAccountsBar';

import { CommitmentLoadCard } from './components/CommitmentLoadCard';
import { DashboardChartCard } from './components/DashboardChartCard';
import { SalaryCreditCard } from './components/SalaryCreditCard';
import { CommitmentsView } from './components/CommitmentsView';
import { SavingsView } from './components/SavingsView';
import { BudgetHealthView } from './components/BudgetHealthView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { NavBar } from './components/NavBar';
import { PaymentModal } from './components/PaymentModal';
import { BudgetModal } from './components/BudgetModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import type { PaymentItem } from './types';

const MainContent: React.FC = () => {
  const { activeTab, deletePayment, isLiquidGlass } = usePayments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
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
          ? 'border-white/40 dark:border-white/10 backdrop-blur-md dark:bg-black' 
          : 'bg-slate-50 dark:bg-[#000000] border-slate-200/50 dark:border-slate-800/40'
      }`}>
        
        {/* Header */}
        <Header />

        {/* Dynamic View Scrollable Body */}
        <main className="flex-1 px-4 pt-4 pb-32 space-y-4 overflow-y-auto overscroll-contain">
          {activeTab === 'home' && (
            <>
              <OverviewCard />
              <SalaryCreditCard />
              <PaymentAccountsBar />
              <DashboardChartCard />
              <CommitmentLoadCard />
            </>
          )}

          {activeTab === 'commitments' && (
            <CommitmentsView
              onAddCommitment={handleAddPayment}
              onEditPayment={handleEditPayment}
              onDeletePayment={handleDeletePayment}
            />
          )}

          {activeTab === 'savings' && (
            <SavingsView
              onAddSavings={handleAddPayment}
              onEditPayment={handleEditPayment}
              onDeletePayment={handleDeletePayment}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetHealthView onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />
          )}

          {activeTab === 'history' && <HistoryView />}

          {activeTab === 'settings' && <SettingsView onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />}
        </main>

        {/* Dynamic Theme-Adaptive Floating Round Payri AI Button (Fixed for Mobile & PC) */}
        <div className="fixed bottom-[92px] right-4 sm:right-[calc(50vw-13rem)] z-50">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className={`w-13 h-13 rounded-full flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl group ${
              isLiquidGlass
                ? 'bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-2 border-white/80 dark:border-white/30 text-slate-900 dark:text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                : 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 dark:from-orange-500 dark:via-amber-400 dark:to-yellow-400 text-white shadow-xl shadow-emerald-500/40 dark:shadow-orange-500/50 border-2 border-white/90 dark:border-slate-800'
            }`}
            title="Open Payri AI Assistant"
          >
            <div className="relative flex items-center justify-center">
              <IndianRupee className="w-5 h-5 stroke-[2.8] group-hover:scale-110 transition-transform" />
              <Sparkles className="w-2.5 h-2.5 text-amber-300 dark:text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-[9px] font-black leading-none tracking-tight mt-0.5">Payri</span>
          </button>
        </div>

        {/* Sticky Bottom Nav Bar */}
        <NavBar />

        {/* Modal for Add / Edit Payment */}
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPayment(null);
          }}
          editingPayment={editingPayment}
        />

        {/* Modal for Category Budget Caps */}
        <BudgetModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
        />

        {/* AI Finance Assistant Modal */}
        <AiAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
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
