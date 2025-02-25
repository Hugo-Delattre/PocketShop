import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { Kpi } from './entities/kpi.entity';
import { DateRangeDto } from './dto/dateRange';
import { Product } from '../product/entities/product.entity';
import { KpiProducts } from './entities/kpiProducts.entity';
import { KpiResponse } from './dao/KpiReport';
import { CartService } from '../cart/cart.service';
import { OrderService } from '../order/order.service';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from '../product/product.service';

@Injectable()
export class KpiService {
  constructor(
    @InjectRepository(Kpi)
    private readonly kpiRepository: Repository<Kpi>,
    @InjectRepository(KpiProducts)
    private readonly kpiProductRepo: Repository<KpiProducts>,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
  ) {}
  async makeKpiResponse(kpis: Kpi[]) {
    const response: KpiResponse[] = [];
    for (const kpi of kpis) {
      response.push({
        date: kpi.date,
        nbOutOfStock: kpi.nb_out_of_stock,
        newUser: await this.newUserOfTheDay(kpi),
        timeSpentBeforePay: await this.averageTimeSpentBeforePay(kpi),
        averageCartPrice: await this.averageCartPrice(kpi),
        productsOutOfStockIds: kpi.products.map((product) => product.id),
      });
    }
    return response;
  }

  async findAll() {
    const kpis = await this.kpiRepository.find({ relations: ['products'] });
    return this.makeKpiResponse(kpis);
  }
  async findByDate(date: Date) {
    const kpis = await this.kpiRepository.find({
      where: { date },
      relations: ['products'],
    });
    return this.makeKpiResponse(kpis);
  }

  async findByRange(dateRangeDto: DateRangeDto) {
    if (!dateRangeDto.startDate) {
      throw new Error('Start date is required');
    }
    //by default end date is today
    if (!dateRangeDto.endDate) {
      dateRangeDto.endDate = new Date().toISOString();
    }

    if (dateRangeDto.startDate > dateRangeDto.endDate) {
      throw new Error('Start date must be before end date');
    }
    const startDate = new Date(dateRangeDto.startDate);
    const endDate = new Date(dateRangeDto.endDate);
    const kpis = await this.kpiRepository.find({
      where: { date: Between(startDate, endDate) },
      relations: ['products'],
    });
    return this.makeKpiResponse(kpis);
  }
  async averageCartPrice(kpi: Kpi): Promise<number> {
    const date = new Date(kpi.date);
    return await this.cartService.getAverageCartPrice(date);
  }
  async averageTimeSpentBeforePay(kpi: Kpi): Promise<number> {
    const date = new Date(kpi.date);
    return await this.orderService.getAverageTimeSpentBeforePay(date);
  }
  async newUserOfTheDay(kpi: Kpi): Promise<number> {
    const date = new Date(kpi.date);
    return await this.userService.getNewUsersOfTheDay(date);
  }

  async counts() {
    const totalUsers = await this.userService.countUsers();
    const totalProducts = await this.productService.countProducts();

    return {
      totalUsers,
      totalProducts,
    };
  }

  async incrementOutOfStockCount(product: Product, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const todayKpi = await this.kpiRepository.findOne({
      where: { date: Between(startOfDay, endOfDay) },
    });
    if (todayKpi) {
      todayKpi.nb_out_of_stock = (todayKpi.nb_out_of_stock || 0) + 1;
      this.kpiProductRepo.save({ kpi: todayKpi, product });
      return await this.kpiRepository.save(todayKpi);
    }
    const newTodayKpi = await this.kpiRepository.save({
      date,
      outOfStockCount: 1,
    });
    return await this.kpiProductRepo.save({ kpi: newTodayKpi, product });
  }
}
