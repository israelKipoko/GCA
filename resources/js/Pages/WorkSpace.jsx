import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { Toaster } from "../../../components/ui/toaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { cn } from "../../../lib/utils";
import { format } from 'date-fns';
import { Progress } from "../../../components/ui/progress"
import { fr } from 'date-fns/locale';
import { ScrollArea } from "../../../components/ui/scroll-area";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import TodoCreateInput from './utils/TodoCreateInput';
import TodoItem from './utils/TodoItem';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogOverlay
} from "../../../components/ui/dialog";

import Echo from 'laravel-echo';

import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});


const WorkSpace = ({caseId,caseFolders}) =>{

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const textareaRef = useRef(null);
  const [userRole, setUserRole] = useState('');
  const [toggleDocRenderer, setToggleDocRedenrer] = useState(false);
  const [docToRender, setDocToRender] = useState([]);
  const [docInfo,setDocInfo] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isFileUpoading, setIsFileUpoading] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [caseFiles, setCaseFiles] = useState(caseFolders);
  var transformedData;
  var transformedUserData;
  const dialogRef = useRef(null);
  const audio = new Audio('../../../sounds/completed_2.mp3');

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
        realDate: element.created_at
      }));
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
  window.Echo.channel('messages')
.listen('Message', (event)=>{
  getMessages();
})
  function getTasks(){
    axios.get('/tasks/get-all-case-tasks/'+caseId)
    .then(response => {
      var transformedDataTasks = response.data[0].map(element => ({
        id:element.id,
        title: element.title,
        note: element.note,
        status: element.status,
        assigned: element.assigned_to,
      }));
      let userId = response.data[1];
      setUserRole(response.data[2]);
      setTasks([]);
      transformedDataTasks.forEach((task) => {
       if(task.assigned != null){
          if(response.data[2] == "Admin"){
            setTasks(prevAffectedTasks => [...prevAffectedTasks,task]);
          }else if(task.assigned.includes(userId)){
            //  if(task.status == "pending")
            setTasks(prevAffectedTasks => [...prevAffectedTasks,task]);
            //  else
            //    setCompletedAffectedTasks(prevAffectedTasks => [...prevAffectedTasks,task]);
           }
        }else{
          setTasks(prevTasks => [...prevTasks,task]);
        }
      });
    })
    .catch(error => {
      console.log(error.message)

    });
  }
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshParent = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  useEffect(() => {
    getMessages();
    getTasks();
    const textarea = textareaRef.current;
    const handleInput = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener('input', handleInput);
    textarea.dispatchEvent(new Event('input'));

    
    return () => {
      textarea.removeEventListener('input', handleInput);
    };

  }, [refreshKey]);

  const handleFileChange = (event) => {
    setIsFileUpoading(true);
    const files = Array.from(event.target.files);
    
    transformedData = files.map(file => ({
        name: file.name,
        size: file.size,
        loading: 0,
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
          //something
        }
      },
    }).catch(console.error);
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

  const ViewDoc = (url,message=null,model_id=null) => {
   var doc = [
      { uri: url},
    ];
    if(model_id != null){
      message = messages.find(item => item.id === model_id);
    }
    setDocToRender(doc)
    setDocInfo(message)
    setToggleDocRedenrer(true);
  }
  const SendMessage = (event) => {
    if(newMessage !== '' || filesUploaded.length != 0){
      axios.post('/cases/create-new-message/'+caseId,{
        newComment: newMessage,
        fileLength: filesUploaded.length ?? 0,
      })
      .then(response => {
        refreshParent();
        setNewMessage('');
        setIsFileUpoading(false);
        setShowProgress(false)
        setFilesUploaded([]);
      })
      .catch(error => {
        console.log(error)
      });
    }
    };

  const [toggledTabs , setToggledTabs]  = useState('');
  const [isTabClick , setIsTabClick]  = useState(false);
  const [newTask , setNewTask]  = useState('');
  const TabsToggle = (tabs) =>{
    setIsTabClick(true);
    setToggledTabs(tabs);
  };

  const CreateTask = (event,id = null ,dueDate) =>{
    event.preventDefault();
    console.log(dueDate)
    axios.post('/tasks/create-new-task/'+caseId,{
      title: newTask,
      users: assignedUsers,
      dueDate: dueDate,
    })
    .then(response => {
      getTasks();
      setNewTask('')
      setAssignedUsers([])
    })
    .catch(error => {
      console.log(error.message)
    });
  }
  const ChangeStatus = (id) =>{
    axios.post('/tasks/update-status',{
      task_id: id,
    })
    .then(response => {
      getTasks();
      if(response.data == "completed"){
        audio.play();
      }
    })
    .catch(error => {
      console.log(error.message)
    });
  };
  const addUsersToTask = (id) =>{
    setAssignedUsers((currentUsers) => {
      if (currentUsers.includes(id)) {
        return currentUsers.filter((user) => user !== id);
      } else {
        return [...currentUsers, id];
      }
    });
  }
  return (
    <section className='flex flex-row gap-x-4 w-full'>
      <section className=" w-[600px]">
          <div>
               <Dialog open={toggleDocRenderer} ref={dialogRef}   modal={false}>
               <DialogContent className='w-[1000px] border-none dark:bg-dark-secondary bg-light-thirdly '>
                 <section className='w-full h-full flex flex-row relative'>
                     <ScrollArea className='w-[700px] h-[400px] '>
                         <DocViewer documents={docToRender} pluginRenderers={DocViewerRenderers} style={{height:400,overflowY:"auto"}}/>
                     </ScrollArea>
                     <div className='w-[250px] h-full p-2 workspace_box_shadow'>
                       <div className='w-full'>
                           <div className='flex flex-row gap-x-2 items-center'>
                               <div className='w-[25px] h-[25px]'>
                                 <img src={docInfo.avatar} alt="avatar" className=" object-contain rounded-full" />
                               </div>
                               <h1 className='dark:text-white text-dark-secondary text-[14px] capitalize'>{docInfo.name}</h1>
                           </div>
                           <p className='pl-4 my-1 text-white w-full'>
                               {docInfo.comment}
                           </p>
                       <div className={cn(" opacity-[0.5] text-[#ddd] text-[13px] w-fit ml-auto capitalize")}>{docInfo.length != 0 ?(format(new Date(docInfo.realDate), "dd MMMM yyyy HH:mm", { locale: fr })):(<h1>dd</h1>)}</div>
                       </div>
                     </div>
                     <button className='absolute -top-6 -right-2' onClick={() => setToggleDocRedenrer(false)}>
                         <i class='bx bx-x bx-md dark:text-white text-dark-secondary '></i>
                     </button>
                 </section>
                 
               </DialogContent>
             </Dialog>
             {caseFiles.length != 0 ? (
                <section className='apps p-1 flex flex-wrap gap-x-1'>
                  {caseFiles.map((file,index) => (
                    <div key={index} className='w-[220px] h-[40px] relative flex fex-row gap-x-2 items-center p-2 dark:bg-dark-secondary bg-light-thirdly dark:text-white text-dark-secondary text-[12px]  rounded-[4px]'>
                      <div>
                          <i className='bx bxs-file dark:text-white text-dark-secondary text-[18px]'></i>
                      </div>
                      <div>
                          <h1 className='upload_file_name flex flex-wrap'>{file.name}</h1> 
                          <p className='text-[10px]'>{formatFileSize(file.size)}</p>
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
          <ScrollArea className="py-1 px-2 workspace_message_box_wrapper ">
            <div className='w-full flex flex-col gap-y-4'>
            {messages.length ? (
                  messages.map((message,index) =>(
                      <div key={index} className='flex  flex-row items-start flex-wrap gap-x-1'>
                          <div className='w-[25px] h-[25px]'>
                            <img src={message.avatar} alt="avatar" className=" object-contain rounded-full" />
                          </div>
                        <div className='flex flex-col justify-center py-0.5 w-fit '>
                            <div>
                              <h1 className='dark:text-white text-dark-secondary text-[14px] capitalize'>{message.name} <span className={cn("ml-1 opacity-[0.5] dark:text-white text-dark-secondary  text-[13px]",isSingleWord(message.date) ? 'capitalize' : 'lowercase')}>{message.date}</span></h1>
                            </div>
                            <div className='message_box'>
                              <p className='text-[15px]  w-fit py-1 rounded-[4px] dark:text-white text-dark-secondary'>{message.comment}</p>
                              <div className='flex flex-wrap gap-2 w-fit'>
                                {message.files.map((file,index)=>(
                                  <div key={index}>
                                    <div className='w-[240px] h-[50px] relative flex fex-row gap-x-2 items-center p-2 dark:bg-dark-secondary bg-light-thirdly dark:text-white text-dark-secondary text-[12px]  rounded-[4px]'>
                                      <div>
                                          <i class='bx bxs-file dark:text-white text-dark-secondary text-[18px]'></i>
                                      </div>
                                      <div>
                                          <h1 className='upload_file_name'>{file.file_name}</h1> 
                                          <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                                      </div>
                                      <DropdownMenu>
                                          <DropdownMenuTrigger className='h-full '>
                                              <div className='dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-r-[4px] hover:cursor-pointer h-full absolute right-0 top-1/2 flex items-center -translate-y-1/2 p-1'>
                                                  <i class='bx bx-chevron-down dark:text-white text-dark-secondary bx-sm'></i>
                                              </div>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent side='top' className='w-[180px] dark:bg-dark-secondary bg-light-thirdly border-none flex flex-col'>
                                              <DropdownMenuItem className='dark:text-white text-dark-secondary text-[14px] hover:cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover' onClick={(e) => ViewDoc(file.original_url,message,null)}>
                                                <i class='bx bx-file-find dark:text-white text-dark-secondary text-[18px]'></i>Aperçu
                                                </DropdownMenuItem>
                                              <DropdownMenuItem className='dark:text-white text-dark-secondary text-[14px] hover:cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover'>
                                                 <a className='flex flex-row items-center gap-x-2 w-full h-full'  href={file.original_url} download={file.file_name}>
                                                    <i class='bx bxs-download dark:text-white text-dark-secondary text-[18px]'></i>Télécharger
                                                 </a>
                                              </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                  </div>
                              ))}
                              </div>
                            
                            </div>
                        </div>
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
                <div className='flex flex-row flex-wrap gap-x-1 items-center p-2  border-b'>
                    {filesUploaded.map((file,index) =>(
                      <div key={index} className={cn('relative flex flex-row items-center gap-2 h-[50px] p-1 workspace_box_shadow rounded-[4px] relative', filesUploaded.length > 2 ? "w-[190px]":"w-[200px]")}>
                         <div>
                              <i class='bx bxs-file dark:text-white text-dark-secondary text-[18px]'></i>
                          </div>
                          <div>
                              <h1 className='dark:text-white text-dark-secondary text-[12px] upload_file_name'>{file.name}</h1> 
                              <p className='dark:text-white text-dark-secondary text-[10px]'>{formatFileSize(file.size)}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger className='h-full '>
                                <div className='dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-r-[4px] hover:cursor-pointer h-full absolute right-0 top-1/2 flex items-center -translate-y-1/2 p-1'>
                                    <i class='bx bx-chevron-down dark:text-white text-dark-secondary bx-sm'></i>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side='top' className='w-[180px] dark:bg-dark-secondary bg-light-thirdly border-none flex flex-col'>
                                {/* <DropdownMenuItem className='dark:text-white text-dark-secondary text-[14px] hover:cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover'><i class='bx bx-file-find dark:text-white text-dark-secondary text-[18px]'></i>Aperçu</DropdownMenuItem> */}
                                <DropdownMenuItem className='dark:text-white text-dark-secondary text-[14px] hover:cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover' onClick={() => removeFile(index) }>
                                    <i class='bx bx-x text-red-600 text-[20px]'></i>Supprimer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                    onChange={(e)=> setNewMessage(e.target.value)}
                    ref={textareaRef} 
                    type="text" 
                    className='auto_expand_textarea pr-6 h-[20px] w-full px-1 py-2 text-[15px] focus:outline-none dark:text-white text-dark-secondary dark:bg-dark-secondary bg-light-thirdly border-none' rows={1} placeholder='Type something'></textarea>
                  </div>
                  <div className='absolute right-0 top-1/2 flex items-center -translate-y-1/2 p-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className=' '>
                            <button onClick={SendMessage}  className='h-fit  mt-1 my-auto'><i class='bx bxs-send text-[#0f6cbd] tefxt-[#335b74] bx-sm'></i></button>
                          </div>
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
        {!isTabClick? 
        <section className='w-fit mx-auto '>
          <div className='workspace_tools_wrapper' onClick={(e)=> TabsToggle('task')}> 
            <div className='flex flex-col justify-center' >
              <div className='flex items-center gap-x-1'>
                <h1 className='dark:text-white text-dark-secondary '>Vos tâches</h1><span className='dark:text-white text-dark-secondary'>{tasks.length}</span>
              </div>
            </div>
            <div><i className='bx bx-chevrons-right text-[18px] dark:text-white text-dark-secondary'></i></div>
          </div>
          <div className='workspace_tools_wrapper' onClick={(e)=> TabsToggle('docs')}>
            <div className='flex items-center gap-x-1'>
              <h1 className='dark:text-white text-dark-secondary '>Documents Partagés</h1> <span className='dark:text-white text-dark-secondary'>{allFiles.length}</span>
            </div>
            <div><i className='bx bx-chevrons-right text-[18px] dark:text-white text-dark-secondary'></i></div>
          </div> 
        </section>
        :
          (toggledTabs == 'task')? 
          <section className='w-[500px] mx-auto'>
              <header className='workspace_tabs_header'>
                <div className='w-fit cursor-pointer absolute' onClick={(e)=> setIsTabClick(false)}><i className='bx bx-chevrons-left text-[20px]'></i></div>
                <h1 className='text-center w-full'>Tâches</h1>
              </header>
              <section className='w-full'>
                    <div className='workspace_tabs_content_wrapper w-full'>
                      <div className='todo_items  mt-1 w-full'>
                      <ScrollArea className='h-full'>
                        <div className=''>
                        {tasks.length ? (
                          tasks.map((task,taskIndex)=>(
                            <TodoItem key={taskIndex} ChangeStatus={ChangeStatus} task={task} users={users}/>
                          ))
                        ): (
                          <div className="flex flex-col  items-center h-fit my-auto  no-event mt-4">
                          <img className="w-[60px] h-[60px]" src="../../../icons/no-task.png" alt="No task"/>
                            <p className="text-[13px] text-center dark:text-white text-dark-secondary">Les tâches rélatives à ce dossier apparaîtront ici.</p>
                          </div>
                        )}
                        </div>
                      </ScrollArea>
                      </div>
                      <TodoCreateInput newTask={newTask} setNewTask={setNewTask} CreateTask={CreateTask} users={users} assignedUsers={assignedUsers} isAssign={true} addUsersToTask={addUsersToTask} />
                    </div>
              </section>
          </section>
          :
          <section className='w-[500px] mx-auto'>
              <header className='workspace_tabs_header'>
                <div className='w-fit cursor-pointer absolute' onClick={(e)=> setIsTabClick(false)}><i className='bx bx-chevrons-left text-[20px]'></i></div>
                <h1 className='text-center w-full'>Documents</h1>
              </header>
              <ScrollArea className='mt-2'>
                  <div className='flex flex-col gap-y-1'>
                  {allFiles.length ? (
                    allFiles.map((file,index)=>(
                      <div key={index}>
                         <div className='relative flex fex-row gap-x-2 items-center p-2 dark:bg-dark-secondary bg-light-thirdly dark:text-white text-dark-secondary text-[12px]  rounded-[4px]'>
                            <div>
                                <i class='bx bxs-file dark:text-white text-dark-secondary text-[18px]'></i>
                            </div>
                            <div>
                                <h1 className='upload_file_name'>{file.file_name}</h1> 
                                <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className='h-full p-1 absolute right-0 top-1/2 flex items-center -translate-y-1/2'>
                                    <div className='dark:hover:bg-[#d8d8d833] hover:bg-light-hover rounded-r-[4px] hover:cursor-pointer h-full flex items-center '>
                                        <i class='bx bx-chevron-down dark:text-white text-dark-secondary bx-sm'></i>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side='top' className='w-[180px] dark:bg-dark-secondary bg-light-thirdly border-none flex flex-col'>
                                    <DropdownMenuItem className='dark:text-white text-dark-secondary text-[14px] hover:cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover' onClick={() => ViewDoc(file.original_url,null,file.model_id)}>
                                      <i class='bx bx-file-find dark:text-white text-dark-secondary text-[18px]'></i>Aperçu
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className='dark:text-white text-dark-secondary text-[14px] hover:cursor-pointer dark:hover:bg-[#d8d8d833] hover:bg-light-hover'>
                                        <a className='flex flex-row items-center gap-x-2 w-full h-full'  href={file.original_url} download={file.file_name}>
                                          <i class='bx bxs-download dark:text-white text-dark-secondary text-[18px]'></i>Télécharger
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                          </div>
                      </div>
                    ))
                  ):(
                    <div>
                       <div className="flex flex-col  items-center h-fit my-auto  no-event mt-4">
                          <img className="w-[60px] h-[60px]" src="../../../icons/no-task.png" alt="No task"/>
                            <p className="text-[13px] text-center">Les documents partagés apparaîtront ici.</p>
                        </div>
                    </div>
                  )}
                  </div>
              </ScrollArea>
          </section>
}
          
      </section>
    </section>

  )
}

export default WorkSpace


