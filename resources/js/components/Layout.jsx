import React, { useEffect, useState,useRef } from 'react'
import { fr } from 'date-fns/locale';
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar"
import SideBar  from "./main/SideBar"
import PendingCases from './main/PendingCases';
import TodoList from './TodoList';
import EventManager from './main/EventManager';
import { Toaster } from '../../../components/ui/toaster';

  import { cn } from "../../../lib/utils";

const Layout = () =>{
    const [allUsers, setAllUsers] = useState([]);

    function GetAllUsers() {
        axios.get('/users/get-all-users')
        .then(response => {
          var transformedData = response.data[0].map(element => ({
            id:element.id,
            name: element.firstname + " " + element.name,
            email: element.email,
            avatar: element.avatar_link,
          }));
          setAllUsers(transformedData);
        })
        .catch(error => {
            console.log(error.message)
          });
    }
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshParent = () => {
      setRefreshKey((oldKey) => oldKey + 1);
    };
    useEffect(() => {
        GetAllUsers();
    }, [refreshKey]);
return (
    <section className=''>
        <SidebarProvider className=''>
            <SideBar/> 
            <aside>
                <SidebarTrigger className=' fixed z-10 top-2 text-white'/>
            </aside>
            <main className='flex flex-col mx-auto pl-2 gap-y-6 w-[95%] float-right'>
            <div>
                <h1 class="text-white  flex items-center gap-x-1 font-bold md:text-[15px] opacity-[0.7] text-[14px] capitalize mb-3">
                    <i class="fa-regular fa-clock"></i>
                    Vos dossiers récents
                </h1>
                <PendingCases/>
            </div>
            <div>
                <h1 class="text-white  flex items-center gap-x-1 font-bold md:text-[15px] opacity-[0.7] text-[14px] capitalize mb-3">
                    <i class="fa-solid fa-calendar-day"></i>
                    événements à venir
                </h1>
                <EventManager allUsers={allUsers}/>
            </div>
            <div>
                <h1 class="text-white flex items-center gap-x-1 font-bold md:text-[15px] opacity-[0.7] text-[14px] capitalize mb-3">
                    <i class='bx bx-check-square text-[18px]'></i>
                    Vos Tâches
                </h1>
                <TodoList/>
            </div>
        </main>
      <Toaster />
        </SidebarProvider>
    </section>

)
}

export default Layout