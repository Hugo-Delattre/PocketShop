export const mockOrderline = {
  id: 1,
  quantity: 2,
  price_at_order: 19.99,
  productId: 1,
  orderId: 1,
};

export const mockOrderlineService = {
  create: jest.fn().mockResolvedValue(mockOrderline),
  findAll: jest.fn().mockResolvedValue([mockOrderline]),
  findOne: jest.fn().mockResolvedValue(mockOrderline),
  update: jest.fn().mockResolvedValue(mockOrderline),
  remove: jest.fn().mockResolvedValue(undefined),
};
