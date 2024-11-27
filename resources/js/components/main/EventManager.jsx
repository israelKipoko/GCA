import React, { useEffect, useState,useRef } from 'react'
import { Calendar } from '../../../../components/ui/calendar';
import { fr } from 'date-fns/locale';
import { format } from "date-fns"
import { Video, Plus,CalendarIcon, Scroll } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../../hooks/use-toast";
import axios from 'axios';
import { ScrollArea } from '../../../../components/ui/scroll-area';
  import { cn } from "../../../../lib/utils";
  import TimePicker from 'react-time-picker';
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../components/ui/tooltip";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog"

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "../../../../components/ui/popover"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../../../../components/ui/dropdown-menu";
const EventManager = (allUsers) =>{
    const [events, setEvents] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [calendarDate, setCalendarDate] = useState([new Date]);

    const [title, setTitle] = useState('');
    const [eventDate, setEventDate] = useState(new Date);
    const [isUsersOptionsOpen, setIsUsersOptionsOpen] = useState(false);
    const [hour, setHour] = useState('10');
    const [minute, setMinute] = useState('00');
    const [time, setTime] = useState([]);
    const [filter, setFilter] = useState('');
    const [eventLink, setEventLink] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const triggerRef = useRef(null);
    const optionsRef = useRef(null);
    const [openDialog, setOpenDialog] = useState(false);
    // const [currentTime, setCurrentTime] = useState(new Date());
    // const formattedCurrentTime = currentTime.toLocaleTimeString('fr-FR', {
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   second: '2-digit',
    //   hour12: false,
    // });
    const { toast } = useToast();

    function GetEvents() {
        axios.get('/event/get-user-events')
        .then(response => {
          var transformedData = response.data[0].map(element => ({
            id:element.id,
            title: element.title,
            note: element.note,
            date: element.date,
            time: element.time,
            link: element.meeting_link,
            createdby: element.user.name + " " + element.user.firstname,
          }));
          var transformedUsersData = response.data[1].map(element => ({
            id:element.id,
            name: element.firstname +" "+ element.name,
            email: element.email +" "+ element.email,
            avatar: element.avatar_link,
          }));
          setEvents(transformedData);
          setParticipants(transformedUsersData);
        })
        .catch(error => {
            console.log(error.message)
          });
    }
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshParent = () => {
      setRefreshKey((oldKey) => oldKey + 1);
    };
    function formatDate(date){
        const formattedDate = new Date(date);
        const year = formattedDate.getFullYear();
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(formattedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const formattedSelectedDates = calendarDate ? calendarDate.map(formatDate) : [];
      const filteredEvents = events.filter(event => formattedSelectedDates.includes(event.date));
      
      const handleRemoveOption = (id) => {
        setSelectedUsers(selectedUsers.filter(option => option !== id));
      };
      const handleOptionClick = (id, text) => {
        // if (!selectedOptions.has(value)) {
          setSelectedUsers([...selectedUsers, id]);
        // }
      };
      const handleDocumentClick = (e) => {
        if (
          triggerRef.current &&
          optionsRef.current &&
          !triggerRef.current.contains(e.target) &&
          !optionsRef.current.contains(e.target)
        ) {
          setIsUsersOptionsOpen(false);
        }
      };
      const handleSubmit = (e) => {
            e.preventDefault();
            var dataDate = formatDate(eventDate);
            const data = {title,selectedUsers,eventLink,dataDate,hour,minute};
          axios.post('/event/create-new-event',{
            data: data,
          })
          .then(response => {
            toast({
               title: "Nouvel Evénement",
               description: "L'Evénement a été créé avec succès!!",
             })
             setTitle('');
             setOpenDialog(false)
             setSelectedUsers([]);
             refreshParent();
           })
           .catch(error => {
             console.log('Could not create new client')
           });
    }
    useEffect(() => {
        GetEvents();
        document.addEventListener('click', handleDocumentClick);
        return () => {
          document.removeEventListener('click', handleDocumentClick);
        };
    }, [refreshKey]);
return (
    <section className='flex flex-row gap-x-4  justify-between'>
        <div className={cn('w-full max-h-[350px]')}>
           <ScrollArea className='h-full w-full ' >
             <section className={cn('flex flex-col gap-y-1',!filteredEvents.length?"h-full flex items-center justify-center":"")}>
             {filteredEvents.length ? (
                filteredEvents
                .map((event,index) => (
                    <div key={index} className='relative flex flex-row gap-x-2 rounded-[4px] w-[95%] mx-auto p-2 events_container' >
                      <div>
                         <span className='text-white text-[14px]'>{event.time.start_time}</span>
                      </div>
                      <div>
                        <div>
                          <h1 className="font-bold capitalize text-[17px] text-white">{event.title}</h1>
                          <span className='absolute right-2 top-2'>
                            {event.link != null?
                              <TooltipProvider className="">
                                  <Tooltip className="">
                                      <TooltipTrigger className={cn("border-none w-fit  ")}>
                                          <a href={event.link} target='__blank' class="badge_grey"><Video color="#fff" /></a>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-[#313131] text-white capitalize border-none">
                                          <p>Lien de la réunion</p>
                                      </TooltipContent>
                                  </Tooltip>
                              </TooltipProvider>
                             :""}
                          </span>
                        </div>
                          <div className="flex items-center mt-2">
                              {
                                participants.length? (
                                  participants.map(user => (
                                    <TooltipProvider key={index} className="">
                                        <Tooltip className="">
                                            <TooltipTrigger className={cn("border-none w-fit  ",(index!=0)?"-ml-2":"")}>
                                                <img src={user.avatar}  className="w-[25px] h-[25px] rounded-full" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-[#313131] text-white capitalize border-none">
                                                <p className='capitalize'>{user.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                  ))
                                ):
                                ("")
                              }
                          </div>
                      </div>
                    </div>
                ))
             ):
             (
              <div class="  w-fit h-fit ">
                    <div class="w-[150px] h-[100px] mx-auto">
                        <img class="w-full h-full object-fit-contain" src="../../../../icons/no-event.svg" alt=""/>
                    </div>
                    <h1 class="text-[14px] font-bold text-center opacity-[0.7] mb-4 w-[200px] mx-auto text-white">Aucun événement!</h1>
                </div>
             )}
             
             </section>
           </ScrollArea>
        </div>
        <div>
           <Calendar
            locale={fr}
            weekStartsOn={0}
           className='bg-[#262626] rounded-[4px] text-white'
           mode="multiple"
           numberOfMonths={2}
           selected={calendarDate}
           onSelect={setCalendarDate}
           max={3}
           footer={
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger>
                  <button className='bg-[#0f6cbd] hover:bg-[#12538b] font-bold flex rounded-[4px] p-2 mt-2  items-center'>Nouveau <Plus size={15} /></button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-[#262626] border-none">
                <DialogHeader>
                  <DialogTitle className="text-white font-bold">
                      Nouvel Evénement
                  </DialogTitle>
                </DialogHeader>
                <form  onSubmit={handleSubmit} className="flex gap-x-9 py-4">
                    <div className="flex flex-col mx-auto gap-y-9">
                        <div className="input_div">
                            <input
                                type="text"
                                className="event_title_input focus:outline-none text-[14px]"
                                name="title"
                                value={title}
                                onChange={(e)=> setTitle(e.target.value)}
                                placeholder="Ajouter un titre"
                                required
                                autoComplete='off'/>
                            <i className="fa-solid fa-align-justify event_icons"></i>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger>
                                      <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-[280px] text-white capitalize justify-start text-left font-normal",
                                            !eventDate && "text-muted-foreground"
                                          )}
                                        >
                                          <CalendarIcon   size={13} className='mr-2'/>
                                          {eventDate ? format(eventDate, "PPP", { locale: fr }) : <span>Pick a date</span>}
                                      </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent side='top' className='border-none'>
                                      <Calendar
                                       className='bg-[#262626] rounded-[4px] border-none text-white z-10'
                                        mode="single"
                                        selected={eventDate}
                                        onSelect={setEventDate}
                                      />
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className='flex flex-row gap-x-2 items-center text-white' >
                            <select value={hour} className='p-2  bg-[#262626] border rounded-[4px]' onChange={(event)=>setHour(event.target.value)}>
                                {Array.from({ length: 23 }, (_, i) => (
                                  <option key={i} value={String(i + 1).padStart(2, '0')}>
                                    {String(i + 1).padStart(2, '0')} h
                                  </option>
                                ))}
                              </select>
                              :
                              <select value={minute} className='p-2  bg-[#262626] border rounded-[4px]' onChange={(event)=>setMinute(event.target.value)}>
                                {Array.from({ length: 60 }, (_, i) => (
                                  <option key={i} value={String(i).padStart(2, '0')} selected>
                                    {String(i).padStart(2, '0')}'
                                  </option>
                                ))}
                              </select>
                            </div>
                        </div>
                        <div className='custom-select w-fit mx-auto'>
                  <div className="multiple-select">

                  <div className=" event_title_input input_div w-fit mx-auto">
                    <div id='participants_badges_wrapper'>
                      <input
                        type="hidden"
                        id="participants"
                        required/>
                      <div id="participants_badges_wrapper">
                        {selectedUsers.map(value => {
                          const text = allUsers.allUsers.find(option => option.id === value)?.name || value;
                          return (
                            <div key={value} data-value={value} className="participants">
                              <span>{text}</span>
                              <span onClick={() => handleRemoveOption(value)}>
                                <i className="fa-solid fa-x text-bold text-[12px]"></i>
                              </span>
                            </div>
                          );
                        })}
                    </div>
                    <input
                        ref={triggerRef}
                        id="selected_participants"
                        className="participants_input focus:outline-none text-[14px] select-placeholder"
                        onFocus={() => setIsUsersOptionsOpen(true)}
                        onInput={(e) => setFilter((e.target).value.toLowerCase())}
                        placeholder="Choisissez les participants"/>
                  </div>
                    <i className="fa-solid fa-users event_icons "></i>
                </div>
                    {isUsersOptionsOpen && (
                      <ScrollArea ref={optionsRef} className=" options h-[150px] open">
                        <div>
                        {allUsers.allUsers
                          .filter(option => option.name.toLowerCase().includes(filter))
                          .map(option => (
                            <div
                              key={option.id}
                              className="option text-[#fff] flex -center"
                              data-value={option.id}
                              onClick={() => handleOptionClick(option.id, option.name)}>
                                <img src={option.avatar} alt="avatar" className='w-[25px] h-[25px]' />
                                <div className=''>
                                  <h1 className='capitalize'>{option.name}</h1>
                                  <span className='text-[12px] pl-2 opacity-[0.6]'>{option.email}</span>
                                </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
     
                </div>
                </div>
                  <div class="input_div">
                      <input
                          type="text"
                          value={eventLink}
                          onChange={(e)=> setEventLink(e.target.value)}
                          className="event_title_input focus:outline-none text-[14px]"
                          name="eventLink"
                          placeholder="Ajouter le lien pour une réunion en ligne"/>
                          <i className="fa-solid fa-video event_icons"></i>
                    </div>
                    <div className='w-fit mx-auto'>
                      <button className='action_button rounded-md px-4 font-bold text-white ' type="submit"><i className="fa-regular fa-floppy-disk mr-2"></i>Enregistrer</button>
                    </div>
                </div>
               
                </form>
              </DialogContent>
            </Dialog>
          }
           />
        </div>
    </section>
)
}

export default EventManager