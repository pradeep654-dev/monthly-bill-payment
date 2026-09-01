import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import type { PaymentItem, PaymentTemplate, MonthSummary, ThemeMode, ActiveTab } from '../types';
import { INITIAL_MONTH, DEFAULT_TEMPLATES, INITIAL_PAYMENTS_SEPT_2026 } from '../data/initialData';
import { getMonthName, getNextMonthKey, getPrevMonthKey } from '../utils/formatters';
import { pushToCloudSync, fetchLatestCloudSync, subscribeToCloudEvents } from '../utils/cloudSync';

interface PaymentContextType {
  currentMonthKey: string;
  setCurrentMonthKey: (monthKey: string) => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  payments: PaymentItem[];
  currentMonthPayments: PaymentItem[];
  summary: MonthSummary;
  allMonthSummaries: MonthSummary[];
  togglePaid: (id: string) => void;
  addPayment: (data: Omit<PaymentItem, 'id' | 'monthKey' | 'isPaid' | 'paidAt'>) => void;
  updatePayment: (id: string, data: Partial<PaymentItem>) => void;
  deletePayment: (id: string) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  resetToDefaultData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;

  // Cloud Sync properties & methods
  cloudSyncCode: string;
  isCloudSyncActive: boolean;
  enableCloudSync: (syncCode: string) => Promise<boolean>;
  disableCloudSync: () => void;
}

