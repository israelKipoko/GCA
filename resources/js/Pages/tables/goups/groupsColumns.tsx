"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../components/ui/tooltip";

export type Member = {
  id: number;
  name: string;
  firstname: string;
  avatar_link: string
};

export type Groups = {
  id: number
  groupName: string
  members: Array<Member>
  membersCount: string
}

export const columns: ColumnDef<Groups>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "groupName",
    header: () => <div className="text-left flex items-center gap-x-1">Groupes</div>,
    cell: ({ row }) => {
      return <div className="text-left w-fit">{row.getValue("groupName")}</div>
    },
  },
  {
    accessorKey: "membersCount",
    header: () => <div className="text-center flex items-center gap-x-1 w-fit mx-auto">Membres</div>,
    cell: ({ row }) => {
      let countMember:number = row.getValue("membersCount");
      return <div className="text-center mx-auto w-fit">{row.getValue("membersCount")} Membre{(countMember > 1)? "s":""}</div>
    },
  },

  {
    accessorKey: "members",
    header: () => <div className="text-center w-fit mx-auto flex items-center gap-x-1">Membres</div>,
    cell: ({ row }) => {
      let users:Array<Member> = row.getValue("members");
      return <div className="text-center w-fit mx-auto flex flex-row">
        {users.length != 0?
          users.map((user,index) =>(
                  <TooltipProvider key={index} >
                  <Tooltip >
                      <TooltipTrigger asChild className='cursor-pointer '>
                          <div key={index} className="-ml-2 element_tooltip_container w-[24px] h-[24px] rounded-full">
                              <img src={user.avatar_link} alt="user-profile" className=" rounded-full w-full h-full object-fit-contain"/>
                          </div>
                      </TooltipTrigger>
                  <TooltipContent className=' z-10'>
                      <p className='text-[12px]'>{user.firstname+" "+ user.name}</p>
                  </TooltipContent>
                  </Tooltip>
              </TooltipProvider>
          )):""}
      </div>
    },
  },
]
