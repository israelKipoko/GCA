import React, { useEffect, useState,useRef,useContext } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { SlidersHorizontal, UserRoundCog, Users, SquareArrowUpRight, Camera } from "lucide-react"
import axios from 'axios';
import { Switch } from "../../../../components/ui/switch"
import { ScrollArea } from "../../../../components/ui/scroll-area";
import ChangeEmailDialog from '../Dialogs/ChangeEmail';
import { ThemeContext } from '../../ThemeProvider';
import logo2 from '../../../../public/icons/mobeko_logo2.png';
import Members from "./members";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../../../../components/ui/select";

  import { cn } from "../../../../lib/utils";
import DeleteAccountDialog from '../Dialogs/DeleteAcount';
import { useTranslation } from "react-i18next";

const SettingsDialog = ({ user, allUsers, refreshParent, refreshLayout, openedTab, openSettingsDialog, setOpenSettingsDialog }) =>{
   
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    };

    const [activeTab, setActiveTab] = useState(openedTab);

    const [name, setName] = useState(user.length!=0?user[0].name:"");
    const [isRemembered, setIsRemembered] = useState(user.length!=0?(user[0].remember==1?true:false):false);
    const [password, setPassword] = useState("");

    // Dialogs //
    const [openRememberDialog, setOpenRememberDialog] = useState(false);
    const [openEmailDialod, setOpenEmailDialog] = useState(false);
    const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);

    const [loading, setLoading] = useState(false);

    const timeoutRef = useRef(null);
    
    const settingsTabs = [
        { 
            name: "Profil",
            value: "profile",
            icon: UserRoundCog
        },
        { 
            name: "Paramètres",
            value: "settings",
            icon: SlidersHorizontal
        },
        { 
            name: "Membres",
            value: "members",
            icon: Users
        },
        // { 
        //     name: "Connexion",
        //     value: "connections",
        //     icon: SquareArrowUpRight
        // },
    ]

    const updateName = (e) => {
        
        let capturedName = e.target.value;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        function submitChange(){
            const names = capturedName.split(/\s+/);
            
            axios.post('/Mobeko/update/user-name',{
               names: names, 
            })
            .then(response => {
                refreshParent();
            })
            .catch(error => {
            console.log(error.message)
            });
        }

        if(e.target.value !== user[0].name){
            timeoutRef.current = setTimeout(() => {
                submitChange();
            }, 5000);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        setLoading(true);

        axios.post("/Mobeko/update/profile-picture", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then(response => {
            refreshParent();
        })
        .catch(error => {
            console.error("Upload failed:", error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const submitPassword = (e) =>{
        e.preventDefault();

        const formData = new FormData();
        formData.append("password", password);
        formData.append("email", user[0].email);
        formData.append("remember", isRemembered);

        axios.post("/Mobeko/update/remember-session", formData)
        .then(response => {
            refreshParent();
            setOpenRememberDialog(false);
        })
        .catch(error => {
            console.error("Upload failed:", error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }
   useEffect(()=>{
    
   })
return (
    <Dialog open={openSettingsDialog} onOpenChange={setOpenSettingsDialog}>
        <DialogContent className="md:max-w-[1000px] h-[450px] border-none p-0 rounded-md">
            <DialogTitle className="dark:text-white text-dark-secondary font-bold hidden">
            </DialogTitle>
              <Tabs defaultValue={openedTab} className="flex w-full p-0">
                <TabsList className="p-2 flex-col gap-y-0.5 w-[300px] justify-start items-start todo_wrapper_tabs_list h-full">
                    <section className={cn('flex flex-row gap-x-2 rounded-[4px] items-center justify-center p-1')}>
                        <div className={cn(" rounded-full w-[25px] h-[25px] cursor-pointer")}>
                            <img src={user.length!=0?user[0].avatar:""} alt="user-profile" className='w-full h-full rounded-full object-fit-contain'/>
                        </div>
                        <div className='flex flex-row items-center  opacity-[0.8]'>
                            <div className='flex flex-col items-start dark:text-white text-dark-secondary'>
                            <h1 className='text-[14px] font-bold capitalize'>{user.length!=0?user[0].name:""}</h1>
                            <p className='text-[12px]'>{user.length!=0?user[0].email:""}</p>
                            </div>
                        </div>
                    </section>
                    {settingsTabs.map((tab,index)=> (
                        <TabsTrigger key={index} onClick={()=> setActiveTab(tab.value)} value={tab.value} className={cn("todo_wrapper_tabs dark:text-white text-dark-secondary opacity-[0.8] font-bold",activeTab==tab.value?"active_tab":"")}>
                           <div>
                                <tab.icon size={16}/> <h1>{tab.name}</h1>  
                            </div> 
                        </TabsTrigger>
                    ))}
                </TabsList>
                
                <TabsContent value="profile" className=' w-full h-[450px] m-0 p-3 rounded-md'>
                    <section className='h-full'>
                        <ScrollArea className='h-full'>
                            <h1 className="font-bold opacity-[0.8] dark:text-white text-dark-secondary text-[20px]">Mon Profil</h1>
                            <div className='w-full h-full'>
                                <div className='flex flex-col items-center  gap-y-3 w-fit mx-auto my-6'>
                                    <div className='w-[80px] h-[80px] relative rounded-full'>
                                        <img src={user.length!=0?user[0].avatar:""} alt="" className='w-full h-full rounded-full object-fit-contain' />
                                        <div className='bg-[#31313144] opacitvy-[0.3] absolute inset-0 rounded-full '>
                                            <input  type="file"   id="avatar" onChange={handleImageChange}  className='hidden z-10 w-full h-full rounded-full' />
                                            {loading ? (
                                                <div className='flex items-center jusity-center cursor-pointer w-full h-full rounded-full'>
                                                    <svg 
                                                        className="animate-spin h-5 w-5 text-white mx-auto" 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        fill="none" 
                                                        viewBox="0 0 24 24">
                                                        <circle 
                                                        className="opacity-25" 
                                                        cx="12" 
                                                        cy="12" 
                                                        r="10" 
                                                        stroke="currentColor" 
                                                        strokeWidth="4"
                                                        ></circle>
                                                        <path 
                                                        className="opacity-75" 
                                                        fill="currentColor" 
                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                                ) : (
                                                    <label htmlFor="avatar" className='flex items-center jusity-center cursor-pointer w-full h-full rounded-full'>
                                                        <Camera color='#fff' className='mx-auto opacity-[1]'/>
                                                    </label>
                                                )}
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        className="short_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                                        name="name"
                                        value={name}
                                        onChange={(e)=> {setName(e.target.value); updateName(e)}}
                                        placeholder="Entrer votre nom"
                                        required autoComplete='off'/>
                                </div>
                                <div>
                                    <p className='dark:text-white text-dark-secondary font-normal capitalize pb-3 border-b dark:border-[#ffffff11] border-light-hover '>paramètres du compte</p>
                                    <div className='flex flex-col gap-y-4'>
                                        <div className='flex flex-row justify-between items-start py-2'>
                                            <div className='flex flex-col'>
                                                <h1 className='dark:text-white text-dark-secondary capitalize text-[15px]'>Email</h1>
                                                <p className='text-[13px] dark:text-white text-dark-secondary opacity-[0.8] w-[400px] leading-tight'>
                                                    {user.length!=0?user[0].email:""}
                                                </p>
                                            </div>
                                            <div>
                                                <button onClick={setOpenEmailDialog} type="submit" className=' w-full py-1.5 px-2 dark:bg-[#d8d8d811] bg-[#29292922] transition-all hover:dark:bg-[#d8d8d833] hover:bg-[#29292933] opacity-[0.8] rounded-[4px] flex justify-center dark:text-white text-dark-secondary text-[14px] font-bold'>
                                                    Changer d'Email
                                                </button>
                                            </div>
                                        </div>
                                        <div className='flex flex-row justify-between items-start py-2'>
                                            <div className='flex flex-col'>
                                                <h1 className='dark:text-white text-dark-secondary capitalize text-[15px]'>Se souvenir de vous</h1>
                                                <p className='text-[13px] dark:text-white text-dark-secondary opacity-[0.8] w-[400px] leading-tight'>
                                                    Restez connecté à l’application sans avoir à saisir votre mot de passe à chaque connexion
                                                </p>
                                            </div>
                                            <div>
                                                <Switch
                                                    checked={isRemembered}
                                                    onCheckedChange={setOpenRememberDialog}
                                                    />
                                            </div>
                                        </div>
                                        <div className='flex flex-row justify-between items-start py-2 border-t border-[#ffffff11]'>
                                            <div className='flex flex-col'>
                                                <h1 className='dark:text-[#D84444] text-red-600 capitalize text-[15px]'> Supprimer mon Compte</h1>
                                                <p className='text-[13px]  dark:text-white text-dark-secondary opacity-[0.8] w-[400px] leading-tight'>
                                                    Supprimer définitivement votre compte.
                                                </p>
                                            </div>
                                            <div>
                                                <button onClick={setOpenDeleteAccountDialog} type="button" className=' w-full py-1.5 px-2 dark:bg-[#D84444] bg-red-600 transition-all hover:dark:bg-[#D84444D9] hover:bg-red-500 opacity-[0.8] rounded-[4px] flex justify-center text-white text-[14px] font-bold'>
                                                    Supprimer
                                                </button>
                                            </div>
                                            <DeleteAccountDialog userId={user.length!=0?user[0].id:""} openDeleteAccountDialog={openDeleteAccountDialog} setOpenDeleteAccountDialog={setOpenDeleteAccountDialog}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </section>
                </TabsContent>
                <TabsContent value="settings" className=' w-full  h-[450px] m-0 p-3'>
                    <section className='h-full'>
                        <ScrollArea className='h-full'>
                        <h1 className="font-bold opacity-[0.8] dark:text-white text-dark-secondary text-[20px]">Paramètres</h1>
                            <div className='flex flex-row justify-between items-start py-2 my-4 mb-4'>
                                <div className='flex flex-col'>
                                    <h1 className='dark:text-white text-dark-secondary capitalize text-[15px]'>Langage</h1>
                                    <p className='text-[13px] dark:text-white text-dark-secondary opacity-[0.8] w-[400px] leading-tight'>
                                        Changer la langue utilisée sur votre interface utilisateur.
                                    </p>
                                </div>
                                <div>
                                <Select value={i18n.language}  onValueChange={changeLanguage} >
                                    <SelectTrigger className="w-[120px] dark:bg-[#d8d8d811] bg-[#29292922] transition-all hover:dark:bg-[#d8d8d833] opacity-[0.8] rounded-md outline-none focus:outline-none dark:text-white text-dark-secondary">
                                        <SelectValue  placeholder="Langage" />
                                    </SelectTrigger>
                                    <SelectContent className=''>
                                        <SelectItem value="en-US" className='cursor-pointer  '>Anglais</SelectItem>
                                        <SelectItem value="fr"  className='cursor-pointer'>Français</SelectItem>
                                    </SelectContent>
                                </Select>
                                </div>
                            </div>
                            <div className='w-full h-full my-6'>
                                <div className='flex flex-row justify-between items-start py-2'>
                                    <div className='flex flex-col pt-3'>
                                        <h1 className='dark:text-white text-dark-secondary capitalize text-[15px]'>Thème</h1>
                                        <p className='text-[13px] dark:text-white text-dark-secondary opacity-[0.8] w-[400px] leading-tight'>
                                            Personnalisez l'apparence de Mobeko.
                                        </p>
                                    </div>
                                    <div className='flex flex-row gap-x-4'>
                                        <div className="flex flex-col space-y-2">
                                            <label className="flex flex-col gap-y-3 items-center  space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="theme"
                                                    value="dark"
                                                    checked={theme === "dark"}
                                                    onChange={() => toggleTheme("dark")}
                                                    className="hidden"
                                                />
                                                <div className="text-black flex flex-row w-[120px] shadow-custom h-[80px]">
                                                    <div className='w-9 h-full  bg-[#313131] overflow-hidden'>
                                                        <div className='w-9 h-9 -mt-1 -ml-1 kbg-[#007bff] '>
                                                            <img src={logo2} alt='logo' className='w-full h-full object-fit-contain'/>
                                                        </div>
                                                    </div>
                                                    <div className='w-full bg-[#262626] flex flex-col items-center justify-center gap-y-2 p-2'>
                                                        <div className='rounded-[4px] w-full h-3 bg-[#d8d8d833] '></div>
                                                        <div className='rounded-[4px] w-full h-3 bg-[#d8d8d833] '></div>
                                                        <div className='rounded-[4px] w-full h-3 bg-[#d8d8d833] '></div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`w-5 h-5 flex items-center justify-center border-2 rounded-full
                                                    border-[#335b74]`}>
                                                    {theme === "dark"? <div className="w-3 h-3 bg-[#0f6cbd] rounded-full"></div>:""}
                                                </div>
                                            </label>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <label className="flex flex-col gap-y-3 items-center  space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="theme"
                                                     value={"light"}
                                                     checked={theme === "light"}
                                                     onChange={() => toggleTheme("light")}
                                                    className="hidden"
                                                />
                                                <div className="text-black flex flex-row w-[120px] shadow-custom h-[80px]">
                                                    <div className='w-[28px] h-full  bg-[#313131] '>
                                                        <div className='w-9 h-9 -mt-1 -ml-1 bcg-[#007bff] '>
                                                            <img src={logo2} alt='logo' className='w-full h-full object-fit-contain'/>
                                                        </div>
                                                    </div>
                                                    <div className='w-full bg-[#D9D9D9] flex flex-col items-center justify-center gap-y-2 p-2'>
                                                        <div className='rounded-[4px] w-full h-3 bg-[#29292933] '></div>
                                                        <div className='rounded-[4px] w-full h-3 bg-[#29292933] '></div>
                                                        <div className='rounded-[4px] w-full h-3 bg-[#29292933] '></div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`w-5 h-5 flex items-center justify-center border-2 rounded-full
                                                    border-[#335b74]`}>
                                                    {theme === "light"? <div className="w-3 h-3 bg-[#0f6cbd] rounded-full"></div>:""}
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </section>
                </TabsContent>
                <TabsContent value="connections" className=' w-full h-full m-0'>
                    <h1>connection</h1>

                </TabsContent>
                <TabsContent value="members" className=' w-full h-[450px] m-0 p-3'>
                    <section className='h-full'>
                        <ScrollArea className='h-full'>
                            <h1 className="font-bold opacity-[0.8] dark:text-white text-dark-secondary text-[20px]">Membres</h1>
                            <Members allUsers={allUsers} refreshLayout={refreshLayout}/>
                        </ScrollArea>
                    </section>
                </TabsContent>
            </Tabs> 
        </DialogContent>
        <Dialog open={openRememberDialog} onOpenChange={setOpenRememberDialog}>
            <DialogContent className="md:max-w-[350px] h-[250px] border-none p-3">
                <DialogTitle className=" font-bold hidden">
                </DialogTitle>
                <form onSubmit={submitPassword} className='w-full flex flex-col items-center justify-center gap-y-4 '>
                    <h1 className='dark:text-white text-dark-secondary  text-left text-[15px] text-center'>Entrez votre mot de passe pour confirmer</h1>
                    <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                        <label htmlFor="password" className='dark:text-white text-dark-secondary opacity-[0.8]'>Mot de passe:</label>
                        <input  
                            type="password"
                            className="custome_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            placeholder="Entrez votre mot de passe"
                            autoComplete='off'
                            autoFocus/>
                    </div>
                    <button  disabled={loading}  type="submit" className=' w-full py-1.5 px-4 bg-[#356B8C] rounded-[4px] flex justify-center text-white font-bold'>
                          {loading ? (
                            <>
                              <svg 
                                className="animate-spin h-5 w-5 text-white" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24"
                              >
                                <circle 
                                  className="opacity-25" 
                                  cx="12" 
                                  cy="12" 
                                  r="10" 
                                  stroke="currentColor" 
                                  strokeWidth="4"
                                ></circle>
                                <path 
                                  className="opacity-75" 
                                  fill="currentColor" 
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                              </svg>
                            </>
                          ) : (
                            "Confirmer"
                          )}
                      </button>
                </form>
            </DialogContent>
        </Dialog>
        <ChangeEmailDialog userEmail={user.length!=0?user[0].email:""} openEmailDialod={openEmailDialod} setOpenEmailDialog={setOpenEmailDialog}/>
  </Dialog>
)
}

export default SettingsDialog