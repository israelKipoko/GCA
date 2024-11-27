import React, { useEffect, useState,useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar"
import SideBar  from "./main/SideBar"
import WorkSpace from './WorkSpace'

const ForNow = (caseId) =>{
return (
    <section className=''>
        <SidebarProvider className=' '>
            <SideBar/> 
            <aside className=''>
                <SidebarTrigger className='fixed z-10  left-[55px] top-2 text-white'/>
            </aside>
            <main className=' w-full mx-auto '>
                <WorkSpace caseId={caseId}/>
            </main>
        </SidebarProvider>
    </section>

)
}

export default ForNow