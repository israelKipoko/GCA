"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User, Phone, Mail, MapPin, Globe, BriefcaseBusiness } from "lucide-react";

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

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "avatar",
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left flex items-center gap-x-1">Comptes</div>,
    cell: ({ row }) => {
      return <div className="text-left w-fit">
            <section className="flex flex-row gap-x-2 rounded-[4px] items-center justify-center p-1">
                <div className="rounded-full w-[25px] h-[25px] cursor-pointer">
                    <img src={row.getValue("avatar")} alt="user-profile" className='w-full h-full rounded-full object-fit-contain'/>
                </div>
                <div className='flex flex-row items-center  opacity-[0.8]'>
                    <div className='flex flex-col items-start dark:text-white text-dark-secondary'>
                    <h1 className='text-[14px] font-bold capitalize'>{row.getValue("name")}</h1>
                    <p className='text-[12px]'>{row.getValue("email")}</p>
                    </div>
                </div>
            </section>
        </div>
    },
  },
  {
    accessorKey: "groups",
    header: () => <div className="text-center mx-auto w-fit flex items-center gap-x-1">Groupe</div>,
    cell: ({row}) => {
      return <div className="text-center  mx-auto w-fit">{row.getValue("groups")}</div>
  },
  },
  {
     accessorKey: "role",
     header: () => <div className="text-center mx-auto w-fit flex items-center gap-x-1">Role</div>,
     cell: ({row}) => {
        return <div className="text-center mx-auto dark:bg-[#d8d8d811] bg-[#29292922] w-fit px-2 py-1 rounded-md">{row.getValue("role")}</div>
    },
   },

   {
     accessorKey: "email",
     cell: ({row}) => {
        return <div className="text-center">{row.getValue("groups")}</div>
    },
   },
]
