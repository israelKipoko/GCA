"use client"
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import React, { useState, useEffect} from "react";
import { Plus, User, Mail, Phone, MapPin, BriefcaseBusiness, SquareArrowOutUpRight } from "lucide-react";
import ClientForm from "../../ClientForm";
import axios from 'axios';
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
          id: false,
          logo: false,
        },
      }
  })

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
          <div className="flex px-3 mb-2 justify-between items-center ">
            <Input
                placeholder="Trouver un client..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }className="w-[300px] px-[30px]"
            />
            <Dialog open={openClientForm} onOpenChange={setOpenClientForm}>
              <DialogTrigger asChild>
                <Button className="py-1 px-2 bg-[#356B8C] rounded-[4px] flex flex-row gap-x-1 text-white font-bold">
                  Créer un client <Plus size={13}/>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] border-none">
                <DialogHeader>
                  <DialogTitle className="dark:text-white text-dark-secondary font-bold">Nouveau Client</DialogTitle>
                </DialogHeader>
                
                <ClientForm refreshParent={refreshParent}/>
              </DialogContent>
            </Dialog>
        </div>
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
                    <DialogContent className="sm:max-w-[600px] border-none">
                        <DialogHeader>
                            <DialogTitle className=" flex items-center gap-x-2 mb-4">
                              <div className=" rounded-full w-16 h-16 flex items-center justify-center bg-[#ffffff44]">
                                {row.getValue("logo") == ""? 
                                  <User size={30}/>
                                :
                                <img src={row.getValue("logo")} alt="logo"  className="w-full h-full object-fit-contain rounded-full"/>
                                }
                              </div> 
                               <h1 className="font-bold capitalize flex flex-col">
                                  {row.getValue("name")}
                                  <span className="text-[13px]">{row.getValue("sector")}</span>
                               </h1> 
                              </DialogTitle>
                            <div className=" px-6 flex flex-col gap-y-4">
                                <div >
                                   <h1 className="flex flex-row gap-x-2 items-center dark:text-white text-dark-secondary">
                                    <Mail size={20}/> {row.getValue("email")}
                                   </h1> 
                                </div>
                                <div >
                                   <h1 className="flex flex-row gap-x-2 items-center dark:text-white text-dark-secondary">
                                    <Phone size={20}/> {row.getValue("phone")}
                                   </h1> 
                                </div>
                                <div >
                                   <h1 className="flex flex-row gap-x-2 items-center dark:text-white text-dark-secondary">
                                    <MapPin size={20}/> {row.getValue("location")}
                                   </h1> 
                                </div>
                                {row.getValue("count_cases") ? (
                                  <div className="px-2 flex flex-col gap-y-1">
                                    <div>
                                      <h1 className="font-bold dark:text-white text-dark-secondary">Dossiers</h1>
                                    </div>
                                    <div className="flex flex-col gap-y-2 px-4">
                                      {clientCases.map((clientCase, index) => (
                                         <div className="flex flex-row gap-x-2 items-center dark:text-white text-dark-secondary">
                                            <BriefcaseBusiness size={15}/> 
                                              <a href={`/home/pending-cases/${clientCase.id}`} className="capitalize text-[14px] font-bold flex flex-row items-center gap-x-6 hover:underline">{clientCase.title} </a>
                                          </div>
                                          // <Accordion type="single" collapsible className="w-full border-b rounded-none" key={index}>
                                          //   <AccordionItem value={clientCase.title}>
                                          //     <AccordionTrigger className="bgd-[#ffffff44] borded-b rounded-md py-2 text-white font-bold capitalize">
                                          //       <div className="flex flex-row gap-x-2 items-center">
                                          //         <BriefcaseBusiness size={18}/> 
                                          //          <h1 className="capitalize text-[14px]">{clientCase.title}</h1>
                                          //       </div>
                                          //       </AccordionTrigger>
                                          //     <AccordionContent className="bg-d[#ffffff44] rounded-b-md text-white">
                                                  
                                          //     </AccordionContent>
                                          //   </AccordionItem>
                                          // </Accordion>
                                        ))}
                                    </div>
                                  </div>
                                ) : ""}
                            </div>
                        </DialogHeader>
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
