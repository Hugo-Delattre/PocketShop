export const mockOrder = {
  id: 1,
  total_price: 99.99,
  creation_date: new Date('2024-03-20'),
  payment_date: new Date('2024-03-20'),
  is_paid: true,
  userId: 1,
  billingId: 1,
};

export const mockOrderService = {
  create: jest.fn().mockResolvedValue(mockOrder),
  findAllbyUser: jest.fn().mockResolvedValue([mockOrder]),
  findOne: jest.fn().mockResolvedValue(mockOrder),
  update: jest.fn().mockResolvedValue(mockOrder),
  remove: jest.fn().mockResolvedValue(undefined),
};
