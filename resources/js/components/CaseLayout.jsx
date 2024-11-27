import React, { useEffect, useState,useRef } from 'react'
import { fr } from 'date-fns/locale';
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar"
import SideBar  from "./main/SideBar"
import Table from './Table';
  import { cn } from "../../../lib/utils";

const CaseLayout = () =>{
return (
    <section className=''>
        <SidebarProvider className=''>
            <SideBar/> 
            <aside>
                <SidebarTrigger className=' fixed z-10  top-2 text-white'/>
            </aside>
            <main className='flex  w-[95%] float-right activities_wrapper pl-2 gap-y-6'>
                <Table/>
            </main>
        </SidebarProvider>
    </section>

)
}

export default CaseLayout