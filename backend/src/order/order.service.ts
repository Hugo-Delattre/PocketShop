import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { PaypalService } from '../paypal/paypal.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paypalService: PaypalService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  async createPaypalOrder(orderId: number): Promise<Order> {
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
      console.log('paypalOrder', paypalOrder);

      order.paypal_order_id = paypalOrder.id;
      order.paypal_status = paypalOrder.status;
      this.orderRepository.save(order);
      return paypalOrder.links.find((link) => link.rel === 'approve')?.href;
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

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }
  async findAllbyUser(id: number): Promise<Order[]> {
    return this.orderRepository.findBy({ user: { id: id }, is_paid: true });
  }

  async findOne(id: number): Promise<Order | undefined> {
    const order = await this.orderRepository.findOne({ where: { id } });

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
}
