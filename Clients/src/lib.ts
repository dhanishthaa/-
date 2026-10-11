export type InvoiceLine = {
  productId: string;
  name: string;
  mrpPaise: number | null;
  pricePaise: number;
  quantity: number;
};

export const rupees = (paise: number | null | undefined) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format((paise ?? 0) / 100);

export const parseRupeesToPaise = (value: string): number | null => {
  if (!/^\d{1,9}(?:\.\d{0,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ''] = value.trim().split('.');
  const parsed = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(parsed) ? parsed : null;
};

const underTwenty = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function wordsBelowThousand(n: number): string {
  const out: string[] = [];
  if (n >= 100) { out.push(`${underTwenty[Math.floor(n / 100)]} hundred`); n %= 100; }
  if (n >= 20) { out.push(tens[Math.floor(n / 10)]); n %= 10; }
  if (n > 0) out.push(underTwenty[n]);
  return out.join(' ');
}
export function amountInWords(paise: number): string {
  const rupeeValue = Math.floor(paise / 100);
  if (!Number.isSafeInteger(rupeeValue) || rupeeValue < 0) return '';
  if (rupeeValue === 0) return 'Rupees Zero Only';
  let n = rupeeValue;
  const groups: string[] = [];
  const crore = Math.floor(n / 10_000_000); n %= 10_000_000;
  const lakh = Math.floor(n / 100_000); n %= 100_000;
  const thousand = Math.floor(n / 1_000); n %= 1_000;
  if (crore) groups.push(`${wordsBelowThousand(crore)} crore`);
  if (lakh) groups.push(`${wordsBelowThousand(lakh)} lakh`);
  if (thousand) groups.push(`${wordsBelowThousand(thousand)} thousand`);
  if (n) groups.push(wordsBelowThousand(n));
  const paiseRemainder = paise % 100;
  return `Rupees ${groups.join(' ')}${paiseRemainder ? ` and ${wordsBelowThousand(paiseRemainder)} paise` : ''} only`;
}

export function safeFilename(name: string) {
  return `INVOICE - ${name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-').trim() || 'Customer'}.pdf`;
}

export function formatInvoiceDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return '';
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
}

export function buildUpiUri(upiId: string, payee: string, totalPaise: number, note: string) {
  const params = new URLSearchParams({ pa: upiId, pn: payee, am: (totalPaise / 100).toFixed(2), cu: 'INR', tn: note.slice(0, 80) });
  return `upi://pay?${params.toString()}`;
}

export function normalizeWhatsAppPhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed.startsWith('+')) return null;
  const digits = trimmed.slice(1).replace(/[\s().-]/g, '');
  return /^\d{8,15}$/.test(digits) ? digits : null;
}
