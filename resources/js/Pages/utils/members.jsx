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
    const [refreshKey, setRefreshKey] = useState(0);

      const dataRefresh = () => {
      setRefreshKey((oldKey) => oldKey + 1);
    };
    const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
    const [openCreateGroup, setOpenCreateGroup] = useState(false);

    const [totalUsers, setTotalUsers] = useState(null);
    const [totalGroups, setTotalGroups] = useState(null);
    const [groupData, setGroupData] = useState([]);
    const [userdata, setUserData] = useState([]);
   

// Fetch BOTH users and groups
const getData = async () => {

  try {
    const [usersResponse, groupsResponse] = await Promise.all([
      axios.get('/users/get-all-users'),
      axios.get('/groups/get-all-groups'),
    ]);

    handleUsersData(usersResponse.data[0]);
    handleGroupsData(groupsResponse.data);

  } catch (error) {
      console.log("❌ FULL ERROR:", error);
  if (error.response) {
    console.log("🔴 Response error:", error.response.data);
  } else if (error.request) {
    console.log("🟡 Request made, no response:", error.request);
  } else {
    console.log("⚪ General error:", error.message);
  }
  }
};

// Shared handler for users
const handleUsersData = (rawUsers) => {
  const transformedUsers = rawUsers?.map((user) => ({
    id: user.id,
    name: `${user.firstname || ""} ${user.name || ""}`.trim(),
    email: user.email ?? "...",
    role: user.role ?? "...",
    avatar: user.avatar_link ?? "...",
    groups: user.groups ?? "...",
  })) || [];

  setUserData(transformedUsers);
  setTotalUsers(transformedUsers.length);
};

// Shared handler for groups
const handleGroupsData = (rawGroups) => {
  console.log("grop")
  const transformedGroups = rawGroups?.map((group) => ({
    id: group.id,
    groupName: group.name ?? "...",
    name: group.description ?? "",
    members: group.members ?? [],
    membersCount: group.membersCount ?? 0,
    groupCases: group.groupCases ?? [],
  })) || [];
  setGroupData(transformedGroups);
  setTotalGroups(transformedGroups.length);
};

// Fetch ONLY users
const refreshUsersOnly = async () => {
  try {
    const response = await axios.get('/users/get-all-users');
    handleUsersData(response.data[0]);
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
};

// Fetch ONLY groups
const refreshGroupsOnly = async () => {
  try {
    const response = await axios.get('/groups/get-all-groups');
    handleGroupsData(response.data);
  } catch (error) {
    console.error("Error fetching groups:", error.message);
  }
};


  useEffect(() => {
     console.log("🔥 useEffect triggered with refreshKey =", refreshKey);
      getData();
  }, [refreshKey]);
return (
    <section className='my-6  w-full flex justify-center '>
       <Tabs defaultValue="members" className="md:w-full w-[300px] ">
          <div className='flex md:flex-row flex-col-reverse md:items-center items-end gap-y-2 justify-between'>
            <TabsList className="md:w-[400px] w-[300px] grid  gap-x-2 grid-cols-2 bg-none rounded-md ">
                <TabsTrigger onClick={()=> setActiveTab('members')} value="members" className={cn("todo_wrapper_tabs",activeTab=="members"?"active_tab":"")}> 
                  <div><User size={16}/>Membres</div>
                   <span className='font-bold rounded-full  dark:bg-dark-secondary bg-light-thirdly'>{totalUsers}</span>
                </TabsTrigger>
                <TabsTrigger onClick={()=> setActiveTab('groups')} value="groups" className={cn("todo_wrapper_tabs",activeTab=="groups"?"active_tab":"")}> 
                  <div><Users size={16}/>Groupes</div>
                  <span className='font-bold rounded-full  dark:bg-dark-secondary bg-light-thirdly'>{totalGroups}</span>
                </TabsTrigger>
            </TabsList>
              <div className=''>
                <Button onClick={activeTab === "members"? setOpenAddUserDialog: setOpenCreateGroup} className="py-1 px-2 bg-action rounded-[4px]  flex flex-row gap-x-1 text-white font-bold">
                  {activeTab === "members"? <span className=''>Ajouter un membre</span>  : <span className=''>Créer un groupe</span> }<Plus size={18}/>
                </Button>
              </div>
          </div>
            <TabsContent value="members" className='h-full w-full'>
              <section className='h-full w-full '>
                {/* <ScrollArea className='h-full w-full'> */}
                  <UsersTable data={userdata} refreshUsers={refreshUsersOnly} openAddUserDialog={openAddUserDialog} setOpenAddUserDialog={setOpenAddUserDialog} dataRefresh={dataRefresh}/>
                {/* </ScrollArea> */}
              </section>
            </TabsContent>
            <TabsContent value="groups"  className='h-full w-full'>
              <section className='h-full'>
                  {/* <ScrollArea className='h-full'> */}
                    <GroupsTable data={groupData} refreshGroups={refreshGroupsOnly} allUsers={allUsers} openCreateGroup={openCreateGroup} setOpenCreateGroup={setOpenCreateGroup} refreshLayout={refreshLayout} dataRefresh={dataRefresh}/>
                  {/* </ScrollArea> */}
                </section>
            </TabsContent>
        </Tabs>
    </section>
)
}

export default Members