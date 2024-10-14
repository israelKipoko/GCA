"use client"
import React, { useState, useEffect} from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import FolderForm from "./FolderForm";
import axios from 'axios';
import { useToast } from "../../../hooks/use-toast"
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
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip"

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
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
        )
        const months = [
          'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
          'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ];
        
        const formatDate = (dateString:string) =>{
          const date = new Date(dateString);
          const day = date.getDate();
          const month = months[date.getMonth()];
          return `${day} ${month}`;
        }
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
          description: false,
          users: false,
          id: false,
        },
      }
  })
  const { toast } = useToast();

  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshParent = () => {
    setRefreshKey((oldKey:any) => oldKey + 1);
  };
  useEffect(() => {
    dataRefresh();
    wait().then(() => setOpen(false));
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
    if (Array.isArray(users)) {
      if (users.length === 2) {
        assignedUsers.push(users);  // Keep the array of length 2 as a sub-array
      } else {
        assignedUsers = assignedUsers.concat(users);  // Concatenate arrays of other lengths
      }
    }
  });
  return (
    <div>
         <div className="flex px-2 justify-between items-center mb-1">
            <Input
              placeholder="Trouvez un dossier..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="w-[300px]"/>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="py-1 px-2 bg-[#356B8C] rounded-[4px] text-white font-bold">
                  Nouveau +
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-[#262626] border-none">
                <DialogHeader>
                  <DialogTitle className="text-[#fff] font-bold">Nouveau Dossier</DialogTitle>
                  {/* <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription> */}
                </DialogHeader>
                
                <FolderForm refreshParent={refreshParent}/>
              </DialogContent>
            </Dialog>
      </div>
        <div className="rounded-md ">
        <Table className="table">
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id} className="font-bold text-[16px] text-center text-[#fff] opacity-[0.7]">
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
                 
                    <Dialog>
      <DialogTrigger asChild>
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-[#d8d8d80d] border-none cursor-pointer">
                        
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-[#fff] capitalize text-center text-[14px]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-[#262626] border-none">
        <DialogHeader>
          <DialogTitle className="text-[#fff]">{row.getValue("title")}</DialogTitle>
          <DialogDescription className="text-[#fff]">
              {row.getValue("description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="text-[#fff]">
            <label htmlFor="" className="text-[14px] text-center">Assigné à:</label>
              <div className=" flex ">
                {assignedUsers.map((user, index) => (
                      <TooltipProvider>
                      <Tooltip>
                      {(index==0)?
                        <TooltipTrigger className="border-none w-fit ">
                           <img src={user.avatar_link}  className="w-[35px] h-[35px] rounded-full"/>
                        </TooltipTrigger>:
                          <TooltipTrigger className="border-none w-fit  -ml-2">
                              <img src={user.avatar_link}  className="w-[35px] h-[35px] rounded-full" />
                          </TooltipTrigger>}
                        <TooltipContent className="bg-[#262626] border-none">
                          <p>{user.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                ))} 
              </div>
            </div>
          <div className="text-[#fff] flex flex-col gap-y-2">
            <div className="flex justify-between">
                <div>
                  <label htmlFor="" className="text-[14px]">Client:</label>
                  <h1 className="text-[15px] font-bold">{row.getValue("client")}</h1>
                </div>
                <div className="text-center">
                  <label htmlFor="" className="text-[14px] text-center">Statut:</label>
                  {row.getValue("statut") == "pending"?  <div className=" w-fit mx-auto px-3 py-1 rounded-[16px]  capitalize bg-[#ffde4db3] text-[14px] flex items-center gap-x-1"><span className="w-[8px] h-[8px] rounded-full bg-[#ffde4d]"> </span>{row.getValue("statut")}</div>
                  :<div className=" w-fit mx-auto px-3 py-1 rounded-[16px]  capitalize bg-[#387f39b3] text-[14px] flex items-center gap-x-1"><span className="w-[8px] h-[8px] rounded-full bg-[#387f39]"> </span>{row.getValue("statut")}</div>}
                </div>
            </div>
            <div className="flex justify-between">
                <div>
                  <label htmlFor="" className="text-[14px]">Créé par:</label>
                  <h1 className="text-[15px] font-bold">{row.getValue("created_by")}</h1>
                </div>
                <div className="text-center ">
                  <label htmlFor="" className="text-[14px] text-center">Priorité:</label>
                  {row.getValue("priority") == "medium"? <div className=" w-fit mx-auto px-3 py-1 rounded-[4px] text-[14px]  capitalize bg-[#ffde4d80]  flex items-center gap-x-1">{row.getValue("priority")}</div>
                  :row.getValue("priority") == "low"?<div className=" w-fit mx-auto px-3 py-1 rounded-[4px] text-[14px] capitalize bg-[#387f3980]  flex items-center gap-x-1">{row.getValue("priority")}</div>
                  :<div className=" w-fit mx-auto px-3 py-1 rounded-[4px]  capitalize bg-[#c40c0c80] text-[14px] flex items-center gap-x-1">{row.getValue("priority")}</div> }
                </div>
            </div>
          </div>
          <div className="text-[#fff] flex flex-col capitalize ">
            <label htmlFor="" className="text-[14px]">Date limite:</label>
             <span className="text-[15px]">{formatDate(row.getValue("dead_line"))}</span>
          </div>
        </div>
        <DialogFooter>
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogTrigger>
              <Button type="button" className="bg-[#d8d8d833] py-1 font-bold text-red-400 hover:text-red-500 text-[14px]">Supprimer<i className='bx bx-trash text-[14px]'></i></Button>
          </DialogTrigger>
          <DialogContent className="bg-[#262626] border-none">
            <DialogHeader>
              <DialogTitle className="text-[#fff] capitalize">êtes-Vous sûr?</DialogTitle>
              <DialogDescription className="text-[#fff]">
              Cette action ne peut pas être annulée. Cela supprimera définitivement le dossier même pour tous les autres utilisateurs.           </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <button type="button" className="text-[#fff] font-bold bg-[#d8d8d833] hover:bg-[#d8d8d822]" onClick={(e)=> setOpenDelete(false)} >
                  Annuler
            </button>
            <Button onClick={(event) => deleteFolder(row.getValue("id"),event)} type="button" className="bg-[#d8d8d833] py-1 font-bold text-red-400 hover:text-red-500 text-[14px]">Supprimer</Button>
          </DialogFooter>
          </DialogContent>  
        </Dialog>
          <Button type="button" className="text-[#fff] font-bold bg-[#d8d8d833] hover:bg-[#d8d8d822]">
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
                <TableCell colSpan={columns.length} className="h-24 text-[#fff] font-bold text-center">
                    Pas de résultat!
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
          className="text-[#fff] border-none"
        >
        <i className='bx bx-chevrons-left text-[25px]'></i>Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-[#fff] border-none"
        >
         Suivant<i className='bx bx-chevrons-right text-[25px]'></i>
        </Button>
      </div>
    </div>
  
  )
}
