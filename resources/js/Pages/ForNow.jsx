import React, { useEffect, useState,useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar"
import SideBar  from "./main/SideBar"
import WorkSpace from './WorkSpace'
import { cn } from '../../../lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../components/ui/tooltip";

const ForNow = ({caseInfo,users}) =>{
    const formatDate = () =>{
        const months = [
            'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
          ];
        const date = new Date(caseInfo.due_date);
           // Check if the date is valid in case the user did nıt enter a date
        if (isNaN(date.getTime())) {
          return "Aucune date limite"; 
        }
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      }
return (
    <section className=''>
        <SidebarProvider className=' '>
            <SideBar/> 
            <aside className=''>
                <SidebarTrigger className=' absolute z-10 top-2 hover:text-white text-white'/>
            </aside>
            <main className=' flex flex-col mx-auto pl-2 gap-y-6 mt-9 w-full float-right '>
                <div className="flex flex-col gap-y-2 ml-4">
                    <div className="flex flex-col gap-x-1 ">
                        <h1 className="text-[#ffffffcc] font-bold text-[17px]">Titre:</h1>
                        <p className="text-[#ffffffcc]  pl-4 text-[15px]">{caseInfo.title}</p>
                    </div>
                    {caseInfo.description?
                    <div className="flex flex-col gap-x-1">
                        <h1 className="text-[#ffffffcc] font-bold ">Déscription:</h1>
                        <p className="text-[#ffffffcc] w-[550px] max-h-[180px] pl-4 text-[15px]">{caseInfo.description}</p>
                    </div>
                    :""}
                    <div className="flex items-center gap-x-1">
                        <h1 className="text-[#ffffffcc] font-bold ">Date limite :</h1>
                        <p className="text-[#ffffffcc] pl-2 text-[14px]">
                            {formatDate()}
                        </p>
                    </div>
                    <div className="flex gap-x-2" id="assigned_user_wrapper">
                        <div className="capitalize" id={cn( caseInfo.status == "pending"? "case_status_pending": "case_status_submitted")}><span className="w-[8px] h-[8px] rounded-full bg-[#ffde4d]"> </span>{caseInfo.status}</div>
                        <div className="flex gap-x-2 assigned_to_profile pl-4">
                            {users.map((user,index) => (
                                <div key={index} className="user_picture element_tooltip_container w-[30px] h-[30px]">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <img src={user.avatar_link} alt="user-profile"/>
                                            </TooltipTrigger>
                                            <TooltipContent className='bg-[#313131] border-none text-[#fff]'>
                                                <p className='text-[12px]'>{user.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <WorkSpace caseId={caseInfo.id} caseFolders={caseInfo.folders}/>
            </main>
        </SidebarProvider>
    </section>

)
}

export default ForNow