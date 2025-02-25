import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderlineService } from './orderline.service';
import { CreateOrderlineDto } from './dto/create-orderline.dto';
import { UpdateOrderlineDto } from './dto/update-orderline.dto';

@Controller('orderlines')
export class OrderlineController {
  constructor(private readonly orderlineService: OrderlineService) {}

  @Post()
  create(@Body() createOrderlineDto: CreateOrderlineDto) {
    return this.orderlineService.create(createOrderlineDto);
  }

  @Get()
  findAll() {
    return this.orderlineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderlineService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOrderlineDto: UpdateOrderlineDto,
  ) {
    return this.orderlineService.update(id, updateOrderlineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orderlineService.remove(id);
  }
}
