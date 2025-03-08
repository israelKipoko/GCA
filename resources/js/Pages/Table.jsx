import { columns } from "./Columns"
import { DataTable } from "./DataTable"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from "../../../components/ui/toaster"
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar";
import SideBar  from "./main/SideBar";

const Table = () =>{
  const [refreshKey, setRefreshKey] = useState(0);

  const dataRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  const [data, setData] = useState([]);
  var transformedData;
   function getData() {
      axios.get('/folders/show-my-folders')
        .then(response => {
          transformedData = response.data[0].map(element => ({
            id:element.id,
            title: element.title,
            statut: element.status,
            client: element.client?.name || "",
            dead_line: element.due_date,
            priority: element.priority,
            created_by: element.user.firstname +" "+ element.user.name,
            description: element.description,
            users: element.assigned_to,
          }));
         setData(transformedData);
        })
        .catch(error => {
          console.log('no')

        });

       
   return transformedData
  }


  useEffect(() => {
      getData();

  }, [refreshKey]);

  return (
    <div className=" py-10">
        <SidebarProvider  className='container'>
            <SideBar/> 
            <aside>
                <SidebarTrigger className=' fixed z-10 top-2 dark:text-white text-dark-secondary'/>
            </aside>
            <main className="flex flex-col mx-auto pl-2 gap-y-6 w-full float-right">
              <div class="my-4">
                    <div class="">
                        <h1 class="dark:text-white text-dark-secondary font-bold text-[30px] ml-9">Mes Dossiers</h1>
                    </div>
                </div>
              <DataTable columns={columns} data={data} dataRefresh={dataRefresh}/>
              <Toaster />
            </main>
     
      </SidebarProvider>
    </div>
  )
}

export default Table


