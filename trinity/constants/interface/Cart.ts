import { Product } from "./Product";

export interface CartResponseDao {
  products: Array<CartInfo>;
  orderId: number;
  userId: number;
}

export interface CartInfo {
  product: Product;
  code: string;
  status: string;
  status_verbose: string;
  available: string;
  availableQuantity: string;
  price: string;
}
