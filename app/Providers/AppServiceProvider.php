<?php

namespace App\Providers;

use Filament\Support\Colors\Color;
use Illuminate\Support\ServiceProvider;
use Filament\Support\Facades\FilamentColor;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        FilamentColor::register([
            'danger' => Color::Green,
            'gray' => Color::Green,
            'info' => Color::Green,
            'primary' => Color::hex('#fff'),
            'success' => Color::Green,
            'warning' => Color::Green,
        ]);
    }
}
