import React, {useEffect, useState} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import TodoItem from './TodoItem';
import TodoCreateInput from './TodoCreateInput';
import axios from 'axios';
import { Skeleton } from "../../../../components/ui/skeleton";
import wordIcon from "../../../../public/images/logos/docx_icon.svg";
import powerpointIcon from "../../../../public/images/logos/pptx.png";
import excelIcon from "../../../../public/images/logos/excel.png";
import { SquareArrowOutUpRight, MoreVertical, Share, Download } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "../../../../components/ui/popover";

function WorkSpaceUtilities({files, users, caseID}) {
   const [newTask , setNewTask]  = useState('');
   const [assignedUsers, setAssignedUsers] = useState([]);
   const [userTasks, setUserTasks] = useState([]);
   const [userRole, setUserRole] = useState('');
   const [isCreadtingTask, setIsCreatingTask] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [defaultTab, setDefaultTab] = useState("task");
    const audio = new Audio('../../../../sounds/completed_2.mp3');
   
  
    async function getTasks(){
      try{
        setIsLoading(true);
       const response = await axios.get('/tasks/get-all-case-tasks/'+caseID);
       
         var transformedDataTasks = response.data[0].map(element => ({
           id:element.id,
           title: element.title,
           note: element.note,
           status: element.status,
           assigned: element.assigned_to,
         }));

         let userId = response.data[1];
         setUserRole(response.data[2]);
         setUserTasks([]);
         transformedDataTasks.forEach((task) => {
          if(task.assigned != null){
             if(response.data[2] == "Admin"){
               setUserTasks(prevAffectedTasks => [...prevAffectedTasks,task]);
             }else if(task.assigned.includes(userId)){
               //  if(task.status == "pending")
               setUserTasks(prevAffectedTasks => [...prevAffectedTasks,task]);
               //  else
               //    setCompletedAffectedTasks(prevAffectedTasks => [...prevAffectedTasks,task]);
              }
           }else{
             setUserTasks(prevTasks => [...prevTasks,task]);
           }
         });
       }catch(error){
         console.log(error.message)
       }finally{
        setIsLoading(false);
       };
     }

 const ChangeStatus = (id) =>{
    axios.post('/tasks/update-status',{
      task_id: id,
    })
    .then(response => {
       if(response.data == "completed"){
        audio.play();
      }
      getTasks();
    })
    .catch(error => {
      console.log(error.message)
    });
  };
 const CreateTask = async (dueDate) =>{
    if(newTask === "") return;
    // event.preventDefault();
    setIsCreatingTask(true);
    try{
        await axios.post('/tasks/create-new-task/'+caseID,{
            title: newTask,
            users: assignedUsers,
            dueDate: dueDate,
            })
             setNewTask('')
            setAssignedUsers([])
            getTasks();
    }catch(error){
      console.log(error.message)
    }finally{
        setIsCreatingTask(false);
    }
  }

const addUsersToTask = (id) =>{
    setAssignedUsers((currentUsers) => {
      if (currentUsers.includes(id)) {
        return currentUsers.filter((user) => user !== id);
      } else {
        return [...currentUsers, id];
      }
    });
  }
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

  const shareFile = async (name,url)=>{
      if (navigator.share) {
          await navigator.share({
            title: name,
            url,
          });
        } else {
          await navigator.clipboard.writeText(url);
          alert("Lien copié dans le presse-papiers!!");
        }
    }

  useEffect(()=>{
    getTasks();
  },[])
  return (
   <Tabs defaultValue='task' className=' w-[500px] mx-auto'>
    <TabsList className='w-fit flex gap-x-0.5'>
        <TabsTrigger  onClick={()=>setDefaultTab("task")} className={`w-full text-center flex justify-center rounded-md ${defaultTab === "task"? "dark:bg-dark-hover bg-light-hover":""}`} value="task">Vos Tâches </TabsTrigger>
        <TabsTrigger onClick={()=>setDefaultTab("files")} className={` w-full text-center flex justify-center rounded-md  ${defaultTab === "files"? "dark:bg-dark-hover bg-light-hover":""}`} value="files">Documents partagés</TabsTrigger>
    </TabsList>
    <TabsContent className="w-[500px] mx-auto p-2 rounded-md" value="task">
         <section className='w-full'>
            <div className='workspace_tabs_content_wrapper  w-full'>
                <div className='todo_items  mt-1 w-full h-full'>
                  {isLoading?
                  <div className='max-h-[400px] min-h-[400px] flex flex-col gap-y-1'>
                    <Skeleton className="todo_item h-[45px] rounded-lg" />
                    <Skeleton className="todo_item h-[45px] rounded-lg" />
                    <Skeleton className="todo_item h-[45px] rounded-lg" />
                    <Skeleton className="todo_item h-[45px] rounded-lg" />
                  </div>
                  :
                <ScrollArea className='max-h-[400px] min-h-[400px]'>
                    <div className=' py-2 flex flex-col gap-y-1'>
                        {userTasks.length ? (
                            userTasks.map((task,taskIndex)=>(
                            <TodoItem key={taskIndex} ChangeStatus={ChangeStatus} task={task} users={users}/>
                            ))
                        ): (
                            <div className="flex flex-col  items-center h-fit my-auto  no-event mt-4">
                              <img className="w-[60px] h-[60px]" src="../../../../icons/no-task.png" alt="No task"/>
                              <p className="text-[13px] text-center dark:text-white text-dark-secondary">Les tâches rélatives à ce dossier apparaîtront ici.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                  }
                </div>
                <TodoCreateInput newTask={newTask} setNewTask={setNewTask} CreateTask={CreateTask} users={users} assignedUsers={assignedUsers} isAssign={true} addUsersToTask={addUsersToTask} isLoading={isCreadtingTask} />
            </div>
        </section>
    </TabsContent>
    <TabsContent className='w-[500px] mx-auto p-2 rounded-md' value="files">
       <ScrollArea className='max-h-[400px] min-h-[400px]'>
            <div className='flex flex-col gap-y-1'>
            {files.length ? (
              files.map((file,index)=>(
                <div key={index}>
                    <div className=' relative flex fex-row gap-x-2 items-center p-2 dark:bg-dark-secondary bg-light-thirdly dark:text-white text-dark-secondary text-[12px]  rounded-[4px]'>
                      {/* <div>
                          <i class='bx bxs-file dark:text-white text-dark-secondary text-[20px]'></i>
                      </div> */}
                       <div className='h-[50px] w-[40px] '>
                             {
                              file.mime_type == "application/vnd.openxmlformats-officedocument.presentationml.presentation"  || file.type == "application/vnd.ms-powerpoint"?
                                  <img src={powerpointIcon} alt="file" className='w-[40px] h-full object-contain '/>
                              :
                              (file.mime_type == "application/pdf"?
                                  <img src={file.thumb_url} alt="file" className='w-full h-full object-contain '/>
                                  :
                              file.mime_type == "application/vnd.oasis.opendocument.text" || file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"?
                                  <img src={wordIcon} alt="file" className='w-[40px] h-full object-contain '/>
                              :
                              file.mime_type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ?
                                  <img src={excelIcon} alt="file" className='w-[40px] h-full object-contain '/>
                                :
                              file.mime_type = "image" ?
                                  <img src={file.original_url} alt="file" className='w-full h-full object-contain '/>
                              :
                              <i class='bx bxs-file dark:text-white text-dark-secondary text-[20px]'></i>
                              )
                          }
                        </div>
                      <div>
                          <h1 className='upload_file_name'>{file.file_name}</h1> 
                          <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                      </div>
                      <Popover >
                          <PopoverTrigger className='z-10 h-full p-1 absolute right-0 top-1/2 flex items-center -translate-y-1/2'>
                              <MoreVertical size={20}/>
                          </PopoverTrigger>
                          <PopoverContent side='bottom' className='py-2 text-[15px] w-[180px] dark:bg-dark-secondary bg-light-thirdly border-none flex flex-col gap-y-1'>
                             <a href={file.original_url} className='flex-1 flex items-center gap-x-2 cursor-pointer w-full py-1 px-2 rounded-[4px] hover:dark:bg-dark-hover hover:bg-light-hover'><SquareArrowOutUpRight size={16}/> Ouvrir</a>
                             <a href={file.original_url} download={file.name} className='flex-1 flex items-center gap-x-2 cursor-pointer w-full py-1 px-2 rounded-[4px] hover:dark:bg-dark-hover hover:bg-light-hover'><Download size={16}/>Télécharger</a>
                             <div onClick={()=>shareFile(file.name,file.original_url)} className='flex-1 flex items-center gap-x-2 cursor-pointer w-full py-1 px-2 rounded-[4px] hover:dark:bg-dark-hover hover:bg-light-hover'> <Share size={16}/> Partager</div>
                          </PopoverContent>
                        </Popover>
                    </div>
                </div>
              ))
            ):(
              <div>
                  <div className="flex flex-col  items-center h-fit my-auto  no-event mt-4">
                    <img className="w-[60px] h-[60px]" src="../../../../icons/no-task.png" alt="No task"/>
                      <p className="text-[13px] text-center">Les documents partagés apparaîtront ici.</p>
                  </div>
              </div>
            )}
            </div>
        </ScrollArea>
    </TabsContent>
   </Tabs>
  )
}

export default WorkSpaceUtilities