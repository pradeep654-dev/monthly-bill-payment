import type { CategoryType, CommitmentType, PaymentItem, MonthSummary, PaymentMethod } from '../types';
import { formatCurrency } from './formatters';

export interface ParsedAiAction {
  type: 'add_entry' | 'mark_paid' | 'query' | 'unknown';
  replyMessage: string;
  badge?: string;
  actionData?: {
    name?: string;
    amount?: number;
    dueDay?: number;
    category?: CategoryType;
    commitmentType?: CommitmentType;
    paymentMethodId?: string;
    isRecurring?: boolean;
    isAutopayEnabled?: boolean;
    targetPaymentId?: string;
  };
}

export const processAiPrompt = (
  prompt: string,
  payments: PaymentItem[],
  summary: MonthSummary,
  paymentMethods: PaymentMethod[] = []
): ParsedAiAction => {
  const clean = prompt.trim().toLowerCase();

  // 1. QUERY INTENTS
  if (clean.includes('total savings') || clean.includes('how much savings') || clean.includes('savings total')) {
    return {
      type: 'query',
      replyMessage: `Your total monthly savings for ${summary.monthName} is **${formatCurrency(summary.totalSavings)}**.`,
      badge: '📊 Savings Summary'
    };
  }

  if (clean.includes('bank balance') || clean.includes('total balance') || clean.includes('cash in bank')) {
    return {
      type: 'query',
      replyMessage: `Your total liquid bank balance across all linked accounts is **${formatCurrency(summary.totalBankBalance)}**.`,
      badge: '💰 Bank Balance'
    };
  }

  if (clean.includes('free cash') || clean.includes('net cash') || clean.includes('liquidity')) {
    return {
      type: 'query',
      replyMessage: `Your Net Free Cash (after accounting for pending bills) is **${formatCurrency(summary.netFreeLiquidity)}**.`,
      badge: '🛡️ Safe Free Cash'
    };
  }

  if (clean.includes('pending') || clean.includes('due bills') || clean.includes('unpaid')) {
    const pendingItems = payments.filter(p => !p.isPaid);
    if (pendingItems.length === 0) {
      return {
        type: 'query',
        replyMessage: `🎉 Great news! You have **no pending bills** for ${summary.monthName}.`,
        badge: '✅ All Clear'
      };
    }
    const names = pendingItems.map(p => `${p.name} (${formatCurrency(p.amount)})`).join(', ');
    return {
      type: 'query',
      replyMessage: `You have **${pendingItems.length} pending bill(s)** totaling **${formatCurrency(summary.pendingAmount)}**: ${names}.`,
      badge: '⏳ Pending Dues'
    };
  }

  // 2. MARK PAID INTENT
  if (clean.startsWith('pay ') || clean.includes('mark as paid') || clean.includes('paid ') || clean.startsWith('mark paid')) {
    // Find target payment by matching name
    const match = payments.find(p => clean.includes(p.name.toLowerCase()));
    if (match) {
      return {
        type: 'mark_paid',
        replyMessage: `Marked **"${match.name}"** (${formatCurrency(match.amount)}) as **PAID**! Updated your bank balance.`,
        badge: '✅ Marked Paid',
        actionData: {
          targetPaymentId: match.id
        }
      };
    }
  }

  // 3. ADD ENTRY INTENT (Bill or Savings)
  if (clean.startsWith('add ') || clean.includes('create ') || clean.includes('new ')) {
    const isSavings = clean.includes('savings') || clean.includes('sip') || clean.includes('rd') || clean.includes('deposit') || clean.includes('mutual fund') || clean.includes('invest');
    const isUdhar = clean.includes('friend') || clean.includes('udhar') || clean.includes('kirana') || clean.includes('credit');
    const isAutopay = clean.includes('autopay') || clean.includes('auto-debit') || clean.includes('auto pay') || clean.includes('auto debit');

    // Extract Payment Account / Bank Name
    let matchedMethod = paymentMethods.find(m => clean.includes(m.name.toLowerCase()));
    if (!matchedMethod) {
      if (clean.includes('hdfc')) matchedMethod = paymentMethods.find(m => m.name.toLowerCase().includes('hdfc'));
      else if (clean.includes('icici')) matchedMethod = paymentMethods.find(m => m.name.toLowerCase().includes('icici'));
      else if (clean.includes('gpay') || clean.includes('upi') || clean.includes('phonepe')) matchedMethod = paymentMethods.find(m => m.name.toLowerCase().includes('gpay') || m.name.toLowerCase().includes('upi'));
      else if (clean.includes('cash')) matchedMethod = paymentMethods.find(m => m.name.toLowerCase().includes('cash'));
    }
    const chosenMethod = matchedMethod || paymentMethods[0];

    // Extract amount using regex
    const amountMatch = clean.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
    let amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 1000;
    if (isNaN(amount) || amount <= 0) amount = 1000;

    // Extract due day (e.g. "due 5th", "due on 10", "on 15th")
    const dayMatch = clean.match(/(?:due\s*(?:on)?|on|by)?\s*(\d{1,2})(?:st|nd|rd|th)?/i);
    let dueDay = 5;
    if (dayMatch) {
      const parsedDay = parseInt(dayMatch[1], 10);
      if (parsedDay >= 1 && parsedDay <= 31) {
        dueDay = parsedDay;
      }
    }

    // Extract clean name
    let name = prompt.replace(/add|create|new|bill|savings|payment|due|on|by|\d+(?:st|nd|rd|th)?|₹|rs\.?|inr|autopay|auto-debit|from|via|using|bank|hdfc|icici|gpay|upi|cash/gi, '').trim();
    name = name.replace(/\s+/g, ' ');
    if (!name || name.length < 2) {
      name = isSavings ? 'Monthly SIP Savings' : (isUdhar ? 'Shop / Friend Udhar' : 'New Bill Payment');
    }
    // Capitalize name
    name = name.charAt(0).toUpperCase() + name.slice(1);

    const commitmentType: CommitmentType = isSavings ? 'savings' : 'commitment';
    let category: CategoryType = isSavings ? 'investment' : (isUdhar ? 'personal_credit' : 'expense');

    if (clean.includes('rent')) category = 'housing';
    if (clean.includes('electricity') || clean.includes('light')) category = 'utilities';
    if (clean.includes('wifi') || clean.includes('internet') || clean.includes('broadband')) category = 'internet';
    if (clean.includes('card') || clean.includes('loan')) category = 'finance';

    const accountLabel = chosenMethod ? ` from **${chosenMethod.name}**` : '';

    return {
      type: 'add_entry',
      replyMessage: `Successfully added **"${name}"** for **${formatCurrency(amount)}** due on day ${dueDay}${accountLabel}${isSavings ? ' as **Savings (Auto Every Month)**' : ''}${isAutopay ? ' with **⚡ Autopay @ 11:55 PM**' : ''}!`,
      badge: isSavings ? '🏦 Savings Added' : '💳 Bill Added',
      actionData: {
        name,
        amount,
        dueDay,
        category,
        commitmentType,
        paymentMethodId: chosenMethod?.id,
        isRecurring: isSavings ? true : true,
        isAutopayEnabled: isSavings || isAutopay
      }
    };
  }

  // Fallback for general questions or unparsed input
  return {
    type: 'unknown',
    replyMessage: `I've analyzed your prompt! Here is your current status: Bank Balance: **${formatCurrency(summary.totalBankBalance)}**, Monthly Savings: **${formatCurrency(summary.totalSavings)}**, Monthly Commitments: **${formatCurrency(summary.totalExpense)}**. \n\n*Tip: Try prompts like "Add rent 15000 due on 5th" or "Add SIP 5000 with autopay"!*`,
    badge: '💡 AI Assistant'
  };
};
