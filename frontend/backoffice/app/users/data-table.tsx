import React from "react";
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
import CreateUserButton from "./create-user";
import { useDeleteUser } from "@/lib/queries/users";
import EditUserButton from "./edit-user";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData extends { id: number }, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
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

    const { mutateAsync: deleteUser } = useDeleteUser();

    // Get the selected row's user ID
    const selectedRowIndex = Object.keys(rowSelection)[0];
    const selectedUserId = selectedRowIndex ? data[parseInt(selectedRowIndex, 10)].id : null;

    return (
        <div>
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search email"
                        value={
                            (table
                                .getColumn("email")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("email")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <div className="flex items-center space-x-2 ml-auto">
                    <Button
                        variant="outline"
                        disabled={!isAnyRowSelected}
                        onClick={() => {
                            if (selectedUserId !== null) {
                                deleteUser(selectedUserId);
                            }
                        }}
                    >
                        Delete
                    </Button>
                    <EditUserButton userID={selectedUserId!} />
                    <CreateUserButton />
                </div>
            </div>

            <div className="rounded-md border w-full max-w-7xl">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const isEmailColumn =
                                        header.column.id === "email";
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={
                                                isEmailColumn
                                                    ? "w-1/2"
                                                    : "w-1/4"
                                            }
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
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
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const isEmailColumn =
                                            cell.column.id === "email";
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={
                                                    isEmailColumn
                                                        ? "w-1/2"
                                                        : "w-1/4"
                                                }
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
            <div>
                <div className="flex-2 flex justify-between items-center">
                    <span>
                        Element from {startRow} to {endRow} of {data.length}
                    </span>
                    <div className="flex items-center justify-end space-x-2">
                        <div>
                            <span>Show by</span>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => {
                                    table.setPageSize(Number(e.target.value));
                                }}
                                className="border rounded p-1"
                            >
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
