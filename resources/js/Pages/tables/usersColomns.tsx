"use client"
import React, { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { User, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import DeleteAccountDialog from "../Dialogs/DeleteAccount";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"

export type User = {
  avatar_link: string;
  name: string;
  id: string;
};

export type Users = {
  id:number
  name: string
  avatar: string
  groups: string
  role: string
  email: string
}


export const columns = (changeUserRole: (id: number, name: string, role: string)=> void,dataRefresh:()=> void): ColumnDef<User>[] => [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "avatar",
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left flex items-center gap-x-1">Compte</div>,
    cell: ({ row }) => {
      return <div className="text-left w-fit">
            <section className="flex flex-row gap-x-2 rounded-[4px] items-center justify-center p-1">
                <div className="rounded-full w-[25px] h-[25px] cursor-pointer">
                    <img src={row.getValue("avatar")} alt="user-profile" className='w-full h-full rounded-full object-contain'/>
                </div>
                <div className='flex flex-row items-center  opacity-[0.8]'>
                    <div className='flex flex-col items-start dark:text-white text-dark-secondary'>
                        <h1 className='text-[14px] font-bold "capitalize"'>{row.getValue("name")}</h1>
                        <p className='text-[12px] normal-case'>{row.getValue("email")}</p>
                    </div>
                </div>
            </section>
        </div>
    },
  },
  {
    accessorKey: "groups",
    header: () => <div className="text-center mx-auto w-fit flex items-center gap-x-1">Groupes</div>,
    cell: ({row}) => {
      let userGroups:any= row.getValue("groups");
      return <div className="text-center  mx-auto w-fit">{userGroups.join(', ')}</div>
  },
  },
  {
     accessorKey: "role",
     header: () => <div className="text-center mx-auto w-fit flex items-center gap-x-1">Role</div>,
     cell: ({row}) => {
        return <div className="text-center mx-auto  w-fit px-2 py-1 rounded-md">
          <Select value={row.getValue("role")} onValueChange={(role) => changeUserRole(row.getValue("name"), row.getValue("id"),role)}>
              <SelectTrigger className="md:w-[180px] dark:bg-[#d8d8d811] bg-[#29292922] border border-[#ffffff66] font-bold opacity-[0.8] rounded-md outline-none focus:outline-none ">
                  <SelectValue  placeholder="Priorité opacity-[0.6]" className='dark:text-white text-dark-secondary font-bold'/>
              </SelectTrigger>
              <SelectContent className=''>
                  <SelectItem value="Super-Admin" className='cursor-pointer dark:text-white text-dark-secondary '>Administrateur</SelectItem>
                  <SelectItem value="Admin"  className='cursor-pointer dark:text-white text-dark-secondary'>Gestionnaire</SelectItem>
                  <SelectItem value="User"  className='cursor-pointer dark:text-white text-dark-secondary'>Utilisateur</SelectItem>
              </SelectContent>
          </Select>
        </div>
    },
   },

   {
     accessorKey: "email",
     cell: ({row}) => {
        return <div className="text-center">{row.getValue("groups")}</div>
    },
   },
   {
    id: "actions",
    cell: ({ row }) => {
      const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            {/* <DropdownMenuItem className="font-bold">
              <Eye/> Affichier le résumé
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="dark:text-[#D84444] text-red-600 font-bold" onClick={()=>setOpenDeleteAccountDialog(true)}>
              <Trash2/> Supprimer ce compte</DropdownMenuItem>
            {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
          <DeleteAccountDialog userId={row.getValue("id")} userName={row.getValue("name")} openDeleteAccountDialog={openDeleteAccountDialog} setOpenDeleteAccountDialog={setOpenDeleteAccountDialog} dataRefresh={dataRefresh}/>
        </DropdownMenu>
      )
    },
  },
]
