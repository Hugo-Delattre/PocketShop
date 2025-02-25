import { Test, TestingModule } from '@nestjs/testing';
import { KpiService } from './kpi.service';
import { Kpi } from './entities/kpi.entity';
import { KpiController } from './kpi.controller';

describe('KpiService', () => {
  let service: KpiService;
  const mockKpi: Kpi = {
    id: 1,
    date: new Date(new Date().setFullYear(new Date().getFullYear() - 1000)),
    nb_out_of_stock: 5,
    products: [],
  };

  const mockKpiService = {
    createKpi: jest.fn().mockResolvedValue(mockKpi),
    findAllKpi: jest.fn().mockResolvedValue([mockKpi]),
    viewKpi: jest.fn().mockResolvedValue(mockKpi),
    updateKpi: jest.fn().mockResolvedValue(mockKpi),
    removeKpi: jest.fn().mockResolvedValue(mockKpi),
    makeKpiResponse: jest.fn().mockResolvedValue([
      {
        productsOutOfStockIds: [],
        newUser: 0,
        timeSpentBeforePay: 0,
        averageCartPrice: 0,
        nbOutOfStock: mockKpi.nb_out_of_stock,
        date: mockKpi.date,
      },
    ]),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KpiController],
      providers: [
        {
          provide: KpiService,
          useValue: mockKpiService,
        },
      ],
    }).compile();

    service = module.get<KpiService>(KpiService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('return a correct kpi response', () => {
    it('should return a correct kpi response', async () => {
      const expectedResponse = [
        {
          productsOutOfStockIds: [],
          newUser: 0,
          timeSpentBeforePay: 0,
          averageCartPrice: 0,
          nbOutOfStock: mockKpi.nb_out_of_stock,
          date: mockKpi.date,
        },
      ];
      const kpis = [mockKpi];
      expect(await service.makeKpiResponse(kpis)).toEqual(expectedResponse);
    });
  });
});
