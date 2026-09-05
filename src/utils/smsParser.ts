import type { CategoryType } from '../types';

export interface ParsedSmsResult {
  success: boolean;
  bankName: string;
  accountEnding?: string;
  type: 'debit' | 'credit';
  amount: number;
  newBalance?: number;
  merchantOrVendor?: string;
  category: CategoryType;
  date: string;
  referenceNo?: string;
  rawSms: string;
}

/**
 * Utility to guess category from transaction vendor or notes
 */
const categorizeMerchant = (text: string): CategoryType => {
  const lower = text.toLowerCase();
  if (lower.includes('electricity') || lower.includes('bescom') || lower.includes('tata power') || lower.includes('gas') || lower.includes('water')) {
    return 'utilities';
  }
  if (lower.includes('wifi') || lower.includes('broadband') || lower.includes('act fiber') || lower.includes('jio') || lower.includes('airtel')) {
    return 'internet';
  }
  if (lower.includes('rent') || lower.includes('society') || lower.includes('maintenance')) {
    return 'housing';
  }
  if (lower.includes('sip') || lower.includes('mutual fund') || lower.includes('zerodha') || lower.includes('groww') || lower.includes('nps')) {
    return 'investment';
  }
  if (lower.includes('zomato') || lower.includes('swiggy') || lower.includes('supermarket') || lower.includes('grocery') || lower.includes('food')) {
    return 'food';
  }
  if (lower.includes('amazon') || lower.includes('flipkart') || lower.includes('myntra') || lower.includes('shopping')) {
    return 'shopping';
  }
  if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('prime') || lower.includes('movie') || lower.includes('pvr')) {
    return 'entertainment';
  }
  if (lower.includes('policy') || lower.includes('lic') || lower.includes('hdfc ergo') || lower.includes('insurance')) {
    return 'insurance';
  }
  if (lower.includes('salary') || lower.includes('payroll') || lower.includes('stipend')) {
    return 'savings';
  }
  return 'expense';
};

/**
 * Parses bank transaction SMS strings
 */
export const parseBankSms = (smsText: string): ParsedSmsResult => {
  const cleanSms = smsText.trim();

  // Detect Type (Debit or Credit)
  const isCredit = /credited|received|deposited|salary/i.test(cleanSms);
  const type: 'debit' | 'credit' = isCredit ? 'credit' : 'debit';

  // Extract Bank Name
  let bankName = 'Bank Account';
  if (/sbi|state bank/i.test(cleanSms)) bankName = 'SBI Bank';
  else if (/hdfc/i.test(cleanSms)) bankName = 'HDFC Bank';
  else if (/icici/i.test(cleanSms)) bankName = 'ICICI Bank';
  else if (/axis/i.test(cleanSms)) bankName = 'Axis Bank';
  else if (/kotak/i.test(cleanSms)) bankName = 'Kotak Bank';
  else if (/paytm/i.test(cleanSms)) bankName = 'Paytm UPI';

  // Extract Account Ending numbers (e.g. A/C XX4321 or A/C 9012 or ending 4321)
  let accountEnding: string | undefined = undefined;
  const accMatch = cleanSms.match(/(?:a\/c|account|acct|ending|card|\*{2,})[\s\:\*\-]*([0-9]{3,4})/i);
  if (accMatch) {
    accountEnding = accMatch[1];
  }

  // Extract Amount (e.g. Rs 4,500.00, INR 1299, Rs.350, ₹ 2,500)
  let amount = 0;
  const amountMatch = cleanSms.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i) || 
                      cleanSms.match(/(?:debited|credited|paid)\s*(?:by|of)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (amountMatch) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // Extract Available Balance (e.g. Avail Bal: Rs 42,500.00 or Bal: INR 53,200)
  let newBalance: number | undefined = undefined;
  const balMatch = cleanSms.match(/(?:avail(?:able)?\s*bal(?:ance)?|bal(?:ance)?|clr\s*bal)[\s\:\=]*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (balMatch) {
    newBalance = parseFloat(balMatch[1].replace(/,/g, ''));
  }

  // Extract Merchant or Vendor / Purpose (e.g. towards Electricity Bill or to Zomato or for Netflix)
  let merchantOrVendor: string | undefined = undefined;
  const vendorMatch = cleanSms.match(/(?:towards|for|to|at|vpa|info|vendor)\s+([A-Za-z0-9\s&\.\-\@]+?)(?=\.|\,|\s+(?:avail|bal|ref|on|dt|date)|$)/i);
  if (vendorMatch) {
    merchantOrVendor = vendorMatch[1].trim();
  }

  // Extract Reference Number (e.g. Ref 619284 or UPI Ref: 12345678)
  let referenceNo: string | undefined = undefined;
  const refMatch = cleanSms.match(/(?:ref|rrn|txn\s*id|upi\s*ref)[\s\:\#]*([A-Za-z0-9]+)/i);
  if (refMatch) {
    referenceNo = refMatch[1];
  }

  const category = categorizeMerchant(merchantOrVendor || cleanSms);

  const success = amount > 0;

  return {
    success,
    bankName,
    accountEnding,
    type,
    amount,
    newBalance,
    merchantOrVendor: merchantOrVendor || (isCredit ? 'Salary / Income' : 'Bank Expense'),
    category,
    date: new Date().toISOString(),
    referenceNo,
    rawSms: cleanSms
  };
};

/**
 * Samples of Bank SMS for Quick One-Click Testing in UI
 */
export const SAMPLE_BANK_SMS_LIST = [
  {
    label: 'SBI Electricity Bill Debit (₹3,850)',
    sms: 'Rs. 3,850.00 debited from SBI A/c XX4321 on 05-Sep-26 towards Electricity Bescom Bill. Avail Bal: Rs 41,150.00. Ref 984021.'
  },
  {
    label: 'HDFC Wifi & Internet Debit (₹1,499)',
    sms: 'Dear HDFC User, A/C ending 9012 debited by INR 1,499.00 for Airtel Fiber Broadband. Bal: INR 53,501.00. Txn ID: 772184.'
  },
  {
    label: 'SBI Mutual Fund SIP Debit (₹5,000)',
    sms: 'Alert: Rs 5,000.00 debited from SBI A/c XX4321 towards Nifty 50 Mutual Fund SIP. Clr Bal: Rs 36,150.00.'
  },
  {
    label: 'HDFC Monthly Salary Credit (₹80,000)',
    sms: 'Credited Rs 80,000.00 to HDFC Bank A/C 9012 on 01-Sep-26 towards Monthly Payroll Salary. Avail Bal: Rs 1,33,501.00.'
  }
];
