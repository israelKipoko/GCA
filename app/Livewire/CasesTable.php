<?php

namespace App\Livewire;

use App\Models\User;
use App\Models\Cases;
use App\Models\Profiles;
use Rappasoft\LaravelLivewireTables\Views\Column;
use Rappasoft\LaravelLivewireTables\DataTableComponent;
use Rappasoft\LaravelLivewireTables\Views\Columns\DateColumn;
use Rappasoft\LaravelLivewireTables\Views\Columns\ImageColumn;

class CasesTable extends DataTableComponent
{
    protected $model = Cases::class;
   
    public function configure(): void
    {
        $this->setPrimaryKey('id');
       
    }

    public function columns(): array
    {
        return [
            Column::make("Titre", "title")
                ->sortable()
                ->searchable(),
            Column::make("Client", "clients.name"),
             Column::make(__("Assignés"), "assigned_to")
             ->format(function($value){
                foreach($value as $item){
                    $users[]=User::with('profiles')->find($item);
                };
                return view('components.admin.assignedTo',[
                    'users' => $users
                ]);
             }),
            // Column::make('assigned_to','assigned_to')
            // ->view('components.admin.status'),
            DateColumn::make('Deadline', 'due_date')
                        ->outputFormat('d M o'),
            DateColumn::make("Date", "created_at")
                        ->outputFormat('d M o')
                        ->sortable(),
            Column::make("Status", "status")
                ->format(
                    fn($value, $row, Column $column) => view('components.admin.status')->withValue($value)
                ),
            // Column::make('actions')
            // Column::make("Type", "type")
            //     ->sortable(),
            // Column::make("Sample", "sample")
            //     ->sortable(),
            
           
        ];
    }
}
