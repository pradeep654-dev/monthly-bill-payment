import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, Sparkles, X, CheckCircle2 } from 'lucide-react';

/**
 * Utility to unregister stale service workers and hard-reload latest version
 */
export const forceReloadApp = async () => {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
      }
    }
    sessionStorage.clear();
  } catch (err) {
    console.warn('[PWA] Force reload cleanup warning:', err);
  } finally {
    // Bust browser HTTP cache by redirecting with timestamp query param
    const cleanUrl = window.location.origin + window.location.pathname + '?force_update=' + Date.now();
    window.location.replace(cleanUrl);
  }
};

export const PWAUpdatePrompt: React.FC = () => {
  const [offlineToast, setOfflineToast] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, r) {
      if (r) {
        // Check for updates every 10 minutes
        setInterval(() => {
          r.update();
        }, 10 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('[PWA] SW registration error:', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      setOfflineToast(true);
      const timer = setTimeout(() => setOfflineToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady]);

  useEffect(() => {
    // Automatically trigger SW update check when app regains focus or visibility on mobile
    const checkSWUpdate = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg) {
            reg.update();
            if (reg.waiting) {
              setNeedRefresh(true);
            }
          }
        });
      }
    };

    window.addEventListener('focus', checkSWUpdate);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkSWUpdate();
      }
    });

    return () => {
      window.removeEventListener('focus', checkSWUpdate);
    };
  }, [setNeedRefresh]);

  return (
    <>
      {/* Offline Ready Toast */}
      {offlineToast && (
        <div className="fixed top-3 left-3 right-3 z-50 animate-fade-in max-w-md mx-auto pointer-events-none">
          <div className="p-3.5 rounded-2xl bg-emerald-900/90 text-white border border-emerald-400/40 shadow-xl backdrop-blur-md flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">App is ready for 100% offline use!</span>
          </div>
        </div>
      )}

      {/* New Version Update Banner */}
      {needRefresh && (
        <div className="fixed top-3 left-3 right-3 z-50 animate-bounce-in max-w-md mx-auto">
          <div className="p-4 rounded-3xl bg-slate-900/95 text-white border border-emerald-500/50 shadow-2xl backdrop-blur-xl flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shrink-0 animate-pulse">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-white tracking-tight">
                  New Version Available! 🚀
                </h4>
                <p className="text-[11px] font-medium text-slate-300 truncate">
                  Tap Update to switch to the latest build.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-3.5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black transition-all shadow-md active:scale-95 flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Update Now</span>
              </button>
              <button
                onClick={() => setNeedRefresh(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

