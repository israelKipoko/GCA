import React, { useEffect, useState,useRef } from 'react'
import { fr } from 'date-fns/locale';
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar"
import SideBar  from "./main/SideBar"
import { cn } from "../../../lib/utils";
import { Toaster } from '../../../components/ui/toaster';
import LibraryCategory from './main/LibraryCategory';
import { Link ,usePage} from '@inertiajs/react';

function Library() {
     const { tab } = usePage().props;
  return (
    <section className=" py-10 w-full">
        <SidebarProvider  className=' w-full '>
            <SideBar activeTab={tab}/> 
            <aside>
                <SidebarTrigger className=' fixed z-10 top-2 dark:text-white text-dark-secondary'/>
            </aside>
            <main className="flex flex-col pl-3   gap-y-1 w-full  float-right">
                <div class="my-2">
                    <div class="">
                        <h1 class="dark:text-white text-dark-secondary font-bold text-[30px] ml-9">Bibliothèque</h1>
                    </div>
                </div>
                <LibraryCategory/>
                <Toaster />
            </main>
        </SidebarProvider>
    </section>
  )
}

export default Library