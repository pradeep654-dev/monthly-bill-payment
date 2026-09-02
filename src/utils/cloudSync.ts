import type { PaymentItem, PaymentTemplate } from '../types';

export const pushToCloudSync = async (
  syncCode: string,
  data: { payments: PaymentItem[]; templates: PaymentTemplate[] }
): Promise<boolean> => {
  const cleanCode = syncCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!cleanCode) return false;

  const topicUrl = `https://ntfy.sh/paytracker_sync_${cleanCode}`;
  try {
    const response = await fetch(topicUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updatedAt: new Date().toISOString(),
        payments: data.payments,
        templates: data.templates
      })
    });
    return response.ok;
  } catch (e) {
    console.error('Cloud sync push error:', e);
    return false;
  }
};

export const fetchLatestCloudSync = async (
  syncCode: string
): Promise<{ payments: PaymentItem[]; templates: PaymentTemplate[] } | null> => {
  const cleanCode = syncCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!cleanCode) return null;

  const pollUrl = `https://ntfy.sh/paytracker_sync_${cleanCode}/json?poll=1`;
  try {
    const res = await fetch(pollUrl);
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return null;

    const lastLine = lines[lines.length - 1];
    const parsedObj = JSON.parse(lastLine);
    if (parsedObj.message) {
      const payload = JSON.parse(parsedObj.message);
      if (Array.isArray(payload.payments)) {
        return {
          payments: payload.payments,
          templates: Array.isArray(payload.templates) ? payload.templates : []
        };
      }
    }
  } catch (e) {
    console.error('Cloud sync fetch error:', e);
  }
  return null;
};

export const subscribeToCloudEvents = (
  syncCode: string,
  onData: (data: { payments: PaymentItem[]; templates: PaymentTemplate[] }) => void
): (() => void) | null => {
  const cleanCode = syncCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!cleanCode) return null;

  const sseUrl = `https://ntfy.sh/paytracker_sync_${cleanCode}/sse`;
  let eventSource: EventSource | null = null;

  try {
    eventSource = new EventSource(sseUrl);
    eventSource.onmessage = event => {
      try {
        const parsedObj = JSON.parse(event.data);
        if (parsedObj.message) {
          const payload = JSON.parse(parsedObj.message);
          if (Array.isArray(payload.payments)) {
            onData({
              payments: payload.payments,
              templates: Array.isArray(payload.templates) ? payload.templates : []
            });
          }
        }
      } catch (e) {
        console.error('SSE parse error:', e);
      }
    };

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  } catch (e) {
    console.error('Failed to create EventSource:', e);
    return null;
  }
};
