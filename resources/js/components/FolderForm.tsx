import React, { useState, useRef, useEffect , FormEvent} from 'react';
import axios from 'axios';
import { format } from "date-fns"
import { fr } from 'date-fns/locale';
import { Button } from "../../../components/ui/button"
import { Calendar } from "../../../components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { useToast } from "../../../hooks/use-toast"
import { ScrollArea } from '../../../components/ui/scroll-area';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../../../components/ui/select"


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
    
    let transformedData: User[];
    let dataClient: Client[];
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const { toast } = useToast();

    function getData() {
      axios.get('/users/get-all-users')
        .then(response => {
          transformedData = response.data[0].map((element: any)  => ({
            id:element.id,
            name:element.name,
            fullname:element.firstname +" "+ element.name,
            postname:element.postname,
            email:element.email,
            avatar:element.avatar_link,
          }));
          setUsers(transformedData);
        })
        .catch(error => {
          console.log('no')
        });

        axios.get('/clients/get-all-clients')
        .then(response => {
          dataClient = response.data[0].map((element: any)  => ({
            id:element.id,
            name:element.name,
            sector:element.sector,
            logo:element.logo_link,
          }));
          setClients(dataClient);
        })
        .catch(error => {
          console.log('we couldnot get clients');
        });
       
   return [transformedData,dataClient]
  }
 
  useEffect(() => {
    getData();
  }, []);

    
    const [date, setDate] = React.useState<Date>()
    const [priority, setPriority] = useState<string>(''); 
    const [title, setTitle] = useState<string>(''); 
    const [description, setDescription] = useState<string>(''); 
    const [client, setClient] = useState<string>(''); 
    const [newClient, setNewClient] = useState<string>(''); 
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const triggerRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [selectedClientOptions, setSelectedClientOptions] =  useState<string>("");
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState('');
  const triggerClientRef = useRef<HTMLInputElement>(null);
  const optionsClientRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    setPriority(value);
  };
 const handleOptionClick = (id: string, text: string) => {
    // if (!selectedOptions.has(value)) {
      setSelectedOptions([...selectedOptions, id]);
    // }
  };
  const handleClientOptionClick = (id: string, text: string) => {
      setSelectedClientOptions(text);
      setClient(id);
  };
   const handleRemoveOption = (id: string) => {
    setSelectedOptions(selectedOptions.filter(option => option !== id));
  };
  const handleRemoveClientOption = () => {
    setSelectedClientOptions('');
    setClient('');
  };

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
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);


