<?php

namespace App\Livewire;

use Livewire\Component;

class UploadsFile extends Component
{
    public $case;
    public $pendingCase;
    public $hasMedia;

    public function mount($case , $pendingCase, $hasMedia)
    {
        $this->case = $case;
        $this->pendingCase = $pendingCase;
        $this->hasMedia = $hasMedia;
    }

    public function render()
    {
        return view('livewire.uploads-file');
    }
}
