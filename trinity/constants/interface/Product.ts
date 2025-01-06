export interface Product {
  id: string;
  name: string;
  brands: string;
  product_name_fr: string;
  generic_name_fr: string;
  ingredients_text: string;
  link: string;
  categories: string[];
  ingredients: string[];
  allergens: string[];
  image_url: string;
  quantity: string;
}

export interface ProductInShop extends Product {
  available: boolean;
  availableQuantity: number;
  price: number;
}
