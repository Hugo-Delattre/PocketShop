import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('invoices')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  // @Get()
  // findAll() {
  //   return this.orderService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }
  @Get()
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
}
