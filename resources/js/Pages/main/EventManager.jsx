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
  import { TimePicker, Space,ConfigProvider } from "antd";
  import dayjs from 'dayjs';
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
const EventManager = ({allUsers}) =>{
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [calendarDate, setCalendarDate] = useState(new Date);

    const [title, setTitle] = useState('');
    const [eventDate, setEventDate] = useState(new Date);
    const [isUsersOptionsOpen, setIsUsersOptionsOpen] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEnTime] = useState('');
    const [filter, setFilter] = useState('');
    const [eventLink, setEventLink] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const triggerRef = useRef(null);
    const optionsRef = useRef(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCalendarDialog, setOpenCalendarDialog] = React.useState(false);
    
    const [isDarkMode, setIsDarkMode] = useState(
      localStorage.getItem("theme") === "dark"
    );

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
            participants: element.event_users || [],
            createdby: element.user.name + " " + element.user.firstname,
          }));
          setEvents(transformedData);
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
      const formattedSelectedDates = calendarDate ? formatDate(calendarDate) : [];
      const filteredEvents = events.filter(event => formattedSelectedDates.includes(event.date));
      
      const handleRemoveOption = (id) => {
        const removedUser = allUsers.find(user => user.id === id);
        setUsers([...users, removedUser]); 
        setSelectedUsers(selectedUsers.filter(option => option !== id));
      };
      const handleOptionClick = (id, text) => {
        // if (!selectedUsers.includes(id)) {
          setSelectedUsers([...selectedUsers, id]);
          setUsers(users.filter(user => user.id !== id));
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
            const data = {title,selectedUsers,eventLink,dataDate,startTime,endTime};
          axios.post('/event/create-new-event',{
            data: data,
          })
          .then(response => {
            toast({
               description: "L'événement a été créé avec succès!!",
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
    function pickedDate(date){
       setEventDate(date);
       setOpenCalendarDialog(false);
    }
    function pickedTime(dates){
      if (dates && dates.length === 2) {
        const startTime = dates[0]?.format("HH:mm"); // Get the start time
        const endTime = dates[1]?.format("HH:mm"); // Get the end time
        setStartTime(startTime);
        setEnTime(endTime);
      } else {
        console.log("No time selected.");
      }
    }
    useEffect(() => {
      setUsers(allUsers);
        GetEvents();
        document.addEventListener('click', handleDocumentClick);
        return () => {
          document.removeEventListener('click', handleDocumentClick);
        };
    }, [refreshKey,allUsers]);
return (
    <section className='flex flex-row gap-x-2  justify-between'>
       <div className=''>
           <Calendar
            locale={fr}
            weekStartsOn={0}
           className='  rounded-[4px]'
           mode="single"
           numberOfMonths={1}
           selected={calendarDate}
           onSelect={setCalendarDate}
           footer={
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger>
                  <button className='bg-[#0f6cbd] hover:bg-[#12538b] text-white font-bold flex rounded-[4px] p-2 mt-2  items-center'>Nouveau <Plus size={15} /></button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]  border-none">
                <DialogHeader>
                  <DialogTitle className="dark:text-white text-dark-secondary font-bold">
                      Nouvel Evénement
                  </DialogTitle>
                </DialogHeader>
                <form  onSubmit={handleSubmit} className="flex gap-x-9 py-4">
                    <div className="flex flex-col mx-auto gap-y-9">
                        <div className="input_div">
                          <label htmlFor="title" className='dark:text-white text-dark-secondary  opacity-[0.8]'>Titre :</label>
                            <input
                                type="text"
                                className="event_title_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                                name="title"
                                id="title"
                                value={title}
                                onChange={(e)=> setTitle(e.target.value)}
                                placeholder="Ajouter un titre"
                                required
                                autoComplete='off'/>
                        </div>
                        <div className='custom-select w-fit mx-auto'>
                  <div className="multiple-select input_div ">
                    <label htmlFor="title" className='dark:text-white text-dark-secondary  opacity-[0.8]'>Participants :</label>
                  <div className=" realtive event_title_input dark:bg-dark-primary bg-light-primary  dark:text-white text-dark-secondary  w-fit mx-auto">
                    <div id='participants_badges_wrapper'>
                      <input
                        type="hidden"
                        id="participants"
                        required/>
                      <div id="participants_badges_wrapper">
                        {selectedUsers.map(value => {
                          const text = allUsers.find(option => option.id === value)?.name || value;
                          return (
                            <div key={value} data-value={value} className="participants">
                              <span>{text}</span>
                              <span onClick={() => handleRemoveOption(value)}>
                                  <i className="fa-solid fa-x text-bold text-[10px] border p-1 opacity-[0.7] rounded-full"></i>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    <input
                        ref={triggerRef}
                        id="selected_participants"
                        className="dark:text-white text-dark-secondary dark:bg-dark-primary bg-light-primary participants_input focus:outline-none text-[14px] select-placeholder"
                        onFocus={() => setIsUsersOptionsOpen(true)}
                        onInput={(e) => setFilter((e.target).value.toLowerCase())}
                        placeholder="Choisissez les participants" autoComplete='off'/>
                  </div>
                    {isUsersOptionsOpen && (
                      <section className='options dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary'>
                        <ScrollArea ref={optionsRef} className={cn("z-10 p-1  w-full  rounded shadow open",users.lenght == 0? "h-2":"h-[150px]")}>
                         <div className=' w-full'>
                        {users
                          .filter(option => 
                            option.name.toLowerCase().includes(filter) &&
                            !selectedUsers.includes(option.id) // Exclude users already in selectedUsers
                          )
                          .map(option => (
                            <div
                              key={option.id}
                              className="option rounded dark:text-white text-dark-secondary flex -center hover:dark:bg-dark-hover hover:bg-light-hover"
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
                      </section>
                    )}
                  </div>
                </div>
                </div>
                <div className="flex flex-col gap-y-9 justify-between items-center">
                    <div>
                        <DropdownMenu  open={openCalendarDialog} onOpenChange={setOpenCalendarDialog}>
                          <DropdownMenuTrigger>
                              <Button
                                  type='button'
                                  className={cn(
                                    "w-[280px] border-light-secondary dark:border dark:bg-dark-primary bg-light-primary p-2 dark:text-white text-dark-secondary capitalize justify-between text-left font-normal",
                                    !eventDate && "text-muted-foreground"
                                  )}>
                                  {eventDate ? format(eventDate, "PPP", { locale: fr }) : <span>Pick a date</span>}
                                  <CalendarIcon   size={13} className='mr-2'/>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side='top' className='border-none'>
                              <Calendar
                                className=' rounded-[4px] border-none z-10'
                                mode="single"
                                selected={eventDate}
                                onSelect={pickedDate}
                              />
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className='flex flex-col input_div items- dark:text-white text-dark-secondary' >
                      <label htmlFor="eventLink" className='dark:text-white text-dark-secondary opacity-[0.8]'>Lien:</label>
                        <Space direction="vertical" className='dark:text-white text-dark-secondary' size={18}>
                        <ConfigProvider
                            theme={{
                              token: {
                                colorTextPlaceholder: isDarkMode ? "#fff" : "#313131",
                                colorIcon: "#fff",
                                colorIconHover: "#ffa07a",
                                cellHoverBg: isDarkMode ? "#1f1f1f" : "#1f1f1f",
                                colorBgContainer: isDarkMode ? "#313131" : "#CFCFCF",
                                colorBgElevated: isDarkMode ? "#313131" : "#CFCFCF",
                                colorText: isDarkMode ? "#ffffff" : "#313131",
                                colorPrimaryBorder: "none",
                                controlItemBgActive:  isDarkMode ? "#d8d8d833" : "#29292933",
                              },
                            }}
                          >
                          <TimePicker.RangePicker defaultValue={[dayjs('12:08', 'HH:mm'), dayjs('12:30', 'HH:mm')]} className="w-[280px] border-light-secondary dark:border  dark:text-white text-dark-secondary  dark:bg-dark-primary bg-light-primary hover:dark:bg-dark-primary hover:bg-light-primary"  placeholder={["Heure de début","Heure de fin"]}  format={"HH:mm"} onChange={pickedTime}  />
                          </ConfigProvider>
                        </Space>
                    </div>
                        </div>
                  <div class="input_div">
                    <label htmlFor="eventLink" className='dark:text-white text-dark-secondary opacity-[0.8]'>Lien:</label>
                      <input
                          type="text"
                          value={eventLink}
                          onChange={(e)=> setEventLink(e.target.value)}
                          className="event_title_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                            popupClassName="dark:bg-dark-secondary bg-white dark:text-white text-black"
                          name="eventLink"
                          id="eventLink"
                          placeholder="Ajouter le lien pour une réunion en ligne"/>
                  </div>
                  
                    <div className='w-fit mt-2 ml-auto'>
                      <button className='action_button rounded-md px-4 py-2 font-bold text-white text-[14px]' type="submit">Enregistrer</button>
                    </div>
              </div>
                </form>
              </DialogContent>
            </Dialog>
          }
           />
        </div>
        <div className={cn('w-full max-h-[350px] dark:bg-dark-primary bg-light-secondary rounded-[4px] py-2')}>
            <ScrollArea className={cn('h-full w-full ')}>
             <section className={cn('flex flex-col gap-y-1 ',!filteredEvents.length?"h-[350px] flex items-center justify-center":"")}>
             {filteredEvents.length ? (
                filteredEvents
                .map((event,index) => (
                    <div key={index} className='relative flex flex-row justify-between gap-x-2 rounded-[4px] w-[95%] mx-auto p-2 dark:bg-[#313131] bg-light-hover events_container' >
                      <div className='px-2'>
                        <div >
                          <h1 className="font-bold capitalize opacity-[0.8] text-[15px] dark:text-white text-dark-secondary">{event.title}</h1>
                          <span className='absolute right-2 top-2'>
                            {/* {event.link != null?
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
                             :""} */}
                          </span>
                        </div>
                          <div className="flex items-center mt-2 px-4">
                              {
                                 event.participants.length? (
                                  event.participants.map((user,index) => (
                                     <TooltipProvider key={index} className="">
                                         <Tooltip className="">
                                             <TooltipTrigger className={cn("border-none w-fit  ",(index!=0)?"-ml-2":"")}>
                                                 <img src={user.avatar_link}  className="w-[25px] h-[25px] rounded-full" />
                                             </TooltipTrigger>
                                             <TooltipContent className="dark:bg-[#313131] bg-light-secondary dark:text-white text-dark-secondary capitalize border-none">
                                                 <p className='capitalize text-[13px]'>{user.name}</p>
                                             </TooltipContent>
                                         </Tooltip>
                                     </TooltipProvider>
                                   ))
                                 ):
                                 ("")
                              }
                          </div>
                      </div>
                      <div className='flex flex-col'>
                         <span className='dark:text-white text-dark-secondary text-[14px]'>{event.time.start_time}</span>
                         <span className='dark:text-white text-dark-secondary text-[14px] opacity-[0.5]'>{event.time.end_time}</span>
                      </div>
                    </div>
                ))
             ):
             (
              <div class="  w-fit h-fit">
                    <h1 class="text-[14px] font-bold text-center opacity-[0.7] mb-4 w-[200px] mx-auto dark:text-white text-dark-secondary">Aucun événement!</h1>
                </div>
             )}
             
             </section>
           </ScrollArea> 
        </div> 
    </section>
)
}

export default EventManager