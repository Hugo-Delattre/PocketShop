import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ClientSideUser } from "@/lib/repositories/users/usersRepositories";

export const columns: ColumnDef<ClientSideUser>[] = [
  {
    accessorKey: "username",
    id: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    id: "email",
    header: "Email",
  },
  {
    accessorKey: "first_name",
    id: "first_name",
    header: "First name",
    size: 80,
  },
  {
    accessorKey: "last_name",
    id: "last_name",
    header: "Last name",
    size: 80,
    enableSorting: true,
  },
  {
    accessorKey: "orders",
    id: "orders",
    header: "Orders",
    size: 120,
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <u>See orders</u> <span style={{ marginLeft: "5px" }}>→</span>
      </Link>
    ),
  },
  {
    accessorKey: "cart",
    id: "cart",
    header: "Cart",
    cell: ({ row }) => (
      <Link href={`/users/cart/${row.id}`}>
        <u>See current cart</u> <span style={{ marginLeft: "5px" }}>→</span>
      </Link>
    ),
  },
];
