import React, { useEffect, useState,useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { User, Users, Plus } from "lucide-react"
import axios from 'axios';
import { ScrollArea } from "../../../../components/ui/scroll-area";
import UsersTable from "../tables/usersTable";
import { Button } from '../../../../components/ui/button';
import { cn } from "../../../../lib/utils";
import GroupsTable from "../tables/goups/groupsTable"

const Members = ({allUsers,refreshLayout}) =>{
    const [activeTab, setActiveTab] = useState('members');

    const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
    const [openCreateGroup, setOpenCreateGroup] = useState(false);

    const [totalUsers, setTotalUsers] = useState(null);
    const [totalGroups, setTotalGroups] = useState(null);
   
return (
    <section className='my-6'>
       <Tabs defaultValue="members" className="w-full">
          <div className='flex flex-row items-center  justify-between'>
            <TabsList className="w-[400px] grid  gap-x-2 grid-cols-2 bg-none rounded-md ">
                <TabsTrigger onClick={()=> setActiveTab('members')} value="members" className={cn("todo_wrapper_tabs",activeTab=="members"?"active_tab":"")}> 
                  <div><User size={16}/>Membres</div>
                   <span className='font-bold rounded-full  dark:bg-dark-secondary bg-light-thirdly'>{totalUsers}</span>
                </TabsTrigger>
                <TabsTrigger onClick={()=> setActiveTab('groups')} value="groups" className={cn("todo_wrapper_tabs",activeTab=="groups"?"active_tab":"")}> 
                  <div><Users size={16}/>Groupes</div>
                  <span className='font-bold rounded-full  dark:bg-dark-secondary bg-light-thirdly'>{totalGroups}</span>
                </TabsTrigger>
            </TabsList>
              <div>
                <Button onClick={activeTab === "members"? setOpenAddUserDialog: setOpenCreateGroup} className="py-1 px-2 bg-[#356B8C] rounded-[4px] flex flex-row gap-x-1 text-white font-bold">
                  {activeTab === "members"? (`Ajouter un membre`) : "Créer un groupe"}<Plus size={13}/>
                </Button>
              </div>
          </div>
            <TabsContent value="members" className='h-full w-full'>
              <section className='h-full'>
                <ScrollArea className='h-full'>
                  <UsersTable setTotalUsers={setTotalUsers} openAddUserDialog={openAddUserDialog} setOpenAddUserDialog={setOpenAddUserDialog} refreshLayout={refreshLayout}/>
                </ScrollArea>
              </section>
            </TabsContent>
            <TabsContent value="groups"  className='h-full w-full'>
              <section className='h-full'>
                  <ScrollArea className='h-full'>
                    <GroupsTable setTotalGroups={setTotalGroups} allUsers={allUsers} openCreateGroup={openCreateGroup} setOpenCreateGroup={setOpenCreateGroup} refreshLayout={refreshLayout}/>
                  </ScrollArea>
                </section>
            </TabsContent>
        </Tabs>
    </section>
)
}

export default Members