@extends('layout')

@section('content')
    <section class="container mx-auto">
        <div id="home_wrapper">
            <section>
                <x-sidebar :profiles="$profiles"/>
            </section>
            <section id="main" class="py-4 activities_wrapper px-1">
                <div class="mt-6">
                    <div class="overflow-scroll">
                        {{-- @livewire('admin.cases-table') --}}
                        <div>
                            <h1 class="text-white font-bold text-[30px] ml-9">Mes Dossiers</h1>
                        </div>
                    </div>
                </div>
                <div class="w-full px-4">
                    <div id="table"></div>
               </div>
            </section>
        <x-admin.new-case :clients="$clients" :users="$users"/>
        </div>
    </section>
@endsection