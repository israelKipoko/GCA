"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User, Phone, Mail, MapPin, Globe, BriefcaseBusiness } from "lucide-react";

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
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left flex items-center gap-x-1"><User size={20} />Nom</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "sector",
    header: () => <div className="text-center flex items-center gap-x-1"><Globe size={20} />Secteur d'activité</div>,
    cell: ({row}) => {
      return <div className="text-center">{row.getValue("sector")}</div>
  },
  },
  {
    accessorKey: "location",
    header: () => <div className="text-center flex items-center gap-x-1"><MapPin size={20} />Adresse</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center flex items-center gap-x-1"><Mail size={20} />Email</div>,
      cell: ({row}) => {
         return <div className="lowercase ">{row.getValue("email")}</div>
     },
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-center flex flex-row items-center gap-x-1"><Phone size={20} />TéléPhone</div>,
      cell: ({row}) => {
         return <div className="lowercase">{row.getValue("phone")}</div>
     },
  },
  {
    accessorKey: "count_cases",
    header: () => <div className="text-center flex flex-row items-center gap-x-1"><BriefcaseBusiness size={20} />Nbr. Dossiers</div>,
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
  },
]
