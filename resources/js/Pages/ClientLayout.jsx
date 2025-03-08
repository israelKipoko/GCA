import React, { useEffect, useState,useRef } from 'react'
import { fr } from 'date-fns/locale';
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar"
import SideBar  from "./main/SideBar"
import ClientTable from './main/clients/ClientsTable';
import { cn } from "../../../lib/utils";
import { Toaster } from '../../../components/ui/toaster';

const ClientLayout = () =>{
return (
    <section className=" py-10 w-full">
        <SidebarProvider  className='container w-full '>
            <SideBar/> 
            <aside>
                <SidebarTrigger className=' fixed z-10 top-2 dark:text-white text-dark-secondary'/>
            </aside>
            <main className="flex flex-col pl-3  mx-auto  gap-y-1 w-full  float-right">
                <div class="my-2">
                    <div class="">
                        <h1 class="dark:text-white text-dark-secondary font-bold text-[30px] ml-9">Clients</h1>
                    </div>
                </div>
                <ClientTable/>
                <Toaster />
            </main>
        </SidebarProvider>
    </section>

)
}

export default ClientLayout