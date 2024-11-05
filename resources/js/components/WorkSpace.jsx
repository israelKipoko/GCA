import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { Toaster } from "../../../components/ui/toaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { cn } from "../../../lib/utils";
import { formatDistanceToNow } from 'date-fns';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

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

window.Echo.channel('messages')
.listen('Message', (event)=>{
  getMessages();
})
const WorkSpace = (caseId) =>{

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState('my_task');
  const audio = new Audio('../../../sounds/completed_2.mp3');
  const [userRole, setUserRole] = useState('');
  var [timecreated] = useState(); 
  var [relativeTime, setRelativeTime] = useState();
  var transformedData;
  var transformedUserData;
 
  function getMessages(){
    axios.get('/cases/get-all-case-messages/'+caseId.caseId)
    .then(response => {
      transformedData = response.data[0].map(element => ({
        id:element.id,
        comment: element.comments,
        date: element.created_at,
        name: element.user.firstname +" "+ element.user.name,
        avatar: element.user.avatar_link,
        files: element.media,
        date: element.created_at
      }));
      console.log(transformedData.date)
      timecreated =  transformedData.date;
      setRelativeTime(formatDistanceToNow(timecreated, { addSuffix: true }));

      setAllFiles([]);
      transformedData.forEach((item) =>{
        if(item.files.length != 0){
          item.files.forEach((file)=>{
            setAllFiles(prevAllFiles => [...prevAllFiles,file]);
          })
        }
      })
      transformedUserData = response.data[1].map(element => ({
        id:element.id,
        name: element.firstname +" "+ element.name,
        avatar: element.avatar_link,
      }));
      setUsers(transformedUserData);
      setMessages(transformedData);
    })
    .catch(error => {
      console.log(error.message)

    });
  }
  function getTasks(){
    axios.get('/tasks/get-all-case-tasks/'+caseId.caseId)
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
      setAssignedTasks([]);
      transformedDataTasks.forEach((task) => {
       if(task.assigned != null){
           if(task.assigned.includes(userId)){
            //  if(task.status == "pending")
               setAssignedTasks(prevAffectedTasks => [...prevAffectedTasks,task]);
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

    const interval = setInterval(() => {
      setRelativeTime(formatDistanceToNow(timecreated, { addSuffix: true }));
    }, 60000);

    return () => {
      textarea.removeEventListener('input', handleInput);
      clearInterval(interval); 
    };

  }, [refreshKey,timecreated]);

  
  const [newMessage, setNewMessage] = useState('');
  const [isFileUpoading, setIsFileUpoading] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState([]);
  const [fileProgress, setFileProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  var allUploaded;

  const handleFileChange = (event) => {
    setIsFileUpoading(true);
    const files = Array.from(event.target.files);
    
    transformedData = files.map(file => ({
        name: file.name,
        size: file.size,
    }));
    setFilesUploaded((prevFilesUploaded) => [...prevFilesUploaded, ...transformedData]);

    files.forEach((file, index) => {
      uploadFile(file, index + files.length); // Adjust index for new files
    });
     allUploaded = filesUploaded.length > 0 && filesUploaded.every((file, index) => uploadStatus[index] === 'uploaded');

  };
  const uploadFile = (file, index) => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('/cases/upload-file/'+caseId.caseId, formData, {
      onUploadProgress: (progressEvent) => {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setFileProgress((prevProgress) => ({
          ...prevProgress,
          [index]: percentage,
        }));
      },
    })
    .then((response) => {
      setFileProgress((prevProgress) => ({
        ...prevProgress,
        [index]: 100,
      }));
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [index]: 'uploaded',
      }));
    })
    .catch((error) => {
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [index]: 'failed',
      }));
    });

  };
  const formatFileSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const SendMessage = (event) => {

      axios.post('/cases/create-new-message/'+caseId.caseId,{
        newComment: newMessage,
        fileLength: filesUploaded.length ?? 0,
      })
      .then(response => {
        refreshParent();
        setNewMessage('');
        setIsFileUpoading(false);
        setFilesUploaded([]);
        setFileProgress({});
        setUploadStatus({})
      })
      .catch(error => {
        console.log('Could not create new client')
      });
    };

  const [toggledTabs , setToggledTabs]  = useState('');
  const [isTabClick , setIsTabClick]  = useState(false);
  const [newTask , setNewTask]  = useState('');
  const TabsToggle = (tabs) =>{
    setIsTabClick(true);
    setToggledTabs(tabs);
  };

  const CreateTask = (event) =>{
    event.preventDefault();
    axios.post('/tasks/create-new-task/'+caseId.caseId,{
      title: newTask,
    })
    .then(response => {
      getTasks();
      setNewTask('')
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
  return (
    <section className='flex'>
      <section className=" w-[600px]">
          <div>
            <div className='py-1 px-2' id='workspace_message_box_wrapper'>
              {messages.length ? (
              messages.map((message) =>(
                  <div className='flex  flex-row items-start flex-wrap gap-x-1'>
                      <div className='w-[25px] h-[25px]'>
                        <img src={message.avatar} alt="avatar"className=" object-fit-contain rounded-full" />
                      </div>
                     <div className='flex flex-col justify-center py-0.5'>
                        <div>
                          <h1 className='text-[#fff] text-[14px] capitalize'>{message.name}{`Posted ${relativeTime}`}</h1>
                        </div>
                        <div className='message_box'>
                          <p className='text-[15px]  w-fit py-1 rounded-[4px] text-[#fff]'>{message.comment}</p>
                          <div className='flex gap-x-2'>
                            {message.files.map((file)=>(
                              <div>
                                <a className='w-[ h-[50px] p-2 bg-[#335b74] text-[#fff] text-[12px] upload_file_name rounded-[4px]' href={file.original_url} download={file.file_name}>{file.file_name}</a>
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
                      <img  className=" object-fit-contain  "  src="../../../icons/discussion.svg" alt="message" />
                  </div>
                </div>
              )}
            </div>
            <div className='mt-2  bg-[#313131] rounded-[4px]'>
              {isFileUpoading && (
                <div className='flex gap-x-2 items-center p-2  overflow-scroll  border-b'>
                    {filesUploaded.map((file,index) =>(
                      <div className=' w-[140px] h-[50px] p-2 bg-[#335b74] rounded-[4px] relative'>
                        <h1 className='text-[#fff] text-[12px] upload_file_name'>{file.name}</h1>
                        <span className='text-[#fff] text-[11px]'>{formatFileSize(file.size)}</span>
                        {/* <progress value={fileProgress[index] || 0} max="100">{fileProgress[index] || 0}%</progress> */}
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
                            <label htmlFor='file' className='cursor-pointer'><i className="fa-solid fa-paperclip text-[#fff]"></i></label>
                            <input type="file" accept=".pdf, .doc, .docx, .xls, .xlsx .txt .png .jpeg .jpg" name='file' id='file' multiple className='hidden' onChange={handleFileChange} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#313131] border-none text-[#fff]'>
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
                    className='auto_expand_textarea pr-6 h-[20px] w-full px-1 py-2 text-[15px] focus:outline-none text-[#fff] bg-[#313131] border-none' rows={1} placeholder='Type something'></textarea>
                  </div>
                  <div className='absolute right-0 top-1/2 flex items-center -translate-y-1/2 p-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className=' '>
                            <button onClick={SendMessage} className='h-fit  mt-1 my-auto'><i class='bx bxs-send text-[#335b74] bx-sm'></i></button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#313131] border-none text-[#fff]'>
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
                <h1>Vos tâches</h1><span>{tasks.length}</span>
              </div>
            </div>
            <div><i className='bx bx-chevrons-right text-[18px]'></i></div>
          </div>
          <div className='workspace_tools_wrapper' onClick={(e)=> TabsToggle('docs')}>
            <div className='flex items-center gap-x-1'>
              <h1>Documents Partagés</h1> <span>{allFiles.length}</span>
            </div>
            <div><i className='bx bx-chevrons-right text-[18px]'></i></div>
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
                <Tabs defaultValue="my_task" className="w-full">
                  <TabsList className='gap-x-2 items-center'>
                    <TabsTrigger value="my_task"  onClick={()=> setActiveTab('my_task')} className={cn("rounded-full text-[#fff]",activeTab=="my_task"?"active_tab":"opacity-[0.50] ")}>Mes tâches</TabsTrigger>
                    <TabsTrigger value="assigned_task" onClick={()=> setActiveTab('assigned_task')}  className={cn("rounded-full text-[#fff]",activeTab=="assigned_task"?"active_tab":"opacity-[0.50] ")}>Assignées</TabsTrigger>
                  </TabsList>
                  <TabsContent value="my_task" className=' w-full'>
                    <div className='workspace_tabs_content_wrapper w-full'>
                      <div className='todo_items  mt-1 w-full'>
                        <div className=''>
                        {tasks.length ? (
                          tasks.map((task)=>(
                            <div className="todo_item">
                              <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                  <div {...task.status == "pending"? {className:'check_mark'}:{className:'check_mark checked'}}>
                                      <img src="../../../icons/icon-check.svg"/>
                                  </div>
                              </div>
                              <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                  {task.title}
                              </div>
                            </div>
                          ))
                        ): (
                          <div className="flex flex-col  items-center h-fit my-auto  no-event mt-4">
                          <img className="w-[60px] h-[60px]" src="../../../icons/no-task.png" alt="No task"/>
                            <p className="text-[13px] text-center">Les tâches rélatives à ce dossier apparaîtront ici.</p>
                          </div>
                        )}
                        </div>
                      </div>
                      <div className="addTaskInput">
                        <div className="check">
                          <div className="">
                            <i className="fas fa-plus text-[18px]  text-[#fff]"></i>
                          </div>
                        </div>
                        <form className="todo_text" id="new_todo_form" onSubmit={CreateTask}>
                          <input type="text" value={newTask}  onChange={(e)=> setNewTask(e.target.value)} placeholder="Ajouter une tâche" id="new_task" name="new_task"/>
                        </form>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="assigned_task">
                  <div className='workspace_tabs_content_wrapper w-full'>
                      <div className='todo_items  mt-1 w-full'>
                        <div className=''>
                        {assignedTasks.length ? (
                          assignedTasks.map((task)=>(
                            <div className="todo_item">
                              <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                  <div {...task.status == "pending"? {className:'check_mark'}:{className:'check_mark checked'}}>
                                      <img src="../../../icons/icon-check.svg"/>
                                  </div>
                              </div>
                              <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                  {task.title}
                              </div>
                            </div>
                          ))
                        ): (
                          <div className="flex flex-col  items-center h-fit my-auto  no-event mt-4">
                          <img className="w-[60px] h-[60px]" src="../../../icons/no-task.png" alt="No task"/>
                            <p className="text-[13px] text-center">Les tâches qui vous sont assignées apparaîtront ici.</p>
                          </div>
                        )}
                        </div>
                      </div>
                      {userRole == 'Admin'?
                       <div className="addTaskInput">
                       <div className="check">
                         <div className="">
                           <i className="fas fa-plus text-[18px]  text-[#fff]"></i>
                         </div>
                       </div>
                       <form className="todo_text" id="new_todo_form" onSubmit={CreateTask}>
                        <div className='relative'>
                            <input type="text" value={newTask}  onChange={(e)=> setNewTask(e.target.value)} placeholder="Ajouter une tâche" id="new_task" name="new_task"/>
                             <div className='absolute right-0 top-1/2 flex items-center -translate-y-1/2 '>
                               
                                        <DropdownMenu>
                                          <DropdownMenuTrigger>
                                              <TooltipProvider >
                                                <Tooltip >
                                                  <TooltipTrigger asChild className='cursor-pointer'>
                                                  <div>
                                                      <span><i class='bx bxs-user text-[#fff] text-[18px]'></i></span>
                                                  </div>
                                                  </TooltipTrigger>
                                                <TooltipContent className='bg-[#313131] border-none text-[#fff] z-10'>
                                                  <p className='text-[12px]'>Asssigner une tâche</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent className='bg-[#d8d8d833] border-none grid grid-cols-3'>
                                            {users.map((user,index) =>(
                                                <DropdownMenuItem key={index} className='w-[40px] h-[40px]'>
                                                  <TooltipProvider >
                                                    <Tooltip >
                                                      <TooltipTrigger asChild className={cn('cursor-pointer',(assignedUsers.includes(user.id))?"opacity-[0.75]":"")} onClick={(e)=> setAssignedUsers(prevUsers => [...prevUsers,users.id])}>
                                                          <img src={user.avatar} alt="avatar" className=" object-fit-contain rounded-full" />
                                                      </TooltipTrigger>
                                                    <TooltipContent className='bg-[#313131] border-none text-[#fff] z-10'>
                                                      <p className='text-[12px] capitalize'>{user.name}</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                                </DropdownMenuItem>
                                            ))}
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                        
                                    
                             </div>
                        </div>
                       </form>
                     </div>
                     :
                     <div></div>
                    }
                    </div>
                  </TabsContent>
                </Tabs>

                  
                
              </section>
          </section>
          :
          <section className='w-[500px] mx-auto'>
              <header className='workspace_tabs_header'>
                <div className='w-fit cursor-pointer absolute' onClick={(e)=> setIsTabClick(false)}><i className='bx bx-chevrons-left text-[20px]'></i></div>
                <h1 className='text-center w-full'>Documents</h1>
              </header>
              <section className='mt-2 flex flex-col gap-y-1'>
                  {allFiles.length ? (
                    allFiles.map((file,index)=>(
                      <div key={index}>
                         <div className='bg-[#313131]  relative p-2  h-[50px] rounded-[4px]'>
                            <div className='w-[ text-[#fff] text-[12px] upload_file_name '>{file.file_name}</div>
                            <span className='text-[#fff] text-[10px]'>{formatFileSize(file.size)}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild className='cursor-pointer'>
                                  <a  href={file.original_url} download={file.file_name} className='absolute right-0 top-1/2 flex items-center -translate-y-1/2 p-2'><i class='bx bxs-download text-[#fff] bx-sm'></i></a>
                                </TooltipTrigger>
                                <TooltipContent className='bg-[#313131] border-none text-[#fff]'>
                                  <p className='text-[12px]'>Télécharger le document</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                      </div>
                    ))
                  ):(
                    <div>ss</div>
                  )}
              
              </section>
          </section>
       
}
          
      </section>
    </section>

  )
}

export default WorkSpace


