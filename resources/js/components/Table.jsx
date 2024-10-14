import { columns } from "./Columns"
import { DataTable } from "./DataTable"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from "../../../components/ui/toaster"

const Table = () =>{
  const [refreshKey, setRefreshKey] = useState(0);

  const dataRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  const [data, setData] = useState([]);
  var transformedData;
   function getData() {
      axios.get('/folders/show-my-folers')
        .then(response => {
          transformedData = response.data[0].map(element => ({
            id:element.id,
            title: element.title,
            statut: element.status,
            client: element.client.name,
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
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} dataRefresh={dataRefresh}/>
      <Toaster />
    </div>
  )
}

export default Table


