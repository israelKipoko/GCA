<div id="todo_wrapper" class="flex h-full">
    <div class="w-[300px]">
        <div class="todo_wrapper_tabs" wire:ignore>
          <ul>
            <li class="tab_link active" data-tab="my_day"><i class='bx bx-sun text-[#eeee22]'></i>@lang('Ma Journée')</li>
            <li class="tab_link" data-tab="assigned_to_me"><i class='bx bx-user text-[#0f6cbd]'></i>@lang('Affectées à moi')</li>
            <li class="tab_link" data-tab="planned"><i class='bx bx-calendar-event text-[#0f6cbd]'></i>@lang('Planifiées')</li>
            <li class="tab_link" data-tab="my_tasks"><i class='bx bx-home-alt text-[#0f6cbd]'></i>@lang('Mes Tâches')</li>
          </ul>
        </div>
    </div>
    <ul class="todo_list_wrapper h-full w-full capitalize" >
      <div class="todo_items_wrapper h-full py-2 px-3">
        <div class="r w-fit ">
          <h1 class="flex items-center gap-x-2 ">Ma journée</h1>
          <span class="todo_date_now capitalize text-[#fff]   text-[14px] text-center w-fit" wire:ignore></span>  
        </div>
        <div class=" tab-pane active" id="my_day">
          <div class="todo_items">
            <div class="todo_scroller">
                @if ($todayTasksExist)
                    @foreach ($todayTasks as $task)
                        <div class="todo_item">
                            <div class="check">
                                <div class="check_mark {{($task->status =="pending")?"":"checked"}}">
                                  <form action="" class="hidden"><input type="text" name="task_id" id="task_id" value="{{$task->id}}"/></form>
                                    <img src="{{asset('icons/icon-check.svg')}}">
                                </div>
                            </div>
                            <div class="todo_text checked {{($task->status =="completed")?"completed":""}}">
                                {{$task->title}}
                            </div>
                        </div>
                    @endforeach
                @else
                  <div class="flex flex-col items-center h-fit my-auto  no-event" wire:ignore>
                    <img src="{{asset("icons/my_day.webp")}}" alt="dd">
                    <p class="text-[13px] text-center">@lang("Vous n'avez aucune tâche aujoud'hui.")<br/>@lang('Profitez de votre journée')!!!</p>
                  </div>
                @endif
            </div>
           
              
          </div>
          <div class="addTaskInput">
            <div class="check">
              <div class="">
                <i class="fas fa-plus text-[18px]  text-[#fff]"></i>
              </div>
          </div>
          <form class="todo_text" id="new_todo_form">
            <input type="text" id="new_task" name="new_task">
          </form>
        </div>
        </div>
        
        <div class=" tab-pane " id="assigned_to_me">
          <div class="todo_items h-full">
            <div class="todo_scroller">
                @if ($assignedTasksExists)
                @foreach ($assignedTasks as $task)
                    <div class="todo_item">
                      <div class="check">
                          <div class="check_mark {{($task->status =="pending")?"":"checked"}}">
                              <img src="{{asset('icons/icon-check.svg')}}">
                          </div>
                      </div>
                      <div class="todo_text checked {{($task->status =="completed")?"completed":""}}">
                          {{$task->title}}
                      </div>
                  </div>
                @endforeach
            @else
              <div class="flex flex-col items-center h-fit my-auto  no-event">
                <img src="{{asset("icons/assigned_to_me.webp")}}" alt="dd">
                <p class="text-[13px] text-center">@lang("Les tâches qui vous sont assignées ici.")</p>
              </div>
            @endif
            </div>
           
              
          </div>
        </div>
        <div class=" tab-pane " id="my_tasks">
          <div class="todo_items h-full ">
            <div class="todo_scroller">
                  @if ($todayTasksExist || $plannedTasksExists || $assignedTasksExists)
                  @foreach ($tasks as $task)
                      <div class="todo_item">
                          <div class="check">
                              <div class="check_mark {{($task->status =="pending")?"":"checked"}}">
                                  <img src="{{asset('icons/icon-check.svg')}}">
                              </div>
                          </div>
                          <div class="todo_text checked {{($task->status =="completed")?"completed":""}}">
                              {{$task->title}}
                          </div>
                      </div>
                  @endforeach
              @else
                <div class="flex flex-col  items-center h-fit my-auto  no-event">
                  <img class="w-[60px] h-[60px]" src="{{asset("icons/no-task.png")}}" alt="No task">
                  <p class="text-[13px] text-center">@lang("les tâches avec une date d'échéance et un rappel apparaîtront ici.")</p>
                </div>
              @endif
            </div>
          
            <div class="addTaskInput">
              <div class="check">
                  <div class="">
                    <i class="fas fa-plus text-[18px]  text-[#fff]"></i>
                  </div>
              </div>
              <form class="todo_text" id="new_todo_form">
                <input type="text" id="new_task" name="new_task">
              </form>
          </div>
          </div>
        </div>
        <div class=" tab-pane " id="planned">
          <div class="todo_items h-full">
            <div class="todo_scroller">
              @if ($plannedTasksExists)
                @foreach ($plannedTasks as $task)
                        <div class="todo_item">
                            <div class="check">
                                <div class="check_mark {{($task->status =="pending")?"":"checked"}}">
                                    <img src="{{asset('icons/icon-check.svg')}}">
                                </div>
                            </div>
                            <div class="todo_text checked {{($task->status =="completed")?"completed":""}}">
                                {{$task->title}}
                            </div>
                        </div>
                    @endforeach
                @else
                  <div class="flex flex-col items-center h-fit my-auto  no-event">
                    <img src="{{asset("icons/planned_task.webp")}}" alt="planned">
                    <p class="text-[13px] text-center">@lang("les tâches avec une date d'échéance et un rappel apparaîtront ici.")</p>
                  </div>
                @endif
            </div>
           
              
          </div>
          <div class="addTaskInput">
            <div class="check">
              <div class="">
                <i class="fas fa-plus text-[18px]  text-[#fff]"></i>
              </div>
          </div>
          <form class="todo_text" id="new_todo_form">
            <input type="text" id="new_task" name="new_task">
          </form>
        </div>
        </div>
    </div>
    </ul>
</div>
