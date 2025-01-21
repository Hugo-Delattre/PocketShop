"use client";

import {
  useCreateProduct,
  useDeleteProduct,
  useGetProducts,
  useUpdateProduct,
} from "@/lib/queries/products";
import { ProductType } from "@/lib/repositories/products/productRepository";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

export function ProductsPage() {
  const { data, isLoading } = useGetProducts();

  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const handleEdit = (item: ProductType) => {
    setEditingProductId(item.id);
    setShowModal(true);
    setNewItem({
      openFoodFactId: item.open_food_fact_id,
      quantity: item.inventory[0].quantity,
      price:
        parseFloat(
          parseFloat(item.inventory[0].price as unknown as string).toFixed(2)
        ) ?? "0",
    });
  };

  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: createProduct } = useCreateProduct();

  const handleUpdate = async () => {
    if (!editingProductId) {
      return;
    }

    await updateProduct({
      productId: editingProductId,
      product: newItem,
    });
    setEditingProductId(null);
    setShowModal(false);
    setNewItem({ openFoodFactId: "", quantity: 0, price: 0 });
  };

  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    openFoodFactId: "",
    quantity: 0,
    price: 0,
  });

  const handleAdd = async () => {
    if (!newItem.openFoodFactId) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    await createProduct(newItem);

    setNewItem({ openFoodFactId: "", quantity: 0, price: 0 });
    setShowModal(false);
  };

  if (isLoading) {
    return <p>loading ...</p>;
  }
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Liste des Produits</h2>
        <button
          onClick={() => {
            setNewItem({ openFoodFactId: "", quantity: 0, price: 0 });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Modal de création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Nouveau Produit</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Open Food Fact ID
                </label>
                <input
                  type="number"
                  value={newItem.openFoodFactId}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      openFoodFactId: e.target.value,
                    })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité
                </label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: Number(e.target.value) })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix
                </label>
                <input
                  type="number"
                  min="0.00"
                  max="10000.00"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      price: parseFloat(parseFloat(e.target.value).toFixed(2)),
                    })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={editingProductId ? handleUpdate : handleAdd}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {editingProductId ? "Modifier" : "Créer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Open Food Fact ID
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shop ID
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.open_food_fact_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.inventory.map(({ id, quantity, price }) => (
                    <p key={id}>
                      x{quantity} at {price} €
                    </p>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
