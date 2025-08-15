"use client"

import { useTranslation } from "react-i18next";
import { X, Users, Mail, Phone, MapPin, BriefcaseBusiness, Check,Pencil, Camera } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../../components/ui/tooltip";

interface ViewCase {
    title: string,
    description: string,
    status: string;  // Assuming userId is a number
    owner:any;
    priority: string;
    deadLine: any;
    users: any;
    groups:any;
    refresh: ()=> void;
  }
const ViewCase: React.FC<ViewCase> = ({ 
    title,
    description,
    owner, 
    status,
    priority, 
    deadLine,
    users,
    groups,
    refresh,
  }) => {
    const { t } = useTranslation();
    const [isChanging, setIsChanging] = useState(false);
    const [field, setField] = useState("");
    const [isChangingEmail, setIsChangingEmail] = useState(false);
    const [newlogo, setNewLogo] =  useState<string | null>(""); // or null if you pre
    const [isLoading, setIsLoading] = useState(false);

    const months = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
         const formatDate = (dateString:string) =>{
          const date = new Date(dateString);
           // Check if the date is valid in case the user did nıt enter a date
            if (isNaN(date.getTime())) {
              return "..."; 
            }
          const day = date.getDate();
          const month = months[date.getMonth()];
          const year = date.getFullYear();
          return `${day} ${month} ${year}`;
        }

        console.log(groups)
  return (
    <section>   
        <div>
            <div className="flex items-center gap-x-2">
                <div className="flex items-center justify-center w-[35px] h-[35px] rounded-md bg-[#007bff66]">
                    <BriefcaseBusiness  className=' text-[#fff] ' size={18}/>
                </div>
                <h1 className="dark:text-white text-dark-secondary capitalize font-bold">{title}</h1>
            </div>
            <p className="dark:text-white text-dark-secondary px-2 mt-1 text-[14px]">
                {description}
            </p>
        </div>
      <div className="grid gap-4 py-4">
       
          <div className="dark:text-white text-dark-secondary flex flex-col gap-y-4">
            <div className="flex justify-between">
                {/* <div>
                  <label htmlFor="" className="text-[14px]">Client:</label>
                  <h1 className="text-[15px] font-bold">{row.getValue("client")==""?"...":""}</h1>
                </div> */}
                <div className="text-left flex flex-col">
                  <label htmlFor="" className="text-[14px] text-left font-bold mb-1">Statut</label>
                  {status == "pending"?  
                  (<span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 px-3 py-1 text-xs font-medium text-yellow-700">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    {t("pending")}
                  </span>)
                  :
                 (<span className="inline-flex items-center gap-1 rounded-full bg-green-200 px-3 py-1 text-xs font-medium text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    {t("completed")}
                  </span>)
                  }
                </div>
            </div>
             <div className="text-center flex flex-col w-fit ">
                  <label htmlFor="" className="text-[14px] text-left font-bold mb-1">Priorité</label>
                  {priority == "medium"? 
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 px-3 py-1 text-xs font-medium text-yellow-700">
                    <span className="h-2 w-2 rounded-full bg-yellow-700"></span>
                    {t("medium")}
                  </span>
                  :priority == "low"?
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-300 px-3 py-1 text-xs font-medium text-green-700">
                      <span className="h-2 w-2 rounded-full bg-green-700"></span>
                      {t("low")}
                    </span>
                  :
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-200 px-3 py-1 text-xs font-medium text-red-700">
                    <span className="h-2 w-2 rounded-full bg-red-700"></span>
                    {t("high")}
                  </span>}
              </div>
            <div className="flex flex-col gap-y-3">
                <div className="flex flex-col ">
                  <label htmlFor="" className="text-[14px] font-bold">Créé par</label>
                   <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className=" w-fit  ">
                           <img src={owner.avatar_link}  className="w-[35px] h-[35px] rounded-full"/>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#262626] border-none">
                          <p>{owner.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
              <div className="dark:text-white text-dark-secondary flex flex-col gap-y-3">
                  <label htmlFor="" className="text-[14px] text-left font-bold">Assigné à</label>
                <div>
                  <div className=" flex ">
                    {users &&(
                    users.map((user:any, index:any) => (
                          <TooltipProvider key={index}>
                          <Tooltip>
                          {(index==0)?
                            <TooltipTrigger className="border-none w-fit ">
                              <img src={user.avatar_link}  className="w-[35px] h-[35px] rounded-full"/>
                            </TooltipTrigger>:
                              <TooltipTrigger className="border-none w-fit  -ml-2">
                                  <img src={user.avatar_link}  className="w-[30px] h-[30px]  rounded-full" />
                              </TooltipTrigger>}
                            <TooltipContent className="bg-[#262626] border-none">
                              <p>{user.firstname} {user.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                    )))} 
                  </div>
                </div>
             
                <div className=" flex flex-row gap-x-3 ">
                  {groups &&(
                  groups.map((group:any, index:any) => (
                      <div  key={index}>
                        <p className="flex items-center gap-x-2 text-[15px] capitalize"><Users size={14}/> {group.name}</p>
                        <div className="ml-2">
                          {group.users.map((user:any, index:any) =>(
                            <TooltipProvider>
                              <Tooltip>
                              {(index==0)?
                                <TooltipTrigger className="border-none w-fit ">
                                  <img src={user.avatar_link}  className="w-[35px] h-[35px] rounded-full"/>
                                </TooltipTrigger>:
                                  <TooltipTrigger className="border-none w-fit  -ml-2">
                                      <img src={user.avatar_link}  className="w-[30px] h-[30px] rounded-full" />
                                  </TooltipTrigger>}
                                <TooltipContent className="bg-[#262626] border-none">
                                  <p>{user.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                       
                      </div>
                  )))} 
                </div>
              </div>
             
          </div>
          <div className="dark:text-white text-dark-secondary flex flex-col capitalize ">
            <label htmlFor="" className="text-[14px] font-bold">Date limite</label>
             <span className="text-[15px]">{formatDate(deadLine)}</span>
          </div>
        </div>
        </section>
  )
}

export default ViewCase