import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { cn } from "../../../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";


const TodoList = () =>{
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('my_day');
  const [tasks, setTasks] = useState([]);
  const [myDayTasks, setMyDayTasks] = useState([]);
  const [plannedTasks, setPlannedTasks] = useState([]);
  const [affectedTasks, setAffectedTasks] = useState([]);
  const [casesTasks, setCasesTasks] = useState([]);
  const [newTask , setNewTask]  = useState('');
  const [completedTasks , setCompletedTasks]  = useState([]);
  const [myDayCompletedTasks, setMyDayCompletedTasks]  = useState([]);
  const [completedPlannedTasks, setCompletedPlannedTasks]  = useState([]);
  const [completedAffectedTasks, setCompletedAffectedTasks]  = useState([]);

  const audio = new Audio('../../../sounds/completed_2.mp3');
    const date = new Date();
    const todayDate = format(date, 'yyyy-MM-dd');
    const formattedDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(date);
  const dataRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  var transformedDataTasks;
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
      setTasks([]);
      setMyDayTasks([]);
      setAffectedTasks([]);
      setPlannedTasks([]);
      setCompletedTasks([]);
      setMyDayCompletedTasks([]);
      setCompletedPlannedTasks([]);
      setCompletedAffectedTasks([]);
      setCasesTasks([]);
      transformedDataTasks.forEach((task) => {
        if(task.caseId == null){
          if(task.status == "pending")
            setTasks(prevTasks => [...prevTasks,task]);
          else{
            setCompletedTasks(prevTasks => [...prevTasks,task]);
          }
        }else if(task.caseId != null){
          setCasesTasks(prevCasesTasks => [...prevCasesTasks,task]);
        }

        if(task.dueDate != null){
          if(task.dueDate == todayDate){
            if(task.status == "pending")
              setMyDayTasks(prevMyDayTasks => [...prevMyDayTasks,task]);
            else{
              setMyDayCompletedTasks(prevMyDayTasks => [...prevMyDayTasks,task]);
            }
          }
            if(task.dueDate != todayDate){
              if(task.status == "pending")
                setPlannedTasks(prevPlannedTasks => [...prevPlannedTasks,task]);
              else
                setCompletedPlannedTasks(prevPlannedTasks => [...prevPlannedTasks,task]);
            }
        }
        // if(task.assigned != null){
        //   if(task.assigned.includes(userId)){
        //     if(task.status == "pending")
        //       setAffectedTasks(prevAffectedTasks => [...prevAffectedTasks,task]);
        //     else
        //       setCompletedAffectedTasks(prevAffectedTasks => [...prevAffectedTasks,task]);
        //   }
        // }
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
  function CreateTask(e,caseId = null){
    e.preventDefault();
    axios.post('/tasks/create-new-task',{
      title: newTask,
      category: activeTab,
      caseId: caseId,
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
        <div id="todo_wrapper" className="flex h-full">
        <Tabs defaultValue="my_day" className="flex  w-full">
            <TabsList className="flex flex-col w-[300px] justify-start items-start pt-2 todo_wrapper_tabs_list h-full">
                <TabsTrigger onClick={()=> setActiveTab('my_day')} value="my_day" className={cn("todo_wrapper_tabs",activeTab=="my_day"?"active_tab":"")}> <div><i class='bx bx-sun text-[#eeee22]'></i>Ma Journée</div> <span>{(myDayTasks.length + myDayCompletedTasks.length) == 0?"":(myDayTasks.length + myDayCompletedTasks.length)}</span></TabsTrigger>
                {/* <TabsTrigger onClick={()=> setActiveTab('assigned_to_me')} value="assigned_to_me" className={cn("todo_wrapper_tabs ",activeTab=="assigned_to_me"?"active_tab":"")}> <div><i class='bx bx-user text-[#0f6cbd]'></i>Affectées à moi</div><span>{(affectedTasks.length + completedAffectedTasks.length) == 0?"":(affectedTasks.length + completedAffectedTasks.length)}</span></TabsTrigger> */}
                <TabsTrigger onClick={()=> setActiveTab('planned')} value="planned" className={cn("todo_wrapper_tabs ",activeTab=="planned"?"active_tab":"")}><div><i class='bx bx-calendar-event text-[#0f6cbd]'></i>Planifiées</div><span>{(plannedTasks.length + completedPlannedTasks.length) == 0?"":(plannedTasks.length + completedPlannedTasks.length)}</span></TabsTrigger>
                <TabsTrigger onClick={()=> setActiveTab('my_tasks')} value="my_tasks" className={cn("todo_wrapper_tabs ",activeTab=="my_tasks"?"active_tab":"")}> <div><i class='bx bx-home-alt text-[#0f6cbd]'></i>Mes Tâches </div><span>{(tasks.length + completedTasks.length) == 0?"":(tasks.length + completedTasks.length)}</span></TabsTrigger>
                {casesTasks.length ? (
                  <section className='w-full'>
                      <div className='border opacity-[0.5] my-2 rounded-full w-[100%] mx-auto'></div>
                      <Accordion type="single" collapsible className='w-full'>
                          <AccordionItem value="item-1">
                            <AccordionTrigger className='text-[#fff] text-sm w-full todo_wrapper_tabs'><div><i class='bx my-auto bx-dock-left'></i>Dossiers</div></AccordionTrigger>
                            <AccordionContent className='mt-1'>
                                {groupedCasesTasks.map((group, groupIndex) => (
                                    <TabsTrigger key={groupIndex} onClick={()=> setActiveTab(`${group[0].caseId}`)} value={group[0].caseId} className={cn("todo_wrapper_tabs ml-1",activeTab==`${group[0].caseId}`?"active_tab":"")}> <div className='capitalize'><i class='bx bx-list-ul my-auto text-[#0f6cbd]'></i>{group[0].caseTitle}</div><span>{group.length == 0?"":(group.length)}</span></TabsTrigger>
                                  ))}
                            </AccordionContent>
                          </AccordionItem>
                      </Accordion>
                  </section>
                    
                ):(<div></div>)}
               
            </TabsList>
            <TabsContent value="my_day" className=' w-full'>
                <div class="h-full py-1 px-3 w-full">
                    <div className="r w-fit ">
                        <h1 className="flex items-center gap-x-2  text-md font-bold text-[#fff]">Ma journée</h1>
                        <span className=" capitalize text-[#d8d8d8]  text-[14px] text-center w-fit">{formattedDate}</span>  
                    </div>
                    <div className='todolist_tabs_content_wrapper  w-full'>
                        <div className="todo_items ">
                        {myDayTasks.length || myDayCompletedTasks.length ? (
                          myDayTasks.map((task)=>(
                                <div className="todo_item">
                                    <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                        <div className={cn("check_mark border ",task.status=="pending"?"":"checked")}>
                                            <img src="../../../icons/icon-check.svg"/>
                                        </div>
                                    </div>
                                    <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                        {task.title}
                                    </div>
                                </div>
                             ))
                            ): (
                              <div className="flex flex-col items-center h-fit my-auto  no-event">
                                <img src="../../../icons/my_day.webp" alt="No task"/>
                                <p className="text-[13px] text-center">Vous n'avez aucune tâche aujourd'hui.<br/>Profitez de votre journée!!!</p>
                              </div>
                          )}
                          {myDayCompletedTasks.length > 0?
                          <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger className='w-[150px] py-1 todolist_accordion_trigger'>Complétées</AccordionTrigger>
                              <AccordionContent className='mt-2'>
                              {myDayCompletedTasks.length ? (
                                  myDayCompletedTasks.map((task)=>(
                                        <div className="todo_item">
                                            <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                                <div className={cn("check_mark border ",task.status=="pending"?"":"checked")}>
                                                    <img src="../../../icons/icon-check.svg"/>
                                                </div>
                                            </div>
                                            <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                                {task.title}
                                            </div>
                                        </div>
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
                        </div>
                        <div className="addTaskInput">
                          <div className="check">
                            <div className="">
                              <i className="fas fa-plus text-[18px]  text-[#fff]"></i>
                            </div>
                          </div>
                          <form className="todo_text" id="new_todo_form" onSubmit={(e) => CreateTask(e)}>
                            <input type="text" value={newTask}  onChange={(e)=> setNewTask(e.target.value)} placeholder="Ajouter une tâche" id="new_task" name="new_task"/>
                          </form>
                        </div>
                    </div>
                </div>

            </TabsContent>
            {/* <TabsContent value="assigned_to_me" className=' w-full'>
                <div class="h-full py-1 px-3 w-full">
                    <div className="r w-fit mb-1">
                        <h1 className="flex items-center gap-x-2  text-md font-bold text-[#fff]">Affectées</h1>
                    </div>
                    <div className='todolist_tabs_content_wrapper  w-full'>
                        <div className="todo_items ">
                        {affectedTasks.length || completedAffectedTasks.length ? (
                          affectedTasks.map((task)=>(
                              <div className="todo_item">
                                    <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                        <div className={cn("check_mark border ",task.status=="pending"?"":"checked")}>
                                            <img src="../../../icons/icon-check.svg"/>
                                        </div>
                                    </div>
                                    <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                        {task.title}
                                    </div>
                              </div>
                             ))
                            ): (
                              <div className="flex flex-col items-center h-fit my-auto  no-event">
                                <img src="../../../icons/assigned_to_me.webp" alt="assigned to me"/>
                                
                                <p className="text-[13px] text-center">Les tâches qui vous sont assignées apparaîtront ici!!</p>
                              </div>
                          )}
                           {completedAffectedTasks.length > 0?
                          <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger className='w-[150px] py-1 todolist_accordion_trigger'>Complétées</AccordionTrigger>
                              <AccordionContent className='mt-2'>
                              {completedAffectedTasks.length ? (
                                  completedAffectedTasks.map((task)=>(
                                        <div className="todo_item">
                                            <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                                <div className={cn("check_mark border ",task.status=="pending"?"":"checked")}>
                                                    <img src="../../../icons/icon-check.svg"/>
                                                </div>
                                            </div>
                                            <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                                {task.title}
                                            </div>
                                        </div>
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
                        </div>
                    </div>
                </div>

            </TabsContent> */}
            <TabsContent value="planned" className=' w-full'>
                <div class="h-full py-1 px-3 w-full">
                    <div className="r w-fit mb-1">
                        <h1 className="flex items-center gap-x-2  text-md font-bold text-[#fff]">Planifiées</h1>
                    </div>
                    <div className='todolist_tabs_content_wrapper  w-full'>
                        <div className="todo_items ">
                        {plannedTasks.length || completedPlannedTasks.length ? (
                          plannedTasks.map((task)=>(
                                <div className="todo_item">
                                    <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                        <div className={cn("check_mark border ",task.status=="pending"?"":"checked")}>
                                            <img src="../../../icons/icon-check.svg"/>
                                        </div>
                                    </div>
                                    <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                        {task.title}
                                    </div>
                                </div>
                             ))
                            ): (
                               <div class="flex flex-col items-center h-fit my-auto  no-event">
                               <img src="../../../icons/planned_task.webp" alt="planned tasks"/>
                               <p class="text-[13px] text-center">Les tâches avec une date d'échéance et un rappel apparaîtront ici!!</p>
                             </div>
                          )}
                          {completedPlannedTasks.length > 0?
                          <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger className='w-[150px] todolist_accordion_trigger'>Complétées</AccordionTrigger>
                              <AccordionContent className='mt-2'>
                                  {completedPlannedTasks.map((task)=>(
                                        <div className="todo_item">
                                            <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                                <div className={cn("check_mark border ",task.status=="pending"?"":"checked")}>
                                                    <img src="../../../icons/icon-check.svg"/>
                                                </div>
                                            </div>
                                            <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                                {task.title}
                                            </div>
                                        </div>
                                    ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          :
                          <div>

                          </div>
                              }
                        </div>
                        <div className="addTaskInput">
                          <div className="check">
                            <div className="">
                              <i className="fas fa-plus text-[18px]  text-[#fff]"></i>
                            </div>
                          </div>
                          <form className="todo_text" id="new_todo_form" onSubmit={(e) => CreateTask(e)}>
                            <input type="text" value={newTask}  onChange={(e)=> setNewTask(e.target.value)} placeholder="Ajouter une tâche" id="new_task" name="new_task"/>
                          </form>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="my_tasks" className=' w-full'>
            <div class="h-full py-1 px-3 w-full">
                    <div className="r w-fit mb-1">
                        <h1 className="flex items-center gap-x-2  text-md font-bold text-[#fff]">Mes Tâches</h1>
                    </div>
                    <div className='todolist_tabs_content_wrapper  w-full'>
                        <div className="todo_items ">
                        {tasks.length || completedTasks.length ? (
                          tasks.map((task)=>(
                                <div className="todo_item">
                                    <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                        <div className={cn("check_mark border ",task.status=="pending"?"":"checked")}>
                                            <img src="../../../icons/icon-check.svg"/>
                                        </div>
                                    </div>
                                    <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                        {task.title}
                                    </div>
                                </div>
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
                                completedTasks.map((task)=>(
                                      <div className="todo_item">
                                          <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                              <div className={cn("check_mark border ",task.status=="pending"?"":"checked")}>
                                                  <img src="../../../icons/icon-check.svg"/>
                                              </div>
                                          </div>
                                          <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                              {task.title}
                                          </div>
                                      </div>
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
                          
                        </div>
                        <div className="addTaskInput">
                          <div className="check">
                            <div className="">
                              <i className="fas fa-plus text-[18px]  text-[#fff]"></i>
                            </div>
                          </div>
                          <form className="todo_text" id="new_todo_form" onSubmit={(e) => CreateTask(e)}>
                            <input type="text" value={newTask}  onChange={(e)=> setNewTask(e.target.value)} placeholder="Ajouter une tâche" id="new_task" name="new_task"/>
                          </form>
                        </div>
                    </div>
                </div>
            </TabsContent>
            {casesTasks.length ? (
              groupedCasesTasks.map((group, groupIndex) => (
              <TabsContent key={groupIndex} value={group[0].caseId} className='w-full'>
                  <div class="h-full py-1 px-3 w-full">
                    <div className="r w-fit mb-1">
                        <h1 className="flex items-center gap-x-2  text-md font-bold text-[#fff] capitalize">{group[0].caseTitle}</h1>
                    </div>
                    <div className='todolist_tabs_content_wrapper  w-full'>
                        <div className="todo_items ">
                        {group.map((task, taskIndex) => (
                                <div key={taskIndex} className="todo_item">
                                    <div className="check rounded-full" onClick={()=> ChangeStatus(task.id)}>
                                        <div className={cn("check_mark border ",task.status=="pending"?"":"checked")}>
                                            <img src="../../../icons/icon-check.svg"/>
                                        </div>
                                    </div>
                                    <div className={cn("todo_text checked",task.status=="completed"?"completed":"")}>
                                        {task.title}
                                    </div>
                                </div>
                             ))}
                        </div>
                        <div className="addTaskInput">
                          <div className="check">
                            <div className="">
                              <i className="fas fa-plus text-[18px]  text-[#fff]"></i>
                            </div>
                          </div>
                          <form className="todo_text" id="new_todo_form" onSubmit={(e) => CreateTask(e, group[0].caseId)}>
                            <input type="text" value={newTask}  onChange={(e)=> setNewTask(e.target.value)} placeholder="Ajouter une tâche" id="new_task" name="new_task"/>
                          </form>
                        </div>
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


