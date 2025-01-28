import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { UpdateProductType } from "@/lib/repositories/products/productRepository";

interface UpdateCreateModalProps {
  isOpen?: boolean;
  setIsOpen(v: boolean): void;
  selectedItem?: UpdateProductType;
  onSubmit(v: UpdateProductType): void;
  isEditing?: boolean;
}

const defaultValue = { openFoodFactId: "", quantity: 0, price: 0 };

export function UpdateCreateModal({
  isOpen,
  setIsOpen,
  selectedItem,
  onSubmit,
  isEditing,
}: UpdateCreateModalProps) {
  const [formItem, setFormItem] = useState<UpdateProductType>(
    selectedItem ?? defaultValue
  );

  useMemo(() => {
    setFormItem(selectedItem ?? defaultValue);
  }, [selectedItem]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="update or insert product"
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} product</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4 py-4">
          <div className="">
            <Label htmlFor="openFoodFactId" className="text-right">
              Open Food Fact ID
            </Label>
            <Input
              id="openFoodFactId"
              value={formItem?.openFoodFactId}
              onChange={(e) =>
                setFormItem((prev) => ({
                  ...prev,
                  openFoodFactId: e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>
          <div className="">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              value={formItem?.quantity}
              onChange={(e) =>
                setFormItem((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value) ?? 0,
                }))
              }
            />
          </div>
          <div className="">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              step="0.01"
              min="0.00"
              max="10000.00"
              type="number"
              value={formItem?.price}
              onChange={(e) =>
                setFormItem((prev) => ({
                  ...prev,
                  price: parseFloat(parseFloat(e.target.value).toFixed(2)),
                }))
              }
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              onSubmit(formItem);
              setIsOpen(false);
            }}
          >
            {isEditing ? "Save changes" : "Create product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
