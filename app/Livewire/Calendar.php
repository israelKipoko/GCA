<?php

namespace App\Livewire;

use DateTime;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Event;
use Livewire\Component;
use Livewire\Attributes\On;
use Illuminate\Support\Facades\Auth;

class Calendar extends Component
{
    public $users;
    public $userEventsExist;
    public $userEvents;
    public $dateToday;
    public $calendar_date = "";

   

    public function mount(){
        $this->query = '';

        $months = [
            'janvier' => '01',
            'février' => '02',
            'mars' => '03',
            'avril' => '04',
            'mai' => '05',
            'juin' => '06',
            'juillet' => '07',
            'août' => '08',
            'septembre' => '09',
            'octobre' => '10',
            'novembre' => '11',
            'décembre' => '12'
        ];

        $this->users = User::whereNot('id',Auth::id())->get();
        $this->dateToday = date("Y-m-d");
        Carbon::setLocale('fr');
        $this->userEventsExist = Event::whereDate('date', '=', $this->dateToday)->where(function($query) {
            $query->whereJsonContains('participants', Auth::id())
                  ->orWhere('created_by', Auth::id());
        })->exists();

        if($this->userEventsExist){
            $this->userEvents = Event::with('user')->whereDate('date', '=', $this->dateToday)->where(function($query) {
                $query->whereJsonContains('participants', Auth::id())
                    ->orWhere('created_by', Auth::id());
            })->get();
            // $participants = $events[0]->created_by;
        }
    }

    public function updatedQuery(){
        $this->users = User::whereNot('id',Auth::id())->where('name', 'like', '%' . $this->query . '%')->get()->toArray();
    }
       

    #[On('refreshComponent')] 
    public function refresh(){
        return ['refreshComponent' => '$refresh',];
    }

    public function render()
    {
        return view('livewire.calendar');
    }
}
