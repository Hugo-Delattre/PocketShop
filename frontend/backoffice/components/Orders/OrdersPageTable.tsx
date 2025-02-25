"use client";
import React from "react";
import { useGetOrders } from "@/lib/queries/orders";
import { columns } from "./columns";
import classes from "../table/Table.module.css";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Table as ShadcnTable } from "../ui/table";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Loader } from "../ui/loader";

interface OrdersPageProps {
  params: {
    id: string;
  };
}

export default function OrdersPage({ params }: OrdersPageProps) {
  const { data, isLoading } = useGetOrders(params.id);
  const table = useReactTable({
    data: data ? data : [],
    columns,
    getRowId: (row) => String(row.id),
    rowCount: data ? data.length : 0,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="w-5/6 mx-auto pt-14">
        <h1 className="font-crimson text-4xl mb-6">Order history</h1>
        <div className="w-full max-w-7xl mx-auto">
          <ShadcnTable className="table-fixed w-full mx-auto">
            <TableHeader className={`${classes.tHead} mx-auto`}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="mx-auto">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="last-of-type:rounded-tr-lg last-of-type:rounded-br-lg mx-auto"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="mx-auto">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="mx-auto"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id} className="mx-auto">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow className="mx-auto">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 w-full text-center mx-auto"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ShadcnTable>
        </div>
      </div>
    </>
  );
}
