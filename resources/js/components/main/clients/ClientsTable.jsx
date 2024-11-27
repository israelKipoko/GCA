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
            sector: element.sector,
            location: element.location.city + "/"+ element.location.district,
            contact: element.contacts.email,
            cases: element.case_count,
          }));
          console.log(response.data[0])
          console.log(transformedData)
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
    <div className="container mx-auto py-10">
       <div class="mt-6">
                <div class="">
                    <h1 class="text-white font-bold text-[30px] ml-9">Clients</h1>
                </div>
            </div>
      <DataTable columns={columns} data={data} dataRefresh={dataRefresh}/>
      {/* <Toaster /> */}
    </div>
  )
}

export default ClientTable


