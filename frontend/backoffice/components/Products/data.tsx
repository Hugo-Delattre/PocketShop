import { ProductType } from "@/lib/repositories/products/productRepository";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ProductType>[] = [
  {
    header: "OpenFoodFactId",
    accessorKey: "open_food_fact_id",
    id: "openFoodFactId",
  },
  {
    header: "Shop",
    accessorFn: (product) => product.inventory[0].shop.name,
    id: "shop",
  },
  {
    header: "Unit Price (€)",
    accessorFn: (product) => product.inventory[0].price,
    id: "unitPrice",
  },
  {
    header: "Quantity",
    accessorFn: (product) => product.inventory[0].quantity,
    id: "quantity",
  },
];
