import PDFDocument from 'pdfkit';

export type TInvoice = {
  billing: {
    name: string;
    address: string;
    city: string;
    country: string;
    postal_code: string;
  };
  totalPaid: number;
  invoiceNumber: number;
  products: {
    name: string;
    quantity: number;
    price_at_order: number;
  }[];
};
export function createInvoice(invoice: TInvoice): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    // Collecter les chunks de données
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
  });
}

function generateHeader(doc: PDFKit.PDFDocument) {
  doc
    .image('/app/assets/logo.png', 50, 45, { width: 90 })
    .fillColor('#444444')
    .fontSize(20)
    .fontSize(10)
    .text('Trinity Inc.', 200, 50, { align: 'right' })
    .text('16 rue Théodore Blanc', 200, 65, { align: 'right' })
    .text('Bordeaux, Fr, 33000', 200, 80, { align: 'right' })
    .moveDown();
}

function generateCustomerInformation(
  doc: PDFKit.PDFDocument,
  invoice: TInvoice,
) {
  doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  const total = invoice.products.reduce(
    (sum, item) => sum + item.price_at_order * item.quantity,
    0,
  );

  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(String(invoice.invoiceNumber), 150, customerInformationTop)
    .font('Helvetica')
    .text('Invoice Date:', 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text('Balance Paid:', 50, customerInformationTop + 30)
    .text(formatCurrency(total), 150, customerInformationTop + 30)

    .font('Helvetica-Bold')
    .text(invoice.billing.name, 300, customerInformationTop)
    .font('Helvetica')
    .text(invoice.billing.address, 300, customerInformationTop + 15)
    .text(
      invoice.billing.city +
        ', ' +
        invoice.billing.country +
        ', ' +
        invoice.billing.postal_code,
      300,
      customerInformationTop + 30,
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, invoice: TInvoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Product',
    'Unit Cost',
    'Quantity',
    'Line Total',
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  for (i = 0; i < invoice.products.length; i++) {
    const product = invoice.products[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      product.name,
      formatCurrency(product.price_at_order),
      product.quantity,
      formatCurrency(product.price_at_order * product.quantity),
    );

    generateHr(doc, position + 20);
  }

  const paidToDatePosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    paidToDatePosition,
    '',
    'Paid To Date',
    '',
    formatCurrency(invoice.totalPaid),
  );

  const duePosition = paidToDatePosition + 25;
  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    duePosition,
    '',
    'Total Paid TTC',
    '',
    formatCurrency(invoice.totalPaid),
  );
  doc.font('Helvetica');
}

function generateFooter(doc: PDFKit.PDFDocument) {
  doc.fontSize(10).text('Trinity, made in Bordeaux with love', 50, 780, {
    align: 'center',
    width: 500,
  });
}

function generateTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  name: string,
  unitCost: number | string,
  quantity: number | string,
  lineTotal: number | string,
) {
  doc
    .fontSize(10)
    .text(name, 50, y)
    .text(String(unitCost), 280, y, { width: 90, align: 'right' })
    .text(String(quantity), 370, y, { width: 90, align: 'right' })
    .text(String(lineTotal), 0, y, { align: 'right' });
}

function generateHr(doc: PDFKit.PDFDocument, y: number) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(amount: number) {
  return amount.toFixed(2) + '€';
}

function formatDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + '/' + month + '/' + day;
}
