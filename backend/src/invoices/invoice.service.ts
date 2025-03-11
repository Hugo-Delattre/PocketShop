import { Injectable } from '@nestjs/common';
import { createInvoice, type TInvoice } from './createInvoice';

@Injectable()
export class InvoiceService {
  constructor() {}

  generateInvoicePdf(invoiceData: TInvoice): Promise<Buffer> {
    return createInvoice(invoiceData);
  }
}
