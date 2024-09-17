<?php

namespace App\Filament\Resources\CasesResource\Pages;

use App\Filament\Resources\CasesResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCases extends EditRecord
{
    protected static string $resource = CasesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
