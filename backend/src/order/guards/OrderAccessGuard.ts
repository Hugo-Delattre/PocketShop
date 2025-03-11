import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from '../order.service';
import { UserRole } from '../../user/entities/user.entity';
import { FindManyOptions } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderAccessGuard implements CanActivate {
  constructor(private orderService: OrderService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      throw new UnauthorizedException(
        'You are not authorized to access this route',
      );
    }

    if (request.params.id) {
      const orderId = request.params.id;
      const order = await this.orderService.findOne(orderId, {
        relations: ['user'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (user.role === UserRole.ADMIN || order.user.id === user.userId) {
        return true;
      }

      return false;
    } else {
      let orderFilter: FindManyOptions<Order>['where'] = undefined;

      if (user.role === UserRole.ADMIN) {
        orderFilter = undefined;
      } else {
        orderFilter = { user: { id: user.userId } };
      }
      request.orderFilter = orderFilter;

      return true;
    }
  }
}
