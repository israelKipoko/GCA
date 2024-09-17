<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\PendingCases;

class CaseUpdates extends Component
{
    public $case;
    public $pendingCase;
    public $updates;

    public function mount($case, $pendingCase)
    {
        $this->case = $case;
        $this->pendingCase = $pendingCase;
        $this->updates =  PendingCases::with('user.profiles')->where('case_number', $case->number)->latest()->get();
    }

    public function render()
    {
        return view('livewire.case-updates');
    }
}
