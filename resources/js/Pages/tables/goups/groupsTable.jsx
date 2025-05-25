import { columns } from "./groupsColumns"
import { DataTable } from "../usersDataTable"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from "../../../../../components/ui/toaster";
import CreateGroup from "../../Dialogs/CreateGroup";

const GroupsTable = ({setTotalGroups, allUsers, openCreateGroup, setOpenCreateGroup, refreshLayout}) =>{
  const [refreshKey, setRefreshKey] = useState(0);

  const dataRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  const [data, setData] = useState([]);
  var transformedData;
  async function  getData() {
    await axios.get('/groups/get-all-groups')
        .then((response)=>{
            transformedData = response.data.map(element => ({
                id:element.id,
                groupName: element.name,
                members: element.members || [],
                membersCount: element.membersCount || "",
              }));
        setData(transformedData);
        setTotalGroups(transformedData.length)
        }).catch((error)=>{
            console.log(error);
        })
       
   return transformedData
  }


  useEffect(() => {
      getData();
  }, [refreshKey]);

  return (
    <div className="w-full mx-auto py-10 ">
        <CreateGroup allUsers={allUsers} openCreateGroup={openCreateGroup} setOpenCreateGroup={setOpenCreateGroup} refreshLayout={refreshLayout} dataRefresh={dataRefresh}/>
        <DataTable columns={columns(dataRefresh, allUsers)} data={data} dataRefresh={dataRefresh}/>
    </div>
  )
}

export default GroupsTable


