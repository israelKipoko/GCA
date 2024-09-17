@extends('layout')

@section('content')
    <section class="container mx-auto">
        <div id="home_wrapper">
            <section>
                <x-sidebar :profiles="$profiles"/>
            </section>
            <section id="main" class="">
                <div class="w-full">
                    <x-livewire-filemanager />
               </div>
            </section>
        </div>
    </section>
@endsection