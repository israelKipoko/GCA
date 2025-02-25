<?php

namespace App\Livewire;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Event;
use Livewire\Component;
use Livewire\Attributes\On;
use Illuminate\Support\Facades\Auth;

class EventsManager extends Component
{
    public $users;
    public $query;
    public $userEventsExist;
    public $userEvents;
    public $todayEventExists;
    public $dateToday;
    public $groudEvents;

   

    public function mount(){

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
        $this->groudEvents ="";
        if($this->userEventsExist){
            $this->groudEvents = $this->userEvents->groupBy(function ($event) {
                return $event->date;
            })->map(function ($dateGroup, $date) {
                // $formattedDate = Carbon::parse($date)->isoFormat('ddd DD MMM');
                return [
                    'date' => $date, 
                    'events' => $dateGroup
                ];
            });
        }
        // foreach($this->groudEvents as $f){
        // dd($this->groudEvents);

        // }
    }

  


    public function render()
    {
        return view('livewire.events-manager');
    }
}