// Handle form submission
const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    var year,month,day;
    if(date == undefined){
      const todayDate = new Date();
       year = todayDate.getFullYear();
       month = String(todayDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
       day = String(todayDate.getDate()).padStart(2, '0');
    }else{
      const todayDate = new Date(date);
        year = todayDate.getFullYear();
       month = String(todayDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
       day = String(todayDate.getDate()).padStart(2, '0');
    }
    const formattedDate = `${year}-${month}-${day}`;
    var clientId;

    /*Create Folder */ 
    if(newClient != ''){
      axios.post('/clients/create-new-client',{
        createNewClient: newClient,
      })
      .then(response => {
        clientId = response.data.id;
        const data = {title,selectedOptions,description,priority,formattedDate,clientId};
        axios.post('/folders/create-new-folder',{
          newFolder: data,
        })
        .then(response => {
          toast({
            title: "Nouveau Dossier",
            description: "Le dossier a été créé avec succès!!",
          })
          refreshParent();
        })
        .catch(error => {
          console.log('Could not create new client')
        });
      })
      .catch(error => {
        console.log('Could not create new client')
      });
    }else{
      clientId = client;
       const data = {title,selectedOptions,description,priority,formattedDate,clientId};
        axios.post('/folders/create-new-folder',{
          newFolder: data,
        })
        .then(response => {
         toast({
            title: "Nouveau Dossier",
            description: "Le dossier a été créé avec succès!!",
          })
          refreshParent();
        })
        .catch(error => {
          console.log('Could not create new client')
        });
    }

};

    return (
        <form onSubmit={handleSubmit}>
            <section>
                <div className='flex flex-col gap-y-6'>
                <div className="input_div w-fit mx-auto">
                    <input
                        type="text"
                        className="event_title_input focus:outline-none text-[14px]"
                        name="title"
                        value={title}
                        onChange={(e)=> setTitle(e.target.value)}
                        placeholder="Ajouter un titre"
                        required/>
                    <i className="fa-solid fa-align-justify event_icons"></i>
                </div>
                <div className='custom-select w-fit mx-auto'>
                  <div className="multiple-select">

                  <div className=" event_title_input input_div w-fit mx-auto">
                    <div id=''>
                      <div id="participants_badges_wrapper">
                         {selectedClientOptions != "" ? 
                          <div key={selectedClientOptions} data-value={selectedClientOptions} className="participants">
                                <span>{selectedClientOptionsText}</span>
                              <span onClick={() => handleRemoveClientOption()}>
                                <i className="fa-solid fa-x text-bold text-[12px]"></i>
                              </span>
                          </div>: 
                          <div className=''></div>}
                      </div>
                      {selectedClientOptions == ""? 
                      <input
                        ref={triggerClientRef}
                        id="selected_participants"
                        className="participants_input w-fit focus:outline-none text-[14px] select-placeholder"
                        value={newClient}
                        onChange={(e)=> setNewClient(e.target.value)}
                        onFocus={() => setIsClientDropdownOpen(true)}
                        onInput={(e) => setClientFilter((e.target as HTMLInputElement).value.toLowerCase())}
                        placeholder="Ajouter un client"/>
                        :
                        <input
                        ref={triggerClientRef}
                        id="selected_participants"
                        className="participants_input hidden w-fit focus:outline-none text-[14px] select-placeholder"
                        onFocus={() => setIsClientDropdownOpen(true)}
                        onInput={(e) => setClientFilter((e.target as HTMLInputElement).value.toLowerCase())}
                        placeholder="Ajouter un client"/>}
                    
                  </div>
                    <i className="fa-solid fa-user event_icons "></i>
                </div>
                    {isClientDropdownOpen && (
                       <ScrollArea ref={optionsClientRef} className=" options h-[150px] open">
                        {clients
                          .filter(option => option.name.toLowerCase().includes(clientFilter))
                          .map(option => (
                            <div
                              key={option.id}
                              className="option text-[#fff] flex -center"
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
                      </ScrollArea>
                    )}
     
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
                        {selectedOptions.map(value => {
                          const text = users.find(option => option.id === value)?.name || value;
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
                        onFocus={() => setIsDropdownOpen(true)}
                        onInput={(e) => setFilter((e.target as HTMLInputElement).value.toLowerCase())}
                        placeholder="Choisissez les participants"/>
                  </div>
                    <i className="fa-solid fa-users event_icons "></i>
                </div>
                    {isDropdownOpen && (
                      <div ref={optionsRef} className="options open">
                        {users
                          .filter(option => option.name.toLowerCase().includes(filter))
                          .map(option => (
                            <div
                              key={option.id}
                              className="option text-[#fff] flex -center"
                              data-value={option.id}
                              onClick={() => handleOptionClick(option.id, option.name)}>
                                <img src={option.avatar} alt="avatar" className='w-[25px] h-[25px]' />
                                <div className=''>
                                  <h1 className='capitalize'>{option.fullname}</h1>
                                  <span className='text-[12px] pl-2 opacity-[0.6]'>{option.email}</span>
                                </div>
                            </div>
                          ))}
                      </div>
                    )}
     
                </div>
                </div>
                <div className='flex'>
                <div className="input_div w-fit mx-auto ">
                <label htmlFor="" className='text-[14px] text-[#fff]'>Date limite:</label>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                      <Button
                          variant={"outline"}
                          className={(
                            "w-[280px] text-white capitalize justify-start text-left font-normal")}
                        >
                          <CalendarIcon   size={13} className='mr-2'/>
                          {date ? format(date, "PPP", { locale: fr }) : <span className='text-[#fff]'>Chossissez une date</span>}
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='top' className='border-none'>
                    <Calendar
                        className='bg-[#262626] rounded-[4px] border-none text-white z-10'
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
                    <div className="input_div w-fit mx-auto ">
                    <label htmlFor="" className='text-[14px] text-[#fff]'>Priorité:</label>
                        <Select value={priority}  onValueChange={handleSelect}>
                            <SelectTrigger className="w-[180px] outline-none focus:outline-none text-[#fff]">
                                <SelectValue  placeholder="Priorité" />
                            </SelectTrigger>
                            <SelectContent className='text-[#fff] bg-[#313131]'>
                                <SelectItem value="low" className='cursor-pointer text-[#fff] '>Faible</SelectItem>
                                <SelectItem value="medium"  className='cursor-pointer text-[#fff]'>Moyenne</SelectItem>
                                <SelectItem value="high"  className='cursor-pointer text-[#fff]'>Grande</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className=" w-fit mx-auto">
                    <textarea id="hs-autoheight-textarea"  value={description}  onChange={(e)=> setDescription(e.target.value)} name="note" className="event_title_input focus:outline-none text-[14px] py-3 px-4 block w-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:focus:ring-neutral-600" rows={3} placeholder="Description..." required/>
                </div>
                </div>
            </section>
            
            <div className='w-fit mx-auto mt-4 py-2'>
                <button type="submit" className='py-1 px-4 bg-[#356B8C] rounded-[4px] text-white font-bold'>Valider</button>
            </div>
        </form>
    );
};

export default FolderForm;
