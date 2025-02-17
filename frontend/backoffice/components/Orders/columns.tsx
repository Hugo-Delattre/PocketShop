import { OrderType } from "@/lib/repositories/order/orderRepository";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

const formatDate = (date: string) => format(new Date(date), "dd/MM/yyyy");

export const columns: ColumnDef<OrderType>[] = [
  {
    header: "Numéro de commande",
    accessorKey: "id",
  },
  {
    header: "Date de commande",
    accessorKey: "creation_date",
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    header: "Date de Paiment",
    accessorKey: "payment_date",
    cell: ({ getValue }) => getValue() ? formatDate(getValue() as string) : "Non payé",
  },
  {
    header: "Prix total",
    accessorKey: "total_price",
  },
  {
    header: "Paiment effectué",
    accessorKey: "is_paid",
    cell: ({ getValue }) => getValue() ? "Oui" : "Non",
  }
];