import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { Toaster } from "../../../components/ui/toaster"
import { cn } from "../../../lib/utils";
import { format, isEqual } from 'date-fns';
import {Loader, Pencil, Trash2, Check, X} from 'lucide-react';
import { Progress } from "../../../components/ui/progress"
import { ScrollArea } from "../../../components/ui/scroll-area";
import "@cyntler/react-doc-viewer/dist/index.css";
import WorkSpaceUtilities from './utils/WorkSpaceUtilities';
import UploadedFiles from './utils/UploadedFiles';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import wordIcon from "../../../public/images/logos/docx_icon.svg";
import powerpointIcon from "../../../public/images/logos/pptx.png";
import excelIcon from "../../../public/images/logos/excel.png";
import pdfIcon from "../../../public/images/icons/pdf-icon.png";

import Echo from 'laravel-echo';

import Pusher from 'pusher-js';

// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'reverb',
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
//     wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });


const WorkSpace = ({caseId,caseFolders}) =>{

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const textareaRef = useRef(null);
  const [newMessage, setNewMessage] = useState('');
  const [isFileUpoading, setIsFileUpoading] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [caseFiles, setCaseFiles] = useState(caseFolders);
  const [openMessageOptions, setOpenMessageOptions] = useState(null);
  const [deletedMessage, setDeletedMessage] = useState([]);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [messageToEdit, setMessageToEdit] = useState(null);
  const [editLoader, setEditLoader] = useState(false);

  const messageOptionRef = useRef(null);
  const [loader, setLoader] = useState(false);
  var transformedData; 
  var transformedUserData;
  const dialogRef = useRef(null);

  function getMessages(){
    axios.get('/cases/get-all-case-messages/'+caseId)
    .then(response => {
      transformedData = response.data[0].map(element => ({
        id:element.id,
        comment: element.comments,
        name: element.user.firstname +" "+ element.user.name,
        avatar: element.user.avatar_link,
        files: element.media,
        date: element.date,
        realDate: element.created_at,
        modifedAt: element.updated_at
      }));
      console.log(response.data[0])
      setAllFiles([]);
      transformedData.forEach((item) =>{
        if(item.files.length != 0){
          item.files.forEach((file)=>{
            setAllFiles(prevAllFiles => [...prevAllFiles,file]);
          })
        }
      })
      if(response.data[1] != null){
        transformedUserData = response.data[1].map(element => ({
          id:element.id,
          name: element.firstname +" "+ element.name,
          avatar: element.avatar_link,
        }));
        setUsers(transformedUserData);
      }
     
      setMessages(transformedData);
    })
    .catch(error => {
      console.log(error.message)

    });

  }
//   window.Echo.channel('messages')
// .listen('Message', (event)=>{
//   getMessages();
// })
  async function deleteMessage(ID){
    setIsDeletingMessage(true);
    try {
      await axios.put('/cases/messages/delete-message',{ID});
        setDeletedMessage(prev => [...prev,ID]);
    } catch (error) {
    }finally{
      setIsDeletingMessage(false);
    }

  }
  async function editMessage(ID){
    if(editedMessage === "") return;
    setEditLoader(true);
    try {
      await axios.put('/cases/messages/edit-message',{ID,editedMessage});
      getMessages();
    } catch (error) {
      console.log(error)
    }finally{
      cancelEditingMessage();
      setEditLoader(false);
    }

  }
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshParent = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  const [screenSize, setScreenSize] = useState({
        width: window.innerWidth - 25,
        height: window.innerHeight
    });
  

  const handleFileChange = (event) => {
    setIsFileUpoading(true);
    const files = Array.from(event.target.files);
      const transformedData = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        loading: 0,
        url: file.type.startsWith("image/") 
            ? URL.createObjectURL(file) 
            : null
    }));
    setFilesUploaded((prevFilesUploaded) => [...prevFilesUploaded, ...transformedData]);

    files.forEach((file, index) => {
      uploadFile(file, index); // Adjust index for new files
    });

  };
  const uploadFile = (file,index) => {
    const formData = new FormData();
    formData.append('file', file);
    setShowProgress(true);
    axios.post('/cases/upload-file', formData, {
      onUploadProgress: ({loaded, total}) => {
        setFilesUploaded(prevFilesUploaded => {
          const newFiles = [...prevFilesUploaded];
          newFiles.forEach((file) => {
            if(file.loading != 100){
              file.loading = Math.floor((loaded / total) * 100);
            }
          })
          return newFiles;
        });
        if(loaded == total){
          setShowProgress(false)
        }
      },
    }).catch(console.log);
  };

  const removeFile = (id) => {
    const files = filesUploaded.filter((file,index) => index !== id);
    setFilesUploaded(files);
    if(files.length == 0){
      setIsFileUpoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if(!bytes){
      return "";
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };
  const isSingleWord = (str) => {
    return str.trim().split(/\s+/).length === 1;
  };

  const SendMessage = async (event) => {
    try{
      setLoader(true);
      if(newMessage !== '' || filesUploaded.length != 0){

      const response = await axios.post('/cases/create-new-message/'+caseId,{
          newComment: newMessage,
          fileLength: filesUploaded.length ?? 0,
        })
        // .then(response => {
          refreshParent();
          setNewMessage('');
          setIsFileUpoading(false);
          setShowProgress(false)
        setFilesUploaded([]);
      }
      }catch(error){
        console.log(error)
      }finally{
        setLoader(false);
      };
    };

  const [toggledTabs , setToggledTabs]  = useState('');
  const [isTabClick , setIsTabClick]  = useState(false);

  const MessageOptionMouseEnter = (index) =>{
    if(isEditingMessage) return; // Do not show the options when the user is editing a message

    setOpenMessageOptions(index);
  }
   const MessageOptionMouseLeave = (event) =>{
    if (messageOptionRef.current && !messageOptionRef.current.contains(event.target)){
       setOpenMessageOptions(null);
     }
  }
 
  const cancelEditingMessage = ()=>{
    setIsEditingMessage(false);
    setMessageToEdit(null);
    setEditedMessage("");
  }

  useEffect(() => {
    getMessages();
    const textarea = textareaRef.current;
    const handleInput = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener('input', handleInput);
    textarea.dispatchEvent(new Event('input'));

     document.addEventListener("mousedown", MessageOptionMouseLeave);
    
    return () => {
      textarea.removeEventListener('input', handleInput);
      document.removeEventListener("mousedown", MessageOptionMouseLeave);
    };

  
  }, [refreshKey]);
  return (
    <section className='flex flex-row gap-x-4 w-full mb-6'>
      <section className=" w-[620px]">
          <div>         
             {caseFiles.length != 0 ? (
                <section className='apps p-1 flex flex-wrap gap-x-1'>
                  {caseFiles.map((file,index) => (
                    <div key={index} className='w-[220px] h-[40px] relative flex fex-row gap-x-2 items-center p-2 dark:bg-dark-secondary bg-light-thirdly dark:text-white text-dark-secondary text-[12px]  rounded-[4px]'>
                     <div className='flex flex-row'>
                       <div className='w-full'>
                            <i className='bx bxs-file dark:text-white text-dark-secondary text-[18px]'></i>
                        </div>
                        <div>
                            <h1 className='upload_file_name flex flex-wrap'>{file.name}</h1> 
                            <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                        </div>
                     </div>
                     
                    <DropdownMenu>
                        <DropdownMenuTrigger className='h-full '>
                            <div className='dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-r-[4px] hover:cursor-pointer h-full absolute right-0 top-1/2 flex items-center -translate-y-1/2 p-1'>
                                <i class='bx bx-chevron-down dark:text-white text-dark-secondary bx-sm'></i>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side='top' className='w-[180px] dark:bg-dark-secondary bg-light-thirdly border-none flex flex-col gap-2'>
                            <DropdownMenuItem className='dark:text-white text-dark-secondary text-[14px] hover:cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover'>
                                <a className='flex flex-row items-center gap-x-2 w-full h-full'  href={file.url} download={file.name}>
                                  <i class='bx bxs-download dark:text-white text-dark-secondary text-[18px]'></i>Télécharger
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>))}
                </section>
              ):""}
          <ScrollArea className="max-h-[500px]">
            <div className='w-fit flex flex-col'>
            {messages.length ? (
                  messages.map((message,index) =>(
                      <div key={index} className='flex flex-row items-end w-fit  gap-x-1 py-4 px-3'>
                          <div className='w-[25px] h-[25px]'>
                            <img src={message.avatar} alt="avatar" className=" object-contain rounded-full" />
                          </div>
                        {deletedMessage.length > 0 && deletedMessage.includes(message.id) ?  
                          <div className='bg-[#356B8C44] rounded-md py-2 px-3'>
                            <h1 className='dark:text-white text-dark-secondary text-[13px] capitalize'>Vous avez supprimé ce message</h1>
                          </div>
                          :
                          <div className='flex flex-col justify-center py-0.5 w-fit'>
                            <div className='flex flex-row justify-between'>
                              <h1 className='dark:text-white text-dark-secondary text-[13px] capitalize'>{message.name} <span className={cn("ml-1 opacity-[0.5] dark:text-white text-dark-secondary  text-[13px]",isSingleWord(message.date) ? 'capitalize' : 'lowercase')}>{message.date}</span></h1>
                              <p className='dark:text-white text-dark-secondary text-[13px] opacity-[0.5] '>{isEqual(message.realDate, message.modifedAt)?"": "Modifé"}</p>
                            </div>
                              <div className={`bg-[#356B8C44] rounded-md w-fit px-2 py-1 relative`} onMouseEnter={()=>MessageOptionMouseEnter(index)} onMouseLeave={(event)=>MessageOptionMouseLeave(event)}>
                                <div className='flex flex-wrap flex-1 gap-2 w-fit'>
                                  {message.files.map((file,index)=>(
                                    <div key={index} className=''>
                                      <div className='w-fit z-500  upload_file_name relative flex fex-row gap-x-2 items-center dark:bg-dark-hover bg-light-hover dark:text-white text-dark-secondary text-[12px]  rounded-[4px]'>
                                      <div className='flex flex-row items-center gap-x-1 px-2 w-fit h-fit'>
                                            {
                                              
                                                file.mime_type == "application/vnd.openxmlformats-officedocument.presentationml.presentation"  || file.type == "application/vnd.ms-powerpoint"?
                                                  <UploadedFiles name={file.name} size={file.size} icon={powerpointIcon} url={file.original_url}/>
                                                :
                                                (file.mime_type == "application/pdf"?
                                                  <UploadedFiles name={file.name} size={file.size} icon={file.thumb_url} url={file.original_url}/>
                                                    :
                                                file.mime_type == "application/vnd.oasis.opendocument.text" || file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"?
                                                  <UploadedFiles name={file.name} size={file.size} icon={wordIcon} url={file.original_url}/>
                                                :
                                                file.mime_type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ?
                                                  <UploadedFiles name={file.name} size={file.size} icon={excelIcon} url={file.original_url}/>
                                                  :
                                                file.mime_type = "image" ?
                                                <a href={file.original_url} target='_blank' className='max-h-[220px] min-h-[50px] flex items-center w-[420px] cursor-pointer'>
                                                    <img src={file.original_url} alt="file" className='w-full h-full object-contain '/>
                                                </a>
                                                :
                                                  <UploadedFiles name={file.name} size={file.size}/>
                                                )
                                            }
                                          {/* <div>
                                              <h1 className='upload_file_name flex flex-wrap w-[350px]'>{file.name}</h1> 
                                              <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                                          </div> */}
                                      </div>
                                        {/* <DropdownMenu>
                                            <DropdownMenuTrigger className='h-full '>
                                                <div className='dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-r-[4px] hover:cursor-pointer h-full absolute right-0 top-1/2 flex items-center -translate-y-1/2 p-1'>
                                                    <i class='bx bx-chevron-down dark:text-white text-dark-secondary bx-sm'></i>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side='top' className='w-[180px] dark:bg-dark-secondary bg-light-thirdly border-none flex flex-col'>
                                                <DropdownMenuItem className='dark:text-white text-dark-secondary text-[14px] hover:cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover'>
                                                  <a className='flex flex-row items-center gap-x-2 w-full h-full'  href={file.original_url} download={file.file_name}>
                                                      <i class='bx bxs-download dark:text-white text-dark-secondary text-[18px]'></i>Télécharger
                                                  </a>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu> */}
                                      </div>
                                    </div>
                                ))}
                                </div>
                                {isEditingMessage && messageToEdit == index?
                                <div className='relative'>
                                  <div className='absolute bottom-0 right-0 py-2 px-3 flex flex-row gap-x-2'>
                                     <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger  onClick={cancelEditingMessage} asChild className='cursor-pointer'>
                                         <X size={20} className='dark:text-white text-dark-secondary'/>
                                        </TooltipTrigger>
                                        <TooltipContent className='dark:bg-dark-secondary bg-light-thirdly border-none dark:text-white text-dark-secondary'>
                                          Annuler
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                      {editLoader?
                                      <div>
                                         <Loader size={18} className="dark:text-white text-dark-secondary animate-spin [animation-duration:2s]"/>
                                      </div>
                                        :
                                     <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger onClick={()=>!(editedMessage === message.comment || editedMessage === "")&&editMessage(message.id)} asChild className={`cursor-pointer ${editedMessage === message.comment || editedMessage === ""? "opacity-[0.4]": ""}`}>
                                         <Check size={20} className={`dark:text-white text-dark-secondary `}/>
                                        </TooltipTrigger>
                                        <TooltipContent className='dark:bg-dark-secondary bg-light-thirdly border-none dark:text-white text-dark-secondary'>
                                          Confirmer
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                      }
                                  </div>
                                  <textarea 
                                    value={editedMessage}
                                    onChange={(e)=> setEditedMessage(e.target.value) }
                                    // ref={textareaRef} 
                                    type="text" 
                                    className='auto_expand_textarea pr-6 h-[100px]  px-1 py-2 text-[15px] focus:outline-none dark:text-white text-dark-secondary dark:bg-dark-secondary bg-light-thirdly border-none' rows={1} placeholder='Type something'></textarea>
                                </div>
                                :
                                <p className='text-[15px]  w-fit py-1 rounded-[4px] dark:text-white text-dark-secondary'>{message.comment}</p>
                                  }
                                {openMessageOptions == index &&
                                  <motion.div
                                  ref={messageOptionRef}
                                    // onMouseLeave={()=>{optionOnMouseLeave()}}
                                    initial={{ opacity: 0, y: 30 }} // Start invisible and shifted down
                                    animate={{ opacity: 1, y: 0 }} // Move up to original position
                                    transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
                                    className='absolute -top-8 -right-4 z-10'>

                                    <div className='flex flex-row items-center gap-x-3 px-3 py-2 shadow-lg dark:text-white text-dark-secondary dark:bg-dark-primary bg-light-primary rounded-md'>
                                       
                                         <TooltipProvider>
                                          <Tooltip >
                                            <TooltipTrigger onClick={()=>{setEditedMessage(message.comment); setOpenMessageOptions(null); setIsEditingMessage(true); setMessageToEdit(index)}}>
                                              <Pencil  size={18} className="cursor-pointer "/>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              Modifier
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        {isDeletingMessage ?
                                          <TooltipProvider>
                                            <Tooltip >
                                              <TooltipTrigger  onClick={()=>deleteMessage(message.id)}>
                                                <Loader size={18} className="dark:text-white text-dark-secondary animate-spin [animation-duration:2s]"/>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                Suppression...
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        :
                                        <TooltipProvider>
                                          <Tooltip >
                                            <TooltipTrigger  onClick={()=>deleteMessage(message.id)}>
                                              <Trash2  size={18} className="cursor-pointer text-destructive"/>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              Supprimer
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        }
                                    </div>
                                  </motion.div>
                                }
                              </div>
                          </div>
                        }
                    </div>
                  ))):
                  (
                    <div>
                      <div className='w-[250px] h-[250px] opacity-[0.15] mx-auto'>
                          <img  className=" object-contain  "  src="../../../icons/discussion.svg" alt="message" />
                      </div>
                    </div>
                  )}
            </div>
          </ScrollArea>
            <div className='mt-2  dark:bg-dark-secondary bg-light-thirdly rounded-[4px]'>
              {isFileUpoading && (
                <div className='flex flex-row flex-wrap gap-1 items-center p-2  border-b'>
                    {filesUploaded.map((file,index) =>(
                      <div key={index} className={cn('relative  upload_file_name flex flex-row items-center gap-2 h-[50px]  workspace_box_shadow rounded-[4px] relative')}>
                          <div className='flex flex-row items-center gap-x-1 px-2 w-fit h-fit dark:text-white text-dark-secondary text-[15px]'>
                                  {
                                      file.type == "application/vnd.openxmlformats-officedocument.presentationml.presentation"  || file.type == "application/vnd.ms-powerpoint"?
                                            <div className='w-[250px] flex flex-row items-center gap-x-2'>
                                            <div className='h-[50px] w-[40px]'>
                                              <img src={powerpointIcon} alt="file" className='w-[40px] h-full object-contain '/>
                                            </div>
                                            <div>
                                                <h1 className='upload_file_name flex flex-wrap '>{file.name}</h1> 
                                                <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                                            </div> 
                                          </div>
                                      :
                                      (file.type == "application/pdf"?
                                        <div className='w-[250px] flex flex-row items-center gap-x-2 '>
                                          <div className='h-[50px] w-[40px]'>
                                            <img src={pdfIcon} alt="file" className='w-full h-full object-contain '/>
                                          </div>
                                          <div>
                                              <h1 className='upload_file_name flex flex-wrap '>{file.name}</h1> 
                                              <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                                          </div> 
                                        </div>
                                        
                                          :
                                      file.type == "application/vnd.oasis.opendocument.text" || file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"?
                                            <div className='w-[250px] flex flex-row items-center gap-x-2'>
                                            <div className='h-[50px] w-[40px]'>
                                              <img src={wordIcon} alt="file" className='w-[40px] h-full object-contain '/>
                                            </div>
                                            <div>
                                                <h1 className='upload_file_name flex flex-wrap '>{file.name}</h1> 
                                                <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                                            </div> 
                                          </div>
                                      :
                                      file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ?
                                            <div className='w-[250px] flex flex-row items-center gap-x-2'>
                                            <div className='h-[50px] w-[40px]'>
                                              <img src={excelIcon} alt="file" className='w-[40px] h-full object-contain '/>
                                            </div>
                                            <div>
                                                <h1 className='upload_file_name flex flex-wrap w-[200px]'>{file.name}</h1> 
                                                <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                                            </div> 
                                          </div> 
                                        :
                                      file.type = "image" ?
                                      <div className='max-h-[220px] min-h-[50px] flex items-center w-[420px]'>
                                          <img src={file.url} alt="file" className='w-full h-full object-contain '/>
                                      </div>
                                      :
                                        <div className='w-[250px] flex flex-row items-center gap-x-2'>
                                        <div className='h-[50px] w-[40px]'>
                                          <i class='bx bxs-file dark:text-white text-dark-secondary text-[20px]'></i>
                                        </div>
                                        <div>
                                            <h1 className='upload_file_name flex flex-wrap '>{file.name}</h1> 
                                            <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                                        </div> 
                                      </div> 
                                      )
                                  }
                                {/* <div>
                                    <h1 className='upload_file_name flex flex-wrap w-[350px]'>{file.name}</h1> 
                                    <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                                </div> */}
                            </div>
                          {/* <DropdownMenu>
                            <DropdownMenuTrigger className='h-full '>
                                <div className='dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-r-[4px] hover:cursor-pointer h-full absolute right-0 top-1/2 flex items-center -translate-y-1/2 p-1'>
                                    <i class='bx bx-chevron-down dark:text-white text-dark-secondary bx-sm'></i>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side='top' className='w-[180px] dark:bg-dark-secondary bg-light-thirdly border-none flex flex-col'>
                                <DropdownMenuItem className='dark:text-white text-dark-secondary text-[14px] hover:cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover' onClick={() => removeFile(index) }>
                                    <i class='bx bx-x text-red-600 text-[20px]'></i>Supprimer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu> */}
                           {showProgress ? <Progress value={file.loading} className=" h-1 left-0 w-full absolute bottom-0" />:""}
                      </div>
                    ))}
                </div>
                )}
              <div className='relative w-full '>
                  <div className='w-[90%] mx-auto  '>
                  <div className='absolute left-0 top-1/2 -translate-y-1/2 p-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <label htmlFor='file' className='cursor-pointer'><i className="fa-solid fa-paperclip dark:text-white text-dark-secondary"></i></label>
                            <input type="file" accept=".pdf, .doc, .docx, .xls, .odt, .xlsx, .txt, .png, .jpeg, .jpg" name='file' id='file' multiple className='hidden' onChange={handleFileChange} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className='dark:bg-dark-secondary bg-light-thirdly border-none dark:text-white text-dark-secondary'>
                          <p className='text-[12px]'>Attachez un document</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                    <textarea 
                    value={newMessage}
                    onChange={(e)=> setNewMessage(e.target.value) }
                    ref={textareaRef} 
                    type="text" 
                    className='auto_expand_textarea pr-6 h-[20px] w-full px-1 py-2 text-[15px] focus:outline-none dark:text-white text-dark-secondary dark:bg-dark-secondary bg-light-thirdly border-none' rows={1} placeholder='Type something'></textarea>
                  </div>
                  <div className='absolute right-0 top-1/2 flex items-center -translate-y-1/2 p-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {loader ?
                          <Loader size={20} className="dark:text-white text-dark-secondary animate-spin [animation-duration:2s]" /> 
                          :
                          <div className=' '>
                            <button onClick={SendMessage}  className='h-fit  mt-1 my-auto'><i class='bx bxs-send text-[#0f6cbd] tefxt-[#335b74] bx-sm'></i></button>
                          </div>
                          }
                        </TooltipTrigger>
                        <TooltipContent className='dark:bg-dark-secondary bg-light-thirdly border-none dark:text-white text-dark-secondary'>
                          <p className='text-[12px]'>Envoyer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
              </div>
            </div>
          </div>
      </section>
      <section className='flex-1 pt-4'>
        <WorkSpaceUtilities tasks={tasks} files={allFiles} users={users} caseID={caseId}/>
      </section>
    </section>

  )
}

export default WorkSpace


