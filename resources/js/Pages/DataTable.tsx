"use client"
import React, { useState, useEffect} from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import FolderForm from "./FolderForm";
import axios from 'axios';
import { useToast } from "../../../hooks/use-toast"
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
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
    const { t, i18n } = useTranslation();
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
    if (Array.isArray(users)) {
      if (users.length === 2) {
        assignedUsers.push(users);  // Keep the array of length 2 as a sub-array
      } else {
        assignedUsers = assignedUsers.concat(users);  // Concatenate arrays of other lengths
      }
    }
  });
  return (
    <div className="w-full">
         <div className="flex px-3 mb-2  justify-between items-center mb-1">
            <Input
              placeholder="Trouvez un dossier..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="w-[300px]"/>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="py-1 px-2 bg-[#356B8C] rounded-[4px] flex flex-row gap-x-1 text-white font-bold">
                  Créer un dossier <Plus size={13}/>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]  border-none">
                <DialogHeader>
                  <DialogTitle className="dark:text-white text-dark-secondary font-bold">Nouveau Dossier</DialogTitle>
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
      <DialogContent className="sm:max-w-[700px] border-none">
        <DialogHeader>
          <DialogTitle className="dark:text-white text-dark-secondary capitalize">{row.getValue("title")}</DialogTitle>
          <DialogDescription className="dark:text-white text-dark-secondary">
              {row.getValue("description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            {/* <div className="dark:text-white text-dark-secondary">
            <label htmlFor="" className="text-[14px] text-center">Assigné à:</label>
              <div className=" flex ">
                {assignedUsers.map((user, index) => (
                      <TooltipProvider key={index}>
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
            </div> */}
          <div className="dark:text-white text-dark-secondary flex flex-col gap-y-2">
            <div className="flex justify-between">
                {/* <div>
                  <label htmlFor="" className="text-[14px]">Client:</label>
                  <h1 className="text-[15px] font-bold">{row.getValue("client")==""?"...":""}</h1>
                </div> */}
                <div className="text-left flex flex-col">
                  <label htmlFor="" className="text-[14px] text-left">Statut:</label>
                  {row.getValue("statut") == "pending"?  
                  (<span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 px-3 py-1 text-xs font-medium text-yellow-700">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    {t("pending")}
                  </span>)
                  :
                 (<span className="inline-flex items-center gap-1 rounded-full bg-green-200 px-3 py-1 text-xs font-medium text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    {t("completed")}
                  </span>)
                  }
                </div>
            </div>
            <div className="flex flex-col gap-y-3">
                <div>
                  <label htmlFor="" className="text-[14px]">Créé par:</label>
                  <h1 className="text-[15px] font-bold">{row.getValue("created_by")}</h1>
                </div>
                <div className="text-center flex flex-col w-fit ">
                  <label htmlFor="" className="text-[14px] text-center">Priorité:</label>
                  {row.getValue("priority") == "medium"? 
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 px-3 py-1 text-xs font-medium text-yellow-700">
                    <span className="h-2 w-2 rounded-full bg-yellow-700"></span>
                    {t("medium")}
                  </span>
                  :row.getValue("priority") == "low"?
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-300 px-3 py-1 text-xs font-medium text-green-700">
                      <span className="h-2 w-2 rounded-full bg-green-700"></span>
                      {t("low")}
                    </span>
                  :
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-200 px-3 py-1 text-xs font-medium text-red-700">
                    <span className="h-2 w-2 rounded-full bg-red-700"></span>
                    {t("high")}
                  </span>}
                </div>
            </div>
          </div>
          <div className="dark:text-white text-dark-secondary flex flex-col capitalize ">
            <label htmlFor="" className="text-[14px]">Date limite:</label>
             <span className="text-[15px]">{formatDate(row.getValue("dead_line"))}</span>
          </div>
        </div>
        <DialogFooter>
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogTrigger>
              <Button type="button" className="dark:bg-[#d8d8d833] bg-light-hover py-1 font-bold dark:text-red-400 text-red-600 hover:text-red-500 text-[14px]">Supprimer<i className='bx bx-trash text-[14px]'></i></Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] border-none">
            <DialogHeader>
              <DialogTitle className="dark:text-white text-dark-secondary capitalize">êtes-Vous sûr?</DialogTitle>
              <DialogDescription className="dark:text-white text-dark-secondary">
              Cette action ne peut pas être annulée. Cela supprimera définitivement le dossier même pour tous les autres utilisateurs.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button onClick={(e)=> setOpenDelete(false)} type="button" className="dark:bg-[#d8d8d833] bg-light-hover py-1 font-bold dark:text-white text-dark-secondary text-[14px]">Annuler</Button>
            <Button onClick={(event) => deleteFolder(row.getValue("id"),event)} type="button" className="dark:bg-[#d8d8d833] bg-light-hover py-1 font-bold dark:text-red-400 text-red-600  hover:text-red-500 text-[14px]">Supprimer</Button>
          </DialogFooter>
          </DialogContent>  
        </Dialog>
          <Button type="button" className="dark:text-white text-dark-secondary font-bold dark:bg-[#d8d8d833] bg-light-hover ">
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
