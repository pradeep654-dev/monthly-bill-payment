import React, { useState } from 'react';
import { 
  Landmark, 
  Smartphone, 
  KeyRound, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  X, 
  MessageSquareText, 
  Code2, 
  ArrowRight, 
  Check, 
  Copy,
  ExternalLink
} from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { parseBankSms, SAMPLE_BANK_SMS_LIST, type ParsedSmsResult } from '../utils/smsParser';
import { SETU_AA_BACKEND_CODE_SAMPLE, BANK_API_DOCS } from '../services/bankApiGuide';
import { formatCurrency } from '../utils/formatters';

import { apiCreateConsent, apiVerifyOtp, apiFetchBankData } from '../services/bankApiService';

interface BankConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_BANKS = [
  { id: 'pm-sbi', name: 'SBI Bank', color: 'from-blue-600 to-indigo-700', badge: 'SBI A/C XX4321', defaultBal: 42500 },
  { id: 'pm-1', name: 'HDFC Bank', color: 'from-sky-500 to-blue-600', badge: 'HDFC A/C XX9012', defaultBal: 55000 },
  { id: 'pm-2', name: 'Paytm UPI', color: 'from-cyan-500 to-blue-500', badge: 'Paytm UPI Wallet', defaultBal: 15000 },
  { id: 'pm-icici', name: 'ICICI Bank', color: 'from-orange-500 to-amber-600', badge: 'ICICI A/C XX6543', defaultBal: 38000 },
  { id: 'pm-axis', name: 'Axis Bank', color: 'from-rose-600 to-pink-700', badge: 'Axis A/C XX1122', defaultBal: 27500 }
];

