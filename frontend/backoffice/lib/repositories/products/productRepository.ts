import apiClient from "../apiClient";

export const getProducts = async ({
  skip,
  take,
  search,
}: {
  skip?: number;
  take?: number;
  search?: string;
}) => {
  return await apiClient({
    method: "get",
    url: `/products?skip=${skip}&take=${take}&search=${search}`,
  });
};

export type UpdateProductType = Partial<createProductType>;
export type ProductType = {
  id: number;
  open_food_fact_id: string;
  inventory: {
    id: number;
    price: number;
    quantity: number;
    shop: { name: string; id: number };
  }[];
};

export const updateProduct = async ({
  productId,
  product,
}: {
  productId: number;
  product: UpdateProductType;
}) => {
  return await apiClient({
    method: "patch",
    url: `/products/${productId}`,
    data: product,
  });
};

export const deleteProduct = async (productId: number) => {
  return await apiClient({
    method: "delete",
    url: `/products/${productId}`,
  });
};

export type createProductType = {
  openFoodFactId: string;
  quantity: number;
  price: number;
};

export const createProduct = async (product: createProductType) => {
  return await apiClient({
    method: "post",
    url: `/products`,
    data: product,
  });
};
