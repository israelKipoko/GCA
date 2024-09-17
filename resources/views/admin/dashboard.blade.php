@extends('layout')

@section('content')
    <section class="container mx-auto">
        <div id="home_wrapper">
            <section class="lg:block hidden">
                <x-sidebar :profiles="$profiles"/>
            </section>
            <section id="main" class="py-4 activities_wrapper px-1">
                {{-- <div class=" text-center w-full flex justify-evenly">
                    @livewire(\App\Livewire\CasesOverview::class)
                </div> --}}
                <div class="mt-6">
                    <div class="overflow-scroll">
                        {{-- @livewire('admin.cases-table') --}}
                        <div>
                            <h1 class="text-white font-bold text-[34px] ml-9">Mes Dossiers</h1>
                        </div>
                        <div class="w-fit ml-auto mr-6">
                            <button type="button" x-data x-on:click="$dispatch('open-create-case');" class="py-1 px-2 bg-[#356B8C] rounded-[4px] text-white font-bold">{{__("+ Créer un dossier")}}</button>
                        </div>
                        <livewire:cases-table/>
                    </div>
                </div>
            </section>
        </div>
        <x-admin.new-case :clients="$clients" :users="$users"/>
        {{-- <x-filament::modal id="new-case"  slide-over>
         
            {{-- Modal content -
        </x-filament::modal> --}}
    </section>
@endsection