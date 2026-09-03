import React, { useState, useRef, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Smartphone, 
  Share, 
  PlusSquare, 
  Check,
  Cloud,
  RefreshCw,
  Key,
  WifiOff,
  Sparkles,
  Target,
  Banknote,
  Sliders,
  ArrowRightLeft,
  Zap
} from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { SalarySettingsModal } from './SalarySettingsModal';
import { formatCurrency } from '../utils/formatters';

interface SettingsViewProps {
  onOpenBudgetModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenBudgetModal }) => {

  const { 
    theme, 
    setTheme, 
    isLiquidGlass,
    toggleLiquidGlass,
    resetToDefaultData, 
    exportData, 
    importData,
    cloudSyncCode,
    isCloudSyncActive,
    enableCloudSync,
    disableCloudSync,
    summary,
    salarySplitPercent,
    runAutoSweepEngine
  } = usePayments();

  const [importMessage, setImportMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [syncKeyInput, setSyncKeyInput] = useState('');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // BeforeInstallPromptEvent for Android / Chrome
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleExport = () => {
    const jsonString = exportData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-payments-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const success = importData(content);
        if (success) {
          setImportMessage({ text: 'Data imported successfully!', success: true });
        } else {
          setImportMessage({ text: 'Failed to import data. Invalid JSON file format.', success: false });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all payment data to default September 2026 sample state?')) {
      resetToDefaultData();
      setImportMessage({ text: 'Data reset to default September 2026 sample payments.', success: true });
    }
  };

  const handleForceRefresh = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
      } catch (e) {
        console.error('Error unregistering service workers:', e);
      }
    }
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        for (let name of cacheNames) {
          await caches.delete(name);
        }
      } catch (e) {
        console.error('Error clearing caches:', e);
      }
    }
    window.location.reload();
  };

  const handleEnableSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncKeyInput.trim()) {
      setSyncMessage('Please enter a private Sync Key (e.g. pradeep-bills-2026)');
      return;
    }
    const success = await enableCloudSync(syncKeyInput.trim());
    if (success) {
      setSyncMessage('Cloud Sync active! Use this same Sync Key on your other devices.');
    } else {
      setSyncMessage('Failed to activate Cloud Sync. Please check network.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize theme, backup local data, and enable multi-device sync
        </p>
      </div>

      {/* Theme Section */}
      <div className="app-card p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
          Appearance & Theme
        </h3>

        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
              theme === 'light'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Sun className="w-5 h-5 mb-1.5 text-emerald-600" />
            <span className="text-xs">Clean Light</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">Green Accent</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
              theme === 'dark'
                ? 'border-orange-500 bg-orange-950/40 text-orange-400 font-bold shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Moon className="w-5 h-5 mb-1.5 text-orange-500" />
            <span className="text-xs">Dark Mode</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">Orange Accent</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
              theme === 'system'
                ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Monitor className="w-5 h-5 mb-1.5" />
            <span className="text-xs">System</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">Auto Match</span>
          </button>
        </div>

        {/* 3D Liquid Glass UI Checkbox Switch */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 pr-2">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                3D Liquid Glassmorphism UI
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isLiquidGlass
                  ? 'Translucent glass cards & animated wave background enabled'
                  : 'Clean UI active (Unchecked)'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isLiquidGlass}
              onChange={toggleLiquidGlass}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* Salary Credit & Auto-Split Settings Section */}
      <div className="app-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500 text-white shadow-sm">
              <Banknote className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Salary Credit & Auto-Split
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SBI Salary ({formatCurrency(summary.monthlyIncome)}) • 50/50 HDFC Auto-Split
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSalaryModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-black bg-cyan-500 hover:bg-cyan-600 text-white shadow-xs transition-colors shrink-0 flex items-center space-x-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure</span>
          </button>
        </div>

        <div className="p-2.5 sm:p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between gap-1.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap overflow-hidden">
          <div className="flex items-center space-x-1.5 min-w-0 truncate">
            <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="truncate">SBI: {formatCurrency(summary.sbiSplitAmount || 40000)} • HDFC: {formatCurrency(summary.hdfcSplitAmount || 40000)}</span>
          </div>
          <span className="font-mono text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-black shrink-0 whitespace-nowrap">
            {100 - (salarySplitPercent || 50)}/{salarySplitPercent || 50} Split
          </span>
        </div>
      </div>

      {/* Auto-Sweeper Zero-Idle Surplus Investment Engine Section */}
      <div className="app-card p-5 shadow-xs space-y-3 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate">
                Auto-Sweeper Zero-Idle Wealth Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Sweeps unspent liquid surplus into 7.2% Yield Mutual Funds / Sweep FD
              </p>
            </div>
          </div>

          <button
            onClick={() => runAutoSweepEngine(40000)}
            className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-transform hover:scale-105 active:scale-95 shrink-0 flex items-center space-x-1"
          >
            <span>Run Sweep</span>
          </button>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs font-semibold">
          <span className="text-amber-800 dark:text-amber-300 font-extrabold">Safe Reserve Threshold: ₹40,000</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black">⚡ 7.2% Yield</span>
        </div>
      </div>

      {/* Category Spending Limits Section */}
      <div className="app-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Category Spending Limits
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure monthly caps per category and over-budget warnings
              </p>
            </div>
          </div>

          {onOpenBudgetModal && (
            <button
              onClick={onOpenBudgetModal}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-600 dark:bg-orange-500 dark:hover:bg-orange-400 text-white shadow-xs transition-colors shrink-0"
            >
              Configure
            </button>
          )}
        </div>
      </div>

      {/* Cloud Sync (Multi-Device) Section */}
      <div className="app-card p-5 shadow-xs space-y-3">

        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Real-Time Multi-Device Cloud Sync
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sync bills live across your iPhone, iPad, Mac, and PC
            </p>
          </div>
        </div>

        {syncMessage && (
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            {syncMessage}
          </div>
        )}

        {isCloudSyncActive ? (
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Cloud Sync Active</span>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60">
                Key: {cloudSyncCode}
              </span>
            </div>

            <button
              onClick={() => {
                disableCloudSync();
                setSyncMessage('Cloud Sync disconnected. Reverted to LocalStorage mode.');
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center space-x-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <WifiOff className="w-4 h-4" />
              <span>Disconnect Cloud Sync</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleEnableSync} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Enter a Private Sync Key
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. pradeep-bills-2026"
                  value={syncKeyInput}
                  onChange={e => setSyncKeyInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Enter the exact same Sync Key on your other devices to link them together!
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Enable Real-Time Cloud Sync</span>
            </button>
          </form>
        )}
      </div>

      {/* PWA Install Section */}
      <div className="app-card p-5 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-orange-950/40 text-emerald-600 dark:text-orange-500">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Install PWA App
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add to iPhone or mobile Home Screen for native experience
            </p>
          </div>
        </div>

        {isInstalled ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center space-x-3 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <Check className="w-5 h-5 shrink-0" />
            <span>App is installed and running in Standalone Mode!</span>
          </div>
        ) : (
          <div className="space-y-3">
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-500 dark:bg-orange-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Install Monthly Payment Tracker</span>
              </button>
            )}

            {/* iOS Instructions */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  How to Install on iPhone (Safari)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  iOS Guide
                </span>
              </div>
              <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside font-medium">
                <li className="leading-relaxed">
                  Open this app in <strong>Safari</strong> on your iPhone.
                </li>
                <li className="leading-relaxed">
                  Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-blue-500" /> <strong>Share</strong> icon in Safari's bottom toolbar.
                </li>
                <li className="leading-relaxed">
                  Scroll down and tap <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-slate-700 dark:text-slate-300" /> <strong>Add to Home Screen</strong>.
                </li>
                <li className="leading-relaxed">
                  Tap <strong>Add</strong> in the top-right corner. Launch directly from your home screen!
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="app-card p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Data Management & PWA Cache
        </h3>

        {importMessage && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold ${
              importMessage.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
            }`}
          >
            {importMessage.text}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* Export */}
          <button
            onClick={handleExport}
            className="py-3 px-4 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-orange-500" />
            <span>Export JSON</span>
          </button>

          {/* Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-3 px-4 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Upload className="w-4 h-4 text-emerald-600 dark:text-orange-500" />
            <span>Import JSON</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* Force Update PWA */}
        <button
          onClick={handleForceRefresh}
          className="w-full py-3 px-4 rounded-2xl bg-emerald-50 dark:bg-orange-950/40 border border-emerald-200 dark:border-orange-800/40 text-emerald-700 dark:text-orange-400 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-emerald-100 dark:hover:bg-orange-900/50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Force Refresh & Update Latest App Version</span>
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="w-full py-3 px-4 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Default September 2026 Data</span>
        </button>
      </div>

      {/* Privacy Notice Card */}
      <div className="p-4 rounded-3xl bg-emerald-50/70 dark:bg-orange-950/20 border border-emerald-200/60 dark:border-orange-900/30 flex items-start space-x-3 text-slate-700 dark:text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-orange-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-slate-900 dark:text-slate-100">
            100% Offline & Hybrid Cloud Sync
          </h4>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Your payments are saved locally on your device and encrypted. Enabling Cloud Sync links your payment records securely across all your devices using your private Sync Key.
          </p>
        </div>
      </div>

      {/* Salary Settings Modal */}
      <SalarySettingsModal
        isOpen={isSalaryModalOpen}
        onClose={() => setIsSalaryModalOpen(false)}
      />
    </div>
  );
};
