import React from "react";

import { CartPageModale } from "./(CartPageModale)";

async function CartPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <div>
      <CartPageModale userId={userId} />
    </div>
  );
}

export default CartPage;
