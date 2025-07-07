import React from 'react'
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog";
import { fr, enUS } from 'date-fns/locale';
  import { Video, Plus,CalendarIcon, CircleCheck,BriefcaseBusiness,Trash2,MoreVertical,Eye,CalendarClock } from 'lucide-react';
  import { format,parseISO, isAfter, isEqual } from "date-fns"
  import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
  } from "../../../../components/ui/tooltip";
function DisplayEvent({openDisplayEvent,setOpenDisplayEvent,event }) {
  return (
     <Dialog open={openDisplayEvent} onOpenChange={setOpenDisplayEvent}>
        <DialogContent className="md:max-w-[450px] max-h-[500px] min-h-[200px] border-none p-3">
            <DialogTitle className="dark:text-white text-dark-secondary font-bold capitalize flex items-center gap-x-2">
               {event?.case == null?
                    <div className='bg-[#ffc10766] rounded-full w-8 h-8 flex items-center justify-center'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild className='cursor-pointer'>
                                    <CalendarClock  className=' text-[#fff] ' size={18}/>
                                </TooltipTrigger>
                                <TooltipContent className='dark:bg-dark-secondary bg-light-thirdly border-none dark:text-white text-dark-secondary'>
                                    <p className='text-[12px] capitalize'>événement</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>:
                    <div className='bg-[#007bff66] rounded-full w-8 h-8 flex items-center justify-center'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild className='cursor-pointer'>
                                    <BriefcaseBusiness  className=' text-[#fff] ' size={18}/>
                                </TooltipTrigger>
                                <TooltipContent className='dark:bg-dark-secondary bg-light-thirdly border-none dark:text-white text-dark-secondary'>
                                    <p className='text-[12px] capitalize'>Dossier</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>}
                {event?.title}
            </DialogTitle>
                {(() => {
                    const description = event?.case?.description || event?.note;
                    if (!description) return ""; // fallback if no date is available
                    try {
                    return(
                    <DialogDescription>
                        {description}
                    </DialogDescription>)
                    } catch {
                    return '—'; // fallback if parse fails
                    }
                })()}
            <section className='flex flex-col gap-y-4'>
                <div className='flex items-center gap-x-3 dark:text-white text-dark-secondary'>
                    <h1 className='font-bold'> {event?.case == null? "Date et heure": "Date limite"}:</h1>
                    <div className='flex items-center gap-x-3'>
                        <span className='text-[14px]'>
                        {(() => {
                                const dateString = event?.case?.due_date || event?.date;
                                if (!dateString) return '—'; // fallback if no date is available
                                try {
                                return (
                                <div className='flex items-center gap-x-2'>
                                    {format(parseISO(dateString), 'dd MMMM', { locale: fr })}
                                </div> )
                                } catch {
                                return '—'; // fallback if parse fails
                                }
                            })()}
                        </span>
                        <span className='flex flex-row text-[14px] gap-x-2 font-bold dark:text-[#fff] text-dark-secondary '><p>à</p> {event?.time.start_time} - {event?.time.end_time}</span>
                        <CalendarClock size={18} className='dark:text-white text-dark-secondary'/>
                    </div>
                    
                </div>
                <div className='flex flex-col items-start gap-x-3 dark:text-white text-dark-secondary'>
                    {event?.participants?.length ?
                    <div>
                        <h1 className='font-bold'>Participants:</h1>
                        <div className="flex ml-3 gap-x-2 assigned_to_profile ">
                        {event.participants.map((user,index) => (
                            <div key={index} className="user_picture element_tooltip_container w-[25px] h-[25px]">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild className='cursor-pointer'>
                                        <div>
                                            <img src={user.avatar_link} alt="user-profile" className='rounded-full w-full h-full object-contain'/>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className='dark:bg-dark-secondary bg-light-thirdly border-none dark:text-white text-dark-secondary'>
                                        <p className='text-[12px]'>{user.firstname} {user.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            </div>
                        ))}
                        </div>
                    </div>:""
                    }
                </div>
                {(() => {
                    const link = event?.link;
                    if (!link) return ''; // fallback if no date is available
                    try {
                    return (
                    <div className='w-fit mt-2 ml-auto'>
                        <a className='action_button flex flex-row items-center gap-x-2 rounded-[4px] text-wite px-4 py-2 font-bold text-white text-[14px]' href={link} target="_blank" rel="noopener noreferrer">Rejoindre <Video size={18} fill='#fff'/></a>
                    </div>)
                    } catch {
                    return ''; // fallback if parse fails
                    }
                })()}
                
            </section>
         </DialogContent>
    </Dialog>
  )
}

export default DisplayEvent