import React, { useEffect, useState,useMemo } from 'react'
import { Calendar } from '../../../../components/ui/calendar';
import CreateEvent from './events/CreateEvent';
import { fr, enUS } from 'date-fns/locale';
import { format,parseISO, isAfter, isEqual } from "date-fns"
import { Video, Plus,CalendarIcon, Users,BriefcaseBusiness,Trash2,MoreVertical,Eye,CalendarClock, Clock } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../../hooks/use-toast";
import axios from 'axios';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { useTranslation } from "react-i18next";
import DisplayEvent from '../Dialogs/DisplayEvent';
  import { cn } from "../../../../lib/utils";
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "../../../../components/ui/popover";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../../../../components/ui/dropdown-menu";
const EventManager = ({allUsers}) =>{
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [calendarDate, setCalendarDate] = useState(new Date);

  
    const [openDialog, setOpenDialog] = useState(false);
    const [openCalendarDialog, setOpenCalendarDialog] = useState(false);
    const [selectedEventToDisplay,setSelectedEventToDisplay] = useState();
  const memoizedEvent = useMemo(() => selectedEventToDisplay, [selectedEventToDisplay]);
    const [openDisplayEvent, setOpenDisplayEvent] = useState();

    const [isDeleting, setIsDeleting] = useState(false);

    const { toast } = useToast();

    const { t, i18n } = useTranslation();
    
    async function GetEvents() {
       try {
      const [usersRes] = await Promise.all([
          axios.get('/event/get-user-events'),
        ]);
        const allEvents = usersRes.data[0].map((element) => ({
            id: element.id,
            title: element.title,
            note: element.note,
            date: element.date,
            time: element.time,
            link: element.meeting_link,
            case: element.cases,
            participants: element.event_users || [],
            groups: element.group_participants || [],
            createdby: element.user?.name + " " + element.user?.firstname,
          }));
          setEvents(allEvents);

       } catch (error) {
          console.error("Error loading data:", error);
          return [[]]; // safe fallback
        } finally {
        }
    }
    function DeleteEvent(eventId,name){
      setIsDeleting(true);

      const formData = new FormData();
      formData.append("id",eventId);

      axios.post('/event/delete-event',formData)
        .then(response => {
          setIsDeleting(false);
          GetEvents();
          toast({
            variant: "default",
            title: `L'événement "${name}" a été supprimé!!`,
          })
        })
        .catch(error => {
          setIsDeleting(false);
          toast({
            variant: "destructive",
            title: `Ooups! Une erreur est survenue!`,
          })
          });
    }
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshParent = () => {
      setRefreshKey((oldKey) => oldKey + 1);
    };
    const [screenSize, setScreenSize] = useState({
            width: window.innerWidth - 25,
            height: window.innerHeight
        });

    function formatDate(date){
       if (!date) return ''; // Avoid errors
        const formattedDate = new Date(date);
        const year = formattedDate.getFullYear();
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(formattedDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      };
      const formattedSelectedDate = formatDate(calendarDate); // 'YYYY-MM-DD'

      // Step 2: Filter events that are on or after the selected date
      const filteredEvents = events.filter(event => {
         if (!event?.date) return false; 

        const eventDate = parseISO(event.date);
        const selectedDate = parseISO(formattedSelectedDate);

        return isEqual(eventDate, selectedDate) || isAfter(eventDate, selectedDate);
      });

      // Step 3: Group the filtered events by date
      const groupedEvents = filteredEvents.reduce((groups, event) => {
        const date = event.date; // assuming this is in 'YYYY-MM-DD' format
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(event);
        return groups;
      }, {});
      
      const showEvent = (event) =>{
      if (selectedEventToDisplay?.id !== event.id) {
          setSelectedEventToDisplay(event);
        }
        setOpenDisplayEvent(true);
      }
      // Format the date for display for phone display
      const formatDateForPhone = (date) => {
        if (!date) return ''; // Avoid errors
        const calendarDate = new Date(date);
        return calendarDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    useEffect(() => {
      setUsers(allUsers);
        GetEvents();
    }, [refreshKey]);
return (
    <section className='flex flex-col gap-y-2'>
      <div className='w-full flex flex-row items-center justify-between '>
        <h1 className="dark:text-white text-dark-secondary  flex items-center gap-x-1 font-bold md:text-[15px] opacity-[0.8] text-[14px] capitalize">
            <i className="fa-solid fa-calendar-day"></i>
            {t("événements à venir")}
        </h1>
         <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger> 
                <button className='flex bg-action hover:bg-[#12538b] text-white font-bold rounded-[4px] p-1.5 items-center justify-center md:w-[120px] w-[100px] text-center md:text-[16px] text-[14px]'>Nouveau <Plus size={15} /></button>
            </DialogTrigger>
            <DialogContent className={`md:w-[500px] w-[${screenSize.width}px]  border-none`}>
              <DialogHeader>
                <DialogTitle className="dark:text-white text-dark-secondary font-bold">
                    {t("Nouvel Evénement")}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className='hidden'></DialogDescription>
              <CreateEvent allUsers={allUsers} users={users} setUsers={setUsers} refresh={refreshParent} setOpenDialog={setOpenDialog}/>
            </DialogContent>
          </Dialog>
      </div>
      <section className='flex md:flex-row flex-col gap-y-2 gap-x-2  md:justify-between justify-center'>
        <div className='md:block hidden'>
            <Calendar
              locale={i18n.language== "en-US"? enUS: fr}
              weekStartsOn={0}
            className='rounded-[4px]'
            mode="single"
            numberOfMonths={1}
            selected={calendarDate}
            onSelect={setCalendarDate}
            required
            />
        </div>
          <div className=' md:hidden flex justify-between'>
            <Popover>
                <PopoverTrigger>
                    <div className='relative bg-[#d8d8d833] text-white py-1.5 px-2 w-[130px] rounded-md flex items-center justify-start'>
                      <span className='text-[14px] text-left'>{formatDateForPhone(calendarDate)}</span>
                      <CalendarIcon className='inline-block ml-2 absolute right-2 top-1/2 -translate-y-1/2 ' size={14} />
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                      locale={i18n.language== "en-US"? enUS: fr}
                      weekStartsOn={0}
                    className='rounded-[4px]  shadow-sm '
                    mode="single"
                    numberOfMonths={1}
                    selected={calendarDate}
                    onSelect={setCalendarDate}
                    required
                    />
                </PopoverContent>
              </Popover>
          </div>
          <div className={cn('w-full  dark:bg-dark-primary bg-light-thirdly rounded-lg ')}>
              <ScrollArea className={cn('max-h-[300px] w-full')}>
              <section className={cn('flex flex-col py-2 px-3 h-[300px]',!Object.entries(groupedEvents).length?"h-[300px] flex items-center justify-center":"")}>
              {
              Object.entries(groupedEvents).length ? (
                Object.entries(groupedEvents).map(([date, event],index) => (
                <div key={index}>
                  <div className=' flex flex-col items-start gap-y-2'>
                    <div className='flex items-center justify-center md:mb-0 mb-4 gap-x-1'>
                      <div className='dark:bg-light-thirdly bg-dark-secondary rounded-full w-2 h-2'></div>
                      <p className='w-[120px] text-center dark:text-[#fff] text-dark-secondary opacity-[0.7] capitalize text-[15px] font-bold '>{format(parseISO(date), 'dd MMMM yyyy', { locale: fr })}</p>
                    </div>
                    <div className='flex flex-row flex-wrap md:justify-start justify-between gap-x-6 md:gap-y-6 gap-y-9'>
                    {event.map((event,index) => (
                      <div key={index} className='flex flex-row gap-x-1 items-start'>
                        {event.case == null?
                          <div className='bg-[#ffc10766] rounded-full md:w-8 md:h-8 w-6 h-6 md:mt-0 mt-1 flex items-center justify-center'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild className='cursor-pointer'>
                                        <CalendarClock  className=' text-[#fff] md:w-5 w-4'  />
                                    </TooltipTrigger>
                                    <TooltipContent className='dark:bg-dark-secondary bg-light-thirdly border-none dark:text-white text-dark-secondary'>
                                        <p className='text-[12px] capitalize'>événement</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                          </div>:
                          <div className='bg-[#007bff66] rounded-full md:w-8 md:h-8 w-6 h-6 md:mt-0 mt-1 flex items-center justify-center'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild className='cursor-pointer'>
                                        <BriefcaseBusiness  className=' text-[#fff] md:w-5 w-4' />
                                    </TooltipTrigger>
                                    <TooltipContent className='dark:bg-dark-secondary bg-light-thirdly border-none dark:text-white text-dark-secondary'>
                                        <p className='text-[12px] capitalize'>Dossier</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                          </div>
                          }
                        <div className=''>
                          <div className='flex justify-between items-center md:gap-x-1  gap-x-6'>
                          <div className='w-fit md:max-w-[150px] max-w-[100px] flex items-center justify-center'>
                            <h1 className='upload_file_name font-bold capitalize md:text-[15px] text-[14px] dark:opacity-[0.8] dark:text-[#fff] text-dark-secondary'>{event.title}</h1> 
                          </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="default" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t("Open menu")}</span>
                                    <MoreVertical className="h-4 w-4 dark:text-[#fff] text-dark-secondary" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                {event.link != null?
                                    <a href={event.link} target='__blank'>
                                      <DropdownMenuItem className="font-bold" >
                                        <Video color="#fff" size={18} fill='#fff'/>{t("Participer")} 
                                      </DropdownMenuItem>
                                    </a>
                              :""}
                                  {/* <DropdownMenuItem className="font-bold" onClick={()=> {showEvent(event)}}>
                                    <Eye /> {t("Afficher")}
                                  </DropdownMenuItem> */}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={()=>DeleteEvent(event.id,event.title)} className="dark:text-[#D84444] text-red-600 font-bold" >
                                    <Trash2/> {t("Supprimer")}</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                          </div> 
                            {event.time.start_time && 
                            <div className='flex items-center gap-x-1 mb-2'>
                              <Clock size={18} className='dark:text-white text-dark-secondary'/>
                              <span className='flex flex-row text-[14px] font-bold dark:text-[#fff] text-dark-secondary opacity-[0.6]'>{format(parseISO(event.time.start_time), 'HH:mm', { locale: fr })} - {format(parseISO(event.time.end_time), 'HH:mm', { locale: fr })}</span>
                            </div>}
                            <div className='flex flex-col gap-y-2'>
                                {event.participants.length ?
                                <div className="flex gap-x-2 assigned_to_profile ">
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
                                </div>:""
                                }
                                
                            {event.groups &&(
                                event.groups.map((group, index) => (
                                    <div key={index} className=' dark:text-white text-dark-secondary'>
                                      <p className="flex items-center gap-x-2 text-[15px] capitalize"><Users size={14}/> {group.name}</p>
                                      <div className="ml-2">
                                        {group.users.map((user, index) =>(
                                          <TooltipProvider key={index}>
                                            <Tooltip>
                                            {(index==0)?
                                              <TooltipTrigger className="border-none w-fit ">
                                                <img src={user.avatar_link}  className="w-[25px] h-[25px] rounded-full"/>
                                              </TooltipTrigger>:
                                                <TooltipTrigger className="border-none w-fit  -ml-2">
                                                    <img src={user.avatar_link}  className="w-[25px] h-[25px] rounded-full" />
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
                      </div>  ))}
                    </div>
                  </div>
                  {!(Object.entries(groupedEvents).length == (index+1)) &&<div className=' w-1 h-12 bg-white ml-[100px] opacity-[0.5] rounded-full my-2'></div>}
                </div>
                ))):
                (
                  <div class="  w-fit h-fit">
                        <h1 class="text-[14px] font-bold text-center opacity-[0.7] mb-4 w-[200px] mx-auto dark:text-white text-dark-secondary">{t("Aucun événement")}!</h1>
                    </div>
              )}
              </section>
            </ScrollArea> 
          </div> 
            <DisplayEvent openDisplayEvent={openDisplayEvent} setOpenDisplayEvent={setOpenDisplayEvent} event={selectedEventToDisplay}/>
      </section>
    </section>
)
}

export default EventManager