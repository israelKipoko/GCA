import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card"
import { cn } from "../../../../lib/utils";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useSidebar } from "../../../../components/ui/sidebar"
import hammer from '../../../../public/icons/hammer.png';
import { CheckCircle, Circle } from 'lucide-react';
import CountUp from "../utils/CounterUp";
import { useTranslation } from "react-i18next";
import { Link } from '@inertiajs/react';
import { Skeleton } from "../../../../components/ui/skeleton"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "../../../../components/ui/carousel"

const PendingCases = () =>{
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const dataRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
    const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);

  var transformedData;
   async function getData() {
    try{
      setIsDataLoading(true);
      const response = await axios.get('/folders/show-pending-folders')
        // .then(response => {
          transformedData = response.data[0].map(element => ({
            id:element.id,
            title: element.title,
            dead_line: element.due_date,
            // created_by: element.user.firstname +" "+ element.user.name,
            // avatar_link: element.user.avatar_link,
            // assignedTo: [...element.assigned_to],
            completed_tasks_count: element.completed_tasks_count,
            uncompleted_tasks_count: element.uncompleted_tasks_count,
          }));
         setData(transformedData);
        // })
        }catch(error){
          console.log(error)
        }finally{
          setIsDataLoading(false);
        }

       
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
          {isDataLoading?
           <CarouselItem className={cn(open?"md:basis-1/3 basis-full":" basis-1/3")}>
              <Skeleton className="h-[100px] w-[320px] rounded-md" />
           </CarouselItem>
          :
           data.length ? (
              data.map((item,index) => (
                  <CarouselItem key={index} className={cn(open?"md:basis-1/3 basis-full":" basis-1/3")}>
                      <Link href={`/home/pending-cases/`+ item.id}>
                          <Card className=' dark:bg-[#313131] bg-light-thirdly border-none py-2 relative overflow-hidden'>
                              <CardHeader className='px-2 '>
                                  <CardTitle className='h-[30px] text-[14px] capitalize opacity-[0.8] text-[#fff]  '>
                                  {/* {item.completed_tasks_count !=0?
                                      <div className=' top-2 right-3'>
                                          <h1 className='text-[#fff] opacity-[0.5] font-bold text-[13px] text-center'>{item.completed_tasks_count} <br /> Tâche{(item.completed_tasks_count>1)?"s":""}</h1>
                                      </div>
                                      :
                                      <div></div>
                                  } */}
                                    <h1 className={cn('font-bold md:text-[16px] capitalize dark:text-[#fff] text-dark-secondary')}>
                                        {item.title}
                                    </h1>
                                  </CardTitle>
                              </CardHeader>
                              <CardContent className=" flex flex-col h-[60px] justify-end ">
                              {item.completed_tasks_count + item.uncompleted_tasks_count !=0 &&
                                  <div className='ml-2'>
                                    {/* <h1 className='flex items-center text-[14px] dark:text-[#fff] text-dark-secondary'><ListCheck color='#0f6cbd' size={15}/>Tasks:</h1> */}
                                    <div className='flex flex-row gap-x-2 text-[14px]'>
                                      {/* <div className='flex flex-col items-start justify-center gap-x-2'>
                                          <CountUp
                                            from={0}
                                            to={item.completed_tasks_count}
                                            separator=","
                                            direction="up"
                                            duration={1}
                                            className="count-up-text font-bold text-[14px]  dark:opacity-[0.8] dark:text-[#fff] text-dark-secondary"/>
                                            <p className='text-[12px] dark:text-[#fff] text-dark-secondary opacity-[0.6]'>{t("task")}{item.completed_tasks_count>1?"s":""}</p>
                                        </div>
                                        <p className='text-[12px] dark:text-[#fff] text-dark-secondary'>{t("completed")}</p>
                                      </div> */}
                                      <div className='flex flex-col items-start gap-x-2'>
                                        {/* <Circle  color='#0f6cbd' size={15}/> */}
                                        <div className='flex flex-row items-start gap-x-1'>
                                         <CountUp
                                            from={0}
                                            to={item.uncompleted_tasks_count}
                                            separator=","
                                            direction="up"
                                            duration={1}
                                            className="count-up-text font-bold text-[14px]  dark:opacity-[0.8] dark:text-[#fff] text-dark-secondary"/>
                                            <p className='text-[12px] dark:text-[#fff] text-dark-secondary opacity-[0.6]'>{t("task")}{item.uncompleted_tasks_count>1?"s":""}</p>
                                        </div>
                                        <p className='text-[12px] dark:text-[#fff] text-dark-secondary'>{t("uncompleted")}</p>
                                      </div>
                                    </div>
                                  </div>}
                              </CardContent>
                              <div className='w-[200px] md:h-[120px] h-[100px] absolute md:top-2 top-4 -right-14  z-10'>
                                <img src={hammer} alt='hammer' className='w-full h-full object-contain '/>
                              </div>
                          </Card>
                      </Link>
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


