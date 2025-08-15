import React, { useEffect, useState,useRef } from 'react'
import { fr } from 'date-fns/locale';
import { SidebarProvider, SidebarTrigger } from "../../../../../components/ui/sidebar"
import SideBar  from "../SideBar"
import { cn } from "../../../../../lib/utils";
import { Toaster } from '../../../../../components/ui/toaster';
import { usePage } from '@inertiajs/react';
import books from '../../../../../public/images/books.png';
import DocumentsList from "./DocumentsList";
import { X } from 'lucide-react';
import { Link,router  } from '@inertiajs/react';

function Category() {

    const { library} = usePage().props;
  return (
       <section className=" md:py-10 py-4 w-full">
           <SidebarProvider  className=' w-full'>
               <SideBar/> 
               <aside>
                   <SidebarTrigger className=' fixed z-10 top-2 dark:text-white text-dark-secondary'/>
               </aside>
               <main className="flex flex-col  w-full ">
                   <div class="my-2 flex items-center gap-x-2 md:ml-9 relative">
                        <div className='h-[80px] w-[50px]'>
                            <img src={books} alt="books" className='w-full h-full object-contain'/>
                        </div>
                       <div class="">
                           <h1 class="dark:text-white text-dark-secondary font-bold  text-[30px] capitalize">{library.category_name}</h1>
                       </div>
                       <div onClick={() => window.history.back()} className="cursor-pointer absolute bg-[#80808044]  rounded-full p-1.5 md:right-6 right-4 top-3 -70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[#808080] data-[state=open]:text-[#fff]">
                            <X className="h-5 w-5 dark:text-white text-dark-secondary" />
                        </div>
                   </div>
                   <DocumentsList libraryID={library.id}/>
                   <Toaster />
               </main>
           </SidebarProvider>
       </section>
  )
}

export default Category