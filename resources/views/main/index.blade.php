@extends('layout')

@section('content')
@php
    $time = date('H');
        if($time < 12){
            $title = 'Bonjour,';
        }else{
            $title = 'Bonsoir,';
        }
@endphp
    <section class="container">
        <div id="home_wrapper">
            <section class="lg:block hidden">
                <x-sidebar :profiles="$profiles"/>
            </section>
            <section id="main" class="flex flex-col gap-y-6  mx-auto px-6 py-9">
                <div>
                    <h1 class="text-white font-bold md:text-[24px] text-[20px] capitalize text-center">{{$title}}{{Auth::user()->firstname}} {{Auth::user()->name}}</h1>
                </div>
                <div id="pending_cases" class="">
                    <h1 class="text-white font-bold md:text-[15px] opacity-[0.7] text-[14px] capitalize mb-3">
                        <i class="fa-regular fa-clock"></i>
                        @lang('Vos dossiers récents')
                    </h1>
                    @include('partials._pending-cases')
                </div>
                <div>
                    <h1 class="text-white font-bold md:text-[15px] opacity-[0.7]  text-[14px] capitalize mb-3">
                        <i class="fa-regular fa-newspaper"></i>
                        @lang('Communiqués')
                    </h1>
                    <div id="comunication" class="h-[220px] mb-4">
                        @include('partials._communication')
                    </div>
                </div>
                <div>
                    <h1 class="text-white font-bold md:text-[15px] opacity-[0.7] text-[14px] capitalize mb-3">
                        <i class="fa-solid fa-calendar-day"></i>
                        @lang('événements à venir')
                    </h1>
                    <div id="calendar_events" class=" ">
                        @include('partials._events')
                    </div>
                </div>
               
                <div id="usefull_tools" class="w-full mt-4">
                    <h1 class="text-white font-bold md:text-[15px] text-[14px] capitalize">@lang('Vos dossiers récents')</h1>
                    <div>
                        @include('partials._todo-list')
                    </div>
                </div>
                
            </section>
        </div>
    </section>
@endsection