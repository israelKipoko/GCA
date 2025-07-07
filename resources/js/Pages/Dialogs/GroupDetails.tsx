import React,{useState} from 'react'
import { Pencil,Trash2, BriefcaseBusiness, X, Check, Plus} from "lucide-react"
import Confirmation from "./Confirmation"
import NewGroupMember from './NewGroupMember';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { useToast } from "../../../../hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../components/ui/tooltip";
interface NewMemberDialogsProps {
    groupId: any;
    groupName: string,
    description: string,
    groupMembers: any;
    groupCases: any;
    allMembers:any;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    dataRefresh: () => void;
    refreshGroups: () => void;
  }
const GroupDetails: React.FC<NewMemberDialogsProps> = ({ 
    groupId,
    groupName,
    description,
    groupMembers,
    groupCases,
    open, 
    allMembers,
    setOpen,
    dataRefresh,
    refreshGroups
  }) =>  {
const [loading, setLoading] = useState(false);
const { toast } = useToast();

const removeMember = async (id: any, groupId:any) => {
  setLoading(true);

  try {
    await axios.put('/groups/remove-member', {
      id,
      groupId
    });

    setOpenConfirmation(false);
    setOpen(false);
    refreshGroups();
      dataRefresh();

  } catch (error) {
    setOpenConfirmation(false);
    console.log(error)
    setOpen(false);
  } finally {
    setLoading(false);
  }
};
  const [showactions, setShowActions] = useState(null);
  const [isChangingName, setIsChangingName] = useState(false);
  const [newName, setNewName] = useState(groupName);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openNewGroupMemberDialog, setOpenNewGroupMemberDialog] = useState(false);
  
  const text = "Une fois cette action confirmée, le membre ne fera plus partie de ce groupe.";

  const changeName = async () =>{
    if(newName === groupName && newName === "") return;
    setIsLoading(true);
    try {
      await axios.put('/groups/change-name', {
        groupId,
        newName,
      });
      refreshGroups();
      dataRefresh();
      setIsChangingName(false);
       toast({
          variant: "default",
          title: `Le nom du groupe a été modifié!!`,
        })
    } catch (error) {
       toast({
          variant: "destructive",
          title: `Ooups! Une erreur est survenue!`,
        })
    }finally {
      setIsLoading(false);
  }

  }
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:max-w-[550px] ma00px] min-h-[200px] border-none p-6">
           {/* Name of the group */}
            <div className="flex items-center h-fit gap-x-3 capitalize font-bold text-muted-foreground dark:text-white text-dark-secondary ">
               {!isChangingName?
               <div  className="flex items-center h-fit gap-x-3 capitalize font-bold text-muted-foreground dark:text-white text-dark-secondary ">
                <div>{groupName}</div> 
                <TooltipProvider>
                      <Tooltip >
                          <TooltipTrigger onClick={()=>setIsChangingName(true)} className='cursor-pointer w-7 h-7 rounded-full flex items-center justify-center'>
                            <Pencil size={14} className='dark:text-white text-dark-secondary'/>
                          </TooltipTrigger>
                      <TooltipContent className=' z-10'>
                          <p className='text-[12px]'>Changer le nom du groupe</p>
                      </TooltipContent>
                      </Tooltip>
                  </TooltipProvider>
                  </div>
                :
                <div className='flex items-center justify-center'>
                  <input type="text" value={newName} autoFocus={true} onChange={(e)=>setNewName(e.target.value)} className=' capitalize bg-transparent w-[150px] border-none outline-none focus:ring-0 focus:outline-none'/>
                  {
                  !isLoading?<div className='flex items-center justify-center my-1 gap-x-2'>
                    <div onClick={changeName} className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer dark:bg-dark-hover bg-light-hover ${newName === groupName && "opacity-[0.5]"}`}><Check size={14} /></div>
                    <div onClick={()=>setIsChangingName(false)} className='w-6 h-6 rounded-md flex items-center justify-center cursor-pointer dark:bg-dark-hover bg-light-hover'><X  size={14}/></div>
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
              }
            </div>
            {/* Description */}
            {/* <DialogDescription className='h-fit'>
               {description ? description : "Aucune description fournie pour ce groupe."}
            </DialogDescription> */}
            <section className='flex flex-col gap-y-4'>
            <div>
              <h1 className='dark:text-white text-dark-secondary font-bold text-[15px] mb-3'>Membres du groupe</h1>
              <ScrollArea className=' max-h-[300px]'>
              <div className='flex flex-col gap-y-2 mx-2'>
                  {groupMembers && groupMembers.length > 0 ? (
                    groupMembers.map((member: any, index:any) => (
                      <div onMouseEnter={()=>setShowActions(index)} onMouseLeave={()=>setShowActions(null)} className='flex items-center justify-between gap-x-2 cursor-pointer' key={index}>
                        <div className='flex items-center gap-x-2'>
                          <div className=" w-[40px] h-[40px] rounded-full">
                              <img src={member.avatar_link} alt="user-profile" className=" rounded-full w-full h-full object-fit-contain"/>
                          </div>
                          <div>
                            <h1 className='dark:text-white text-dark-secondary capitalize text-[14px] font-bold'>{member.firstname} {member.name}</h1>
                              <p className='text-action text-[14px]'>{member.email}</p>
                          </div>
                        </div>
                        {showactions === index && (
                          <div>
                            <TooltipProvider>
                                <Tooltip >
                                    <TooltipTrigger onClick={()=>{setOpenConfirmation(true); setUserToDelete(member.id)}} className='cursor-pointer w-7 h-7 rounded-full bg-[#D8444433] hover:bg-[#D8444455] flex items-center justify-center'>
                                        <Trash2  size={14} className='text-destructive'/>
                                    </TooltipTrigger>
                                <TooltipContent className=' z-10'>
                                    <p className='text-[12px]'>Retirer du groupe</p>
                                </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                    </div>
                  ))) : (
                    <h1 className='text-[14px] dark:text-white text-dark-secondary'>Aucun membre dans ce groupe.</h1>
                  )}
              </div>
              </ScrollArea>
              {/* Add a new member in the group */}
              <div onClick={()=>setOpenNewGroupMemberDialog(true)} className='flex flex-row items-center gap-x-2 mx-2.5 mt-2 hover:underline cursor-pointer dark:text-white text-dark-secondary'>
                <div className='flex items-center justify-center w-[35px] h-[35px] rounded-full dark:bg-[#d8d8d844] bg-[#29292922] scalling-animation'>
                  <Plus className='text-white'/>
                </div>
                <h1 className='dark:text-white text-dark-secondary capitalize text-[14px] font-bold'>Ajouter un membre</h1>
              </div>
            </div>
             <div className=''>
              <h1 className='dark:text-white text-dark-secondary font-bold text-[15px] mb-3'>Projets assignés</h1>
              <ScrollArea className=' max-h-[200px]'>
                  <div className='flex flex-col gap-y-2 mx-2'>
                  {groupCases && groupCases.length > 0 ? (
                    groupCases.map((caseItem: { title: string; id: string }, index: number) => (
                      <div className='flex items-center justify-between gap-x-2' key={index}>
                        <div className='flex items-center gap-x-2'>
                          <div className="flex items-center justify-center w-[40px] h-[40px] rounded-md bg-[#007bff66]">
                               <BriefcaseBusiness  className=' text-[#fff] ' size={18}/>
                          </div>
                          <div>
                            <Link href={`/home/pending-cases/`+ caseItem.id}>
                              <h1 className='hover:underline cursor-pointer dark:text-white text-dark-secondary capitalize text-[14px] font-bold'>{caseItem.title}</h1>
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                  ))) : (
                    <p className='text-[14px] dark:text-white text-dark-secondary'>Aucun projet assignés à ce groupe.</p>
                  )}
                  </div>
              </ScrollArea>
            </div>
            </section>
        </DialogContent>
    </Dialog>
    <NewGroupMember groupId={groupId} groupName={groupName}  allMembers={allMembers} openNewGroupMemberDialog={openNewGroupMemberDialog} setOpenNewGroupMemberDialog={setOpenNewGroupMemberDialog} dataRefresh={dataRefresh}/>
    <Confirmation text={text} actionLabel='Retirer' loading={loading} open={openConfirmation} setOpen={setOpenConfirmation} action={()=>removeMember(userToDelete, groupId)}/>
    </>
  )
}

export default GroupDetails