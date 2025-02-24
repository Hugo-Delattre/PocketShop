"use client";
import { useGetCart } from "@/lib/queries/cart";
import { Loader } from "../ui/loader";

export function CartDisplay({ userId }: { userId: number }) {
  const { data, isLoading, error } = useGetCart(userId);

  if (error) {
    console.error(error);
    return <p>An error occured</p>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return <p>User have no cart</p>;
  }

  return (
    <div>
      {data.products.map(
        ({ product: { image_url }, selectedQuantity, priceAtOrder }, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-20 aspect-video overflow-hidden">
              <img
                className="object-contain w-full h-full"
                src={image_url}
                alt="product image"
              />
            </div>
            <p>x {selectedQuantity}</p>
            <p>
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(priceAtOrder)}
            </p>
            <p>
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(priceAtOrder * selectedQuantity)}
            </p>
          </div>
        )
      )}
    </div>
  );
}
