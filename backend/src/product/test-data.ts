export const mockProduct = {
  id: 1,
  open_food_fact_id: '123456',
  shopId: 1,
};

export const mockProductService = {
  create: jest.fn().mockResolvedValue(mockProduct),
  findAll: jest.fn().mockResolvedValue([mockProduct]),
  findOne: jest.fn().mockResolvedValue(mockProduct),
  update: jest.fn().mockResolvedValue(mockProduct),
  remove: jest.fn().mockResolvedValue(undefined),
};
