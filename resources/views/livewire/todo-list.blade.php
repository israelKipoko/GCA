<div id="todo_wrapper" class="flex h-full">
    <div class="w-[300px]">
        <div class="todo_wrapper_tabs" wire:ignore>
          <ul>
            <li class="activeTodoTabs" x-data x-on:click="$dispatch('todo-category', { category: 'today'})"><i class='bx bx-sun text-[#eeee22]'></i>@lang('Ma Journée')</li>
            <li x-data x-on:click="$dispatch('todo-category', { category: 'assigned_to_me'})"><i class='bx bx-user text-[#0f6cbd]'></i>@lang('Affectées à moi')</li>
            <li x-data x-on:click="$dispatch('todo-category', { category: 'my_tasks'})"><i class='bx bx-home-alt text-[#0f6cbd]'></i>@lang('Mes Tâches')</li>
          </ul>
        </div>
    </div>
    <ul class="todo_list_wrapper h-full w-full capitalize" >
      <div class="r w-fit" wire:ignore>
        <h1 class="flex items-center gap-x-2">Ma journée</h1>
        <span class="todo_date_now capitalize text-[#fff] text-[15px] text-center w-fit"></span>  
      </div>
      <div class="todo_items_wrapper">
        <div class="todo_items h-full">
          @if ($tasksExist)
              @foreach ($tasks as $task)
                  <div class="todo_item">
                      <div class="check">
                          <div class="check_mark {{($task->status =="pending")?"":"checked"}}">
                              <img src="{{asset('icons/icon-check.svg')}}">
                          </div>
                      </div>
                      <div class="todo_text checked">
                          {{$task->title}}
                      </div>
                  </div>
              @endforeach
          @else
            <div class="flex items-center h-fit my-auto  no-event">
              <h3 class="">Aucune Tâche!!</h3>
            </div>
          @endif
            
        </div>
    </div>
    <div class="addTaskInput  hidden">
        <div class="check">
          <div class="check_mark">
              <img src="{{asset('icons/icon-check.svg')}}">
          </div>
      </div>
      <div class="todo_text checked">
      </div>
    </div>
    <button class="add_task" x-data x-on:click="$dispatch('open-new-event-modal')">
      <i class="fas fa-plus"></i>
    </button>
    {{-- <div class="todo_item todo_enter" wire:click="$dispatch('update-task-status', { id: {{ $task->id }} })">
        <div class="check">
            <div class="check_mark {{($task->status =="pending")?"":"checked"}}">
                <img src="{{asset('icons/icon-check.svg')}}">
            </div>
        </div>
        <div class="todo_text checked">
            {{$task->title}}
        </div>
    </div> --}}
    </ul>
</div>
