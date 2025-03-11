import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { PaypalService } from '../paypal/paypal.service';
import { CreatePaypalOrderDTO } from '../order/dto/create-paypal-order.dto';
import { Response } from 'express';
import { ProductService } from '../product/product.service';
import { InvoiceService } from '../invoices/invoice.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paypalService: PaypalService,
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  async createPaypalOrder(orderId: number): Promise<CreatePaypalOrderDTO> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    if (!order.total_price || order.total_price <= 0) {
      throw new HttpException(
        'Order total price must be greater than 0',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const paypalOrder = await this.paypalService.createPaypalOrder(
        order.total_price,
      );
      //console.log('paypalOrder', paypalOrder);

      order.paypal_order_id = paypalOrder.id;
      order.paypal_status = paypalOrder.status;
      this.orderRepository.save(order);
      return {
        paypalUrl: paypalOrder.links.find((link) => link.rel === 'approve')
          ?.href,
        orderId: order.id,
        status: paypalOrder.status,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create PayPal order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async capturePaypalOrder(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (!order.paypal_order_id) {
      throw new HttpException(
        'PayPal order not initialized',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const captureData = await this.paypalService.capturePaypalOrder(
        order.paypal_order_id,
      );

      order.paypal_status = captureData.status;
      order.is_paid = captureData.status === 'COMPLETED';
      order.payment_date = new Date();

      return this.orderRepository.save(order);
    } catch (error) {
      throw new HttpException(
        `Failed to capture PayPal payment: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(options?: FindManyOptions<Order>): Promise<Order[]> {
    return this.orderRepository.find(options);
  }
  async findAllbyUser(id: number): Promise<Order[]> {
    return this.orderRepository.findBy({ user: { id: id }, is_paid: true });
  }

  async findOne(
    id: number,
    options: FindOneOptions<Order> = {},
  ): Promise<Order | undefined> {
    const order = await this.orderRepository.findOne({
      where: { id },
      ...options,
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order | undefined> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.orderRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async getAverageTimeSpentBeforePay(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await this.orderRepository.find({
      where: { creation_date: Between(startOfDay, endOfDay), is_paid: true },
      relations: ['orderlines'],
    });

    if (orders.length === 0) {
      return 0;
    }
    const total = orders.reduce((acc, order) => {
      const timeSpent =
        order.payment_date.getTime() - order.creation_date.getTime();
      return acc + timeSpent;
    }, 0);

    return total / orders.length;
  }

  async generateInvoice(orderId: number, res: Response) {
    try {
      const order = await this.findOne(orderId, {
        relations: ['orderlines', 'orderlines.product', 'user', 'billing'],
      });

      if (!order.is_paid) {
        res
          .status(HttpStatus.EXPECTATION_FAILED)
          .send("The order is not paid, can't generate an invoice");
      }

      const getProducts = order.orderlines.map(async (orderline) => {
        const productData = await this.productService.findOne(
          orderline.product.open_food_fact_id,
        );

        return {
          ...orderline,
          productData,
        };
      });
      const orderlines = await Promise.all(getProducts);

      const invoiceData = {
        billing: {
          name: `${order.user.first_name} ${order.user.last_name}`,
          address: order.billing.address,
          city: order.billing.city,
          country: order.billing.country,
          postal_code: order.billing.zip_code,
        },
        invoiceNumber: order.id,
        totalPaid: Number(order.total_price),
        products: orderlines.map((orderLine) => ({
          // @ts-expect-error the type is not correct...
          name: orderLine.productData.product.product_name,
          quantity: Number(orderLine.quantity),
          price_at_order: Number(orderLine.price_at_order),
        })),
      };
      // console.log('invoice data ', invoiceData);

      const pdfBuffer =
        await this.invoiceService.generateInvoicePdf(invoiceData);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=facture-${invoiceData.invoiceNumber}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      res.send({
        buffer: pdfBuffer,
        filename: `Invoice-${invoiceData.invoiceNumber}.pdf`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error while generating the invoice',
        error: error.message,
      });
    }
  }
}
