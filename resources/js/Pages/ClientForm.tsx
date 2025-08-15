import React, { useState, useRef, useEffect , FormEvent} from 'react';
import axios from 'axios';
import { format } from "date-fns"
import { fr } from 'date-fns/locale';
import { Button } from "../../../components/ui/button"
import { Calendar } from "../../../components/ui/calendar"
import { Calendar as CalendarIcon,CircleCheck } from "lucide-react"
import { useToast } from "../../../hooks/use-toast"
import { ScrollArea } from '../../../components/ui/scroll-area';
import { FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { UserSquare, BriefcaseBusiness, MapPin } from 'lucide-react';
// import 'react-phone-number-input/style.css'
// import PhoneInput from 'react-phone-number-input'
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

  registerPlugin(FilePondPluginImagePreview);
  const ClientForm: React.FC<ChildProps> = ({ refreshParent }) => {
  
  const { toast } = useToast();

  const [newClientName, setNewClientName] = useState<string>('')
  const [sector, setSector] = useState<string>(''); 
  const [streetNumber, setStreetNumber] = useState<string>(''); 
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const triggerRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [selectedClientOptions, setSelectedClientOptions] =  useState<string>("");
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState('');
  const triggerClientRef = useRef<HTMLInputElement>(null);
  const optionsClientRef = useRef<HTMLDivElement>(null);
  const [logo, setLogo] = useState<string>('');;
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


// Handle form submission
const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    /*Create Folder */ 
       const data = {newClientName,sector,email,phone,address,logo};

        axios.post('/clients/create-new-client',{
           newClient: data,
        })
        .then(response => {
          refreshParent();
         toast({
            variant: "default",
            title: `Le client "${newClientName}" a été créé avec succès!!`,
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

    return (
        <form onSubmit={handleSubmit}>
            <section>
              <ScrollArea className='md:max-h-[450px] max-h-[520px]'>
              <div className='flex flex-col gap-y-6'>
                <div className="input_div w-fit mx-auto">
                  <label htmlFor="nom" className='dark:text-white text-dark-secondary  opacity-[0.8]'>Nom :</label>
                    <input
                        type="text"
                        className="event_title_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                        name="name"
                        id="name"
                        value={newClientName}
                        onChange={(e)=> setNewClientName(e.target.value)}
                        placeholder="Entrer le nom du client"
                        required autoComplete='off'/>
                        {/* <UserSquare size={20} color='#fff' className='event_icons'/> */}
                </div>
                <div className="input_div w-fit mx-auto">
                  <label htmlFor="sector" className='dark:text-white text-dark-secondary  opacity-[0.8]'>Secteur d'activité :</label>
                    <input
                        type="text"
                        className="event_title_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                        name="sector"
                        id="sector"
                        value={sector}
                        onChange={(e)=> setSector(e.target.value)}
                        placeholder="Entrer le secteur d'activité du client"
                        autoComplete='off'/>
                </div>
                <div className='flex md:flex-row flex-col gap-x-4 gap-y-6 justify-evenly'>
                  <div className="input_div w-full mx-auto ">
                    <label htmlFor="sector" className='dark:text-white text-dark-secondary opacity-[0.8]'>Email :</label>
                      <input
                          type="email"
                          className="short_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                          name="address"
                          value={email}
                          onChange={(e)=> setEmail(e.target.value)}
                          placeholder="Entrez l'adresse email du client"
                          autoComplete='off'/>
                  </div>
                  <div className="input_div w-full mx-auto ">
                    <label htmlFor="sector" className='dark:text-white text-dark-secondary  opacity-[0.8]'>Contact :</label>
                      <input
                          type="text"
                          className="short_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                          name="address"
                          value={phone}
                          onChange={(e)=> setPhone(e.target.value)}
                          placeholder="Entrez le téléphone du client"
                          autoComplete='off'/>
                  </div>
                </div>
                <div className="input_div w-fit mx-auto ">
                  <label htmlFor="sector" className='dark:text-white text-dark-secondary  opacity-[0.8]'>Adresse :</label>
                    <input
                        type="text"
                        className="event_title_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                        name="address"
                        value={address}
                        onChange={(e)=> setAddress(e.target.value)}
                        placeholder="Entrez une adresse (ex: 13, av:Colonel, Gombe Kinshasa)"
                        autoComplete='off'/>
                </div>
                <div  className="input_div w-[500px] mx-auto">
                  <label htmlFor="logo" className='dark:text-white text-dark-secondary opacity-[0.8]'>Logo :</label>
                  {/* <FilePond 
                  ref={pondRef}
                  files={files}
                  name="logo"
                  allowMultiple={false}  
                  allowImagePreview={true} 
                  imagePreviewHeight={150} 
                  acceptedFileTypes={['image/*']}
                  server={{
                    process: {
                        url: '/home/client/upload-logo',
                        method: 'POST',
                        // withCredentials: false,
                        headers: {
                          'X-CSRF-TOKEN': csrfToken || '',
                            'Accept': 'application/json'
                      },
                      onload: (response) => {
                        try {
                          const jsonResponse = JSON.parse(response);
                          setLogo(jsonResponse)
                          return response; // ✅ Fix: Return the response string
                        } catch (error) {
                          console.error("Error parsing response:", error);
                          return ""; // ✅ Fix: Return an empty string on error
                        }
                      },
                      onerror: (error: any) => {
                        toast({
                          description: "Ooups!! Désolé votre logo n'a pas pu etre telechargé",
                        })
                      },
                    },
                    revert: {
                      url: `/home/client/delete-logo/${logo}`,
                      method: "DELETE",
                      withCredentials: false,
                      headers: {
                        'X-CSRF-TOKEN': csrfToken || '',
                      },
                    },
                }}
                onprocessfile={(error, file) => {
                  if (error) {
                    console.error('File upload failed:', error);
                    return;
                  }
                  console.log('File upload successful:', file.serverId);
                }}
                  oninit={handleInit}
                  onupdatefiles={handleUpdateFiles}
                  labelIdle='Faites glisser et déposez un logo ou <span class="filepond--label-action">Parcourir</span>' /> */}
                </div>
                </div>
                  <div className='w-full ml-auto mt-6 py-2'>
                      <button  disabled={isLoading}  type="submit" className=' md:w-32 w-full py-1.5 px-4 bg-[#356B8C] rounded-[4px] flex justify-center text-white font-bold'>
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

export default ClientForm;
