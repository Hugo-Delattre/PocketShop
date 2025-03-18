import { ProductInShop } from 'src/product/dto/product-info.dto';

type ProductsInCart = {
  price: number;
  name: string;
  availableQuantity: number;
};
export class ShortCartResponseDao {
  products: Array<ProductsInCart>;
}
export { ProductInShop };
