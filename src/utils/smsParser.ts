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
  if (/electricity|bescom|tata power|tneb|mseb|cesc|gas|water|torrent/i.test(lower)) {
    return 'utilities';
  }
  if (/wifi|broadband|act fiber|jio|airtel|vi |vodafone|bsnl/i.test(lower)) {
    return 'internet';
  }
  if (/rent|society|maintenance|landlord|housing/i.test(lower)) {
    return 'housing';
  }
  if (/sip|mutual fund|zerodha|groww|nps|indmoney|coin|upstox|ppf/i.test(lower)) {
    return 'investment';
  }
  if (/zomato|swiggy|supermarket|grocery|food|restaurant|blinkit|zepto|instamart|starbucks/i.test(lower)) {
    return 'food';
  }
  if (/amazon|flipkart|myntra|shopping|meesho|nykaa|ajio|tata cliq/i.test(lower)) {
    return 'shopping';
  }
  if (/netflix|spotify|prime|movie|pvr|inox|youtube|bookmyshow|apple/i.test(lower)) {
    return 'entertainment';
  }
  if (/policy|lic|hdfc ergo|insurance|star health|care insurance|acko/i.test(lower)) {
    return 'insurance';
  }
  if (/salary|payroll|stipend|credit|dividend|cashback|refund/i.test(lower)) {
    return 'savings';
  }
  return 'expense';
};

/**
 * Parses bank transaction SMS strings
 */
export const parseBankSms = (smsText: string): ParsedSmsResult => {
  const cleanSms = smsText.trim();
  if (!cleanSms) {
    return {
      success: false,
      bankName: 'Bank Account',
      type: 'debit',
      amount: 0,
      category: 'expense',
      date: new Date().toISOString(),
      rawSms: ''
    };
  }

  // Detect Type (Debit or Credit)
  const isCredit = /credited|received|deposited|salary|cashback|refund|added|recvd/i.test(cleanSms);
  const type: 'debit' | 'credit' = isCredit ? 'credit' : 'debit';

  // Extract Bank Name
  let bankName = 'Bank Account';
  if (/sbi|state bank/i.test(cleanSms)) bankName = 'SBI Bank';
  else if (/hdfc/i.test(cleanSms)) bankName = 'HDFC Bank';
  else if (/icici/i.test(cleanSms)) bankName = 'ICICI Bank';
  else if (/axis/i.test(cleanSms)) bankName = 'Axis Bank';
  else if (/kotak/i.test(cleanSms)) bankName = 'Kotak Bank';
  else if (/pnb|punjab national/i.test(cleanSms)) bankName = 'PNB Bank';
  else if (/bob|bank of baroda/i.test(cleanSms)) bankName = 'Bank of Baroda';
  else if (/canara/i.test(cleanSms)) bankName = 'Canara Bank';
  else if (/union bank/i.test(cleanSms)) bankName = 'Union Bank';
  else if (/idfc/i.test(cleanSms)) bankName = 'IDFC First Bank';
  else if (/indusind/i.test(cleanSms)) bankName = 'IndusInd Bank';
  else if (/federal/i.test(cleanSms)) bankName = 'Federal Bank';
  else if (/yes bank/i.test(cleanSms)) bankName = 'Yes Bank';
  else if (/paytm/i.test(cleanSms)) bankName = 'Paytm UPI';
  else if (/phonepe/i.test(cleanSms)) bankName = 'PhonePe UPI';
  else if (/gpay|google pay/i.test(cleanSms)) bankName = 'Google Pay';
  else if (/cred/i.test(cleanSms)) bankName = 'CRED';
  else if (/jupiter/i.test(cleanSms)) bankName = 'Jupiter Bank';
  else if (/fi money|fi bank/i.test(cleanSms)) bankName = 'Fi Money';

  // Extract Account Ending numbers (e.g. A/C XX4321, A/C 9012, Card ending 5678, XXXXXX4321)
  let accountEnding: string | undefined = undefined;
  const accMatch = cleanSms.match(/(?:a\/c|account|acct|card|ending)[\s\:\*\-\.a-z0-9]*?([0-9]{4})/i) ||
                  cleanSms.match(/(?:x+|\*+)([0-9]{3,4})/i);
  if (accMatch) {
    accountEnding = accMatch[1];
  }

  // Extract Amount (e.g. Rs 4,500.00, INR 1299, Rs.350, ₹ 2,500, debited by 500)
  let amount = 0;
  const amountMatch = cleanSms.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i) || 
                      cleanSms.match(/(?:debited|credited|paid|spent|received|transferred|withdrawn)\s*(?:by|of)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (amountMatch) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // Extract Available Balance
  let newBalance: number | undefined = undefined;
  const balMatch = cleanSms.match(/(?:avail(?:able)?\s*(?:bal(?:ance)?|limit)|bal(?:ance)?|clr\s*bal|net\s*bal|total\s*bal)[\s\:\=]*(?:is)?\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (balMatch) {
    newBalance = parseFloat(balMatch[1].replace(/,/g, ''));
  }

  // Extract Merchant or Vendor / Purpose
  let merchantOrVendor: string | undefined = undefined;
  const vendorMatch = cleanSms.match(/(?:towards|for|to|at|vpa|info|vendor|paid to|spent at)\s+([A-Za-z0-9\s&\.\-\@]+?)(?=\.|\,|\s+(?:avail|bal|ref|rrn|on|dt|date|upi)|$)/i);
  if (vendorMatch) {
    let rawVendor = vendorMatch[1].trim();
    if (rawVendor.includes('@')) {
      rawVendor = rawVendor.split('@')[0];
    }
    rawVendor = rawVendor.replace(/^(vpa|info|transfer)\s+/i, '');
    if (rawVendor.length > 2) {
      merchantOrVendor = rawVendor.charAt(0).toUpperCase() + rawVendor.slice(1);
    }
  }

  // Extract Reference Number (e.g. Ref 984021, UPI Ref: 12345678, Txn ID: 772184)
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
    merchantOrVendor: merchantOrVendor || (isCredit ? 'Income / Deposit' : 'Bank Expense'),
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
    label: 'ICICI Zomato Food Debit (₹650)',
    sms: 'Rs 650.00 debited from ICICI Bank A/C XX6543 at Zomato. Avail Bal: Rs 37,350.00. UPI Ref 41029381.'
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

