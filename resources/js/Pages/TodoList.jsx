import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { cn } from "../../../lib/utils";
import { ScrollArea } from "../../../components/ui/scroll-area";
import TodoCreateInput from './utils/TodoCreateInput';
import TodoItem from './utils/TodoItem';
import Lottie from 'lottie-react';
import live from '../../../public/animation/live-animation.json';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

const TodoList = () =>{
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('my_day');
  const [tasks, setTasks] = useState([]);
  const [myDayTasks, setMyDayTasks] = useState([]);
  const [plannedTasks, setPlannedTasks] = useState([]);
  const [casesTasks, setCasesTasks] = useState([]);
  const [newTask , setNewTask]  = useState('');
  const [overDueTasks , setOverDueTasks]  = useState([]);
  const [completedTasks , setCompletedTasks]  = useState([]);
  const [myDayCompletedTasks, setMyDayCompletedTasks]  = useState([]);
  const [completedPlannedTasks, setCompletedPlannedTasks]  = useState([]);
  const [userRole, setUserRole] = useState('');
  const [users, setUsers] = useState([]);

  const audio = new Audio('../../../sounds/completed_2.mp3');
    const date = new Date();
    const todayDate = format(date, 'yyyy-MM-dd');
    const formattedDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(date);
  const dataRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  var transformedDataTasks;
  var transformedUserData;

  function getTasks(){
    axios.get('/tasks/get-all-tasks')
    .then(response => {
      transformedDataTasks = response.data[0].map(element => ({
        id:element.id,
        title: element.title,
        note: element.note,
        status: element.status,
        dueDate: element.due_date,
        createdDate: element.created_at,
        category: element.category,
        assigned: element.assigned_to,
        caseId: element.case_id,
        caseTitle: element?.case?.title ?? null,
      }));
      let userId = response.data[1];
      setUserRole(response.data[2]);
      setTasks([]);
      setMyDayTasks([]);
      setPlannedTasks([]);
      setOverDueTasks([]);
      setCompletedTasks([]);
      setMyDayCompletedTasks([]);
      setCompletedPlannedTasks([]);
      setCasesTasks([]);
      transformedDataTasks.forEach((task) => {
        if(task.caseId == null){
          if(task.status == "pending")
            setTasks(prevTasks => [...prevTasks,task]);
          else{
            setCompletedTasks(prevTasks => [...prevTasks,task]);
          }
        }else if(task.caseId != null){
          if(response.data[2] == "Admin"){
              setCasesTasks(prevCasesTasks => [...prevCasesTasks,task]);
          }else if( task.assigned != null && task.assigned.includes(userId)){
              setCasesTasks(prevCasesTasks => [...prevCasesTasks,task]);
          }
        }
        transformedUserData = response.data[3].map(element => ({
          id:element.id,
          name: element.firstname +" "+ element.name,
          avatar: element.avatar_link,
        }));
        setUsers(transformedUserData);

        if(task.dueDate != null){
          if(task.dueDate == todayDate){
            if(task.status == "pending")
              setMyDayTasks(prevMyDayTasks => [...prevMyDayTasks,task]);
            else{
              setMyDayCompletedTasks(prevMyDayTasks => [...prevMyDayTasks,task]);
            }
          }
            if(task.dueDate > todayDate){
              if(task.status == "pending")
                setPlannedTasks(prevPlannedTasks => [...prevPlannedTasks,task]);
              else
                setCompletedPlannedTasks(prevPlannedTasks => [...prevPlannedTasks,task]);
            }
            if(task.dueDate < todayDate && task.status == "pending"){
              setOverDueTasks(prevOverDueTasks => [...prevOverDueTasks,task]);
            }
        }
      });
    })
    .catch(error => {
      console.log(error.message)
    });
  }
  const groupedCasesTasks = Object.values(
    casesTasks.reduce((acc, obj) => {
      const caseId = obj.caseId;
      if (!acc[caseId]) {
        acc[caseId] = []; 
      }
      acc[caseId].push(obj); 
      return acc;
    }, {})
  );
  
  function ChangeStatus(id){
    axios.post('/tasks/update-status',{
      task_id: id,
    })
    .then(response => {
      if(response.data == "completed"){
        audio.play();
      }
      getTasks();
    });
  };
  function CreateTask(e,caseId = null,dueDate){
    e.preventDefault();
    axios.post('/tasks/create-new-task',{
      title: newTask,
      category: activeTab,
      caseId: caseId,
      dueDate: dueDate,
    })
    .then(response => {
      getTasks();
      setNewTask('')
    })
    .catch(error => {
      console.log(error.message)
    });
  }
  useEffect(() => {
    getTasks();
  }, [refreshKey]);
  return (
    <section>
        <div id="todo_wrapper" className="flex h-full dark:bg-dark-primary bg-[#E5E5E5]">
        <Tabs defaultValue="my_day" className="flex  w-full">
            <TabsList className="flex flex-col  gap-y-0.5 w-[300px] justify-start items-start pt-2 todo_wrapper_tabs_list h-full">
                {overDueTasks.length == 0 ? "": 
                  <TabsTrigger onClick={()=> setActiveTab('overDue')} value="overDue" className={cn("todo_wrapper_tabs",activeTab=="overDue"?"dark:active_tab active_tab_dark":"")}> <div className='flex items-center'><Lottie animationData={live}  autoplay={true} style={{ width: 18, height: 18 }} loop={true} />Rappel </div> <span>{(overDueTasks.length) == 0?"":(overDueTasks.length)}</span></TabsTrigger>
                }
                <TabsTrigger onClick={()=> setActiveTab('my_day')} value="my_day" className={cn("todo_wrapper_tabs dark:text-white text-dark-secondary",activeTab=="my_day"?"dark:active_tab active_tab_dark":"")}> <div><i class='bx bx-sun dark:text-[#eeee22] text-[#FFA500]'></i>Ma Journée</div> <span className='dark:text-white text-dark-secondary'>{(myDayTasks.length + myDayCompletedTasks.length) == 0?"":(myDayTasks.length + myDayCompletedTasks.length)}</span></TabsTrigger>
                <TabsTrigger onClick={()=> setActiveTab('planned')} value="planned" className={cn("todo_wrapper_tabs ",activeTab=="planned"?"dark:active_tab active_tab_dark":"")}><div><i class='bx bx-calendar-event text-[#0f6cbd]'></i>Planifiées</div><span className='dark:text-white text-dark-secondary'>{(plannedTasks.length + completedPlannedTasks.length) == 0?"":(plannedTasks.length + completedPlannedTasks.length)}</span></TabsTrigger>
                <TabsTrigger onClick={()=> setActiveTab('my_tasks')} value="my_tasks" className={cn("todo_wrapper_tabs ",activeTab=="my_tasks"?"dark:active_tab active_tab_dark":"")}> <div><i class='bx bx-home-alt text-[#0f6cbd]'></i>Mes Tâches </div><span className='dark:text-white text-dark-secondary'>{(tasks.length + completedTasks.length) == 0?"":(tasks.length + completedTasks.length)}</span></TabsTrigger>
                {casesTasks.length ? (
                  <section className='w-full'>
                      <div className='border opacity-[0.5] my-2 rounded-full w-[100%] mx-auto'></div>
                      <Accordion type="single" collapsible className='w-full'>
                          <AccordionItem value="item-1">
                            <AccordionTrigger className='dark:text-white text-dark-secondary text-sm w-full todo_wrapper_tabs'><div><i class='bx my-auto bx-dock-left'></i>Dossiers</div></AccordionTrigger>
                            <AccordionContent className='mt-1'>
                                {groupedCasesTasks.map((group, groupIndex) => (
                                    <TabsTrigger key={groupIndex} onClick={()=> setActiveTab(`${group[0].caseId}`)} value={group[0].caseId} className={cn("todo_wrapper_tabs ml-1",activeTab==`${group[0].caseId}`?"dark:active_tab active_tab_dark":"")}> <div className='capitalize'><i class='bx bx-list-ul my-auto text-[#0f6cbd]'></i>{group[0].caseTitle}</div><span>{group.length == 0?"":(group.length)}</span></TabsTrigger>
                                  ))}
                            </AccordionContent>
                          </AccordionItem>
                      </Accordion>
                  </section>
                    
                ):(<div></div>)}
               
            </TabsList>
            {overDueTasks.length == 0 ? "": 
            <TabsContent value="overDue" className=' w-full'>
                <div class="h-full py-1 px-3 w-full">
                    <div className="r w-fit ">
                        <h1 className="flex items-center gap-x-2  text-md font-bold dark:text-white text-dark-secondary">Rappel</h1>
                        <span className=" capitalize dark:text-[#d8d8d8] text-[#292929]  text-[14px] text-center w-fit">Vous êtes en retard sur {overDueTasks.length > 1?"ces":"cette"} tâches!!</span>  
                    </div>
                    <div className='todolist_tabs_content_wrapper  w-full'>
                        <div className="todo_items ">
                          <ScrollArea className='h-full'>
                          {overDueTasks.length ? (
                          overDueTasks.map((task,taskIndex)=>(
                              <TodoItem key={taskIndex} ChangeStatus={ChangeStatus} task={task} isCaseTitle={true}/>
                             ))
                            ): (
                              <div className="flex flex-col items-center h-fit my-auto  no-event">
                                <img src="../../../icons/my_day.webp" alt="No task"/>
                                <p className="text-[13px] text-center dark:text-[#878895] text-dark-secondary">Vous n'avez aucune tâche aujourd'hui.<br/>Profitez de votre journée!!!</p>
                              </div>
                          )}
                          </ScrollArea>
                        </div>
                    </div>
                </div>

            </TabsContent>
            }
            <TabsContent value="my_day" className=' w-full'>
                <div class="h-full py-1 px-3 w-full">
                    <div className="r w-fit ">
                        <h1 className="flex items-center gap-x-2  text-md font-bold dark:text-white text-dark-secondary">Ma journée</h1>
                        <span className=" capitalize dark:text-[#d8d8d8] text-[#292929] text-[14px] text-center w-fit">{formattedDate}</span>  
                    </div>
                    <div className='todolist_tabs_content_wrapper  w-full'>
                        <div className="todo_items ">
                          <ScrollArea className='h-full'>
                          {myDayTasks.length || myDayCompletedTasks.length ? (
                          myDayTasks.map((task,taskIndex)=>(
                              <TodoItem key={taskIndex} ChangeStatus={ChangeStatus} task={task} isCaseTitle={true}/>
                             ))
                            ): (
                              <div className="flex flex-col items-center h-fit my-auto  no-event">
                                <img src="../../../icons/my_day.webp" alt="No task"/>
                                <p className="text-[13px] text-center dark:text-[#878895] text-dark-secondary">Vous n'avez aucune tâche aujourd'hui.<br/>Profitez de votre journée!!!</p>
                              </div>
                          )}
                          {myDayCompletedTasks.length > 0?
                          <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger className='w-[150px] py-1 todolist_accordion_trigger'>Complétées</AccordionTrigger>
                              <AccordionContent className='mt-2'>
                              {myDayCompletedTasks.length ? (
                                  myDayCompletedTasks.map((task,taskIndex)=>(
                                      <TodoItem key={taskIndex} ChangeStatus={ChangeStatus} task={task} isCaseTitle={true}/>
                                    ))
                                    ): (
                                      <div className="flex flex-col items-center h-fit my-auto  no-event">
                                        
                                      </div>
                                  )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          :
                          <div>

                          </div>
                              }
                          </ScrollArea>
                        </div>
                        <TodoCreateInput newTask={newTask} setNewTask={setNewTask} CreateTask={CreateTask}/>
                    </div>
                </div>

            </TabsContent>
            <TabsContent value="planned" className=' w-full'>
                <div class="h-full py-1 px-3 w-full">
                    <div className="r w-fit mb-1">
                        <h1 className="flex items-center gap-x-2  text-md font-bold dark:text-white text-dark-secondary">Planifiées</h1>
                    </div>
                    <div className='todolist_tabs_content_wrapper  w-full'>
                        <div className="todo_items ">
                           <ScrollArea className='h-full'>
                              {plannedTasks.length || completedPlannedTasks.length ? (
                              plannedTasks.map((task,taskIndex)=>(
                                  <TodoItem key={taskIndex} ChangeStatus={ChangeStatus} task={task}/>
                                ))
                                ): (
                                  <div className="flex flex-col items-center h-fit my-auto  no-event">
                                  <img src="../../../icons/planned_task.webp" alt="planned tasks"/>
                                  <p className="text-[13px] text-center">Les tâches avec une date d'échéance et un rappel apparaîtront ici!!</p>
                                </div>
                              )}
                              {completedPlannedTasks.length > 0?
                              <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                  <AccordionTrigger className='w-[150px] todolist_accordion_trigger'>Complétées</AccordionTrigger>
                                  <AccordionContent className='mt-2'>
                                      {completedPlannedTasks.map((task,taskIndex)=>(
                                            <TodoItem key={taskIndex} ChangeStatus={ChangeStatus} task={task}/>
                                        ))}
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                              :
                              <div>

                              </div>
                                  }
                           </ScrollArea>
                        </div>
                        <TodoCreateInput newTask={newTask} setNewTask={setNewTask} CreateTask={CreateTask}/>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="my_tasks" className=' w-full'>
            <div class="h-full py-1 px-3 w-full">
                    <div className="r w-fit mb-1">
                        <h1 className="flex items-center gap-x-2  text-md font-bold dark:text-white text-dark-secondary">Mes Tâches</h1>
                    </div>
                    <div className='todolist_tabs_content_wrapper  w-full'>
                        <div className="todo_items ">
                          <ScrollArea>
                              {tasks.length || completedTasks.length ? (
                              tasks.map((task,taskIndex)=>(
                                    <TodoItem key={taskIndex} ChangeStatus={ChangeStatus} task={task}/>
                                ))
                                ): (
                                  <div className="flex flex-col items-center h-fit my-auto  no-event">
                                    <img src="../../../icons/my_day.webp" alt="No task"/>
                                    <p className="text-[13px] text-center">Votre liste des tâches est vide!!</p>
                                  </div>
                              )}
                              {completedTasks.length > 0? 
                              <Accordion type="single" collapsible>
                              <AccordionItem value="item-1">
                                <AccordionTrigger className='w-[150px] todolist_accordion_trigger'>Complétées</AccordionTrigger>
                                <AccordionContent className='mt-2'>
                                {completedTasks.length ? (
                                    completedTasks.map((task,taskIndex)=>(
                                        <TodoItem key={taskIndex} ChangeStatus={ChangeStatus} task={task}/>
                                      ))
                                      ): (
                                        <div className="flex flex-col items-center h-fit my-auto  no-event">
                                          
                                        </div>
                                    )}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>:
                                <div>

                                </div>
                              }
                          </ScrollArea>
                        </div>
                        <TodoCreateInput newTask={newTask} setNewTask={setNewTask} CreateTask={CreateTask}/>
                    </div>
                </div>
            </TabsContent>
            {casesTasks.length ? (
              groupedCasesTasks.map((group, groupIndex) => (
              <TabsContent key={groupIndex} value={group[0].caseId} className='w-full'>
                  <div class="h-full py-1 px-3 w-full">
                    <div className="r w-fit mb-1">
                        <h1 className="flex items-center gap-x-2  text-md font-bold dark:text-white text-dark-secondary capitalize">{group[0].caseTitle}</h1>
                    </div>
                    <div className='todolist_tabs_content_wrapper  w-full'>
                        <div className="todo_items ">
                          <ScrollArea>
                              {group.map((task, taskIndex) => (
                                    <TodoItem key={taskIndex} ChangeStatus={ChangeStatus} task={task} users={users}/>
                                ))}
                          </ScrollArea>
                        
                        </div>
                        <TodoCreateInput
                            newTask={newTask}
                            setNewTask={setNewTask}
                            CreateTask={CreateTask}
                            caseId={group[0].caseId} // Pass caseId from the group array
                        />
                    </div>
                </div>
              </TabsContent>
            ))
          ):(<div></div>)}
        </Tabs>
        </div>
    </section>
    
  )
}

export default TodoList


