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
  Check 
} from 'lucide-react';
import { usePayments } from '../context/PaymentContext';

export const SettingsView: React.FC = () => {
  const { theme, setTheme, resetToDefaultData, exportData, importData } = usePayments();
  const [importMessage, setImportMessage] = useState<{ text: string; success: boolean } | null>(null);
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

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize theme, backup local data, and install app on your device
        </p>
      </div>

      {/* Theme Section */}
      <div className="bg-white dark:bg-[#161B26] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
          Appearance & Theme
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
              theme === 'light'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-xs'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-600 dark:text-slate-400 hover:border-slate-300'
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
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-600 dark:text-slate-400 hover:border-slate-300'
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
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1117] text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Monitor className="w-5 h-5 mb-1.5" />
            <span className="text-xs">System</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">Auto Match</span>
          </button>
        </div>
      </div>

      {/* PWA Install Section */}
      <div className="bg-white dark:bg-[#161B26] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs">
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
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-100 dark:border-slate-800 space-y-2.5">
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
      <div className="bg-white dark:bg-[#161B26] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Data Backup & Local Storage
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
            100% Offline & Private
          </h4>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Your financial payment details are saved strictly on your local browser device. No servers, paid backends, or cloud tracking.
          </p>
        </div>
      </div>
    </div>
  );
};
