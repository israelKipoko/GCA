import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { fr } from 'date-fns/locale';
import { Calendar, Home, Inbox, Search, Settings, BriefcaseBusiness, Users, ChevronsUpDown, LogOut, UserCircle, UserPlus } from "lucide-react"
import logo2 from '../../../../public/icons/mobeko_logo2.png';
import logo1 from '../../../../public/icons/Mobeko_logo1.png';
import googleCalendarIcon from '../../../../public/icons/google-calendar.png';
import microsoftCalendar from '../../../../public/icons/microsoft-calendar.png';
import todoIcon from '../../../../public/icons/todo-icon.png';
import SettingsDialog from '../utils/Settings';
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
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog"
  import { cn } from "../../../../lib/utils";

const SideBar = ({refreshLayout, allUsers}) =>{
  const [items, setItems] = useState([]);
  const [apps, setApps] = useState([]);
  const [user, setUser] = useState([]);
  const [tabToOpen, setTabToOpen] = useState("settings");
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

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
            {
              title: "Clients",
              url: "/home/clients?q=clients",
              icon: Users
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

    setApps([
      {
        name: "Google Calendar",
        status: "pas connecté",
        icon: googleCalendarIcon
      },
      {
        name: "Outlook Calendar",
        status: "pas connecté",
        icon: microsoftCalendar
      },
      {
        name: "Todo",
        status: "pas connecté",
        icon: todoIcon
      },
    ]);
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
    <Sidebar className='dark:bg-dark-secondary bg-light-secondary  z-10 border-none'>
    <SidebarHeader className='p-1.5'>
        <div className='bg-[#007bff] rounded-[4px]  flex justify-center'>
          <div className='w-full  h-[40px] flex items-center  justify-center'>
              {open?<img src={logo1} alt='logo' className='w-[170px] object-fit-contain'/>: <img src={logo2} alt='logo' className='w-[70px] h-[40px] object-fit-contain'/>}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className='flex flex-col justify-between'>
        <SidebarGroup >
          <SidebarGroupContent className='mt-4'>
            <SidebarMenu className={cn('',open?"flex flex-col items-start ":"flex flex-col justify-center items-center")}> 
              {items.map((item,index) => (
                <SidebarMenuItem key={index} className='dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-md w-full'>
                  <SidebarMenuButton asChild className='w-full '>
                    <a href={item.url} className=''>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <item.icon size={18} className='dark:text-white text-dark-secondary opacity-[0.8]'/>
                        </TooltipTrigger>
                        {!open? 
                        <TooltipContent side='right' className='dark:bg-[#d8d8d8] bg-[#292929] opacity-1'>
                          <p className='dark:text-[#313131] text-light-secondary text-[14px] z-50'>{item.title}</p>
                        </TooltipContent>:""}
                      </Tooltip>
                    </TooltipProvider>
                      <span className='dark:text-white text-dark-secondary font-bold dark:opacity-[0.8]'>{item.title}</span>
                    </a>
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
                    {/* <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogTrigger>
                          <SidebarMenuButton className='opacity-[0.7]'>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Cable size={20} className='text-white' />
                                </TooltipTrigger>
                                {!open? 
                                <TooltipContent side='right' className='bg-[#d8d8d8]'>
                                  <p className='text-[#313131] text-[14px] z-50'>Connections</p>
                                </TooltipContent>:""}
                              </Tooltip>
                            </TooltipProvider>
                              <span className='text-white font-bold'>Connections</span>
                          </SidebarMenuButton>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] bg-[#262626] border-none">
                        <DialogHeader>
                          <DialogTitle className="text-white font-bold">
                              Connections
                          </DialogTitle>
                          <DialogDescription className="text-white font-bold opacity-[0.8] ">
                              Établissez des connexions avec diverses applications afin de faire de Modeko une solution tout-en-un.
                          </DialogDescription>
                        </DialogHeader>

                          <section className='mt-2'>
                              <div className='grid grid-cols-2 gap-4'>
                               {apps.map((app,index) => (
                                  <div key={index} className='relative apps flex flex-col rounded-[4px] py-2 px-1'>
                                     <div className='flex flex-row text-white'>
                                       <div className='w-[50px] h-[50px]'>
                                        <img src={app.icon} alt="" />
                                       </div>
                                       <div>
                                         <h1 className='text-[14px] font-bold ml-3'>{app.name}</h1>
                                         <p className='text-[14px] opacity-[0.75] capitalize text-center'>{app.status}</p>
                                       </div>
                                     </div>
                                     <div className='w-fit ml-auto mr-1'>
                                      <button className='text-[#0f6cbd] text-[14px] p-1 hover:underline'>Connecter</button>
                                     </div>
                                     {/* <div>
                                       <p className='text-[#262626] text-[14px]'>Description</p>
                                     </div> 
                                     <div className='absolute inset-0 bg-[#31313199] flex items-center justify-center'>
                                       <p className='text-white capitalize font-bold opacity-[0.9]'>Bientôt disponible</p> 
                                     </div>
                                  </div>
                                      ))}
                              </div>
                          </section>
                  </DialogContent>
                  </Dialog> */}
                    </SidebarMenuItem>
                    <SidebarMenuItem className='dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-md w-full' >
                        <SidebarMenuButton className='' onClick={()=>{setOpenSettingsDialog(true), setTabToOpen('settings')}}>
                          <TooltipProvider>
                              <Tooltip>
                              <TooltipTrigger>
                                  <Settings size={18} className='dark:text-white text-dark-secondary opacity-[0.8]' />
                              </TooltipTrigger>
                              {!open? 
                              <TooltipContent side='right' className='dark:bg-[#d8d8d8] bg-[#292929] opacity-1'>
                                  <p className='text-[#313131] text-[14px] z-50'>Paramètres</p>
                              </TooltipContent>:""}
                              </Tooltip>
                          </TooltipProvider>
                              <span className='dark:text-white text-dark-secondary font-bold dark:opacity-[0.8]'>Paramètres</span>
                          </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
             </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='p-0 pb-1 px-0.2'>
          <DropdownMenu>
            <DropdownMenuTrigger>
                <section className={cn('flex flex-row gap-x-1 rounded-[4px] justify-center p-1',open?"dark:hover:bg-[#d8d8d833] hover:bg-light-hover cursor-pointer":"")}>
                  <div className={cn(" rounded-full",open?"w-[38px] h-[38px]":"w-[35px] h-[35px] cursor-pointer")}>
                      <img src={user.length!=0?user[0].avatar:""} alt="user-profile" className='w-full h-full rounded-full object-fit-contain'/>
                  </div>
                  {open?
                    <div className='flex flex-row items-center'>
                        <div className='flex flex-col items-start dark:text-white text-dark-secondary'>
                          <h1 className='text-[14px] font-bold capitalize'>{user.length!=0?user[0].name:""}</h1>
                          <p className='text-[12px]'>{user.length!=0?user[0].email:""}</p>
                        </div>
                        <ChevronsUpDown size={20} className='dark:text-white text-dark-secondary'/>
                    </div>:
                    ""}
                </section>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='right' sideOffset={10} className='dark:bg-[#313131] bg-light-secondary shadow-custom border-none text-white'>
              <DropdownMenuItem className='flex flex-'>
                <div className={cn(" rounded-full w-[24px] h-[24px] ")}>
                      <img src={user.length!=0?user[0].avatar:""} alt="user-profile" className='w-full h-full rounded-full object-fit-contain'/>
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
                Mon profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{setOpenSettingsDialog(true), setTabToOpen('members')}} className='flex flex-row items-center w-full cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-md'>
                <UserPlus className='dark:text-white text-dark-secondary'/>
                 Inviter des membres
              </DropdownMenuItem>
              <DropdownMenuSeparator className="text-white bg-white opacity-[0.5]" />
              <DropdownMenuItem onClick={Logout} className='flex flex-row items-center w-full cursor-pointer dark:text-red-400 text-red-600 dark:hover:bg-[#d8d8d833] hover:bg-light-hover'>
                  <LogOut />
                  Se Déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
      <SettingsDialog user={user} allUsers={allUsers} refreshParent={refreshParent} refreshLayout={refreshLayout} openedTab={tabToOpen} openSettingsDialog={openSettingsDialog} setOpenSettingsDialog={setOpenSettingsDialog}/>
    </Sidebar>
)
}

export default SideBar