"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User, ArrowUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
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
    enableHiding: false
  },
  {
    accessorKey: "title",
    header: ({ column }) => <div  className="text-left flex items-center gap-x-1 cursor-pointer" onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}}>
            Titre  <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("title")}</div>
    },
  },
  {
    accessorKey: "description",
    enableHiding: false
  },
  {
    accessorKey: "users",
    enableHiding: false
  },
    {
    accessorKey: "groups",
    enableHiding: false
  },
  {
    accessorKey: "client",
    header:  ({ column }) =>{  
      const { t, i18n } = useTranslation();

    return(<div  className="text-center flex items-center justify-center gap-x-1 cursor-pointer"  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Client  <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>)},
    cell: ({ row }) => {
      return <div className=" capitalize font-bold  ">{row.getValue("client")==""?"":row.getValue("client")}</div>
    },
  },
  {
    accessorKey: "created_by",
    enableHiding: false,
    header: ({ column }) =><div  className="text-center flex items-center justify-center gap-x-1 cursor-pointer"  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      Créateur  <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>,
    cell: ({ row }) => {
      const owner:any = row.getValue("created_by");
 
      return (
      <div className=" capitalize font-bold flex items-center justify-center gap-x-2 ">
        <div >
          <img src={owner.avatar_link}  className="w-[30px] h-[30px] rounded-full"/>
        </div>
        <h1>{owner.firstname} {owner.name}</h1>
      </div>
      )
    },
  },
  {
    accessorKey: "dead_line",
    header:  ({ column }) => {
      const { t } = useTranslation();
      return <div  className="text-center flex items-center justify-center gap-x-1 cursor-pointer"  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("Date limite")}  <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
    },
    cell: ({row}) => {
      const months = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
      ];
      const formatDate = (dateString:string) =>{
        const date = new Date(dateString);
           // Check if the date is valid in case the user did nıt enter a date
        if (isNaN(date.getTime())) {
          return ""; 
        }
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      }
      // const isDeadlinePassed = (deadline: any): boolean => {
      //   const deadlineDate = new Date(deadline);
      //   const today = new Date();
      //   const normalizedDeadline = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
      //   const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      //   return normalizedToday > normalizedDeadline;
      // }

        return <div className="capitalize">{formatDate(row.getValue("dead_line"))}</div>
    },
  },
  {
    accessorKey: "priority",
    header:  ({ column }) => {
      const { t, i18n } = useTranslation();
      return <div  className="text-center flex items-center justify-center gap-x-1 cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("Priority")}  <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority")
      const { t, i18n } = useTranslation();
 
      if (priority == "medium") {
        return (<span className="inline-flex items-center text-left gap-1 rounded-full bg-yellow-200 px-3 py-1 text-xs font-medium text-yellow-700">
          <span className="h-2 w-2 rounded-full bg-yellow-700"></span>
          {t("medium")}
        </span>)
      } else if(priority == "low") {
        return (<span className="inline-flex items-center gap-1 rounded-full bg-green-300 px-3 py-1 text-xs font-medium text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-700"></span>
          {t("low")}
        </span>)
      } else if(priority == "high"){
        return (<span className="inline-flex items-center gap-1 rounded-full bg-red-200 px-3 py-1 text-xs font-medium text-red-700">
          <span className="h-2 w-2 rounded-full bg-red-700"></span>
          {t("high")}
        </span>)
      }
    },
  },
  {
    accessorKey: "statut",
    header: ({ column }) =>{ 
        const { t, i18n } = useTranslation();
        return <div  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}  className="cursor-pointer text-center flex items-center justify-center gap-x-1"> {t("statut")} <ArrowUpDown className="ml-2 h-4 w-4" /></div>},
    cell: ({ row }) => {
      const statut = row.getValue("statut")
      const { t, i18n } = useTranslation();
      if (statut == "pending") {
        // return <div className=" w-fit mx-auto px-3 py-1 rounded-[16px]  capitalize bg-[#ffde4db3]  flex items-center gap-x-1"><span className="w-[8px] h-[8px] rounded-full bg-[#ffde4d]"> </span>{row.getValue("statut")}</div>
        return(<span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 md:px-3 px-2 py-1 text-xs font-medium text-yellow-700">
          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
          {t("pending")}
        </span>)
      } else {
        // return <div className=" w-fit mx-auto px-3 py-1 rounded-[16px]  capitalize bg-[#387f39b3] flex items-center gap-x-1"><span className="w-[8px] h-[8px] rounded-full bg-[#387f39]"> </span>{row.getValue("statut")}</div>
        return(<span className="inline-flex items-center gap-1 rounded-full bg-green-200 px-3 py-1 text-xs font-medium text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          {t("completed")}
        </span>)
      }
    },
  },
]
