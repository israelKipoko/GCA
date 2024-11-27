import React, { useEffect, useState,useRef } from 'react'
import axios from 'axios';
import { fr } from 'date-fns/locale';
import { Calendar, Home, Inbox, Search, Settings, BriefcaseBusiness, Users, ChevronsUpDown, LogOut } from "lucide-react"
import logo2 from '../../../../public/icons/mobeko_logo2.png';
import logo1 from '../../../../public/icons/Mobeko_logo1.png';
import {
    Sidebar,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
  } from "../../../../components/ui/sidebar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../components/ui/tooltip";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../../../../components/ui/dropdown-menu";
  import { cn } from "../../../../lib/utils";

const SideBar = () =>{
  const [items, setItems] = useState([]);
  const [user, setUser] = useState([]);
  
  function getUserInformation(){

    axios.get('/users/get-information')
    .then(response => {
      var transformedData = response.data.map(element => ({
        id:element.id,
        name: element.firstname +" "+ element.name,
        email: element.email,
        avatar: element.avatar_link,
        role: element.role,
      }));
      setUser(transformedData);
      if(response.data[0].role == "Admin"){
        setItems ([
         {
           title: "Accueil",
           url: "/home",
           icon: Home
         },
         {
           title: "Mes Dossiers",
           url: "/home/my-folder?q=myfolder",
           icon: BriefcaseBusiness
         },
        //  {
        //    title: "Clients",
        //    url: "/home/clients?q=clients",
        //    icon: Users
        //  },
       ])
     }else{
      setItems([
         {
           title: "Accueil",
           url: "/home",
           icon: Home
         },
         {
           title: "Mes Dossiers",
           url: "/home/my-folder?q=myfolder",
           icon: BriefcaseBusiness
         },
       ])
     }
    })
    .catch(error => {
      console.log(error.message)
    });
  }
  const Logout = () =>  {

    axios.post('/logout/user')
    .then(response => {
      window.location.reload();
    })
    .catch(error => {
      console.log(error.message)
    });
  };
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshParent = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  useEffect(() => {
    getUserInformation();
  }, [refreshKey]);
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar()
return (
    <Sidebar className='bg-[#262626] z-10 border-none'>
    <SidebarHeader className='p-1.5'>
        <div className='bg-[#007bff] rounded-[4px]  flex justify-center'>
          <div className='w-full  h-[40px] flex items-center  justify-center'>
              {open?<img src={logo1} alt='logo' className='w-[170px] object-fit-contain'/>: <img src={logo2} alt='logo' className='w-[70px] h-[40px] object-fit-contain'/>}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
          <SidebarGroupContent className='mt-4'>
            <SidebarMenu className={cn('',open?"flex flex-col items-start":"flex flex-col justify-center items-center")}> 
              {items.map((item,index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className='opacity-[0.7]'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <item.icon size={20} className='text-white'/>
                        </TooltipTrigger>
                        {!open? 
                        <TooltipContent side='right' className='bg-[#d8d8d8]'>
                          <p className='text-[#313131] text-[14px] z-50'>{item.title}</p>
                        </TooltipContent>:""}
                      </Tooltip>
                    </TooltipProvider>
                      <span className='text-white font-bold'>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='p-0 pb-1 px-0.2'>
          <DropdownMenu>
            <DropdownMenuTrigger>
                <section className={cn('flex flex-row gap-x-1 rounded-[4px] justify-center p-1',open?"hover:bg-[#d8d8d833] cursor-pointer":"")}>
                  <div className={cn(" rounded-full",open?"w-[38px] h-[38px]":"w-[40px] h-[40px] cursor-pointer")}>
                      <img src={user.length!=0?user[0].avatar:""} alt="user-profile" className='w-full h-full object-fit-contain'/>
                  </div>
                  {open?
                    <div className='flex flex-row items-center'>
                        <div className='flex flex-col items-start text-white'>
                          <h1 className='text-[14px] font-bold capitalize'>{user.length!=0?user[0].name:""}</h1>
                          <p className='text-[12px]'>{user.length!=0?user[0].email:""}</p>
                        </div>
                        <ChevronsUpDown size={20} className='text-white'/>
                    </div>:
                    ""}
                </section>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='right' sideOffset={10} className='bg-[#313131] border-none text-white'>
              <DropdownMenuItem className='flex flex-'>
                <div className={cn(" rounded-full w-[28px] h-[28px] ")}>
                      <img src={user.length!=0?user[0].avatar:""} alt="user-profile" className='w-full h-full object-fit-contain'/>
                  </div>
                    <div className='flex flex-row items-center'>
                        <div className='flex flex-col text-white'>
                          <h1 className='text-[14px] font-bold capitalize'>{user.length!=0?user[0].name:""}</h1>
                          <p className='text-[12px]'>{user.length!=0?user[0].email:""}</p>
                        </div>
                    </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="text-white bg-white opacity-[0.5]" />
              <DropdownMenuItem onClick={Logout} className='flex flex-row items-center w-full cursor-pointer text-red-400 hover:bg-[#d8d8d833]'>
                  <LogOut />
                  Se Déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
)
}

export default SideBar