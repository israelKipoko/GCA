import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card"
import { cn } from "../../../../lib/utils";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useSidebar } from "../../../../components/ui/sidebar"
// import hammer from "../../../../public/images/hammmer.png"
import hammer from '../../../../public/icons/hammer.png';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "../../../../components/ui/carousel"
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../components/ui/tooltip";
  

const PendingCases = () =>{
  const [refreshKey, setRefreshKey] = useState(0);

  const dataRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  const [data, setData] = useState([]);

  var transformedData;
   function getData() {
      axios.get('/folders/show-pending-folders')
        .then(response => {
          transformedData = response.data[0].map(element => ({
            id:element.id,
            title: element.title,
            dead_line: element.due_date,
            created_by: element.user.firstname +" "+ element.user.name,
            avatar_link: element.user.avatar_link,
            assignedTo: [...element.assigned_to],
            completed_tasks_count: element.completed_tasks_count,
          }));
         setData(transformedData);
        })
        .catch(error => {
          console.log('no')

        });

       
   return transformedData
  }
  const formatDate = (dateString) =>{
    const date = new Date(dateString);
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
       // Check if the date is valid in case the user did nıt enter a date
    if (isNaN(date.getTime())) {
      return "Aucune date limite"; 
    }
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
   const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar()

  const isDeadlinePassed = (deadline) => {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return false; 
    }
    const today = new Date();
    const normalizedDeadline = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return normalizedToday > normalizedDeadline;
  }
  useEffect(() => {
    getData();
  }, [refreshKey]);
  const date = new Date();

  return (
    <section className=''>
      <Carousel opts={{loop: false,}} className=''>
      <ScrollArea>
        <CarouselContent className='  '>
           {data.length ? (
                data.map((item,index) => (
                    <CarouselItem key={index} className={cn(open?"basis-1/3 ":"md:basis-1/2 lg:basis-1/4")}>
                        <a href={`/home/pending-cases/`+ item.id}>
                            <Card className=' dark:bg-[#313131] bg-light-secondary border-none py-2 relative overflow-hidden'>
                                <CardHeader className='px-2 '>
                                    <CardTitle className='h-[30px] text-[14px] capitalize opacity-[0.8] text-[#fff]  '>
                                    {item.completed_tasks_count !=0?
                                        <div className=' top-2 right-3'>
                                            <h1 className='text-[#fff] opacity-[0.5] font-bold text-[13px] text-center'>{item.completed_tasks_count} <br /> Tâche{(item.completed_tasks_count>1)?"s":""}</h1>
                                        </div>
                                        :
                                        <div></div>
                                    }
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className=" flex flex-col h-[60px]  px-2 gap-y-2 justify-center  ">
                                    <div className='flex flex-row  justify-start h-full '>
                                        {item.assignedTo && (
                                        item.assignedTo.map((user,index) => (
                                            <TooltipProvider key={index} className="border">
                                                <Tooltip className="">
                                                    <TooltipTrigger className={cn("border-none w-fit  ",(index!=0)?"-ml-2":"")}>
                                                        <img src={user.avatar_link}  className="w-[25px] h-[25px] rounded-full" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-[#d8d8d877] border-none">
                                                        <p className='capitalize'>{user.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )))}
                                    </div>
                                </CardContent>
                                <CardFooter className=" px-2 flex flex-col items-start  opacity-[0.75]">
                                  <h1 className={cn('font-bold text-[14px] capitalize dark:opacity-[0.8] dark:text-[#fff] text-dark-secondary')}>
                                      {item.title}
                                  </h1>
                                </CardFooter>
                                <div className='h-[120px] absolute top-6 -right-28 z-10'>
                                  <img src={hammer} alt='hammer' className='w-full h-full object-fit-fill '/>
                                </div>
                            </Card>
                        </a>
                    </CarouselItem>
                ))
            ):(<div></div>)}
        </CarouselContent>
        </ScrollArea>
        <CarouselPrevious />
        <CarouselNext />
     </Carousel>
    </section>
  )
}

export default PendingCases


