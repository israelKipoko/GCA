@extends('layout')

@section('content')
<section>
    <div id="home_wrapper">
        <section class="lg:block hidden">
            <x-sidebar :profiles="$profiles"/>
        </section>
        <section id="main" class="activities_wrapper flex justify-evenly px-12 py-6">
            @livewire('clients')
        </section>
    </div>
</section>
@endsection