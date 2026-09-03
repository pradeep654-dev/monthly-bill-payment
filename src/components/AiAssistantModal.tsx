import React, { useState } from 'react';
import { X, Sparkles, Send, IndianRupee } from 'lucide-react';
import { usePayments } from '../context/PaymentContext';
import { processAiPrompt } from '../utils/aiIntentParser';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  badge?: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { payments, summary, paymentMethods, addPayment, togglePaid } = usePayments();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I'm **Payri**, your smart financial assistant. Type any command in natural language and I will execute it automatically for you!\n\nExamples:\n• *"Create a budget plan for my remaining income"*\n• *"Add rent 15000 due on 5th via HDFC"*\n• *"Add SIP savings 5000 with autopay"*\n• *"How much safe free cash do I have?"*`,
      badge: '✨ Payri AI',
      timestamp: 'Just now'
    }
  ]);

  if (!isOpen) return null;

  const suggestedPrompts = [
    'Create budget plan for remaining income',
    'Suggest expense plan for rest amount',
    'Add Rent 15,000 due on 5th',
    'Add SIP 5,000 with Autopay',
    'How much safe free cash do I have?'
  ];

  const handleSend = (textToSend?: string) => {
    const queryText = textToSend || prompt;
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const actionResult = processAiPrompt(queryText, payments, summary, paymentMethods);

    // Execute actions based on AI parser result
    if (actionResult.type === 'add_entry' && actionResult.actionData) {
      const data = actionResult.actionData;
      addPayment({
        name: data.name || 'New Payment',
        amount: data.amount || 1000,
        dueDay: data.dueDay || 5,
        category: data.category || 'expense',
        commitmentType: data.commitmentType || 'commitment',
        paymentMethodId: data.paymentMethodId || paymentMethods[0]?.id || 'pm-1',
        isRecurring: data.isRecurring ?? true,
        isAutopayEnabled: data.isAutopayEnabled ?? false
      });
    } else if (actionResult.type === 'mark_paid' && actionResult.actionData?.targetPaymentId) {
      togglePaid(actionResult.actionData.targetPaymentId);
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: actionResult.replyMessage,
      badge: actionResult.badge,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    if (!textToSend) setPrompt('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 w-full max-w-md shadow-2xl transition-all h-[80vh] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 text-white shadow-md relative">
              <IndianRupee className="w-5 h-5 stroke-[2.8]" />
              <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Payri 🤖✨
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Your Smart Financial Voice & Chat Assistant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Suggestions */}
        <div className="py-2.5 overflow-x-auto flex space-x-1.5 no-scrollbar shrink-0 border-b border-slate-100 dark:border-slate-800/60">
          {suggestedPrompts.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(s)}
              className="px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-[#0D1117] text-slate-700 dark:text-slate-300 text-[11px] font-bold hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 shrink-0 active:scale-95 transition-all"
            >
              💡 {s}
            </button>
          ))}
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 dark:bg-orange-500 text-white rounded-br-none shadow-md font-bold'
                    : 'bg-slate-100 dark:bg-[#0D1117] text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-800'
                }`}
              >
                {msg.badge && (
                  <span className="inline-block px-2 py-0.5 rounded-md bg-white/20 text-emerald-800 dark:text-emerald-300 font-black text-[10px] uppercase mb-1">
                    {msg.badge}
                  </span>
                )}
                <div
                  className="leading-relaxed font-medium"
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
                <span className="block text-[9px] opacity-60 text-right font-medium">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 shrink-0"
        >
          <input
            type="text"
            placeholder="Type command e.g. Add rent 15000 due 5th..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:focus:ring-orange-500/40"
          />
          <button
            type="submit"
            className="p-2.5 rounded-2xl bg-emerald-500 dark:bg-orange-500 text-white shadow-md active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
