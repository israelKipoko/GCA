"use client"

import { ColumnDef } from "@tanstack/react-table"

export type User = {
  avatar_link: string;
  name: string;
  id: string;
};

export type Payment = {
  id:number
  title: string
  client: string
  dead_line: string
  priority: "faible" | "moyenne" | "grande"
  created_by: string
  statut: "pending" | "completed"
  description: string
  users: User[]
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "title",
    header: () => <div className="text-left">Titre</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("title")}</div>
    },
  },
  {
    accessorKey: "description",
  },
  {
    accessorKey: "users",
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const client = row.getValue("client")
 
      return <div className=" capitalize font-bold  ">{row.getValue("client")}</div>
    },
  },
  {
    accessorKey: "created_by",
    header: "Créé par",
  },
  {
    accessorKey: "dead_line",
    header: "Date limite",
    cell: ({row}) => {
      const dead_line = row.getValue("dead_line");
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
      const isDeadlinePassed = (deadline: any): boolean => {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const normalizedDeadline = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
        const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        return normalizedToday > normalizedDeadline;
      }
      const deadlinePassed = isDeadlinePassed(dead_line);
      if(deadlinePassed){
        return <div className="capitalize text-red-600">{formatDate(row.getValue("dead_line"))}</div>
      }else{
        return <div className="capitalize ">{formatDate(row.getValue("dead_line"))}</div>

      }

    },
  },
  {
    accessorKey: "priority",
    header: "Priorité",
    cell: ({ row }) => {
      const priority = row.getValue("priority")
 
      if (priority == "medium") {
        return <div className=" w-fit mx-auto px-3 py-1 rounded-[4px]  capitalize bg-[#ffde4d80]  flex items-center gap-x-1">{row.getValue("priority")}</div>
      } else if(priority == "low") {
        return <div className=" w-fit mx-auto px-3 py-1 rounded-[4px]  capitalize bg-[#387f3980] flex items-center gap-x-1">{row.getValue("priority")}</div>
      } else if(priority == "high"){
        return <div className=" w-fit mx-auto px-3 py-1 rounded-[4px]  capitalize bg-[#c40c0c80] flex items-center gap-x-1">{row.getValue("priority")}</div>
      }
    },
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ row }) => {
      const statut = row.getValue("statut")
 
      if (statut == "pending") {
        return <div className=" w-fit mx-auto px-3 py-1 rounded-[16px]  capitalize bg-[#ffde4db3]  flex items-center gap-x-1"><span className="w-[8px] h-[8px] rounded-full bg-[#ffde4d]"> </span>{row.getValue("statut")}</div>
        
      } else {
        return <div className=" w-fit mx-auto px-3 py-1 rounded-[16px]  capitalize bg-[#387f39b3] flex items-center gap-x-1"><span className="w-[8px] h-[8px] rounded-full bg-[#387f39]"> </span>{row.getValue("statut")}</div>
      }
    },
  },
]
