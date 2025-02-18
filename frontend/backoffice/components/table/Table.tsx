import React, { useState } from "react";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  PaginationState,
  ColumnFiltersState,
  Table as TypedTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { PlusCircleIcon, TrashIcon } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table as ShadcnTable } from "../ui/table";
import { TableFooterActions } from "./TableFooterActions";

import classes from "./Table.module.css";
import { Checkbox } from "../ui/checkbox";

interface TableProps<ProductType extends { id: number }> {
  searchValue(table: TypedTable<ProductType>): string;
  searchOnChange(
    e: React.ChangeEvent<HTMLInputElement>,
    table: TypedTable<ProductType>
  ): void;

  deleteElement(selectedElementId: number): void;

  data: [ProductType[], number];
  columns: ColumnDef<ProductType, unknown>[];

  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  children(props: {
    isOpen: boolean;
    handleClose(): void;
    isEditing: boolean;
    selectedItem?: ProductType;
    // @ts-expect-error jsx not in react idk why
  }): React.JSX;
}

export function Table<ProductType extends { id: number }>({
  searchValue,
  searchOnChange,
  data,
  columns,
  pagination,
  setPagination,
  deleteElement,
  children,
}: TableProps<ProductType>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data[0],
    columns,
    getRowId: (row) => String(row.id),
    rowCount: data[1],
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      columnFilters,
      rowSelection,
      pagination,
    },
  });

  const startRow =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const endRow = Math.min(
    startRow + table.getState().pagination.pageSize - 1,
    data[1]
  );

  const isAnyRowSelected = Object.keys(rowSelection).length > 0;

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setRowSelection({});
    setIsOpen(false);
  };

  const selectedItemId = Number(Object.keys(rowSelection)[0]);

  const selectedItem = data[0].find((row) => selectedItemId === row.id);

  return (
    <>
      {children({
        handleClose,
        isOpen,
        selectedItem,
        isEditing: !!selectedItem,
      })}

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search"
            value={searchValue(table)}
            onChange={(event) => searchOnChange(event, table)}
            className="w-48"
          />
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <Button onClick={() => setIsOpen(true)}>
            {!!selectedItemId ? "Edit" : "Add"}
            <PlusCircleIcon />
          </Button>
          <Button
            onClick={async () => await deleteElement(selectedItemId)}
            variant="destructive"
            disabled={!isAnyRowSelected}
          >
            Delete
            <TrashIcon />
          </Button>
        </div>
      </div>
      <div className="w-full max-w-7xl">
        <ShadcnTable className="table-fixed w-full">
          <TableHeader className={classes.tHead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead className="w-12 first-of-type:rounded-tl-lg rounded-bl-lg">
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
                </TableHead>
                {headerGroup.headers.map((header) => {
                  const w = header.column.getSize();

                  return (
                    <TableHead
                      style={{ width: w }}
                      key={header.id}
                      className="last-of-type:rounded-tr-lg last-of-type:rounded-br-lg"
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
                  <TableCell className="w-12">
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Select row"
                    />
                  </TableCell>
                  {row.getVisibleCells().map((cell) => {
                    const value = cell.getValue();

                    const titleValue =
                      typeof value === "string" ? value || "" : "";
                    return (
                      <TableCell
                        key={cell.id}
                        className="text-ellipsis overflow-hidden"
                        title={titleValue}
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
                  className="h-24 w-full text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ShadcnTable>
      </div>
      <TableFooterActions
        elementsCount={data[1]}
        indexFirst={startRow}
        indexLast={endRow}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        pageSize={table.getState().pagination.pageSize}
        previousPage={table.previousPage}
        nextPage={table.nextPage}
        setPageSize={(v) => table.setPageSize(v)}
      />
    </>
  );
}
