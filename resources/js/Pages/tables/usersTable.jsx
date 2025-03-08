import { columns } from "./usersColomns"
import { DataTable } from "./usersDataTable"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from "../../../../components/ui/toaster"
import AddUser from "../Dialogs/AddUser";

const UsersTable = ({allUsers, openAddUserDialog, setOpenAddUserDialog, refreshLayout}) =>{
  const [refreshKey, setRefreshKey] = useState(0);

  const dataRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  const [data, setData] = useState([]);
  var transformedData;
   function getData() {
          transformedData = allUsers.map(element => ({
            id:element.id,
            name: element.name,
            email: element.email || "...",
            role: element.role || "...",
            avatar: element.avatar || "...",
            groups: element.groups || "...",
          }));

         setData(transformedData);
       
   return transformedData
  }


  useEffect(() => {
      getData();
  }, [refreshKey]);

  return (
    <div className="w-full mx-auto py-10 ">
        <AddUser openAddUserDialog={openAddUserDialog} setOpenAddUserDialog={setOpenAddUserDialog} refreshLayout={refreshLayout} dataRefresh={dataRefresh}/>
   
      <DataTable columns={columns} data={data} dataRefresh={dataRefresh}/>
    </div>
  )
}

export default UsersTable


