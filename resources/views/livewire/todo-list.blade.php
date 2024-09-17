<div id="todo_wrapper" class="flex h-full">
    <div class="w-[300px]">
        <div class="task-input">
          <form action="/home/tasks/add-task" method="POST" class="" id="storeTaskForm">
            @csrf
            <input type="text" id="title" name="title" placeholder={{__("Ajouter une tâche...")}} required>
            <div class="task_containings_wrapper">
              <div class="flex justify-end gap-x-2 px-2 py-1">
                <span class="datepicker-toggle">
                
                </span>
                <button type="button" id="task_note_input_button"><i class='bx bxs-note bx-sm text-[#1d1b31]' id="" title="Ajouter une note"></i></button>
                <x-tasknote-input-textarea/>
              </div>
            </div>
          </form>
        </div>
        <div class="controls w-full">
          <div class="filters w-full">
            <span class="active" id="for_me">{{__("Personnelles")}} <p id="count_personal_tasks"></p></span>
            {{-- <span id="assigned">{{__("Assigées")}} <p>{{ ($ != null) ? "(".$assignedTask.")" : ""}}</p></span> --}}
          </div>
        </div>
    </div>
    <ul class="todo_list_wrapper h-full w-full border capitalize">
      <div class="todo_items_wrapper border">
        <div class="todo_items">
            @foreach ($tasks as $task)
                <div class="todo_item" wire:click="$dispatch('update-task-status', { id: {{ $task->id }} })">
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
        </div>
    </div>
    <div class="todo_item todo_enter" wire:click="$dispatch('update-task-status', { id: {{ $task->id }} })">
        <div class="check">
            <div class="check_mark {{($task->status =="pending")?"":"checked"}}">
                <img src="{{asset('icons/icon-check.svg')}}">
            </div>
        </div>
        <div class="todo_text checked">
            {{$task->title}}
        </div>
    </div>
    </ul>
</div>
