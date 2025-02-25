import { CartDisplay } from "@/components/cart/CartDisplay";
import React from "react";

async function Page(props: { params: Promise<{ userId: string }> }) {
  const data = await props.params;

  return (
    <div>
      cart Page for user {data.userId}{" "}
      <CartDisplay userId={Number(data.userId)} />
    </div>
  );
}

export default Page;
