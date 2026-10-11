import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { amountInWords } from './lib';
import type { InvoiceLine } from './lib';

type InvoicePdfDraft = {
  customerType: 'B2B' | 'D2C';
  customerName: string;
  phone: string;
  date: string;
  lines: InvoiceLine[];
};

type InvoicePdfOptions = {
  includePhone: boolean;
  signatureData?: string;
};

const pageTop = {
  customerName: 200.99,
  date: 200.98,
  priceHeading: 289.28,
  serial: [335.37, 369.65, 404.36, 439.08, 473.79, 508.51, 543.22, 577.94, 612.65, 647.36],
  description: [333.85, 370.42, 404.27, 438.86, 472.71, 508.29, 543.01, 577.72, 612.44, 647.15],
  mrp: [335.15, 370.50, 405.85, 438.43, 473.70, 508.97, 544.23, 579.50, 614.77],
  unitPrice: [335.15, 371.89, 403.72, 438.43, 472.71, 508.81, 542.14, 577.29, 613.82, 645.53],
  subtotal: [334.62, 371.81, 405.02, 437.05, 471.99, 508.21, 542.93, 576.36, 613.53, 646.22],
  total: 698.36,
  words: 726.96,
  signature: 764.98,
} as const;

const leftText = rgb(0, 0, 0);
const headerText = rgb(48 / 255, 32 / 255, 10 / 255);
const indianInteger = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

function formatTemplateMoney(paise: number, forcePaise = false) {
  const whole = Math.floor(paise / 100);
  const fraction = paise % 100;
  const amount = indianInteger.format(whole);
  return fraction || forcePaise ? `${amount}.${String(fraction).padStart(2, '0')}` : amount;
}

function formatTemplateDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, 1)));
  return `${monthName.toUpperCase()} ${String(day).padStart(2, '0')}, ${year}`;
}

