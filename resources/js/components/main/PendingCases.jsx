import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card"
import { cn } from "../../../../lib/utils";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useSidebar } from "../../../../components/ui/sidebar"
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
            assignedTo: element.assigned_to,
            tasksCount: element.task_count,
          }));
         setData(transformedData);
        })
        .catch(error => {
          console.log('no')

        });

       
   return transformedData
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
  useEffect(() => {
    getData();
  }, [refreshKey]);
  const date = new Date();

  return (
    <div className="container mx-auto ">
      <Carousel opts={{loop: false,}} className=''>
      <ScrollArea>
        <CarouselContent className=''>
           {data.length ? (
                data.map((item,index) => (
                    <CarouselItem key={index} className={cn(open?"basis-1/3":"md:basis-1/2 lg:basis-1/4")}>
                        <a href={`/home/pending-cases/`+ item.id}>
                            <Card className='bg-[#313131] border-none'>
                                <CardHeader className=' py-2'>
                                    <CardTitle className='text-md capitalize text-[#fff]'>{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col h-[60px] gap-y-2 justify-center ">
                                    {/* {item.tasksCount !=0?
                                        <div>
                                            <h1 className='text-[#12538b] font-bold text-sm'>{item.tasksCount} Tâche{(item.tasksCount>1)?"s":""}</h1>
                                        </div>
                                        :
                                        <div></div>
                                    } */}
                                    <div className='flex flex-row  justify-center'>
                                        {item.assignedTo.map((user,index) => (
                                            <TooltipProvider key={index} className="">
                                                <Tooltip className="">
                                                    <TooltipTrigger className={cn("border-none w-fit  ",(index!=0)?"-ml-2":"")}>
                                                        <img src={user.avatar_link}  className="w-[30px] h-[30px] rounded-full" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-[#d8d8d877] border-none">
                                                        <p className='capitalize'>{user.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ))
                                        }
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-center opacity-[0.75]">
                                    <h1 className='capitalize text-[#fff] text-sm'><span className='font-bold'> Date limite : </span>{new Date(item.dead_line).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                    </h1>
                                </CardFooter>
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
    </div>
  )
}

export default PendingCases


