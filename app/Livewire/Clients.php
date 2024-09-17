<?php

namespace App\Livewire;

use App\Models\User;
use App\Models\Cases;
use Livewire\Component;
use Livewire\Attributes\On;
use App\Models\Clients as CompanyClients; 

class Clients extends Component
{
    public $clients;
    public $search;
    public $showDetails;
    public $clickedClient;
    public $assigned_to;

    public function mount(){
        $this->clients = CompanyClients::with('cases')->withCount('cases')->get();
        $this->search = '';
        $this->showDetails = false;
        $this->clickedClient = [];
        $this->assigned_to = [];

    }

    public function updatedSearch(){
        $this->clients = CompanyClients::where('name', 'like', '%' . $this->search . '%')->get();
    }

    #[On('open-client-details')] 
    public function showDetails(CompanyClients $client){
        $this->showDetails = true;
        $this->clickedClient = CompanyClients::withCount('cases')->with('cases')->where('id',$client->id)->get();
        if($this->clickedClient[0]->cases != null){
            foreach($this->clickedClient[0]->cases as $cases){
                foreach($cases->assigned_to as $user){
                    $this->assigned_to[$cases->id][] = User::with('profiles')->find($user);
                }
            }
        }
    }

    #[On('close-client-details')] 
    public function hideDetails(){
        $this->showDetails = false;
    }

    public function render()
    {
        return view('livewire.clients');
    }
}
