"use client"

import { ColumnDef } from "@tanstack/react-table"

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
  contact: string
  Cases: string
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left">Nom</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "sector",
    header: "Secteur d'activité",
  },
  {
    accessorKey: "location",
    header: "Adresse",
  },
  {
    accessorKey: "contact",
    header: "Email",
      cell: ({row}) => {
         return <div className="lowercase ">{row.getValue("contact")}</div>
     },
  },
  {
    accessorKey: "cases",
    header: "Dossiers",
    cell: ({row}) => {
      const cases = row.getValue("cases")

      if(cases == 0){
        return <div className="lowercase "></div>
      }else{
        return <div className="lowercase ">{row.getValue("cases")}</div>
      }
  },
  },
]
