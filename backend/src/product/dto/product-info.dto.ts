export interface Nutriments {
  'energy-kcal': number;
  fat: number;
  fiber: number;
  proteins: number;
  salt: number;
  sugars: number;
  carbohydrates: number;
  sodium: number;
}

export interface ProductOFF {
  id: string;
  name: string;
  brands: string;
  product_name_fr: string;
  generic_name_fr: string;
  ingredients_text: string;
  link: string;
  categories: string;
  ingredients: string[];
  allergens: string;
  origins: string;
  image_url: string;
  quantity: string;
  nutriments: Nutriments;
}

export interface ProductInShop extends ProductOFF {
  available: boolean;
  availableQuantity: number;
  price: number;
}
