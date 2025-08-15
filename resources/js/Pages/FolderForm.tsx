import React, { useState, useRef, useEffect , FormEvent} from 'react';
import axios from 'axios';
import { format } from "date-fns"
import { fr } from 'date-fns/locale';
import { Button } from "../../../components/ui/button"
import { Calendar } from "../../../components/ui/calendar"
import { Calendar as CalendarIcon, Users,CircleCheck } from "lucide-react"
import { useToast } from "../../../hooks/use-toast"
import { ScrollArea } from '../../../components/ui/scroll-area';
import { FilePond, registerPlugin } from 'react-filepond';
import { FilePondFile, FilePondInitialFile } from 'filepond';
import 'filepond/dist/filepond.min.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../../../components/ui/select"
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../components/ui/tooltip";

  interface ChildProps {
    refreshParent: () => void;
  }

  const FolderForm: React.FC<ChildProps> = ({ refreshParent }) => {
    // State to hold form data
    interface User {
      id: string;
      name: string;
      fullname: string;
      postname: string;
      firstname: string;
      email: string;
      avatar: string;
    }
    interface Client {
      id: string;
      name: string;
      sector: string;
      logo: string;
    }

    type Member = {
      id: number;
      name: string;
      firstname: string;
      avatar_link: string
    };

    interface Groups {
      id: string;
      name: string;
      members: Array<Member>;
      users: string;
    }

  const [users, setUsers] = useState<User[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [groups, setGroups] = useState<Groups[]>([]);
  const [groupsList, setGroupsList] = useState<Groups[]>([]);
  const [selectedUserFromGroup, setSelectedUserFromGroup] = useState<User[]>([]);
  
  const { toast } = useToast();

  const [isLoadingData, setIsLoadingData] = useState(false);

 async function getData() {
  try {
    setIsLoadingData(true);

    const [usersRes, clientsRes, groupsRes] = await Promise.all([
      axios.get('/users/get-all-users'),
      axios.get('/clients/get-all-clients'),
      axios.get('/groups/get-all-groups'),
    ]);

    const allUsers = usersRes.data[0].map((element: any) => ({
      id: element.id,
      name: element.name,
      fullname: `${element.firstname} ${element.name}`,
      postname: element.postname,
      email: element.email,
      avatar: element.avatar_link,
    }));
    setUsers(allUsers);
    setUsersList(allUsers);

    const dataClient = clientsRes.data[0].map((element: any) => ({
      id: element.id,
      name: element.name,
      sector: element.sector,
      logo: element.logo_link,
    }));
    setClients(dataClient);

    const allGroups = groupsRes.data.map((element: any) => ({
      id: element.id,
      name: element.name,
      members: element.members || [],
      users: element.users || [],
      membersCount: element.membersCount || 0,
    }));
    setGroups(allGroups);
    setGroupsList(allGroups);

    return [allUsers, dataClient, allGroups];
  } catch (error) {
    console.error("Error loading data:", error);
    return [[], [], []]; // safe fallback
  } finally {
    setIsLoadingData(false);
  }
}

 
  useEffect(() => {
    getData();
  }, []);

    
  const [date, setDate] = useState<Date>()
  const [openCalendarDialog, setOpenCalendarDialog] = useState(false)
  const [priority, setPriority] = useState<string>('low'); 
  const [title, setTitle] = useState<string>(''); 
  const [description, setDescription] = useState<string>(''); 
  const [client, setClient] = useState<string>(''); 
  const [newClientName, setNewClientName] = useState<string>(''); 
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedGroupUser, setSelectedGroupUser] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const triggerRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [selectedClientOptions, setSelectedClientOptions] =  useState<string>("");
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState('');
  const triggerClientRef = useRef<HTMLInputElement>(null);
  const optionsClientRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const pondRef = useRef<FilePond>(null);
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  const [isLoading, setIsLoading] = useState(false);


  const handleInit = () => {
    console.log('FilePond instance has initialized');
};

const handleUpdateFiles = (fileItems: any[]) => {
    setFiles(fileItems.map(fileItem => fileItem.file));
};

  const handleSelect = (value: string) => {
    setPriority(value);
  };

 const handleOptionClick = (id: string) => {
      setSelectedOptions([...selectedOptions, id]);
      setUsers(users.filter(user => user.id !== id));
 }
  const handleClientOptionClick = (id: string, text: string) => {
      setSelectedClientOptions(text);
      setClient(id);
      setIsClientDropdownOpen(false);
  };
   const handleRemoveOption = (id: string) => {
      const removedUser = usersList.find(user => user.id === id);

      if (!removedUser) {
          console.log(`User with id ${id} not found`);
          return; // Early exit if user is not found
      }
      setUsers(prevUsers => [...prevUsers, removedUser]);
        // setSelectedOptions(selectedOptions.filter(option => option !== id));
      // Remove the user from selectedOptions
      setSelectedOptions(prevOptions => {
        const updatedOptions = prevOptions.filter(option => option !== id);

        return updatedOptions;
      });
  };

  const handleGroupClick = (id:string) =>{
    setSelectedGroups([...selectedGroups, id]);

    const selectedGroup:any = groups.find(group => group.id === id);
    
    const memberIds = selectedGroup.members.map((member: any) => member.id);
    // Update selectedOptions by appending all member IDs
    setSelectedGroupUser(prev => [...prev, ...memberIds]);
    // Remove these members from users
    // setUsers(prevUsers => prevUsers.filter(user => !memberIds.includes(user.id)));

    // setSelectedUserFromGroup(selectedGroup.members)
    setGroups(groups.filter(group => group.id !== id)); // remove the selected group from the dropdown

    setSelectedOptions(prevOptions => {
        const updatedOptions = prevOptions.filter(option => !memberIds.includes(option));

        return updatedOptions;
      });
  }

  const handleRemoveGroup = (id: string) => {
    const removedUser = groupsList.find(group => group.id === id);

      if (!removedUser) {
          console.error(`User with id ${id} not found`);
          return; // Early exit if user is not found
      }
        setSelectedGroupUser(selectedGroupUser.filter(option => option !== id));
        setGroups(prev =>[...prev, removedUser]); 
        setSelectedGroups(selectedGroups.filter(option => option !== id));
  };

  const handleRemoveClientOption = () => {
    setSelectedClientOptions('');
    setClient('');
  };
  function pickedDate(date: any){
    setDate(date);
    setOpenCalendarDialog(false);
 }

  const selectedClientOptionsText = clients.find(option => option.name === selectedClientOptions)?.name || selectedClientOptions;
  
  const handleDocumentClick = (e: MouseEvent) => {
    if (
      triggerRef.current &&
      optionsRef.current &&
      !triggerRef.current.contains(e.target as Node) &&
      !optionsRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }

    if (
      triggerClientRef.current &&
      optionsClientRef.current &&
      !triggerClientRef.current.contains(e.target as Node) &&
      !optionsClientRef.current.contains(e.target as Node)
    ) {
      setIsClientDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

// Handle form submission
const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    var year,month,day;
    if(date != undefined){
      const todayDate = new Date(date);
        year = todayDate.getFullYear();
       month = String(todayDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
       day = String(todayDate.getDate()).padStart(2, '0');
    }
    const formattedDate = `${year}-${month}-${day}`;
    var clientId;

    /*Create Folder */ 
    if(newClientName != ''){
      axios.post('/clients/create-new-client',{
        newClient: {newClientName},
      })
      .then(response => {
        clientId = response.data.id;
        const fileLength = files.length
        const data = {title,selectedOptions,selectedGroups,description,priority,formattedDate,clientId,files,fileLength};
        axios.post('/folders/create-new-folder',{
          newFolder: data,
        })
        .then(response => {
          refreshParent();
          toast({
            variant: "default",
            title: `Le dossier "${title}" a été créé avec succès!!`,
          })
          setIsLoading(false);
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: `Ooups! Il y a eu un problème.`,
            description: "Veuillez réessayer plus tard."
          })
          setIsLoading(false);
        });
      })
      .catch(error => {
        console.log('Could not create new client')
        setIsLoading(false);
      });
    }else{
      clientId = client;
       const fileLength = files.length;
       const data = {title,selectedOptions,selectedGroups,description,priority,formattedDate,clientId,files,fileLength};

        axios.post('/folders/create-new-folder',{
          newFolder: data,
        })
        .then(response => {
          refreshParent();
          toast({
            variant: "default",
            title: `Le dossier "${title}" a été créé avec succès!!`,
          })
          setIsLoading(false);
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: `Ooups! Il y a eu un problème.`,
            description: "Veuillez réessayer plus tard."
          })
          setIsLoading(false);
        });
    }

};

    return (
        <form onSubmit={handleSubmit}>
            <section className=''>
              <ScrollArea className='md:max-h-[450px] max-h-[520px]'>
              <div className='flex flex-col gap-y-6'>
                <div className="input_div w-fit mx-auto ">
                  <label htmlFor="title" className='dark:text-white text-dark-secondary opacity-[0.8]'>Titre :</label>
                    <input
                        type="text"
                        className="event_title_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e)=> setTitle(e.target.value)}
                        placeholder="Ajouter un titre"
                        required autoComplete='off'/>
                </div>
                <div className='custom-select w-full mx-auto'>
                  <div className="multiple-select input_div ">

                  <label htmlFor="selected_participants" className='dark:text-white text-dark-secondary opacity-[0.8]'>Client :</label>
                  <div className=" event_title_input  w-fit mx-auto  dark:bg-dark-primary bg-light-primary  dark:text-white text-dark-secondary ">
                    <div id='' className='realtive'>
                      <div id="participants_badges_wrapper" className=''>
                         {selectedClientOptions != "" ? 
                          <div key={selectedClientOptions} data-value={selectedClientOptions} className="participants bg-[#356B8C]">
                                <span className='px-1 text-[14px] capitalize'>{selectedClientOptionsText}</span>
                              <span onClick={() => handleRemoveClientOption()} className=''>
                                <i className="fa-solid fa-x font-bold text-dark-secondary  text-[10px] p-1 opacity-[0.7] rounded-full bg-[#fff]"></i>
                              </span>
                          </div>: 
                          <div className=''></div>}
                      </div>
                      {selectedClientOptions == ""? 
                      <input
                        ref={triggerClientRef}
                        id="selected_participants"
                        className="dark:text-white text-dark-secondary dark:bg-dark-primary bg-light-primary participants_input focus:outline-none text-[14px] select-placeholder"
                        value={newClientName}
                        onChange={(e)=> setNewClientName(e.target.value)}
                        onFocus={() => setIsClientDropdownOpen(true)}
                        onInput={(e) => setClientFilter((e.target as HTMLInputElement).value.toLowerCase())}
                        placeholder="Ajouter un client" autoComplete='off'/>
                        :
                        <input
                        ref={triggerClientRef}
                        id="selected_participants"
                        className="dark:text-white text-dark-secondary dark:bg-dark-primary bg-light-primary participants_input focus:outline-none text-[14px] select-placeholder"
                        onFocus={() => setIsClientDropdownOpen(true)}
                        onInput={(e) => setClientFilter((e.target as HTMLInputElement).value.toLowerCase())}
                        placeholder="Ajouter un client" autoComplete='off'/>}
                    
                  </div>
                        {isClientDropdownOpen && (
                          <section className='options dark:bg-dark-primary bg-light-primary'>
                          {isLoadingData?
                          <p className='px-2'>Chargement...</p>
                          :
                          <ScrollArea ref={optionsClientRef} className=" max-h-[150px] z-10 p-1 w-full rounded shadow open">
                            {clients
                              .filter(option => option.name.toLowerCase().includes(clientFilter))
                              .map(option => (
                                <div
                                  key={option.id}
                                  className="option rounded dark:text-white text-dark-secondary flex items-center hover:dark:bg-dark-hover hover:bg-light-hover"
                                  data-value={option.id}
                                  onClick={() => handleClientOptionClick(option.id, option.name)}>
                                    {option.logo != null?<img src={option.logo} alt="avatar" className='w-[25px] h-[25px]' />
                                    :""
                                    }
                                    <div className=''>
                                      <h1 className='capitalize'>{option.name}</h1>
                                      <span className='text-[12px] capitalize pl-2 opacity-[0.6]'>{option.sector}</span>
                                    </div>
                                </div>
                              ))}
                          </ScrollArea>}
                          </section> 
                        )}
                </div>
                </div>
                </div>
                <div className='custom-select w-full mx-auto'>
                  <div className="multiple-select input_div">

                  <label htmlFor="participants_badges_wrapper" className='dark:text-white text-dark-secondary opacity-[0.8]'>Contribuants :</label>
                  <div className=" event_title_input  w-fit mx-auto  dark:bg-dark-primary bg-light-primary  dark:text-white text-dark-secondary ">
                    <div id='participants_badges_wrapper'>
                      <input
                        type="hidden"
                        id="participants"
                        required/>
                      <div id="participants_badges_wrapper">
                      {selectedOptions.map(value => {
                            const text = usersList.find(option => option.id === value)?.fullname || value;
                            return (
                              <div key={value} data-value={value} className="participants  bg-[#356B8C]">
                                <span className='px-1 capitalize'>{text}</span>
                                <span onClick={() => handleRemoveOption(value)}>
                                    <i className="fa-solid fa-x font-bold text-dark-secondary  text-[10px] p-1 opacity-[0.7] rounded-full bg-[#fff]"></i>
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
                        className="dark:text-white text-dark-secondary dark:bg-dark-primary bg-light-primary participants_input focus:outline-none text-[14px] select-placeholder"
                        onFocus={() => setIsDropdownOpen(true)}
                        onInput={(e) => setFilter((e.target as HTMLInputElement).value.toLowerCase())}
                        placeholder="Ajouter des contribuants" autoComplete='off'/>
                  </div>
                  </div>
                    {isDropdownOpen && (
                      <section className='options dark:bg-dark-primary bg-light-primary'>
                         {isLoadingData?
                          <p className='px-2  dark:text-white text-dark-secondary'>Chargement...</p>
                          :
                          <div ref={optionsRef}>
                        <ScrollArea className="z-10 p-1  w-full  rounded max-h-[150px] shadow open">
                          <div   className=" p-1 open">
                            {users
                              .filter(option => 
                                option.name.toLowerCase().includes(filter) &&
                                !selectedOptions.includes(option.id) // Exclude users already in selectedUsers
                              )
                              .map(option => (
                                <div
                                  key={option.id}
                                  className={`option rounded dark:text-white text-dark-secondary flex -center hover:dark:bg-dark-hover hover:bg-light-hover ${selectedGroupUser.includes(option.id)? "opacity-[0.2] pointer-events-none":""}`}
                                  data-value={option.id}
                                  onClick={() => handleOptionClick(option.id)}>
                                  <img src={option.avatar} alt="avatar" className='w-[30px] h-[30px] rounded-full' />
                                    <div className=''>
                                      <h1 className='capitalize'>{option.fullname}</h1>
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
                      </div>}
                      </section>
                    )}
                  {/* <div className='absolute -bottom-6'>
                    <h1 className='font-bold text-[14px] dark:text-white text-dark-secondary opacity-[0.6]'>Groupes sélectionnés :</h1>
                  </div> */}
                </div>
                </div>
                <div className='flex md:flex-row flex-col gap-y-6 gap-x-4 items-center'>
                    <div className="input_div w-fit mx-auto">
                    <label htmlFor="" className='text-[14px] dark:text-white text-dark-secondary opacity-[0.8]'>Date limite:</label>
                    <DropdownMenu  open={openCalendarDialog} onOpenChange={setOpenCalendarDialog}>
                      <DropdownMenuTrigger>
                          <Button
                              type='button'
                              className={(
                                "w-full border border-[#ffffff66] border-light-secondary dark:border dark:bg-dark-primary bg-light-primary rounded-md opacity-[0.8] p-2 capitalize justify-between text-left font-normal")}
                            >
                              {date ? <span className='dark:text-white text-dark-secondary'>{format(date, "PPP", { locale: fr })}</span> : <span className='dark:text-white text-dark-secondary  opacity-[0.5]'>Chossissez une date</span>}
                              <CalendarIcon   size={13} className='mr-2 dark:text-white text-dark-secondary'/>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side='top' className='border-none'>
                        <Calendar
                            className='rounded-[4px] border-none z-10'
                            mode="single"
                            selected={date}
                            onSelect={pickedDate}
                            initialFocus
                            />
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                    <div className="input_div w-fit mx-auto">
                      <label htmlFor="" className='text-[14px] dark:text-white text-dark-secondary opacity-[0.8]'>Priorité:</label>
                        <Select value={priority}  onValueChange={handleSelect} >
                            <SelectTrigger className="w-full border border-[#ffffff66]  opacity-[0.8] rounded-md outline-none focus:outline-none ">
                                <SelectValue  placeholder="Priorité opacity-[0.6]" className='dark:text-white text-dark-secondary'/>
                            </SelectTrigger>
                            <SelectContent className=''>
                                <SelectItem value="low" className='cursor-pointer dark:text-white text-dark-secondary '>Faible</SelectItem>
                                <SelectItem value="medium"  className='cursor-pointer dark:text-white text-dark-secondary'>Moyenne</SelectItem>
                                <SelectItem value="high"  className='cursor-pointer dark:text-white text-dark-secondary'>Grande</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="input_div w-fit mx-auto">
                    <label htmlFor="hs-autoheight-textarea" className='text-[14px] dark:text-white text-dark-secondary opacity-[0.8]'>Description :</label>
                    <textarea id="hs-autoheight-textarea" value={description}  onChange={(e)=> setDescription(e.target.value)} name="note" className="event_title_input dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary focus:outline-none rounded-none text-[14px] py-3 px-4 block w-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:focus:ring-neutral-600" rows={3} placeholder="Description du dossier..." autoComplete='off' />
                </div>
                {/* <div className="input_div w-[500px] mx-auto">
                  <label htmlFor="file" className='text-[14px] dark:text-white text-dark-secondary opacity-[0.8]'>Documents :</label>
                  <FilePond 
                  ref={pondRef}
                  files={files}
                  name="file"
                  allowMultiple={true}  
                  acceptedFileTypes={[
                    'image/*',                                      // All image formats
                    'application/pdf',                              // PDF files
                    'application/msword',                           // Word (.doc) files
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (.docx) files
                    'application/vnd.oasis.opendocument.text',      // ODT files
                    'application/vnd.ms-excel',                     // Excel (.xls) files
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (.xlsx) files
                    'application/vnd.ms-powerpoint',               // PowerPoint (.ppt) files
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PowerPoint (.pptx) files
                    'text/plain'                                    // Plain text files
                  ]}
                  server={{
                    process: {
                        url: '/cases/upload-file',
                        method: 'POST',
                        headers: {
                          'X-CSRF-TOKEN': csrfToken || '',
                            'Accept': 'application/json'
                      },
                    }
                }}
                  oninit={handleInit}
                  onupdatefiles={handleUpdateFiles}
                  labelIdle='Faites glisser et déposez vos fichiers ou <span class="filepond--label-action">Parcourir</span>' />
                </div> */}
                </div>
                  <div className='md:w-fit w-full ml-auto mt-6 py-2'>
                      <button  disabled={isLoading}  type="submit" className='action_button md:w-32 w-full py-1.5 px-4 cbg-[#356B8C] flex flex-row items-center gap-x-2  rounded-[4px] justify-center text-white font-bold'>
                          {isLoading ? (
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
                          ) : (
                            <span className='flex flex-row items-center gap-x-2'> Valider <CircleCheck size={18}/></span>
                          )}
                      </button>
                  </div>
              </ScrollArea>
            </section>
           
        </form>
    );
};

export default FolderForm;
