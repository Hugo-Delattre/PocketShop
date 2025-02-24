export const mockShop = {
  id: 1,
  name: 'Test Shop',
  address: 'Test Address',
  zip_code: 31000,
  city: 'Test City',
  country: 'Test Country',
};

export const mockShopService = {
  create: jest.fn().mockResolvedValue(mockShop),
  findAll: jest.fn().mockResolvedValue([mockShop]),
  findOne: jest.fn().mockResolvedValue(mockShop),
  update: jest.fn().mockResolvedValue(mockShop),
  remove: jest.fn().mockResolvedValue(undefined),
};

export const mockShopRepository = {
  create: jest.fn().mockReturnValue(mockShop),
  save: jest.fn().mockResolvedValue(mockShop),
  find: jest.fn().mockResolvedValue([mockShop]),
  findOne: jest.fn().mockResolvedValue(mockShop),
  update: jest.fn().mockResolvedValue(true),
  delete: jest.fn().mockResolvedValue(true),
};
