import { columns } from "./ClientsColumns"
import { DataTable } from "./ClientsDataTable"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from "../../../../../components/ui/toaster"

const ClientTable = () =>{
  const [refreshKey, setRefreshKey] = useState(0);

  const dataRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  const [data, setData] = useState([]);
  var transformedData;
   function getData() {
      axios.get('/clients/show-my-clients')
        .then(response => {
          transformedData = response.data[0].map(element => ({
            id:element.id,
            name: element.name,
            sector: element.sector || "...",
            location: element.location || "...",
            email: element.contacts?.email || "...",
            phone: element.contacts?.phone || "...",
            logo: element.logo,
            count_cases: element.case_count,
            cases: element.case,
          }));
         setData(transformedData);
        })
        .catch(error => {
          console.log(error.message)

        });

       
   return transformedData
  }


  useEffect(() => {
      getData();
  }, [refreshKey]);

  return (
    <div className="container mx-auto py-10 ">
   
      <DataTable columns={columns} data={data} dataRefresh={dataRefresh}/>
    </div>
  )
}

export default ClientTable


