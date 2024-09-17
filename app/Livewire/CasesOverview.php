<?php

namespace App\Livewire;

use App\Models\Cases;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;

class CasesOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Dossier en cours', Cases::where('status','pending')->count())
            ->color('success')
            ->extraAttributes([
                'class' => 'dashboard_boxes',
            ]),

            Stat::make('Dossier soumis', Cases::where('status','submited')->count())
            ->color('success')
            ->extraAttributes([
                'class' => 'dashboard_boxes',
            ]),
        ];
    }
}
