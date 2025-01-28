"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import CreateUserButton from "./create-user";
import { TableFooterActions } from "@/components/table/TableFooterActions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  const startRow =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const endRow = Math.min(
    startRow + table.getState().pagination.pageSize - 1,
    data.length
  );

  const isAnyRowSelected = Object.keys(rowSelection).length > 0;
  const isOneRowSelected = Object.keys(rowSelection).length == 1;

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search email"
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <Button variant="outline" disabled={!isOneRowSelected}>
            Edit
          </Button>
          <Button variant="outline" disabled={!isAnyRowSelected}>
            Delete
          </Button>
          <CreateUserButton />
        </div>
      </div>

      <div className="rounded-md border w-full max-w-7xl">
        <Table className="table-fixed w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isEmailColumn = header.column.id === "email";
                  return (
                    <TableHead
                      key={header.id}
                      className={isEmailColumn ? "w-1/2" : "w-1/4"}
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isEmailColumn = cell.column.id === "email";
                    return (
                      <TableCell
                        key={cell.id}
                        className={isEmailColumn ? "w-1/2" : "w-1/4"}
                      >
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TableFooterActions
        elementsCount={data.length}
        indexFirst={startRow}
        indexLast={endRow}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        pageSize={table.getState().pagination.pageSize}
        previousPage={table.previousPage}
        nextPage={table.nextPage}
        setPageSize={(v) => table.setPageSize(v)}
      />
    </div>
  );
}