function wrapText(text: string, font: Awaited<ReturnType<PDFDocument['embedFont']>>, size: number, maxWidth: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && font.widthOfTextAtSize(next, size) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function rightAlignedX(text: string, right: number, font: Awaited<ReturnType<PDFDocument['embedFont']>>, size: number) {
  return right - font.widthOfTextAtSize(text, size);
}

export async function makeInvoicePdf(draft: InvoicePdfDraft, options: InvoicePdfOptions): Promise<Blob> {
  const base = import.meta.env.BASE_URL;
  const [templateResponse, lightResponse, regularResponse, boldResponse] = await Promise.all([
    fetch(`${base}assets/invoice-base-template.pdf`),
    fetch(`${base}assets/fonts/poppins-light.woff`),
    fetch(`${base}assets/fonts/poppins-regular.woff`),
    fetch(`${base}assets/fonts/poppins-bold.woff`),
  ]);
  if (![templateResponse, lightResponse, regularResponse, boldResponse].every(response => response.ok)) {
    throw new Error('The invoice template or its matching fonts could not be loaded.');
  }

  const pdf = await PDFDocument.load(await templateResponse.arrayBuffer());
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`Invoice - ${draft.customerName.trim()}`);
  pdf.setSubject(`Invoice dated ${formatTemplateDate(draft.date)}`);
  pdf.setAuthor('Isth Fragrances');
  pdf.setCreator('Isth Invoice Studio');
  pdf.setProducer('Isth Invoice Studio');
  const [light, regular, bold] = await Promise.all([
    pdf.embedFont(await lightResponse.arrayBuffer(), { subset: true }),
    pdf.embedFont(await regularResponse.arrayBuffer(), { subset: true }),
    pdf.embedFont(await boldResponse.arrayBuffer(), { subset: true }),
  ]);
  const page = pdf.getPage(0);
  const height = page.getHeight();
  const draw = (text: string, x: number, topBaseline: number, font: typeof light, size: number, color = leftText) => {
    page.drawText(text, { x, y: height - topBaseline, font, size, color });
  };

  const name = draft.customerName.trim();
  let nameSize = 10.98;
  while (light.widthOfTextAtSize(name, nameSize) > 235 && nameSize > 8) nameSize -= 0.25;
  draw(name, 47.19, pageTop.customerName, light, nameSize, headerText);
  draw(`DATE : ${formatTemplateDate(draft.date)}`, 396.99, pageTop.date, light, 10.98, headerText);

  if (options.includePhone && draft.phone.trim()) {
    draw(draft.phone.trim(), 47.19, 219.5, light, 8.5, headerText);
  }

  draw(draft.customerType === 'B2B' ? 'B2B PRICE' : 'D2C PRICE', 331.04, pageTop.priceHeading, light, 11.75);

  const pageTopHeight = 15.01;
  for (const [index, line] of draft.lines.entries()) {
    if (index >= pageTop.serial.length) throw new Error('The supplied one-page invoice template supports up to 10 line items.');
    const i = index;
    const serial = String(i + 1).padStart(2, '0');
    const serialSize = 11.75;
    draw(serial, 63.65 - regular.widthOfTextAtSize(serial, serialSize) / 2, pageTop.serial[i], regular, serialSize);

    const isComplimentaryBundle = /^complimentary fragrance set of 9 fragrances 36 ml each$/i.test(line.name.trim());
    let descriptions = isComplimentaryBundle
      ? ['Complimentary Fragrance', 'Set of 9 Fragrances 36 ml Each']
      : wrapText(line.name, light, 10.83, 149.5);
    let descriptionSize = 10.83;
    if (descriptions.length > 2) {
      descriptionSize = 8.5;
      descriptions = wrapText(line.name, light, descriptionSize, 149.5);
    }
    for (const [lineIndex, text] of descriptions.slice(0, 2).entries()) {
      draw(text, 95.28, pageTop.description[i] + lineIndex * pageTopHeight, light, descriptionSize);
    }

    if (line.mrpPaise !== null && i < pageTop.mrp.length) {
      draw(`Rs. ${formatTemplateMoney(line.mrpPaise)}`, 244.63, pageTop.mrp[i], light, 10.83);
    }

    const unitPrice = line.pricePaise === 0 ? 'Complimentary' : `Rs. ${formatTemplateMoney(line.pricePaise)} x ${line.quantity}`;
    draw(unitPrice, 331.01, pageTop.unitPrice[i], light, 10.83);

    const subtotal = `Rs. ${formatTemplateMoney(line.pricePaise * line.quantity, line.pricePaise === 0)}`;
    draw(subtotal, rightAlignedX(subtotal, 525.99, light, 10.83), pageTop.subtotal[i], light, 10.83);
  }

  const totalPaise = draft.lines.reduce((sum, line) => sum + line.pricePaise * line.quantity, 0);
  const totalText = `RS. ${formatTemplateMoney(totalPaise, true)}`;
  draw(totalText, rightAlignedX(totalText, 508.58, bold, 10.83), pageTop.total, bold, 10.83);

  const amountWords = amountInWords(totalPaise)
    .replace(/^Rupees\b/i, 'Rupees.')
    .replace(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\s+(one|two|three|four|five|six|seven|eight|nine)\b/gi, '$1-$2')
    .toUpperCase()
    .replace(/\bONLY\.?$/i, 'ONLY.');
  const wordLines = wrapText(amountWords, bold, 10.83, 145.6);
  wordLines.forEach((line, index) => draw(line, 431.45, pageTop.words + index * pageTopHeight, bold, 10.83));

  if (options.signatureData) {
    const signature = await pdf.embedPng(options.signatureData);
    const width = 160.5;
    const signatureHeight = width * signature.height / signature.width;
    page.drawImage(signature, {
      x: 57.52,
      y: height - pageTop.signature - signatureHeight,
      width,
      height: signatureHeight,
    });
  }

  const bytes = await pdf.save();
  return new Blob([bytes], { type: 'application/pdf' });
}
