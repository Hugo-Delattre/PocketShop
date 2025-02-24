import { ProductInShop } from "./Product";

export interface CartResponseDao {
  products: Array<CartInfo>;
  orderId: number;
  userId: number;
  totalPrice: string;
}

export interface CartInfo {
  productInShop: ProductInShop;
  code: string;
  status: string;
  status_verbose: string;
  available: string;
  availableQuantity: string;
  price: string;
}
