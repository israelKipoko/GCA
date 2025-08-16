import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Library, Home, Settings, BriefcaseBusiness, Users, ChevronsUpDown, LogOut, UserCircle, UserPlus } from "lucide-react"
import logo2 from '../../../../public/icons/mobeko_logo2.png';
import logo1 from '../../../../public/icons/Mobeko_logo1.png';
import SettingsDialog from '../utils/Settings';
import AddUser from '../Dialogs/AddUser';
import { useTranslation } from "react-i18next";
import { Link ,router} from '@inertiajs/react';
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
    useSidebar,
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

const SideBar = ({refreshLayout, allUsers, activeTab}) =>{
  const [items, setItems] = useState([]);
  const [user, setUser] = useState([]);
  const [tabToOpen, setTabToOpen] = useState("settings");
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);

  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lang) => {
      i18n.changeLanguage(lang);
      localStorage.setItem("lang", lang);
  };
  function getUserInformation(){

    axios.get('/users/get-information')
    .then(response => {
      var transformedData = response.data.map(element => ({
        id: element.id,
        name: element.firstname +" "+ element.name,
        email: element.email,
        avatar: element.avatar_link,
        role: element.role,
        remember: element.remember,
        googleToken: element.google_refresh_token,
        googleCalendar: element.google_calendar,
        googleDrive: element.google_drive,
        todo: element.microsoft_todo,
        outlookCalendar: element.microsoft_calendar,
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
           title: "Dossiers",
           url: "/home/my-folder?q=myfolder",
           icon: BriefcaseBusiness
         },
          {
            title: "Clients",
            url: "/home/clients?q=clients",
            icon: Users
          },
          {
            title: "Bibliothèque",
            url: "/home/library",
            icon: Library
          },
       ])
     }else{
      setItems([
         {
           title: "Accueil",
           url: "/home",
           icon: Home
         },
         {
           title: "Dossiers",
           url: "/home/my-folder?q=myfolder",
           icon: BriefcaseBusiness
         },
         {
          title: "Bibliothèque",
          url: "/home/library",
          icon: Library
        },
       ])
     }
    })
    .catch(error => {
      console.log(error);
    });
  }
  const Logout = () =>  {

    // axios.post('/logout/user')
    // .then(response => {
      router.post('/logout/user');
    // })
    // .catch(error => {
    //   console.log(error.message)
    // });
  };
  
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshParent = () => {
    setRefreshKey((oldKey) => oldKey + 1);
    refreshLayout();
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
    <Sidebar className='dark:bg-dark-secondary bg-light-thirdly  z-10 border-none'>
    <SidebarHeader className='p-1.5'>
        <div className='bg-[#007bff] rounded-[4px]  flex justify-center'>
          <div className='w-full  h-[40px] flex items-center  justify-center'>
              {isMobile?
                openMobile?<img src={logo1} alt='logo' className='w-[170px] object-contain'/>: <img src={logo2} alt='logo' className='w-[70px] h-[40px] object-contain'/>
                :
              open?<img src={logo1} alt='logo' className='w-[170px] object-contain'/>: <img src={logo2} alt='logo' className='w-[70px] h-[40px] object-contain'/>
              }
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className='flex flex-col justify-between'>
        <SidebarGroup >
          <SidebarGroupContent className='mt-4'>
            <SidebarMenu className={cn('',open?"flex flex-col items-start ":"flex flex-col justify-center items-center")}> 
              {items.map((item,index) => (
                <SidebarMenuItem key={index} className={`flex justify-center dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-md w-full ${activeTab === item.title?"dark:bg-dark-hover bg-light-hover ":""}`}>
                  <SidebarMenuButton asChild className='w-full '>
                    <Link href={item.url} className=''>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <item.icon size={18} className={` opacity-[0.8] dark:text-white  text-dark-secondary `}/>
                        </TooltipTrigger>
                        {!open? 
                        <TooltipContent side='right' className=' dark:bg-[#d8d8d8] bg-[#292929] opacity-1'>
                          <p className='dark:text-[#313131] text-light-secondary text-[14px] z-50'>{t(item.title)}</p>
                        </TooltipContent>:""}
                      </Tooltip>
                    </TooltipProvider>
                      <span className={` font-bold dark:opacity-[0.8] dark:text-white text-dark-secondary `}>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className='mb-4'>
             <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem className='dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-md w-full'>
                    </SidebarMenuItem>
                    <SidebarMenuItem className='flex justify-center dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-md w-full' >
                        <SidebarMenuButton className='' onClick={()=>{setOpenSettingsDialog(true), setTabToOpen('settings')}}>
                          <TooltipProvider>
                              <Tooltip>
                              <TooltipTrigger>
                                  <Settings size={18} className={`dark:text-white text-dark-secondary opacity-[0.8]`} />
                              </TooltipTrigger>
                              {!open? 
                              <TooltipContent side='right' className='dark:bg-[#d8d8d8] bg-[#292929] opacity-1'>
                                  <p className='text-[#313131] text-[14px] z-50'>{t("Paramètres")}</p>
                              </TooltipContent>:""}
                              </Tooltip>
                          </TooltipProvider>
                              <span className='dark:text-white text-dark-secondary font-bold dark:opacity-[0.8]'>{t("Paramètres")}</span>
                          </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
             </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='p-0 pb-1 px-0.2'>
          <DropdownMenu>
            <DropdownMenuTrigger>
                <section className={cn('flex flex-row  w-full gap-x-1 rounded-[4px] justify-between py-2 px-2',open?"dark:hover:bg-[#d8d8d833] hover:bg-light-hover  dark:bg-dark-hover bg-light-hover cursor-pointer":"")}>
                  <div className='flex gap-x-2'>
                    <div className={cn(" rounded-full",open?"w-[38px] h-[38px]":"w-[35px] h-[35px] cursor-pointer")}>
                        <img src={user.length!=0?user[0].avatar:""} alt="user-profile" className='w-full h-full rounded-full object-contain'/>
                    </div>
                     {isMobile?
                      <div className='flex flex-col items-start dark:text-white text-dark-secondary'>
                          <h1 className='text-[14px] font-bold capitalize'>{user.length!=0?user[0].name:""}</h1>
                          <p className='text-[12px]'>{user.length!=0?user[0].email:""}</p>
                        </div>
                      :
                     open &&
                      <div className='flex flex-col items-start dark:text-white text-dark-secondary'>
                        <h1 className='text-[14px] font-bold capitalize'>{user.length!=0?user[0].name:""}</h1>
                        <p className='text-[12px]'>{user.length!=0?user[0].email:""}</p>
                      </div>
                      }
                  </div>
                  {isMobile?
                   <div className='flex flex-row items-center'>
                        <ChevronsUpDown size={20} className='dark:text-white text-dark-secondary'/>
                    </div>
                    :
                  open?
                    <div className='flex flex-row items-center'>
                        <ChevronsUpDown size={20} className='dark:text-white text-dark-secondary'/>
                    </div>:
                    ""}
                </section>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='top' sideOffset={10} className='shadow-lg border-none text-white'>
              <DropdownMenuItem className='flex flex-'>
                <div className={cn(" rounded-full w-[24px] h-[24px] ")}>
                      <img src={user.length!=0?user[0].avatar:""} alt="user-profile" className='w-full h-full rounded-full object-contain'/>
                  </div>
                    <div className='flex flex-row items-center'>
                        <div className='flex flex-col dark:text-white text-dark-secondary'>
                          <h1 className='text-[14px] font-bold capitalize'>{user.length!=0?user[0].name:""}</h1>
                          <p className='text-[12px]'>{user.length!=0?user[0].email:""}</p>
                      </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{setOpenSettingsDialog(true), setTabToOpen('profile')}} className='flex flex-row items-center w-full cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-md'>
                <UserCircle className='dark:text-white text-dark-secondary'/>
                 {t("Profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{setOpenAddUserDialog(true)}} className='flex flex-row items-center w-full cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-md'>
                <UserPlus className='dark:text-white text-dark-secondary'/>
                 {t("Inviter des membres")}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="text-white bg-white opacity-[0.5]" />
              <DropdownMenuItem onClick={Logout} className='flex flex-row items-center w-full font-bold cursor-pointer dark:text-red-400 text-red-600 dark:hover:bg-[#d8d8d833] hover:bg-light-hover'>
                  <LogOut />
                  {t("Se Déconnecter")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
      <SettingsDialog user={user} allUsers={allUsers} refreshParent={refreshParent} refreshLayout={refreshLayout} openedTab={tabToOpen} openSettingsDialog={openSettingsDialog} setOpenSettingsDialog={setOpenSettingsDialog}/>
      <AddUser openAddUserDialog={openAddUserDialog} setOpenAddUserDialog={setOpenAddUserDialog} dataRefresh={refreshParent} refreshLayout={refreshParent}/>
    </Sidebar>
)
}

export default SideBar