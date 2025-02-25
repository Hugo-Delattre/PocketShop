import { ProductInShop, ProductOFF } from "./Product";

export interface CartResponseDao {
  products: Array<CartInfo>;
  orderId: number;
  userId: number;
  totalPrice: string;
}

export interface CartInfo {
  product: ProductOFF;
  code: string;
  status: string;
  status_verbose: string;
  available: string;
  availableQuantity: string;
  price: string;
  selectedQuantity : number;
}
