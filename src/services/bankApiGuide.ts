/**
 * Bank API Production Integration Service & Architecture Guide
 * 
 * In production environments, client-side web apps connect to banks using:
 * 1. Setu Account Aggregator (AA) API (RBI Licensed in India)
 * 2. Plaid API (US / UK / EU / Global)
 */

export interface SetuConsentParams {
  phoneNumber: string;
  bankId: string;
  redirectUrl: string;
}

export interface BankApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Sample Backend Service Template for Setu Account Aggregator Integration
 */
export const SETU_AA_BACKEND_CODE_SAMPLE = `
// Node.js Express Backend Route for Setu Account Aggregator (AA) API
import express from 'express';
import axios from 'axios';

const router = express.Router();
const SETU_CLIENT_ID = process.env.SETU_CLIENT_ID;
const SETU_SECRET = process.env.SETU_CLIENT_SECRET;
const SETU_BASE_URL = 'https://fiu-sandbox.setu.co/api';

// 1. Create Consent Request
router.post('/api/bank/create-consent', async (req, res) => {
  try {
    const { phoneNumber, bankName } = req.body;
    
    // Call Setu AA Consent Endpoint
    const response = await axios.post(\`\${SETU_BASE_URL}/consents\`, {
      detail: {
        consentStart: new Date().toISOString(),
        consentExpiry: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
        Customer: { id: \`\${phoneNumber}@setu\` },
        FIDataRange: {
          from: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
          to: new Date().toISOString()
        },
        ConsentMode: "STORE",
        fetchType: "PERIODIC",
        Frequency: { unit: "DAY", value: 1 },
        DataConsumer: { id: "monthly-bill-pay-fiu" },
        FITypes: ["DEPOSIT"]
      }
    }, {
      headers: {
        'x-client-id': SETU_CLIENT_ID,
        'x-client-secret': SETU_SECRET
      }
    });

    res.json({ success: true, consentId: response.data.id, redirectUrl: response.data.url });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Fetch Financial Data (Balance & Transactions) after consent approval
router.get('/api/bank/fetch-data/:consentId', async (req, res) => {
  try {
    const { consentId } = req.params;
    const response = await axios.get(\`\${SETU_BASE_URL}/fi/fetch/\${consentId}\`, {
      headers: {
        'x-client-id': SETU_CLIENT_ID,
        'x-client-secret': SETU_SECRET
      }
    });

    // Parsed accounts, live balances, and transaction statements
    const accounts = response.data.payload.map(acc => ({
      accountNumber: acc.maskedAccNo,
      balance: acc.summary.currentBalance,
      transactions: acc.transactions.list
    }));

    res.json({ success: true, accounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
`;

/**
 * Reference configuration for production deployment
 */
export const BANK_API_DOCS = {
  setuUrl: 'https://docs.setu.co/data/account-aggregator/overview',
  plaidUrl: 'https://plaid.com/docs/api/products/balance/',
  rbiAaGuide: 'https://sahamati.org.in/'
};
