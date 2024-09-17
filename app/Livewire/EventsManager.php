<?php

namespace App\Livewire;

use DateTime;
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

    #[Validate('required')] 
    public $title = '';

    #[Validate('required')] 
    public $participants = '';
    public $note = '';
    
    #[Validate('required')] 
    public $start_time = '';

    #[Validate('required')] 
    public $end_time = '';
    
    #[Validate('required')] 
    public $date = '';
    public $meeting_link = "";
    public $reminder = '';

    public function mount(){
        $this->query = '';
        $this->title = '';
        $this->participants = '';
        $this->note = '';
        $this->start_time = '';
        $this->end_time = '';
        $this->date = '';
        $this->meeting_link = "";
        $this->reminder = '';

        $this->users = User::whereNot('id',Auth::id())->get();
        $this->dateToday = date("Y-m-d");
        Carbon::setLocale('fr');
        $this->userEventsExist = Event::whereJsonContains("participants",Auth::id())->orWhere('created_by',Auth::id())->whereDate('date', '>=', $this->dateToday)->orderBy('date','asc')->orderBy('time->start_time','asc')->exists();
        if($this->userEventsExist){
            $this->userEvents = Event::with('user')->whereJsonContains("participants",Auth::id())->orWhere('created_by',Auth::id())->whereDate('date', '>=', $this->dateToday)->orderBy('date')->orderBy('time')->get();
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

    public function updatedQuery(){
        $this->users = User::whereNot('id',Auth::id())->where('name', 'like', '%' . $this->query . '%')->get()->toArray();
    }

    public function saveEvent(){
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
        $dateParts = explode(' ', substr($this->date, strpos($this->date, ' ') + 1));
        $day = $dateParts[0];
        $month = $months[$dateParts[1]];
        $year = $dateParts[2];
        $date = DateTime::createFromFormat('d-m-Y', "$day-$month-$year");
        $this->date = $date->format('d-m-Y');
      Event::create([
        'title' => $this->title,
        'participants' => $this->participants,
        'note' => $this->note,
        'date' => $this->date,
        'meeting_link' => $this->meeting_link,
        'time' => [
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
        ],
        'created_by' => Auth::id(),
        'reminder' => $this->reminder,
      ]);
        $this->dispatch('close-new-event-modal');
        $this->mount();
      session()->flash('message', 'Votre événement a été crée avec succès!');
    }

    #[On('refreshComponent')] 
    public function refresh(){
        return ['refreshComponent' => '$refresh',];
    }

    public function render()
    {
        return view('livewire.events-manager');
    }
}
