"use client";

import { PaginationState } from "@tanstack/react-table";

import React from "react";

import {
  useCreateProduct,
  useDeleteProduct,
  useGetProducts,
  useUpdateProduct,
} from "@/lib/queries/products";
import { createProductType } from "@/lib/repositories/products/productRepository";

import { columns } from "./data";
import { UpdateCreateModal } from "./UpdateCreateModal";

import { Table } from "../table/Table";

export function ProductsPage() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data, isLoading } = useGetProducts({
    skip: pagination.pageIndex * pagination.pageSize,
    take: pagination.pageSize,
  });

  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: createProduct } = useCreateProduct();

  const handleSubmit = async (
    value: Partial<createProductType> | createProductType,
    isEditing: boolean,
    selectedItemId: number
  ) => {
    if (isEditing) {
      await updateProduct({
        productId: selectedItemId,
        product: {
          ...value,
          price: parseFloat(
            parseFloat(value.price as unknown as string).toFixed(2)
          ),
        },
      });
      return;
    }
    await createProduct(value as createProductType);
  };

  if (!data || isLoading) {
    return (
      <div className="grid place-items-center w-full h-full">
        <svg
          className="-ml-1 size-10 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            className="opacity-75"
            fill="black"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="w-5/6 mx-auto pt-14">
      <h1 className="font-crimson text-4xl mb-6">Products</h1>
      <Table
        data={data}
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        deleteProduct={async (selectedProductId) =>
          await deleteProduct(selectedProductId)
        }
        searchValue={(table) =>
          (table.getColumn("openFoodFactId")?.getFilterValue() as string) ?? ""
        }
        searchOnChange={(event, table) =>
          table.getColumn("openFoodFactId")?.setFilterValue(event.target.value)
        }
      >
        {({ isOpen, handleClose, isEditing, selectedItem }) => (
          <UpdateCreateModal
            isOpen={isOpen}
            setIsOpen={handleClose}
            onSubmit={(value) =>
              handleSubmit(value, isEditing, selectedItem!.id)
            }
            isEditing={isEditing}
            selectedItem={{
              openFoodFactId: selectedItem?.open_food_fact_id,
              quantity: selectedItem?.inventory[0].quantity,
              price: selectedItem?.inventory[0].price,
            }}
          />
        )}
      </Table>
    </div>
  );
}
