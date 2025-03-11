import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Response } from 'express';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../user/entities/user.entity';
import { Roles } from '../auth/roles.decorator';
import { OrderAccessGuard } from './guards/OrderAccessGuard';
import { FindManyOptions } from 'typeorm';
import { Order } from './entities/order.entity';

@Controller('invoices')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @UseGuards(OrderAccessGuard)
  findAll(@Req() request: Request) {
    //@ts-expect-error ahhrr typescript
    const orderFilter = request.orderFilter as FindManyOptions<Order>['where'];
    return this.orderService.findAll({ where: orderFilter });
  }
  @Get('/paid')
  @UseGuards(OrderAccessGuard)
  findAllPaid(@Req() request: Request) {
    //@ts-expect-error ahhrr typescript
    const orderFilter = request.orderFilter as FindManyOptions<Order>['where'];
    return this.orderService.findAll({
      where: { ...orderFilter, is_paid: true },
    });
  }

  @Get(':id')
  @UseGuards(OrderAccessGuard)
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':userId')
  findAllByUser(@Query('userId') userId: number) {
    return this.orderService.findAllbyUser(userId);
  }

  @Post(':id/paypal')
  async createPaypalOrder(@Param('id') id: number) {
    return this.orderService.createPaypalOrder(id);
  }

  @Post(':id/paypal/capture')
  async capturePaypalOrder(@Param('id') id: number) {
    return this.orderService.capturePaypalOrder(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orderService.remove(id);
  }

  @Post('generate/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RolesGuard, OrderAccessGuard)
  async generateInvoice(@Param('id') id: number, @Res() res: Response) {
    return this.orderService.generateInvoice(id, res);
  }
}
