import React, { useEffect, useState,useRef } from 'react'
import { format,startOfDay,isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
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
    DropdownMenuTrigger,
  } from "../../../../components/ui/dropdown-menu";
  import { cn } from "../../../../lib/utils";

const TodoItem = ({ task, users, ChangeStatus, isCaseTitle}) =>{

    const today = startOfDay(new Date());
    const [dueDateIsPassed,setDueDateIspassed] = useState(false);
    function DateChecker(dateToCheck){
        // Get today's date at midnight (00:00:00) for accurate comparison
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
      
        // Parse the dateToCheck to a Date object and set it to midnight as well
        const checkDate = new Date(dateToCheck);
        checkDate.setHours(0, 0, 0, 0);
      
        // Determine if the date is in the past, present, or future
        let message;
        if (checkDate < today) {
          message = format(dateToCheck, 'dd MMM yyyy');
        }else if(checkDate > today){
            if (checkDate.getTime() === tomorrow.getTime()) {
                message = "Demain";
              } else {
                message = format(dateToCheck, 'dd MMM yyyy');
            }
        } else {
          message = "Aujourd'hui";
        }
      
        return message;
      };
      function isTaskOverDue(dateToCheck){

        const checkDate = startOfDay(new Date(dateToCheck));
        checkDate.setHours(0, 0, 0, 0);

        if(isBefore(checkDate, today)) {
             return true;
        }else{
            return false;
        }
      }
return (
    <div  className="todo_item">
        <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
            <div className={cn("check_mark border ",task.status=="pending"?"":"checked")}>
                <img src="../../../icons/icon-check.svg"/>
            </div>
        </div>
        <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
            <span className=''>{task.title}</span>
            <div className='flex flex-row items-center gap-x-2'>
                {isCaseTitle && task.caseId != null ? 
                 <p className='text-[14px] opacity-[0.6]'>{task.caseTitle}</p>:""}
                { (task.assigned != null && task.assigned.length !=0)? (
                    <div className='ml-4 flex'>
                    {users.length != 0?
                    users.filter(user => task.assigned.includes(user.id))
                    .map((user,index) =>(
                            <TooltipProvider key={index} >
                            <Tooltip >
                                <TooltipTrigger asChild className='cursor-pointer opacity-[0.75]'>
                                    <div key={index} className="-ml-2 element_tooltip_container w-[22px] h-[22px]">
                                        <img src={user.avatar} alt="user-profile"/>
                                    </div>
                                </TooltipTrigger>
                            <TooltipContent className='bg-[#313131] border-none text-[#fff] z-10'>
                                <p className='text-[12px]'>{user.name}</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )):""}
                        </div>
                    ):
                    (<div></div>)
                    }
                    {task.dueDate? <span className={cn('text-[12px] opacity-[0.6]',isTaskOverDue(task.dueDate)?"text-red-400":"text-[#fff]")}><i className='bx bx-calendar-event  text-[12px] mr-1'></i>{DateChecker(task.dueDate)}</span>:""}
            </div>
        </div>
    </div>
)
}

export default TodoItem