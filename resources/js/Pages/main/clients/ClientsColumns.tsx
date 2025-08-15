"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User, Phone, Mail, MapPin, Globe, BriefcaseBusiness,ArrowUpDown  } from "lucide-react";

export type User = {
  avatar_link: string;
  name: string;
  id: string;
};

export type Client = {
  id:number
  name: string
  sector: string
  location: string
  email: string
  phone: string
  logo: string
  count_cases: number
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    enableHiding: false
  },
  {
    accessorKey: "name",
    enableHiding: false,
    header: ({ column }) =>{ 
    return (
    <div 
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="text-left flex items-center gap-x-1 cursor-pointer">Nom   <ArrowUpDown className="ml-2 h-4 w-4" /></div>
   )},
    cell: ({ row }) => {
      const logo:any = row.getValue("logo");
      return (
        <div className=" capitalize font-bold flex items-center justify-left gap-x-2 ">
          {logo ?
          <div >
            <img src={logo}  className="w-[30px] h-[30px] rounded-full"/>
          </div>:
          <div className=" rounded-full w-[30px] h-[30px] flex items-center justify-center bg-[#ffffff44]">
           <User size={18} className=" dark:text-white text-dark-secondary"/>
          </div>
          }
          <h1>{row.getValue("name")}</h1>
        </div>
      )
    },
  },
  {
    accessorKey: "sector",
    header: ({ column }) =>{
      return( 
      <div 
       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="text-center flex justify-center items-center gap-x-1 cursor-pointer">Secteur d'activité   <ArrowUpDown className="ml-2 h-4 w-4" /></div>)},
    cell: ({row}) => {
      return <div className="text-center">{row.getValue("sector")}</div>
  },
  },
  {
    accessorKey: "location",
    header: ({ column }) =>{ 
    return (
    <div className="text-center flex justify-center items-center gap-x-1">Adresse</div>)},
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center flex justify-center items-center gap-x-1">Email</div>,
      cell: ({row}) => {
         return <div className="lowercase ">{row.getValue("email")}</div>
     },
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-center flex justify-center flex-row items-center gap-x-1">TéléPhone</div>,
      cell: ({row}) => {
         return <div className="lowercase">{row.getValue("phone")}</div>
     },
  },
  {
    accessorKey: "count_cases",
    header: () => <div className="text-center flex flex-row justify-center items-center gap-x-1">Nbr. Dossiers</div>,
    cell: ({row}) => {
      const cases = row.getValue("count_cases")

      if(cases == 0){
        return <div className="lowercase ">0</div>
      }else{
        return <div className="lowercase ">{row.getValue("count_cases")}</div>
      }
  },
  },
  {
    accessorKey: "logo",
    enableHiding: false,
  },
]