export const BankConnectModal: React.FC<BankConnectModalProps> = ({ isOpen, onClose }) => {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, addPayment } = usePayments();
  const [activeTab, setActiveTab] = useState<'aa' | 'sms' | 'dev'>('aa');

  // AA Sync State
  const [selectedBankId, setSelectedBankId] = useState<string>('pm-sbi');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [aaStep, setAaStep] = useState<'input' | 'otp' | 'fetching' | 'success'>('input');
  const [otp, setOtp] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [consentSessionId, setConsentSessionId] = useState('');
  const [syncedResult, setSyncedResult] = useState<{
    bankName: string;
    accountEnding: string;
    balance: number;
    lastSynced: string;
    transactions: { id: string; name: string; amount: number; type: 'debit' | 'credit'; category: any; dueDay: number }[];
  } | null>(null);

  // SMS Parser State
  const [smsInput, setSmsInput] = useState('');
  const [smsParseResult, setSmsParseResult] = useState<ParsedSmsResult | null>(null);
  const [smsApplySuccess, setSmsApplySuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [importedTxnIds, setImportedTxnIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  // Handle AA Consent OTP Request via Backend API
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    setIsSyncing(true);

    const res = await apiCreateConsent(phoneNumber, selectedBankId);
    setIsSyncing(false);

    if (res.success) {
      if (res.consentId) setConsentSessionId(res.consentId);
      setAaStep('otp');
      setOtp('482910'); // Auto-filled OTP for smooth testing
    }
  };

  // Handle OTP Verification and Live Bank Statement Fetching via Backend API
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setAaStep('fetching');

    await apiVerifyOtp(consentSessionId || 'default-session', otp);

    const apiRes = await apiFetchBankData(consentSessionId || 'default-session');
    const selectedBankObj = SUPPORTED_BANKS.find(b => b.id === selectedBankId) || SUPPORTED_BANKS[0];

    const liveBal = apiRes.data?.balance ?? (selectedBankObj.defaultBal + Math.floor(Math.random() * 1500) - 500);
    const bankName = apiRes.data?.bankName ?? selectedBankObj.name;
    const accountEnding = apiRes.data?.accountEnding ?? selectedBankObj.badge;

    const mockFetchedTxns = apiRes.data?.transactions ?? [
      { id: `txn-${Date.now()}-1`, name: '⚡ Bescom Electricity Bill', amount: 3850, type: 'debit' as const, category: 'utilities' as const, dueDay: 12 },
      { id: `txn-${Date.now()}-2`, name: '🌐 Airtel Fiber Broadband', amount: 1499, type: 'debit' as const, category: 'internet' as const, dueDay: 15 },
      { id: `txn-${Date.now()}-3`, name: '🎯 Nifty 50 Index Mutual Fund SIP', amount: 5000, type: 'debit' as const, category: 'investment' as const, dueDay: 5 }
    ];

    setSyncedResult({
      bankName,
      accountEnding,
      balance: liveBal,
      lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      transactions: mockFetchedTxns
    });

    // Find matching payment method in context or create new
    const existingMethod = paymentMethods.find(m => 
      m.id === selectedBankId || 
      m.name.toLowerCase().includes(selectedBankObj.name.toLowerCase())
    );
    if (existingMethod) {
      updatePaymentMethod(existingMethod.id, {
        balance: liveBal,
        lastSyncedAt: new Date().toISOString()
      });
    } else {
      addPaymentMethod({
        name: selectedBankObj.name,
        type: 'bank',
        balance: liveBal,
        initialBalance: liveBal,
        lastSyncedAt: new Date().toISOString()
      });
    }

    setIsSyncing(false);
    setAaStep('success');
  };

  // Import fetched AA transaction into payments list
  const handleImportTransaction = (txn: { id: string; name: string; amount: number; category: any; dueDay: number }) => {
    const selectedBankObj = SUPPORTED_BANKS.find(b => b.id === selectedBankId) || SUPPORTED_BANKS[0];
    const targetMethod = paymentMethods.find(m => 
      m.id === selectedBankId || 
      m.name.toLowerCase().includes(selectedBankObj.name.toLowerCase())
    ) || paymentMethods[0];

    addPayment({
      name: txn.name,
      amount: txn.amount,
      dueDay: txn.dueDay,
      category: txn.category,
      commitmentType: txn.category === 'investment' ? 'savings' : 'commitment',
      paymentMethodId: targetMethod?.id || 'pm-1',
      isRecurring: true,
      isAutopayEnabled: true,
      notes: `Synced via ${selectedBankObj.name} Account Aggregator Live Statement on ${new Date().toLocaleDateString()}`
    });

    setImportedTxnIds(prev => new Set(prev).add(txn.id));
  };

  // SMS Parser Live Input Change
  const handleSmsInputChange = (text: string) => {
    setSmsInput(text);
    setSmsApplySuccess(false);
    if (text.trim().length > 10) {
      const parsed = parseBankSms(text);
      setSmsParseResult(parsed);
    } else {
      setSmsParseResult(null);
    }
  };

  // Select Sample SMS
  const handleSelectSampleSms = (sampleText: string) => {
    handleSmsInputChange(sampleText);
  };

  // Apply Parsed SMS to update bank balance & add transaction
  const handleApplySms = () => {
    if (!smsParseResult || !smsParseResult.success) return;

    // Find or match Payment Method
    let targetMethod = paymentMethods.find(m => 
      m.name.toLowerCase().includes(smsParseResult.bankName.toLowerCase()) ||
      (smsParseResult.bankName.toLowerCase().includes('sbi') && (m.id === 'pm-sbi' || m.name.toLowerCase().includes('sbi'))) ||
      (smsParseResult.bankName.toLowerCase().includes('hdfc') && (m.id === 'pm-1' || m.name.toLowerCase().includes('hdfc')))
    );

    // If bank method does not exist yet, automatically add it!
    if (!targetMethod && smsParseResult.bankName) {
      const newMethodId = `pm-${Date.now()}`;
      const initialBal = smsParseResult.newBalance ?? (smsParseResult.type === 'credit' ? smsParseResult.amount : 25000);
      addPaymentMethod({
        name: smsParseResult.bankName,
        type: smsParseResult.bankName.toLowerCase().includes('upi') || smsParseResult.bankName.toLowerCase().includes('wallet') ? 'wallet' : 'bank',
        balance: initialBal,
        initialBalance: initialBal,
        accountNumberEnding: smsParseResult.accountEnding,
        lastSyncedAt: new Date().toISOString()
      });
      targetMethod = {
        id: newMethodId,
        name: smsParseResult.bankName,
        type: 'bank',
        balance: initialBal,
        initialBalance: initialBal
      };
    }

    // Update target bank balance if parsed from SMS
    if (smsParseResult.newBalance !== undefined && targetMethod) {
      updatePaymentMethod(targetMethod.id, {
        balance: smsParseResult.newBalance,
        lastSyncedAt: new Date().toISOString()
      });
    }

    // Auto-add parsed transaction as payment commitment if debit
    if (smsParseResult.type === 'debit' && smsParseResult.amount > 0) {
      addPayment({
        name: smsParseResult.merchantOrVendor || `${smsParseResult.bankName} Expense`,
        amount: smsParseResult.amount,
        dueDay: new Date().getDate(),
        category: smsParseResult.category,
        commitmentType: smsParseResult.category === 'investment' ? 'savings' : 'commitment',
        paymentMethodId: targetMethod?.id || 'pm-1',
        isRecurring: true,
        isAutopayEnabled: true,
        notes: `Extracted from Bank SMS Alert (Ref: ${smsParseResult.referenceNo || 'SMS'})`
      });
    }

    setSmsApplySuccess(true);
    setTimeout(() => {
      setSmsApplySuccess(false);
    }, 3500);
  };

  const copyDevCode = () => {
    navigator.clipboard.writeText(SETU_AA_BACKEND_CODE_SAMPLE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="app-card rounded-[32px] p-6 w-full max-w-lg shadow-2xl border border-white/30 dark:bg-[#070C18] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              <Landmark className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight leading-tight">
                Bank Balance & Statement Sync
              </h3>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Fetch balances & sync transactions via RBI Account Aggregator or SMS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1.5 my-4 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('aa')}
            className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'aa'
                ? 'bg-white dark:bg-emerald-500 text-slate-950 dark:text-slate-950 shadow-md font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>AA Live Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('sms')}
            className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'sms'
                ? 'bg-white dark:bg-emerald-500 text-slate-950 dark:text-slate-950 shadow-md font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>SMS Parser</span>
          </button>

          <button
            onClick={() => setActiveTab('dev')}
            className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'dev'
                ? 'bg-white dark:bg-emerald-500 text-slate-950 dark:text-slate-950 shadow-md font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Dev API Guide</span>
          </button>
        </div>

        {/* Tab 1: Account Aggregator OTP Consent Simulator */}
        {activeTab === 'aa' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {aaStep === 'input' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-2">
                    Select Your Primary Bank
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SUPPORTED_BANKS.map(bank => {
                      const existingMethod = paymentMethods.find(m => 
                        m.id === bank.id || 
                        m.name.toLowerCase().includes(bank.name.toLowerCase().replace(' bank', ''))
                      );
                      const displayBadge = existingMethod?.accountNumber 
                        ? `A/C ${existingMethod.accountNumber}`
                        : (existingMethod?.accountNumberEnding 
                          ? `A/C XX${existingMethod.accountNumberEnding}` 
                          : bank.badge);

                      return (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBankId(bank.id)}
                          className={`p-3 rounded-2xl border text-left transition-all relative ${
                            selectedBankId === bank.id
                              ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 text-slate-900 dark:text-white ring-2 ring-emerald-500/30'
                              : 'bg-slate-50 dark:bg-[#0D1322] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-xs">{bank.name}</span>
                            {selectedBankId === bank.id && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 block truncate">{displayBadge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                    Bank Registered Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-black text-slate-400">+91</span>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      className="w-full pl-12 pr-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-750 text-slate-900 dark:text-white text-xs font-black"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-300 leading-snug">
                    Uses RBI-regulated Account Aggregator architecture (Setu / Finvu). Encrypted end-to-end data consent token exchange.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Requesting Bank Consent...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Consent OTP</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {aaStep === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-800">
                  <KeyRound className="w-8 h-8 text-emerald-500 mx-auto mb-2 stroke-[2]" />
                  <h4 className="font-black text-xs text-slate-900 dark:text-white">Enter 6-Digit Bank Verification OTP</h4>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">
                    Sent to +91 {phoneNumber} via Account Aggregator Gateway
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full text-center tracking-[0.5em] text-lg font-black py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] font-bold text-emerald-500 text-center mt-1.5">
                    ✓ Sample OTP auto-filled (482910)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Verify OTP & Fetch Live Statement</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </form>
            )}

            {aaStep === 'fetching' && (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mx-auto" />
                <h4 className="font-black text-xs text-slate-900 dark:text-white">Establishing Secure FIU Data Stream...</h4>
                <p className="text-[11px] font-bold text-slate-400">Decrypting account balances and monthly bank transaction logs...</p>
              </div>
            )}

            {aaStep === 'success' && syncedResult && (
              <div className="space-y-4 animate-fade-in">
                {/* Live Balance Fetched Banner */}
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-slate-900 dark:text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950">
                        LIVE SYNCED
                      </span>
                      <span className="text-xs font-black">{syncedResult.bankName}</span>
                    </div>
                    <span className="text-xl font-black block mt-1 tracking-tight text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(syncedResult.balance)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      Updated in payment accounts at {syncedResult.lastSynced}
                    </span>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 stroke-[2.5]" />
                </div>

                {/* Fetched Bank Statement Transactions */}
                <div>
                  <h4 className="font-black text-xs text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                    <span>Recent Bank Statement Transactions ({syncedResult.transactions.length})</span>
                    <span className="text-[10px] font-bold text-slate-400">Click to import</span>
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {syncedResult.transactions.map(txn => (
                      <div
                        key={txn.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <h5 className="font-black text-xs text-slate-900 dark:text-white truncate">{txn.name}</h5>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                            Due Day {txn.dueDay} • {txn.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-xs text-rose-500 dark:text-rose-400">
                            -{formatCurrency(txn.amount)}
                          </span>
                          <button
                            onClick={() => handleImportTransaction(txn)}
                            disabled={importedTxnIds.has(txn.id)}
                            className={`p-1.5 rounded-xl font-black text-[10px] transition-all ${
                              importedTxnIds.has(txn.id)
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default'
                                : 'bg-emerald-500 hover:scale-105 active:scale-95 text-slate-950 shadow-sm'
                            }`}
                            title={importedTxnIds.has(txn.id) ? 'Imported to payments' : 'Import as Payment Item'}
                          >
                            {importedTxnIds.has(txn.id) ? '✓ Added' : '+ Add'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setAaStep('input')}
                  className="w-full py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs"
                >
                  Sync Another Bank Account
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Smart SMS / Statement Alert Parser */}
        {activeTab === 'sms' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                Quick One-Click Test Samples
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {SAMPLE_BANK_SMS_LIST.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSampleSms(sample.sms)}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate"
                  >
                    ⚡ {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
                Paste Bank SMS Alert / Notification Text
              </label>
              <textarea
                rows={3}
                placeholder="Paste SMS here e.g. Rs. 3,850 debited from SBI A/c XX4321 on 05-Sep-26 towards Electricity Bill. Avail Bal: Rs 41,150."
                value={smsInput}
                onChange={e => handleSmsInputChange(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#0D1322] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Parsed SMS Output Card */}
            {smsParseResult && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white space-y-2 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      smsParseResult.type === 'debit' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                    }`}>
                      {smsParseResult.type}
                    </span>
                    <span className="font-black text-xs text-white">{smsParseResult.bankName}</span>
                  </div>
                  {smsParseResult.accountEnding && (
                    <span className="text-[10px] font-bold text-slate-400">A/C {smsParseResult.accountEnding}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Transaction Amount</span>
                    <span className="font-black text-emerald-400 text-base">{formatCurrency(smsParseResult.amount)}</span>
                  </div>
                  {smsParseResult.newBalance !== undefined && (
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Updated Avail Balance</span>
                      <span className="font-black text-white text-base">{formatCurrency(smsParseResult.newBalance)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-1 text-[11px] font-bold text-slate-300">
                  <span>Merchant/Vendor: </span>
                  <span className="text-emerald-300">{smsParseResult.merchantOrVendor}</span>
                  <span className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-[9px] uppercase font-black">{smsParseResult.category}</span>
                </div>

                <button
                  onClick={handleApplySms}
                  className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-98 flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Update Account Balance & Import Transaction</span>
                </button>

                {smsApplySuccess && (
                  <p className="text-[10px] font-black text-emerald-400 text-center animate-pulse">
                    ✓ Balance updated & payment record added to current month!
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Developer Production API Architecture Guide */}
        {activeTab === 'dev' && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-slate-900 dark:text-white">
              <h4 className="font-black text-xs flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Production Open Banking / AA Architecture</span>
              </h4>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-snug">
                Connect real bank accounts in production using RBI-regulated Account Aggregator endpoints (Setu API) or Plaid API for global banks.
              </p>
            </div>

            {/* Code Snippet Box */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-3 text-[10px] font-mono text-emerald-400 overflow-x-auto">
              <button
                onClick={copyDevCode}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center space-x-1 text-[10px] font-sans"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <pre className="pr-16 leading-relaxed whitespace-pre-wrap">
                {SETU_AA_BACKEND_CODE_SAMPLE.slice(0, 700)}...
              </pre>
            </div>

            <div className="flex space-x-2">
              <a
                href={BANK_API_DOCS.setuUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-[11px] flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Setu AA Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={BANK_API_DOCS.plaidUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-[11px] flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Plaid API Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