const STORAGE_KEY_PAYMENTS = 'paytracker_payments_v1';
const STORAGE_KEY_TEMPLATES = 'paytracker_templates_v1';
const STORAGE_KEY_THEME = 'paytracker_theme_v1';
const STORAGE_KEY_SYNC_CODE = 'paytracker_sync_code_v1';

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(INITIAL_MONTH);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Cloud Sync state
  const [cloudSyncCode, setCloudSyncCode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_SYNC_CODE) || '';
  });
  const [isCloudSyncActive, setIsCloudSyncActive] = useState<boolean>(() => {
    return !!localStorage.getItem(STORAGE_KEY_SYNC_CODE);
  });

  const isRemoteUpdatingRef = useRef(false);

  // Load Theme
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    return 'dark'; // Default Concept 3 Dark Mode
  });

  // Apply Theme class to <html>
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Load Templates
  const [templates, setTemplates] = useState<PaymentTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load templates from localStorage:', e);
    }
    return DEFAULT_TEMPLATES;
  });

  // Load Payments
  const [payments, setPayments] = useState<PaymentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load payments from localStorage:', e);
    }
    return INITIAL_PAYMENTS_SEPT_2026;
  });

  // Save payments and templates to localStorage and Cloud Sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
    if (isCloudSyncActive && cloudSyncCode && !isRemoteUpdatingRef.current) {
      pushToCloudSync(cloudSyncCode, { payments, templates });
    }
  }, [payments, isCloudSyncActive, cloudSyncCode, templates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
  }, [templates]);

  // Real-time Cloud Sync Event Listener
  useEffect(() => {
    if (isCloudSyncActive && cloudSyncCode) {
      // First fetch latest state from cloud
      fetchLatestCloudSync(cloudSyncCode).then(latest => {
        if (latest && latest.payments && latest.payments.length > 0) {
          isRemoteUpdatingRef.current = true;
          setPayments(latest.payments);
          if (latest.templates && latest.templates.length > 0) {
            setTemplates(latest.templates);
          }
          setTimeout(() => {
            isRemoteUpdatingRef.current = false;
          }, 200);
        }
      });

      // Subscribe to live SSE events from other devices
      const unsub = subscribeToCloudEvents(cloudSyncCode, cloudData => {
        if (cloudData.payments && cloudData.payments.length > 0) {
          isRemoteUpdatingRef.current = true;
          setPayments(cloudData.payments);
          if (cloudData.templates && cloudData.templates.length > 0) {
            setTemplates(cloudData.templates);
          }
          setTimeout(() => {
            isRemoteUpdatingRef.current = false;
          }, 200);
        }
      });

      return () => {
        if (unsub) unsub();
      };
    }
  }, [isCloudSyncActive, cloudSyncCode]);

  // Auto-initialize recurring payments for a new month if no payments exist for it
  useEffect(() => {
    const monthHasPayments = payments.some(p => p.monthKey === currentMonthKey);
    if (!monthHasPayments && templates.length > 0) {
      const newMonthPayments: PaymentItem[] = templates
        .filter(t => t.isRecurring)
        .map(t => ({
          id: `pay-${currentMonthKey}-${t.id}-${Date.now()}`,
          templateId: t.id,
          name: t.name,
          amount: t.amount,
          dueDay: t.dueDay,
          category: t.category,
          isRecurring: true,
          isPaid: false,
          paidAt: null,
          monthKey: currentMonthKey,
          notes: t.notes
        }));

      if (newMonthPayments.length > 0) {
        setPayments(prev => [...prev, ...newMonthPayments]);
      }
    }
  }, [currentMonthKey, payments, templates]);

  // Month navigation helpers
  const goToNextMonth = () => {
    setCurrentMonthKey(prev => getNextMonthKey(prev));
  };

  const goToPrevMonth = () => {
    setCurrentMonthKey(prev => getPrevMonthKey(prev));
  };

  // Toggle Paid status
  const togglePaid = (id: string) => {
    setPayments(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextIsPaid = !item.isPaid;
          return {
            ...item,
            isPaid: nextIsPaid,
            paidAt: nextIsPaid ? new Date().toISOString() : null
          };
        }
        return item;
      })
    );
  };

  // Add Payment
  const addPayment = (data: Omit<PaymentItem, 'id' | 'monthKey' | 'isPaid' | 'paidAt'>) => {
    const newId = `pay-${currentMonthKey}-${Date.now()}`;
    const newItem: PaymentItem = {
      ...data,
      id: newId,
      monthKey: currentMonthKey,
      isPaid: false,
      paidAt: null
    };

    if (data.isRecurring) {
      const newTemplate: PaymentTemplate = {
        id: `tmpl-${Date.now()}`,
        name: data.name,
        amount: data.amount,
        dueDay: data.dueDay,
        category: data.category,
        isRecurring: true,
        notes: data.notes
      };
      setTemplates(prev => [...prev, newTemplate]);
      newItem.templateId = newTemplate.id;
    }

    setPayments(prev => [...prev, newItem]);
  };

  // Update Payment
  const updatePayment = (id: string, data: Partial<PaymentItem>) => {
    setPayments(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...data };
          if (item.templateId && data.isRecurring) {
            setTemplates(tmpls =>
              tmpls.map(t =>
                t.id === item.templateId
                  ? {
                      ...t,
                      name: updated.name,
                      amount: updated.amount,
                      dueDay: updated.dueDay,
                      category: updated.category,
                      notes: updated.notes
                    }
                  : t
              )
            );
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Delete Payment
  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(item => item.id !== id));
  };

  // Reset Data
  const resetToDefaultData = () => {
    setPayments(INITIAL_PAYMENTS_SEPT_2026);
    setTemplates(DEFAULT_TEMPLATES);
    setCurrentMonthKey(INITIAL_MONTH);
    localStorage.removeItem(STORAGE_KEY_PAYMENTS);
    localStorage.removeItem(STORAGE_KEY_TEMPLATES);
  };

  // Enable Cloud Sync
  const enableCloudSync = async (syncCode: string): Promise<boolean> => {
    const cleanCode = syncCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanCode) return false;

    setCloudSyncCode(cleanCode);
    setIsCloudSyncActive(true);
    localStorage.setItem(STORAGE_KEY_SYNC_CODE, cleanCode);

    // Initial push to cloud
    await pushToCloudSync(cleanCode, { payments, templates });
    return true;
  };

  // Disable Cloud Sync
  const disableCloudSync = () => {
    setIsCloudSyncActive(false);
    setCloudSyncCode('');
    localStorage.removeItem(STORAGE_KEY_SYNC_CODE);
  };

  // Export Data as JSON
  const exportData = (): string => {
    return JSON.stringify(
      {
        version: 1,
        exportDate: new Date().toISOString(),
        payments,
        templates,
        theme
      },
      null,
      2
    );
  };

  // Import Data from JSON
  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.payments)) {
        setPayments(parsed.payments);
        if (Array.isArray(parsed.templates)) {
          setTemplates(parsed.templates);
        }
        if (parsed.theme) {
          setThemeState(parsed.theme);
        }
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import format:', e);
    }
    return false;
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  // Filter current month payments sorted by due day
  const currentMonthPayments = useMemo(() => {
    return payments
      .filter(p => p.monthKey === currentMonthKey)
      .sort((a, b) => a.dueDay - b.dueDay);
  }, [payments, currentMonthKey]);

  // Current month summary metrics
  const summary: MonthSummary = useMemo(() => {
    const totalAmount = currentMonthPayments.reduce((acc, p) => acc + p.amount, 0);
    const paidAmount = currentMonthPayments
      .filter(p => p.isPaid)
      .reduce((acc, p) => acc + p.amount, 0);
    const pendingAmount = totalAmount - paidAmount;
    const percentagePaid = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
    const paidCount = currentMonthPayments.filter(p => p.isPaid).length;

    return {
      monthKey: currentMonthKey,
      monthName: getMonthName(currentMonthKey),
      totalAmount,
      paidAmount,
      pendingAmount,
      percentagePaid,
      totalCount: currentMonthPayments.length,
      paidCount
    };
  }, [currentMonthPayments, currentMonthKey]);

  // Summaries of all unique months with records
  const allMonthSummaries: MonthSummary[] = useMemo(() => {
    const monthKeys = Array.from(new Set(payments.map(p => p.monthKey))).sort().reverse();
    return monthKeys.map(mKey => {
      const monthItems = payments.filter(p => p.monthKey === mKey);
      const totalAmount = monthItems.reduce((acc, p) => acc + p.amount, 0);
      const paidAmount = monthItems
        .filter(p => p.isPaid)
        .reduce((acc, p) => acc + p.amount, 0);
      const pendingAmount = totalAmount - paidAmount;
      const percentagePaid = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
      const paidCount = monthItems.filter(p => p.isPaid).length;

      return {
        monthKey: mKey,
        monthName: getMonthName(mKey),
        totalAmount,
        paidAmount,
        pendingAmount,
        percentagePaid,
        totalCount: monthItems.length,
        paidCount
      };
    });
  }, [payments]);

  return (
    <PaymentContext.Provider
      value={{
        currentMonthKey,
        setCurrentMonthKey,
        goToNextMonth,
        goToPrevMonth,
        payments,
        currentMonthPayments,
        summary,
        allMonthSummaries,
        togglePaid,
        addPayment,
        updatePayment,
        deletePayment,
        theme,
        setTheme,
        activeTab,
        setActiveTab,
        resetToDefaultData,
        exportData,
        importData,
        cloudSyncCode,
        isCloudSyncActive,
        enableCloudSync,
        disableCloudSync
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayments = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayments must be used within a PaymentProvider');
  }
  return context;
};
