"use client";

import React from "react";
import { CartDisplay } from "@/components/cart/CartDisplay";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function CartPageModale({ userId }: { userId: string }) {
  const router = useRouter();
  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogTitle>Current cart for User</DialogTitle>
        <CartDisplay userId={Number(userId)} />
      </DialogContent>
    </Dialog>
  );
}
