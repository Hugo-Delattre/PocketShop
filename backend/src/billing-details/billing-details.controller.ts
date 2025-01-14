import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BillingDetailsService } from './billing-details.service';
import { CreateBillingDetailDto } from './dto/create-billing-detail.dto';
import { UpdateBillingDetailDto } from './dto/update-billing-detail.dto';

@Controller('billing-details')
export class BillingDetailsController {
  constructor(private readonly billingDetailsService: BillingDetailsService) {}

  @Post()
  create(@Body() createBillingDetailDto: CreateBillingDetailDto) {
    return this.billingDetailsService.create(createBillingDetailDto);
  }

  @Get()
  findAll() {
    return this.billingDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBillingDetailDto: UpdateBillingDetailDto,
  ) {
    return this.billingDetailsService.update(+id, updateBillingDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billingDetailsService.remove(+id);
  }
}
