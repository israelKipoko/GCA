"use client"
import React, { useState } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../../../../components/ui/button";
import { MoreHorizontal, Trash2,UserPlus, BookUser } from "lucide-react";
import DeleteGroup from "../../Dialogs/DeleteGroup";
import NewGroupMember from "../../Dialogs/NewGroupMember";
import GroupDetails from "../../Dialogs/GroupDetails";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";

export type Member = {
  id: number;
  name: string;
  firstname: string;
  avatar_link: string
};

export type Groups = {
  id: number
  groupName: string
  name: string
  members: Array<Member>
  membersCount: string
}

export const columns = (dataRefresh:()=> void,allUsers: number[],refreshGroups:()=> void): ColumnDef<Groups>[] => [
  {
    accessorKey: "id",
  },
  {
  accessorKey: "name",
  header: "Description", // Optional — better for clarity
  enableHiding: true, // ✅ allow it to be hidden by default
},
  {
    accessorKey: "groupCases",
  },
  {
    accessorKey: "groupName",
    header: () => <div className="text-left flex items-center gap-x-1">Nom</div>,
    cell: ({ row }) => {
      return <div className="text-left w-fit">{row.getValue("groupName")}</div>
    },
  },
  {
    accessorKey: "membersCount",
    header: () => <div className="text-center flex items-center gap-x-1 w-fit mx-auto">Nbr. des membres</div>,
    cell: ({ row }) => {
      let countMember:number = row.getValue("membersCount");
      return <div className="text-center mx-auto w-fit">{row.getValue("membersCount")} {row.getValue("membersCount")!=0? ((countMember > 1)? "Membres":"Membre"):""}</div>
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
   {
      id: "actions",
      cell: ({ row }) => {
        const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);
        const [openNewGroupMemberDialog, setOpenNewGroupMemberDialog] = useState(false);
        const [openGroupDetailsDialog, setOpenGroupDetailsDialog] = useState(false);
        let groupsUsers:Array<Member> = row.getValue("members");

        const filteredUsers = allUsers.filter((user:any) =>
          !groupsUsers.some((groupUser) => groupUser.id === user.id)
        );
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
              <DropdownMenuItem className="font-bold" onClick={()=>setOpenGroupDetailsDialog(true)}>
                <BookUser /> Gestion du groupe
              </DropdownMenuItem>
              <DropdownMenuItem className="font-bold" onClick={()=>setOpenNewGroupMemberDialog(true)}>
                <UserPlus /> Ajouter un membre
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="dark:text-[#D84444] text-red-600 font-bold" onClick={()=>setOpenDeleteAccountDialog(true)}>
                <Trash2/> Supprimer ce groupe</DropdownMenuItem>
              {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
            </DropdownMenuContent>
            <DeleteGroup groupId={row.getValue("id")} groupName={row.getValue("groupName")} openDeleteAccountDialog={openDeleteAccountDialog} setOpenDeleteAccountDialog={setOpenDeleteAccountDialog} dataRefresh={dataRefresh}/>
            <NewGroupMember groupId={row.getValue("id")} groupName={row.getValue("groupName")}  allMembers={filteredUsers} openNewGroupMemberDialog={openNewGroupMemberDialog} setOpenNewGroupMemberDialog={setOpenNewGroupMemberDialog} dataRefresh={dataRefresh}/>
            <GroupDetails groupId={row.getValue("id")} groupName={row.getValue("groupName")} description={row.getValue("description")} groupCases={row.getValue("groupCases")} groupMembers={row.getValue("members")} allMembers={filteredUsers} open={openGroupDetailsDialog} setOpen={setOpenGroupDetailsDialog} dataRefresh={dataRefresh} refreshGroups={refreshGroups}/>
          </DropdownMenu>
        )
      },
    },
]
