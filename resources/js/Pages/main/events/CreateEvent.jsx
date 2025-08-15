import {useRef, useState, useEffect} from 'react'
import { TimePicker, Space,ConfigProvider } from "antd";
import dayjs from 'dayjs';
import { useToast } from "../../../../../hooks/use-toast";
import { Calendar } from '../../../../../components/ui/calendar';
import { CalendarIcon, CircleCheck,Users} from 'lucide-react';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../lib/utils";
import { fr, enUS } from 'date-fns/locale';
import { format,parseISO, isAfter, isEqual,addMinutes } from "date-fns"
import { ScrollArea } from '../../../../../components/ui/scroll-area';
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../../components/ui/tooltip";
import theme from 'tailwindcss/defaultTheme';
function CreateEvent({allUsers,setUsers, users, refresh, setOpenDialog}) {
      const { toast } = useToast();

    const triggerRef = useRef(null);
    const optionsRef = useRef(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [title, setTitle] = useState('');
    const [eventDate, setEventDate] = useState(new Date);
    const [isUsersOptionsOpen, setIsUsersOptionsOpen] = useState(false);
    const [liveHour, futureTime] = getRoundedTimeRange();
    const [startTime, setStartTime] = useState(liveHour);
    const [endTime, setEnTime] = useState(futureTime);
    const [filter, setFilter] = useState('');
    const [eventLink, setEventLink] = useState('');
    const [openCalendarDialog, setOpenCalendarDialog] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedGroupUser, setSelectedGroupUser] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const [isLoadingData, setIsLoadingData] = useState();
    
    const [groups, setGroups] = useState([]);
    const [groupsList, setGroupsList] = useState([]);
    const [selectedUserFromGroup, setSelectedUserFromGroup] = useState([]);
    const { t, i18n } = useTranslation();

   function getRoundedTimeRange() {
      const now = dayjs();
      const minutes = now.minute();

      // Round up to the next :00 or :30
      const rounded = now
        .minute(minutes < 30 ? 30 : 0)
        .second(0)
        .millisecond(0);

      const roundedHour = minutes < 30 ? now.hour() : now.add(1, 'hour').hour();
      const nowTime = rounded.hour(roundedHour);

      const futureTime = nowTime.add(30, 'minute');

      return [nowTime, futureTime];
    }

    
    const [isDarkMode, setIsDarkMode] = useState(
      localStorage.getItem("theme") === "dark"
    );

     async function getData() {
      try {
        setIsLoadingData(true);
    
        const [groupsRes] = await Promise.all([
          axios.get('/groups/get-all-groups'),
        ]);
    
        const allGroups = groupsRes.data.map((element) => ({
          id: element.id,
          name: element.name,
          members: element.members || [],
          users: element.users || [],
          membersCount: element.membersCount || 0,
        }));
        setGroups(allGroups);
        setGroupsList(allGroups);
    
        return [allGroups];
      } catch (error) {
        console.error("Error loading data:", error);
        return [[], [], []]; // safe fallback
      } finally {
        setIsLoadingData(false);
      }
    }
    function pickedDate(date){
        setEventDate(date);
        setOpenCalendarDialog(false);
    }
   const pickedTime = (dates) => {
    if (dates && dates.length === 2) {
      console.log("Selected dates:", dates);
      let [start, end] = dates;

      // If end is before or equal to start, auto-correct it
      if (!end || end.isBefore(start) || end.isSame(start)) {
        end = start.add(30, 'minute');
      }

      setStartTime(start);
      setEnTime(end);

      console.log("Selected:", start.format("HH:mm"), end.format("HH:mm"));
    }else {
    }
  };
    function formatDate(date){
       if (!date) return ''; // Avoid errors
        const formattedDate = new Date(date);
        const year = formattedDate.getFullYear();
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(formattedDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      };
     const handleSubmit = (e) => {
            e.preventDefault();
        setIsLoading(true);
            var dataDate = formatDate(eventDate);
            const data = {title,selectedUsers,eventLink,dataDate,startTime,endTime,selectedGroups};
        axios.post('/event/create-new-event',{
            data: data,
            })
        .then(response => {
            toast({
                title: `L'événement "${title}" a été créé!!`,
            })
            setIsLoading(false);
                setTitle('');
                setOpenDialog(false);
                setSelectedUsers([]);
                setSelectedGroups([]);
                refresh();
            })
        .catch(error => {
          console.log(error)
            setIsLoading(false);
            toast({
                variant: "destructive",
                title: `Ooups! Une erreur est survenue!`,
            })})
        }

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

    const handleGroupClick = (id) =>{
        setSelectedGroups([...selectedGroups, id]);

        const selectedGroup = groups.find(group => group.id === id);
        
        const memberIds = selectedGroup.members.map((member) => member.id);
        // Update selectedOptions by appending all member IDs
        setSelectedGroupUser(prev => [...prev, ...memberIds]);
        // Remove these members from users
        // setUsers(prevUsers => prevUsers.filter(user => !memberIds.includes(user.id)));

        // setSelectedUserFromGroup(selectedGroup.members)
        setGroups(groups.filter(group => group.id !== id)); // remove the selected group from the dropdown

        setSelectedUsers(prevOptions => {
            const updatedOptions = prevOptions.filter(option => !memberIds.includes(option));

            return updatedOptions;
        });
    }

  const handleRemoveGroup = (id) => {
    const removedUser = groupsList.find(group => group.id === id);

      if (!removedUser) {
          console.error(`User with id ${id} not found`);
          return; // Early exit if user is not found
      }
        setSelectedGroupUser(selectedGroupUser.filter(option => option !== id));
        setGroups(prev =>[...prev, removedUser]); 
        setSelectedGroups(selectedGroups.filter(option => option !== id));
  };

    useEffect(() => {
        getData();
        document.addEventListener('mousedown', handleDocumentClick);
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, []);
  return (
    <form  onSubmit={handleSubmit} className="flex gapd-x-9 py-4 ">
        <div className="flex flex-col mx-auto gap-y-6  w-full">
            <div className="input_div">
            <label htmlFor="title" className='dark:text-white text-dark-secondary  opacity-[0.8]'>{t("Titre")}:</label>
                <input
                    type="text"
                    className="event_title_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e)=> setTitle(e.target.value)}
                    placeholder={t("Ajouter un titre")}
                    required
                    autoComplete='off'/>
            </div>
            <div className='custom-select w-full mx-auto'>
                  <div className="multiple-select input_div ">
                    <label htmlFor="title" className='dark:text-white text-dark-secondary  opacity-[0.8]'>{t("Participants")} :</label>
                  <div className=" realtive event_title_input dark:bg-dark-primary bg-light-primary  dark:text-white text-dark-secondary  mx-auto">
                    <div id='participants_badges_wrapper'>
                      <input
                        type="hidden"
                        id="participants"
                        required/>
                      <div id="participants_badges_wrapper">
                        {selectedUsers.map(value => {
                          const text = allUsers.find(option => option.id === value)?.name || value;
                          return (
                            <div key={value} data-value={value} className="participants bg-[#356B8C]">
                              <span className='capitalize'>{text}</span>
                              <span onClick={() => handleRemoveOption(value)}>
                                  <i className="fa-solid fa-x text-bold text-[10px] border p-1 opacity-[0.7] rounded-full"></i>
                              </span>
                            </div>
                          );
                        })}
                         {selectedGroups.map(value => {
                            const text = groupsList.find(group => group.id === value)?.name || value;
                            return (
                                <div key={value} data-value={value} className="participants  bg-green-700  ">
                                <span className='capitalize px-1 flex flex-row items-center gap-x-1'><Users size={16}/>{text}</span>
                                <span onClick={() => handleRemoveGroup(value)}>
                                    <i className="fa-solid fa-x font-bold text-dark-secondary  text-[10px] p-1 opacity-[0.7] rounded-full bg-[#fff]"></i>
                                </span>
                                </div>
                            );
                            })}
                      </div>
                    <input
                        ref={triggerRef}
                        id="selected_participants"
                        className="dark:text-white w-full text-dark-secondary dark:bg-dark-primary bg-light-primary participants_input focus:outline-none text-[14px] select-placeholder"
                        onFocus={() => setIsUsersOptionsOpen(true)}
                        onInput={(e) => setFilter((e.target).value.toLowerCase())}
                        placeholder={t("Choisissez les participants")} autoComplete='off'/>
                  </div>
                    {isUsersOptionsOpen && (
                      <section className='options dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary'>
                         {isLoadingData?
                          <p className='px-2  dark:text-white text-dark-secondary'>Chargement...</p>
                          :
                          <div ref={optionsRef}>
                            <ScrollArea className={cn("z-10 p-1  w-full  rounded shadow open",users.lenght == 0? "h-2":"h-[150px]")}>
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
                                      <img src={option.avatar} alt="avatar" className='w-[25px] h-[25px] rounded-full' />
                                      <div className=''>
                                      <h1 className='capitalize'>{option.name}</h1>
                                      <span className='text-[12px] pl-2 opacity-[0.6]'>{option.email}</span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                              {groups.length && (
                                  <div>
                                      <p className='text-[14px] dark:text-white text-dark-secondary border-b border-[#ffffff66] font-bold border-light-secondary'></p>
                                      <p className='text-[14px] dark:text-white text-dark-secondary bordker-b border-[#ffffff66] font-bold border-light-secondary'>Groupes</p>
                                      <div className=" p-1 open">
                                      {groups
                                          .filter(group => 
                                          group.name.toLowerCase().includes(filter) &&
                                          !selectedGroups.includes(group.id) // Exclude users already in selectedUsers
                                          )
                                          .map(group => (
                                          <div
                                              key={group.id}
                                              className="ml-1 option rounded dark:text-white text-dark-secondary flex -center hover:dark:bg-dark-hover hover:bg-light-hover"
                                              data-value={group.id}
                                              onClick={() => handleGroupClick(group.id)}>
                                              <div className=''>
                                                  <h1 className='capitalize'>{group.name}</h1>
                                                  <div className='ml-2 text-[12px] p-1 flex flex-row'>
                                                  {group.members.map((user,index) =>(
                                                      <TooltipProvider key={index} >
                                                      <Tooltip >
                                                          <TooltipTrigger asChild className='cursor-pointer '>
                                                              <div key={index} className="-ml-2 element_tooltip_container w-[25px] h-[25px] rounded-full">
                                                                  <img src={user.avatar_link} alt="user-profile" className=" rounded-full w-full h-full object-contain"/>
                                                              </div>
                                                          </TooltipTrigger>
                                                      <TooltipContent className=' z-10'>
                                                          <p className='text-[12px]'>{user.firstname+" "+ user.name}</p>
                                                      </TooltipContent>
                                                      </Tooltip>
                                                  </TooltipProvider>
                                                  ))}
                                                  </div>
                                              </div>
                                          </div>
                                          ))}
                                      </div>
                                  </div>
                              )}
                            </ScrollArea>
                          </div>
                        }
                      </section>
                    )}
                  </div>
                </div>
            </div>
            <div className="flex md:flex-row flex-col  gap-y-6 justify-between items-center">
                    <div className='flex flex-col items-start justify-start input_div w-full'>
                      <label  className='dark:text-white text-dark-secondary opacity-[0.8]'>{("Date")}:</label>
                        <DropdownMenu  open={openCalendarDialog} onOpenChange={setOpenCalendarDialog}>
                          <DropdownMenuTrigger className=' w-full'>
                              <Button
                                  type='button'
                                  className={cn(
                                    "md:w-[220px] w-full border-light-secondary dark:border dark:bg-dark-primary bg-light-primary p-2 dark:text-white text-dark-secondary capitalize justify-between text-left font-normal",
                                    !eventDate && "text-muted-foreground"
                                  )}>
                                  {eventDate ? format(eventDate, "PPP", { locale: fr }) : <span>{t("Pick a date")}</span>}
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
                    <div className='flex flex-col w-full input_div items-end justify- dark:text-white text-dark-secondary' >
                      <label htmlFor="eventLink" className='dark:text-white text-dark-secondary opacity-[0.8] w-full md:pl-2 pl-0'>{t("Heures")}:</label>
                        <Space direction="vertical" className='w-full dark:text-white text-dark-secondary' size={18}>
                        <ConfigProvider
                            theme={{
                              token: {
                                colorTextPlaceholder: isDarkMode ? "#FFFFFF" : "#313131",
                                colorIcon: isDarkMode ? "#FFFFFF" : "#313131",
                                   colorIconHover: "#ffa07a",
                                colorIconHover: "#ffa07a",
                                cellHoverBg: isDarkMode ? "#1f1f1f" : "#1f1f1f",
                                colorBgContainer: isDarkMode ? "#313131" : "#CFCFCF",
                                colorBgElevated: isDarkMode ? "#313131" : "#CFCFCF",
                                colorText: isDarkMode ? "#ffffff" : "#313131",
                                colorPrimaryBorder: "none",
                                controlItemBgActive:  isDarkMode ? "#d8d8d833" : "#29292933",
                              },
                              components:{
                                TimePicker: {
                                    colorIcon: isDarkMode ? "#FFFFFF" : "#313131",
                                  borderRadius: "40px",
                              }
                            }
                            }}
                          >
                          <TimePicker.RangePicker  defaultValue={[startTime, endTime]}  value={[startTime, endTime]} className="custom-timepicker md:w-[220px] w-full h-10 border-none dark:border  dark:text-white text-dark-secondary  dark:bg-dark-primary bg-light-primary hover:dark:bg-dark-primary hover:bg-light-primary"  placeholder={[t("Heure de début"),t("Heure de fin")]}  format={"HH:mm"} onChange={pickedTime}  />
                          </ConfigProvider>
                        </Space>
                         {/* <TimePicker defaultValue={dayjs('12:08', hourFormat)} format={hourFormat} /> */}
                    </div>
            </div>
            <div class="input_div">
            <label htmlFor="eventLink" className='dark:text-white text-dark-secondary opacity-[0.8]'>{t("Lien")}:</label>
                <input
                    type="text"
                    value={eventLink}
                    onChange={(e)=> setEventLink(e.target.value)}
                    className="event_title_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                    popupClassName="dark:bg-dark-secondary bg-white dark:text-white text-black"
                    name="eventLink"
                    id="eventLink"
                    placeholder={t("Ajouter le lien pour une réunion en ligne")}/>
            </div>
            <div className='md:w-fit w-full mt-2 ml-auto'>
                <button className='action_button flex flex-row w-full flex justify-center items-center gap-x-2 rounded-[4px] px-4 py-2 font-bold text-white text-[14px]' type="submit">
                  {isLoading? (
                       <>
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
                        </>
                  ):
                   <span className='flex items-center justify-center gap-x-2'>Enregistrer <CircleCheck size={18}/></span> 
                  }
                  </button>
            </div>
        </div>
    </form>
  )
}

export default CreateEvent