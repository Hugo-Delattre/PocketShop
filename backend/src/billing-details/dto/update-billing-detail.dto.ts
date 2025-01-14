import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingDetailDto } from './create-billing-detail.dto';

export class UpdateBillingDetailDto extends PartialType(
  CreateBillingDetailDto,
) {}
