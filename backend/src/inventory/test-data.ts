export const mockInventory = {
  id: '1',
  price: 99.99,
  quantity: 10,
  shop_id: '1',
  product_id: '1',
};

export const mockInventoryRepository = {
  create: jest.fn().mockReturnValue(mockInventory),
  save: jest.fn().mockResolvedValue(mockInventory),
  find: jest.fn().mockResolvedValue([mockInventory]),
  findOne: jest.fn().mockResolvedValue(mockInventory),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

export const mockInventoryService = {
  create: jest.fn().mockResolvedValue(mockInventory),
  findAll: jest.fn().mockResolvedValue([mockInventory]),
  findOne: jest.fn().mockResolvedValue(mockInventory),
  update: jest.fn().mockResolvedValue(mockInventory),
  remove: jest.fn().mockResolvedValue(undefined),
};
