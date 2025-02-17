import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/lib/repositories/users/usersRepositories";

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

export const columns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "first_name",
        header: "First",
    },
    {
        accessorKey: "last_name",
        header: "Last",
    },
    {
        accessorKey: "orders",
        header: "Orders",
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
        header: "Cart",
        cell: ({ row }) => (
            <Link
                href={`/users/${row.original.id}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <u>See current cart</u>{" "}
                <span style={{ marginLeft: "5px" }}>→</span>
            </Link>
        ),
    },
    {
        accessorKey: "app_profile_url",
        header: "App Profile URL",
        cell: ({ row }) => (
            <Link
                href={`/users/${row.original.id}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <u>View Profile</u> <span style={{ marginLeft: "5px" }}>→</span>
            </Link>
        ),
    },
];
