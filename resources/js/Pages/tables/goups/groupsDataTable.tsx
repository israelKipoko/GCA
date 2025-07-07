"use client"
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import React, { useState, useEffect} from "react";
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  dataRefresh: () => void;
  refreshGroups: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dataRefresh,
  refreshGroups,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
        )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
        columnFilters,
      },
      initialState: {
        columnVisibility: {
          avatar: false,
          id: false,
          name: false,
          groupCases: false,
        },
      }
  })

  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
  const [refreshKey, setRefreshKey] = useState(0);


  var transformedData:any;

  const refreshParent = () => {
    setRefreshKey((oldKey:any) => oldKey + 1);
  };
  useEffect(() => {
    refreshGroups();
  }, [refreshKey]);

  return (
    <div className="w-full ">
          {/* <div className="flex px-3 mb-2 justify-between items-center ">
            <Input
                placeholder="Trouver un client..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }className="w-[300px] px-[30px]"
            />
        </div> */}
    <div className="rounded-md">
      <Table className="table">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="font-bold text-[16px] text-center opacity-[0.7]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
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
                    className="border-none cursor-pointer">
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className=" text-center capitalize text-[14px]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 dark:text-white text-dark-secondary text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="dark:text-white text-dark-secondary border-none"
            >
            <i className='bx bx-chevrons-left text-[25px]'></i>Précédent
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="dark:text-white text-dark-secondary border-none"
            >
            Suivant<i className='bx bx-chevrons-right text-[25px]'></i>
            </Button>
        </div>
    </div>

  )
}
