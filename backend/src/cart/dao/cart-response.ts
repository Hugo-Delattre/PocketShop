import { ProductInShop } from 'src/product/dto/product-info.dto';

export class CartResponseDao {
  products: Array<ProductInShop>;
  orderId: number;
  userId: number;
}
export { ProductInShop };
