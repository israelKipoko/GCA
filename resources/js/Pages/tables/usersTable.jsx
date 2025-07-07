import { columns } from "./usersColomns"
import { DataTable } from "./usersDataTable"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from "../../../../components/ui/toaster"
import AddUser from "../Dialogs/AddUser";
import { useToast } from "../../../../hooks/use-toast";

const UsersTable = ({data, openAddUserDialog, setOpenAddUserDialog, dataRefresh, refreshUsers}) =>{
  const { toast } = useToast();

  const changeUserRole = (name, id, role) => {
    const formData = new FormData();
      formData.append("role", role);
      formData.append("userID", id);
    axios.post('/users/change-user-role', formData)
    .then(response => {
      refreshUsers();
       toast({
         variant: "default",
         title: `${name}" est maintenant un ${role}!!`,
       })
    })
    .catch(error => {
          toast({
            variant: "destructive",
             title: `Vous n'êtes pas autorisé à effectuer ce changement.`,
        });
    });
  }

  return (
    <div className="w-full mx-auto py-10 ">
        <AddUser openAddUserDialog={openAddUserDialog} setOpenAddUserDialog={setOpenAddUserDialog} dataRefresh={dataRefresh}/>
        <DataTable columns={columns(changeUserRole,dataRefresh)} data={data} dataRefresh={dataRefresh}/>
    </div>
  )
}

export default UsersTable


