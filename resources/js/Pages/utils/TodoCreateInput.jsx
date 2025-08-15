import React, { useEffect, useState,useRef } from 'react'
import { format,addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from "../../../../components/ui/calendar";
import {Loader} from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "../../../../components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../components/ui/tooltip";
  import { cn } from "../../../../lib/utils";

const TodoCreateInput = ({ newTask, setNewTask, CreateTask, isAssign, users, assignedUsers,caseId,addUsersToTask, isLoading }) =>{

    const [dueDate, setDueDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const date = new Date();
    const today = format(date, "eee", { locale: fr });
    const nextDay = format(addDays(date, 1), "eee", { locale: fr });

    const handleSelectDate = (date) => {
        setCalendarDate(date);
        setDueDate(format(date, 'yyyy-MM-dd'));
      };
    return (
        <div className="addTaskInput dark:bg-[#414040] bg-[#CFCFCF] border-b dark:border-[#393a4c] border-[#335b74]">
            <div className="check " onClick={(e)  => { 
                    CreateTask(e, caseId,dueDate); 
                    setDueDate(null)}}>
                {isLoading?
                    <div>
                        <Loader size={18} className="dark:text-white text-dark-secondary animate-spin [animation-duration:2s]"/>
                    </div>
                :
                    <div className="">
                        <i className="fas fa-plus text-[18px]  dark:text-[#fff] text-dark-secondary"></i>
                    </div>
                }
            </div>
            <form className="todo_text" id="new_todo_form"  onSubmit={(e) => {
                    e.preventDefault();
                    CreateTask(e, caseId,dueDate); 
                    setDueDate(null)
                }}>
            <div className='relative'>
                <input type="text" value={newTask}  onChange={(e)=> setNewTask(e.target.value)} className='dark:text-white text-dark-secondary dark:bg-[#414040] bg-[#CFCFCF]' placeholder="Ajouter une tâche" id="new_task" name="new_task" autoComplete='off'/>
                  <div className='flex flex-row items-center gap-x-2 mt-1'>
                        {isAssign ?
                           assignedUsers.length != 0?
                            users.filter(user => assignedUsers.includes(user.id))
                            .map((user,index) =>(
                                    <TooltipProvider key={index} >
                                    <Tooltip >
                                        <TooltipTrigger asChild className='cursor-pointer opacity-[0.75]'>
                                            <div key={index} className="-ml-2 element_tooltip_container w-[22px] h-[22px]">
                                                <img src={user.avatar} alt="user-profile"/>
                                            </div>
                                        </TooltipTrigger>
                                    <TooltipContent className=' border-none z-10'>
                                        <p className='text-[12px]'>{user.name}</p>
                                    </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )):"":""}
                             { dueDate !=null ? 
                                <div>
                                    {dueDate !=null ?<span className='text-[12px] dark:text-white text-dark-secondary '><i className='bx bx-calendar-event dark:text-white text-dark-secondary text-[12px] mr-1'></i>{format(dueDate, 'dd MMM yyyy')}</span>:""}
                                </div>
                                :""}
                    </div>
                    <div className='absolute right-0 top-1/2 flex gap-x-2 items-center -translate-y-1/2 mr-3'>
                    <Popover>
                        <PopoverTrigger>
                            <TooltipProvider >
                                <Tooltip >
                                <TooltipTrigger asChild className='cursor-pointer'>
                                    <span><i className='bx bx-calendar-event dark:text-white text-dark-secondary text-[20px]'></i></span>
                                </TooltipTrigger>
                                <TooltipContent className=' border-none z-10'>
                                    <p className='text-[12px]'>Ajouter une date d'échéance</p>
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        </PopoverTrigger>
                            <PopoverContent side='top' className={cn('border-none flex gap-x-3 text-[13px] flex-col dmax-h-[150px] w-[180px] p-2',showCalendar?"w-full":"w-[180px]")}>
                               <div className={cn('flex flex-col', showCalendar?"block":"hidden")}>
                                <Calendar
                                    mode="single"
                                    selected={calendarDate}
                                    onSelect={handleSelectDate}
                                    footer={
                                       <button onClick={()=> setShowCalendar(false)} className='flex flex-row items-center'>
                                            <i class='bx bxs-chevron-left text-[20px]'></i> Retour
                                       </button> 
                                      }
                                    className="rounded-md "/>
                               </div>
                               <div className={cn('flex flex-col', showCalendar?"hidden":"block")}>
                                    <div onClick={()=> setDueDate(format(date, 'yyyy-MM-dd'))} className='relative cursor-pointer flex flex-row items-center justify-between gap-x-2 hover:bg-[#d8d8d833] p-1 rounded-[4px]'>
                                            <div className='flex flex-row items-center gap-x-2'>
                                                <i className='bx bx-calendar-event dark:text-white text-dark-secondary text-[14px]'></i>Aujourd'hui
                                            </div>
                                            <span className='capitalize text-[12px]'>{today}</span> 
                                    </div>
                                    <div onClick={()=> setDueDate(format(addDays(date, 1), 'yyyy-MM-dd'))}  className='relative cursor-pointer flex flex-row items-center justify-between gap-x-2  hover:bg-[#d8d8d833] p-1 rounded-[4px]'>
                                            <div className='flex flex-row items-center gap-x-2'>
                                                <i class='bx bx-calendar-plus dark:text-white text-dark-secondary text-[14px]'></i>Demain
                                            </div>
                                            <span className='capitalize text-[12px]'>{nextDay}</span> 
                                    </div>
                                    {/* <div className='relative cursor-pointer flex flex-row items-center gap-x-2  hover:bg-[#d8d8d833] p-1 rounded-[4px]'>
                                            <i class='bx bx-calendar-week text-[#fff] text-[14px]'></i>Semaine Prochaine
                                    </div> */}
                                    <div onClick={()=> setShowCalendar(true)}  className='relative cursor-pointer flex flex-row items-center justify-between gap-x-2 hover:bg-[#d8d8d833] p-1 rounded-[4px]'>
                                            <div className='flex flex-row items-center gap-x-2'>
                                                <i class='bx bx-calendar dark:text-white text-dark-secondary text-[14px]'></i>Choisir une date
                                            </div>
                                            <span><i class='bx bx-chevron-right dark:text-white text-dark-secondary text-[18px]'></i></span>
                                    </div>
                               </div>
                              
                            </PopoverContent>
                        </Popover>
                      {isAssign ? 
                        <Popover>
                            <PopoverTrigger>
                                <TooltipProvider >
                                    <Tooltip >
                                    <TooltipTrigger asChild className='cursor-pointer'>
                                    <div>
                                        <span><i class='bx bxs-user dark:text-white text-dark-secondary text-[20px]'></i></span>
                                    </div>
                                    </TooltipTrigger>
                                    <TooltipContent className='dark:bg-[#313131] bg-light-secondary border-none dark:text-white text-dark-secondary z-10'>
                                    <p className='text-[12px]'>Asssigner une tâche</p>
                                    </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            </PopoverTrigger>
                            <PopoverContent className=' border-none flex flex-col max-h-[150px] w-[80%] p-2'>
                                {users.map((user,index) =>(
                                        <div key={index} className={cn('relative hover:cursor-pointer p-2 rounded-[4px]', assignedUsers.length !=0?(assignedUsers.includes(user.id)?"opacity-[0.5]":"opacity-[1]"):" hover:dark:bg-[#d8d8d833] hover:bg-light-hover")} onClick={()=> addUsersToTask(user.id)}>
                                        <div className='flex flex-row items-center gap-x-1'>
                                            <div className='w-[20px] h-[20px]'>
                                                <img src={user.avatar} alt="avatar" className=" object-fit-contain rounded-full" />
                                            </div>
                                            <h1 className='dark:text-white text-dark-secondary text-[12px] upload_file_name'>{user.name}</h1>
                                        </div>
                                        {assignedUsers.includes(user.id)?
                                        <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'><i class='bx bx-check bx-md dark:text-white text-dark-secondary opacity-1'></i></span>
                                        :""}
                                        </div>
                                    ))}
                            </PopoverContent>
                        </Popover>
                        :
                        ""
                        }
                    </div>
                </div>
            </form>
        </div>
    )

}

export default TodoCreateInput