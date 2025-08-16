"use client"
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import React, { useState, useEffect} from "react";
import { Plus, User, Mail, Phone, MapPin, BriefcaseBusiness, SquareArrowOutUpRight } from "lucide-react";
import ClientForm from "../../ClientForm";
import { ViewOptions } from "../cases/ViewOptions";
import ViewClient from "./ViewClient";
import axios from 'axios';
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../../components/ui/dialog";
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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dataRefresh,
}: DataTableProps<TData, TValue>) {
   const [sorting, setSorting] = React.useState<SortingState>([])
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
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
        columnFilters,
         sorting,
      },
      initialState: {
        columnVisibility: {
          id: false,
          logo: false,
        },
      }
  })
    const [screenSize, setScreenSize] = useState({
            width: window.innerWidth - 25,
            height: window.innerHeight
        });
  interface Element {
    id: number;
    title: string;
    description?: string;
  }
  interface ClientCase {
    id: number;
    title: string;
    description: string;
  }

  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
  const [openClientForm, setOpenClientForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [clientCases, setClientCases] =  useState<ClientCase[]>([]);
  const [clientCasesLoading, setClientCasesLoading] = useState(false);
  const [clientCasesError, setClientCasesError] = useState('');

  var transformedData:any;

  const getClientCases = (clientId:any) => {
    setClientCasesLoading(true);
      axios.get(`/clients/get-client-cases/${clientId}`)
      .then(response => {
        transformedData = response.data[0].map((element: Element)=> ({
          id: element.id,
          title: element.title,
          description: element.description,
        }));
        setClientCases(transformedData);
        setClientCasesLoading(false);
      })
      .catch(error => {
        setClientCasesError('Ooups nous n"avons pas pu avoir les données');
        setClientCasesLoading(false);
      });

    
    return transformedData
  }
  const refreshParent = () => {
    setRefreshKey((oldKey:any) => oldKey + 1);
  };
  useEffect(() => {
    wait().then(() => setOpenClientForm(false));
    dataRefresh();
  }, [refreshKey]);

  return (
    <div className="w-full ">
          <div className="flex w-full md:flex-row flex-col-reverse md:px-4 px-0 mb-2  justify-between items-center mb-1 ">
            <div>
              <Input
                  placeholder="Trouver un client..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                      table.getColumn("name")?.setFilterValue(event.target.value)
                  }className="w-[300px] px-[30px] "
              />
            </div>
            <div className="md:flex  md:static absolute right-2 z-10 bottom-20 items-center gap-x-3">
              <ViewOptions table={table}/>
              <Dialog open={openClientForm} onOpenChange={setOpenClientForm}>
                <DialogTrigger asChild>
                  <Button className="py-2 z-10 px-2 bg-[#356B8C] md:rounded-[4px] rounded-full md:w-fit w-12 md:h-fit h-12 flex flex-row gap-x-1 text-white font-bold">
                      <span className="md:block hidden">Créer un client</span> <Plus size={18}/>
                  </Button>
                </DialogTrigger>
                <DialogContent  className={`max-w-xs md:max-w-lg lg:max-w-xl border-none md:px-6 px-3`}  >
                  <DialogHeader>
                    <DialogTitle className="dark:text-white text-dark-secondary font-bold">Nouveau Client</DialogTitle>
                  </DialogHeader>
                  <DialogDescription className='hidden'></DialogDescription>
                  
                  
                  <ClientForm refreshParent={refreshParent}/>
                </DialogContent>
              </Dialog>
            </div>
        </div>
    <div className="rounded-md px-3">
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
                <Dialog key={row.id}  onOpenChange={()=>{row.getValue("count_cases") ? getClientCases(row.getValue("id") ):""}}>
                    <DialogTrigger asChild>
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
                    </DialogTrigger>
                    <DialogContent className="md:w-[600px] w-[350px] border-none">
                          <ViewClient refresh={dataRefresh} id={row.getValue("id")} name={row.getValue("name")} sector={row.getValue("sector")} logo={row.getValue("logo")} email={row.getValue("email")} phone={row.getValue("phone")} location={row.getValue("location")} cases={row.getValue("count_cases")} clientCases={clientCases}/>
                    </DialogContent>
                </Dialog>
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
        <div className="flex items-center justify-start space-x-2 py-4">
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
