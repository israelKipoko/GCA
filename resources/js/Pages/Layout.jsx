import React, { useEffect, useState} from 'react'
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar";
import SideBar  from "./main/SideBar";
import PendingCases from './main/PendingCases';
import TodoList from './TodoList';
import EventManager from './main/EventManager';
import { Toaster } from '../../../components/ui/toaster';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { Link ,usePage} from '@inertiajs/react';

const Layout = ({user}) =>{
      const { tab } = usePage().props;
    const [allUsers, setAllUsers] = useState([]);
    const [greeting, setGreeting] = useState('Bienvenue');

     const { t, i18n } = useTranslation();
    
        const changeLanguage = (lang) => {
            let hello = i18n.changeLanguage(lang);
            localStorage.setItem("lang", lang);
        };
    function GetAllUsers() {
        axios.get('/users/get-all-users')
        .then(response => {
          var transformedData = response.data[0].map(element => ({
            id:element.id,
            name: element.firstname + " " + element.name,
            email: element.email,
            role: element.role,
            groups: element.groups,
            avatar: element.avatar_link,
          }));
          setAllUsers(transformedData);
        })
        .catch(error => {
            console.log(error.message)
          });

    }
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshLayout = () => {
      setRefreshKey((oldKey) => oldKey + 1);
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentHour = new Date().getHours();
            if (currentHour < 17) {
              setGreeting('Bonjour');
            } else {
              setGreeting('Bonsoir');
            }
          }, 2000);
          GetAllUsers();

          return () => clearTimeout(timer);
    }, [refreshKey]);
return (
    <section className='w-full ' >
        <SidebarProvider defaultOpen="true"  className='w-full '>
            <SideBar refreshLayout={refreshLayout} allUsers={allUsers} activeTab={tab}/> 
              
            <aside>
                <SidebarTrigger className=' absolute z-10 top-2 dark:text-white text-dark-secondary '/>
            </aside>
            <section className=' flex flex-col float-right  px-3 gap-y-9 w-full '>
                <section className="pt-9 ">
                    <div>
                        <h1 className="dark:text-white text-dark-secondary font-bold md:text-[24px] text-[20px] capitalize text-center">{t(greeting)}, {user.firstname} {user.name}</h1>
                    </div>
                </section>
            <div>
                <h1 class="dark:text-white text-dark-secondary  flex items-center gap-x-1 font-bold md:text-[15px] opacity-[0.8] text-[14px] capitalize mb-3">
                    <i className="fa-regular fa-clock"></i>
                    {t("Vos dossiers récents")}
                </h1>
                <PendingCases/>
            </div>
            <div>
                <h1 className="dark:text-white text-dark-secondary  flex items-center gap-x-1 font-bold md:text-[15px] opacity-[0.8] text-[14px] capitalize mb-3">
                    <i className="fa-solid fa-calendar-day"></i>
                    {t("événements à venir")}
                </h1>
                <EventManager allUsers={allUsers}/>
            </div>
            <div>
                <h1 className="dark:text-white text-dark-secondary  flex items-center gap-x-1 font-bold md:text-[15px] opacity-[0.8] text-[14px] capitalize mb-3">
                    <i className='bx bx-check-square text-[18px]'></i>
                    {t("Vos Tâches")}
                </h1>
                <TodoList/>
            </div>
            <Toaster />
            </section>
        </SidebarProvider>
    </section>

)
}

export default Layout