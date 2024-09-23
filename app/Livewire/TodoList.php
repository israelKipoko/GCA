<?php

namespace App\Livewire;

use App\Models\Task;
use Livewire\Component;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\On; 

class TodoList extends Component
{
    public $tasks;
    public $assignedTasksExists;
    public $assignedTasks;
    public $plannedTasksExists;
    public $plannedTasks;
    public $todayTasksExist;
    public $todayTasks;
    public $new_task = "";
    public $category = "";

    public function mount(){
        $this->loaded = false;

        $dateToday = date("Y-m-d");
        $this->todayTasksExist = Task::with('user')->whereDate('due_date', '=', $dateToday)->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->exists();

        if($this->todayTasksExist){
            $this->todayTasks = Task::with('user')->whereDate('due_date', '=', $dateToday)->where(function($query) {
                $query->whereJsonContains('assigned_to', Auth::id())
                    ->orWhere('created_by', Auth::id());
            })->orderByRaw("FIELD(status, 'pending', 'completed')")->latest()->get();
        }

        $this->assignedTasksExists = Task::with('user')->whereJsonContains('assigned_to', Auth::id())->exists();
        $this->assignedTasks = Task::with('user')->whereJsonContains('assigned_to', Auth::id())->orderByRaw("FIELD(status, 'pending', 'completed')")->latest()->get();

        $this->plannedTasksExists = Task::with('user')->whereNot('due_date', null)->where('due_date','>=', $dateToday)->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->exists();

        $this->plannedTasks= Task::with('user')->whereNot('due_date', null)->where('due_date','>=', $dateToday)->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->orderByRaw("FIELD(status, 'pending', 'completed')")->latest()->get();

        $this->tasks= Task::with('user')->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->orderByRaw("FIELD(status, 'pending', 'completed')")->latest()->get();
    }

    #[On('refreshTodoList')] 
    public function refresh(){
        $this->mount();
        return ['refreshTodoList' => '$refresh',];
    }

    public function render()
    {
        return view('livewire.todo-list');
    }
}
