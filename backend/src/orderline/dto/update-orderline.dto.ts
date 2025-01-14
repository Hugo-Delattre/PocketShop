import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderlineDto } from './create-orderline.dto';

export class UpdateOrderlineDto extends PartialType(CreateOrderlineDto) {}
