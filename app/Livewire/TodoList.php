<?php

namespace App\Livewire;

use App\Models\Task;
use Livewire\Component;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\On; 

class TodoList extends Component
{
    public $tasks;
    public $tasksExist;

    public function mount(){
        $dateToday = date("Y-m-d");
        $this->tasksExist = Task::with('user')->whereDate('due_date', '=', $dateToday)->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->exists();
        if($this->tasksExist){
            $this->tasks = Task::with('user')->whereDate('due_date', '=', $dateToday)->where(function($query) {
                $query->whereJsonContains('assigned_to', Auth::id())
                    ->orWhere('created_by', Auth::id());
            })->get();
        }
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

     #[On('todo-category')]
     public function todoListByCategory($category){
        if($category == 'today'){
            $dateToday = date("Y-m-d");
            sleep(0.1);
            $this->tasksExist = Task::with('user')->whereDate('due_date', '=', $dateToday)->where(function($query) {
                $query->whereJsonContains('assigned_to', Auth::id())
                    ->orWhere('created_by', Auth::id());
            })->exists();
            if($this->tasksExist){
                $this->tasks = Task::with('user')->whereDate('due_date', '=', $dateToday)->where(function($query) {
                    $query->whereJsonContains('assigned_to', Auth::id())
                        ->orWhere('created_by', Auth::id());
                })->get();
            }
            // $this->dispatch('refreshComponent');

        }elseif($category == 'assigned_to_me'){
            sleep(0.1);
            $this->tasksExist = Task::with('user')->whereJsonContains('assigned_to', Auth::id())->exists();
            if($this->tasksExist){
                $this->tasks = Task::with('user')->whereJsonContains('assigned_to', Auth::id())->get();
            }
        }elseif($category == 'my_tasks'){
            sleep(0.1);
            $this->tasksExist = Task::with('user')->where('created_by', Auth::id())->exists();
            if($this->tasksExist){
                $this->tasks = Task::with('user')->where('created_by', Auth::id())->get();
            }
        };
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
