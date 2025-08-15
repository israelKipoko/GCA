"use client"

import { useTranslation } from "react-i18next";
import { X, User, Mail, Phone, MapPin, BriefcaseBusiness, Check,Pencil, Camera } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../../components/ui/tooltip";

interface ViewClient {
    id: any,
    name: string,
    sector: string,
    email: string;  // Assuming userId is a number
    phone:any;
    location: string;
    cases: any;
    clientCases: any;
    logo:any,
    refresh: ()=> void;
  }
const ViewClient: React.FC<ViewClient> = ({ 
    id,
    name,
    sector,
    email, 
    phone,
    location, 
    cases,
    clientCases,
    logo,
    refresh,
  }) => {
    const { t } = useTranslation();
    const [isChanging, setIsChanging] = useState(false);
    const [field, setField] = useState("");
    const [isChangingEmail, setIsChangingEmail] = useState(false);
    const [newName, setNewName] = useState(name);
    const [newlogo, setNewLogo] =  useState<string | null>(""); // or null if you pre
    const [newEmail, setNewEmail] = useState(email);
    const [isLoading, setIsLoading] = useState(false);

    const modifyClient = async (value:any, field:string) =>{
        if(value === name) return;
        setIsLoading(true);
        console.log(field)
        try {
            await axios.put('/clients/modify-values', {
                id,
                field,
                value,
            });
            refresh();
            setIsChanging(false);
            setField("");
          
        } catch (error) {
            console.log(error)
        }finally {
            setIsLoading(false);
        }
    }

    const changeLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
         if (!file) return;

            // const reader = new FileReader();
            // reader.onloadend = () => {
            // if (typeof reader.result === "string") {
            //     setNewLogo(reader.result); // base64 string
            // }
            // };
            // reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append("logo", file); // 'logo' must match the field in Laravel's $request->file('logo')
            formData.append("id", id);     // pass any other data you need
          try {
            const response = await axios.post("/clients/update-logo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            });

            console.log("Upload success:", response.data);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };
  return (
    <section>   
     <div className="flex items-center gap-x-2 mb-4">
        <input type="file"  accept="image/*" className="hidden" id="image" name="image" onChange={changeLogo}/>

         <label htmlFor="image" id="image" className="relative cursor-pointer rounded-full w-16 h-16 flex items-center justify-center bg-[#ffffff44]">
            {logo == ""? 
                <User size={30} className=" dark:text-white text-dark-secondary"/>
            :
            <img src={logo} alt="logo"  className="w-full h-full object-contain rounded-full"/>
            }
            <div className="absolute -right-0.5 bottom-0 w-6 h-6 rounded-full  bg-action flex items-center justify-center">
                <Camera size={18} className=" dark:text-white text-dark-secondary"/>
            </div>
        </label> 
             {isChanging && field === "name"?
               <div className='flex items-center justify-center dark:text-white text-dark-secondary '>
                    <input type="text" value={newName} autoFocus={true} onChange={(e)=>setNewName(e.target.value)} className=' capitalize bg-transparent w-[150px] border-none outline-none focus:ring-0 focus:outline-none'/>
                {
                  !isLoading?<div className='flex items-center justify-center my-1 gap-x-2'>
                    <div onClick={()=>modifyClient(newName,field)} className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer dark:bg-dark-hover bg-light-hover ${newName === name && "opacity-[0.5]"}`}><Check size={14} /></div>
                    <div onClick={()=>{setIsChanging(false); setField("")}} className='w-6 h-6 rounded-md flex items-center justify-center cursor-pointer dark:bg-dark-hover bg-light-hover'><X  size={14}/></div>
                  </div>
                  :
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
                    }
                </div>
                :
              <div  className="flex items-center h-fit gap-x-3 capitalize font-bold text-muted-foreground dark:text-white text-dark-secondary ">
                 <h1 className="font-bold capitalize flex flex-col  dark:text-white text-dark-secondary"> {name} </h1> 
                 <TooltipProvider>
                      <Tooltip >
                          <TooltipTrigger onClick={()=>{setIsChanging(true); setField("name")}} className='cursor-pointer w-7 h-7 rounded-full flex items-center justify-center'>
                            <Pencil size={14} className='dark:text-white text-dark-secondary'/>
                          </TooltipTrigger>
                      <TooltipContent className=' z-10'>
                          <p className='text-[12px]'>Modifier le nom</p>
                      </TooltipContent>
                      </Tooltip>
                  </TooltipProvider>
                </div>
            }
            {/* // <span className="text-[13px] ">{sector}</span> */}
    </div>
   <div className=" px-6 flex flex-col gap-y-4">
        <div className="dark:text-white text-dark-secondary flex items-center gap-x-2">
            <Mail size={20}/>
            {isChanging && field === "email"?
                 <div className='flex items-center justify-center dark:text-white text-dark-secondary '>
                    <input type="email" value={newEmail} autoFocus={true} onChange={(e)=>setNewEmail(e.target.value)} className=' bg-transparent w-[150px] border-none outline-none focus:ring-0 focus:outline-none'/>
                {
                  !isLoading?<div className='flex items-center justify-center my-1 gap-x-2'>
                    <div  className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer dark:bg-dark-hover bg-light-hover ${newEmail === email && "opacity-[0.5]"}`}><Check size={14} /></div>
                    <div onClick={()=>{setIsChanging(false); setField("")}} className='w-6 h-6 rounded-md flex items-center justify-center cursor-pointer dark:bg-dark-hover bg-light-hover'><X  size={14}/></div>
                  </div>
                  :
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
                    }
                </div>
                :
                  <div  className="flex items-center h-fit gap-x-3 text-muted-foreground dark:text-white text-dark-secondary ">
                 <h1 className="flex flex-row gap-x-2 items-center dark:text-white text-dark-secondary">{email}</h1> 
                 {/* <TooltipProvider>
                      <Tooltip >
                          <TooltipTrigger  onClick={()=>{setIsChanging(true); setField("email")}} className='cursor-pointer w-7 h-7 rounded-full flex items-center justify-center'>
                            <Pencil size={14} className='dark:text-white text-dark-secondary'/>
                          </TooltipTrigger>
                      <TooltipContent className=' z-10'>
                          <p className='text-[12px]'>Modifier l'email</p>
                      </TooltipContent>
                      </Tooltip>
                  </TooltipProvider> */}
                </div>
                }
        </div>
        <div >
            <h1 className="flex flex-row gap-x-2 items-center dark:text-white text-dark-secondary">
            <Phone size={20}/> {phone}
            </h1> 
        </div>
        <div >
            <h1 className="flex flex-row gap-x-2 items-center dark:text-white text-dark-secondary">
            <MapPin size={20}/> {location}
            </h1> 
        </div>
            {cases? (
                <div className="px-2 flex flex-col gap-y-1">
                <div>
                    <h1 className="font-bold dark:text-white text-dark-secondary">Dossiers</h1>
                </div>
                <div className="flex flex-col gap-y-2 px-4">
                    {clientCases.map((clientCase:any, index:any) => (
                        <div className="flex flex-row gap-x-2 items-center dark:text-white text-dark-secondary">
                        <BriefcaseBusiness size={15}/> 
                            <a href={`/home/pending-cases/${clientCase.id}`} className="capitalize text-[14px] font-bold flex flex-row items-center gap-x-6 hover:underline">{clientCase.title} </a>
                        </div>
                        // <Accordion type="single" collapsible className="w-full border-b rounded-none" key={index}>
                        //   <AccordionItem value={clientCase.title}>
                        //     <AccordionTrigger className="bgd-[#ffffff44] borded-b rounded-md py-2 text-white font-bold capitalize">
                        //       <div className="flex flex-row gap-x-2 items-center">
                        //         <BriefcaseBusiness size={18}/> 
                        //          <h1 className="capitalize text-[14px]">{clientCase.title}</h1>
                        //       </div>
                        //       </AccordionTrigger>
                        //     <AccordionContent className="bg-d[#ffffff44] rounded-b-md text-white">
                                
                        //     </AccordionContent>
                        //   </AccordionItem>
                        // </Accordion>
                    ))}
                </div>
                </div>
            ) : ""}
        </div>
        </section>
  )
}

export default ViewClient