"use client"
import React, { useState, useEffect} from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import FolderForm from "./FolderForm";
import axios from 'axios';
import { useToast } from "../../../hooks/use-toast"
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CasesToolbar } from "./main/cases/CasesToolbar";
import { ClientsFilter } from "./main/cases/ClientsFilter";
import { ViewOptions } from "./main/cases/ViewOptions";
import ViewCase from "./main/cases/ViewCase";
import { priorities } from "./main/cases/data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  dataRefresh: () => void; 
}
export type User = {
  avatar_link: string;
  name: string;
  id: string;
};
export function DataTable<TData, TValue>({
  columns,
  data,
  dataRefresh, 
}: DataTableProps<TData, TValue>) {
    const { t, i18n } = useTranslation();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
        )
        const months = [
          'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
          'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ];
        
        const formatDate = (dateString:string) =>{
          const date = new Date(dateString);
           // Check if the date is valid in case the user did nıt enter a date
            if (isNaN(date.getTime())) {
              return "..."; 
            }
          const day = date.getDate();
          const month = months[date.getMonth()];
          const year = date.getFullYear();
          return `${day} ${month} ${year}`;
        }
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
        sorting
      },
      initialState: {
        columnVisibility: {
          description: false,
          users: false,
          groups: false,
          id: false,
        },
      }
  })
  const isFiltered = table.getState().columnFilters.length > 0
  const { toast } = useToast();

  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  var clients: any[] = [];

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshParent = () => {
    setRefreshKey((oldKey:any) => oldKey + 1);
  };
  const [screenSize, setScreenSize] = useState({
          width: window.innerWidth - 25,
          height: window.innerHeight
      });

  useEffect(() => {
    wait().then(() => setOpen(false));
    dataRefresh();
  }, [refreshKey]);

  const deleteFolder  = (folder:string, event: React.MouseEvent<HTMLButtonElement>)=> {
    axios.post('/folders/delete-folder',{
      folderToDelete: folder,
    }).then(response => {
      refreshParent();
      setOpen(false);
      toast({
        description: "Le dossier a été supprimé avec succès!!",
      })
    })
      .catch(error => {
        console.log(error.message);
      });
      return folder;
    }

  var assignedUsers:User[] = [];
  table.getRowModel().rows.forEach((row) => {
    var users = row.getValue('users') as User;
    const client:string = row.getValue('client');

  if (client.trim() !== '') {
    clients.push(client);
  }

  
    if (Array.isArray(users)) {
      if (users.length === 2) {
        assignedUsers.push(users);  // Keep the array of length 2 as a sub-array
      } else {
        assignedUsers = assignedUsers.concat(users);  // Concatenate arrays of other lengths
      }
    }
  });
    clients = clients.map((client) => ({
      name: client,
    }));
  return (
    <div className="w-full ">
         <div className="flex md:flex-row flex-col-reverse md:px-4 px-0 mb-2  justify-between items-center mb-1">
            <div className="flex md:flex-row flex-col-reverse items-center gap-y-2 gap-x-3">
              <Input
                placeholder="Trouvez un dossier..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="w-[300px]"/>
                <div className="md:flex items-center hidden gap-x-2">

                {table.getColumn("priority") && (
                  <CasesToolbar
                    column={table.getColumn("priority")}
                    title="Priority"
                    options={priorities}
                  />
                )}

                {table.getColumn("client") && (
                  <ClientsFilter
                    column={table.getColumn("client")}
                    name="Clients"
                    options={clients}
                  />
                )}
                {isFiltered && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 p-2 rounded-full"
                      onClick={() => table.resetColumnFilters()}
                    >
                      <X size={18} />
                    </Button>
                  )}
                </div>
            </div>
            <div className="md:flex  md:static absolute right-2 z-10 bottom-20 items-center gap-x-3">
              <ViewOptions table={table}/>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="py-2 z-10 px-2 bg-action md:rounded-[4px] rounded-full md:w-fit w-12 md:h-fit h-12 flex flex-row gap-x-1 text-white font-bold">
                  <span className="md:block hidden">Créer un dossier</span> <Plus size={18}/>
                </Button>
              </DialogTrigger>
              <DialogContent className={`md:w-[600px] w-[${screenSize.width}px] border-none md:px-6 px-3`}>
                <DialogHeader>
                  <DialogTitle className="dark:text-white text-dark-secondary font-bold">Nouveau Dossier</DialogTitle>
                </DialogHeader>
                   <DialogDescription className='hidden'></DialogDescription>
                
                <FolderForm refreshParent={refreshParent}/>
              </DialogContent>
            </Dialog>
          </div>

      </div>
        <div className="rounded-md px-4">
        <Table className="table">
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id} className="font-bold text-[16px] text-center dark:text-white text-dark-secondary opacity-[0.8]">
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
          table.getRowModel().rows.map((row,index) => (
                 
        <Dialog key={index}>
          <DialogTrigger asChild>
              <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className=" border-none cursor-pointer">
                      
                  {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className=" capitalize text-center text-[14px]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                  ))}
              </TableRow>
          </DialogTrigger>
      <DialogContent className="md:max-w-[600px] max-w-[350px] border-none">
        <ViewCase title={row.getValue("title")} users={row.getValue("users")} groups={row.getValue("groups")} description={row.getValue("description")} status={row.getValue("statut")} owner={row.getValue("created_by")} priority={row.getValue("priority")} deadLine={row.getValue("dead_line")} refresh={dataRefresh}/>
        
        <DialogFooter className="flex flex-row gap-x-2 items-center justify-between">
          <Dialog open={openDelete} onOpenChange={setOpenDelete}>
            <DialogTrigger className="w-full">
                <Button type="button" className="w-full dark:bg-[#d8d8d833] bg-light-hover py-1 font-bold dark:text-red-400 text-red-600 hover:text-red-500 text-[14px]">Supprimer<i className='bx bx-trash text-[14px]'></i></Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[600px]   max-w-[350px] border-none">
              <DialogHeader>
                <DialogTitle className="dark:text-white text-dark-secondary capitalize">êtes-Vous sûr?</DialogTitle>
                <DialogDescription className="dark:text-white text-dark-secondary">
                Cette action ne peut pas être annulée. Cela supprimera définitivement le dossier même pour tous les autres utilisateurs.</DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-row gap-x-2 items-center justify-between">
              <Button onClick={(event) => deleteFolder(row.getValue("id"),event)} type="button" className="w-full dark:bg-[#d8d8d833] bg-light-hover py-1 font-bold dark:text-red-400 text-red-600  hover:text-red-500 text-[14px]">Supprimer</Button>
              <Button onClick={(e)=> setOpenDelete(false)} type="button" className="w-full dark:bg-[#d8d8d833] bg-light-hover py-1 font-bold dark:text-white text-dark-secondary text-[14px]">Annuler</Button>
            </DialogFooter>
            </DialogContent>  
          </Dialog>

          <Button type="button" className="w-full dark:text-white text-dark-secondary font-bold dark:bg-[#d8d8d833] bg-light-hover ">
            <a href={"/home/pending-cases/"+row.getValue("id")}>
                Ouvrir <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
               
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 dark:text-white text-dark-secondary font-bold text-center">
                    Pas de résultat!
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
