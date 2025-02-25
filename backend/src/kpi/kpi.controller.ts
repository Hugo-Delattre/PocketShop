import { Controller, Get, Query } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { DateRangeDto } from './dto/dateRange';
import { KpiResponse } from './dao/KpiReport';

@Controller('kpis')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get() findAll() {
    return this.kpiService.findAll();
  }
  @Get('/range') async findByRange(
    @Query('startDate') startDate: DateRangeDto['startDate'],
    @Query('endDate') endDate: DateRangeDto['endDate'],
  ): Promise<KpiResponse[]> {
    return this.kpiService.findByRange({ startDate, endDate });
  }
  @Get('/counts') async count(): Promise<{
    totalUsers: number;
    totalProducts: number;
  }> {
    return this.kpiService.counts();
  }
}
