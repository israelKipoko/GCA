import React, { useEffect, useState,useRef } from 'react'
import { fr } from 'date-fns/locale';
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar"
import SideBar  from "./main/SideBar"
import ClientTable from './main/clients/ClientsTable';
  import { cn } from "../../../lib/utils";

const ClientLayout = () =>{
return (
    <section className=''>
        <SidebarProvider className=''>
            <SideBar/> 
            <aside>
                <SidebarTrigger className=' fixed z-10 top-2 text-white'/>
            </aside>
            <main className='flex flex-col activities_wrapper mx-auto pl-2 gap-y-6 w-[95%] float-right'>
                <ClientTable/>
            </main>
        </SidebarProvider>
    </section>

)
}

export default ClientLayout