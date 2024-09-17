<?php

namespace App\Livewire;

use App\Models\Task;
use Livewire\Component;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\On; 

class TodoList extends Component
{
    public $tasks;

    public function mount(){
        $this->tasks = Task::where('created_by',Auth::id())->orWhereJsonContains('assigned_to',Auth::id())->get();
    }

    #[On('update-task-status')]
    public function updateTaskStatus($id){
        $task = Task::find($id);
        if($task->status == "pending"){
            $task->status = "completed";
            $task->save();
            $this->dispatch('refreshComponent');
        }elseif($task->status == "completed"){
            $task->status = "pending";
            $task->save();
            $this->dispatch('refreshComponent');
        }
    }

    #[On('refreshComponent')] 
    public function refresh(){
        return ['refreshComponent' => '$refresh',];
    }

    public function render()
    {
        return view('livewire.todo-list');
    }
}
