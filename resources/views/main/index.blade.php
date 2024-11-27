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
            <section class=" pt-9">
                <div>
                    <h1 class="text-white font-bold md:text-[24px] text-[20px] capitalize text-center">{{$title}}{{Auth::user()->firstname}} {{Auth::user()->name}}</h1>
                </div>
                <div id="layout" class=""></div>
            </section>
            {{-- <section id="main" class="flex flex-col gap-y-6  mx-auto px-6 py-9">
                <div>
                    <h1 class="text-white  flex items-center gap-x-1 font-bold md:text-[15px] opacity-[0.7]  text-[14px] capitalize mb-3">
                        <i class="fa-regular fa-newspaper"></i>
                        @lang('Communiqués')
                    </h1>
                    <div id="comunication" class="h-[220px] mb-4">
                        @include('partials._communication')
                    </div>
                </div>
                <div>
                    <h1 class="text-white  flex items-center gap-x-1 font-bold md:text-[15px] opacity-[0.7] text-[14px] capitalize mb-3">
                        <i class="fa-solid fa-calendar-day"></i>
                        @lang('événements à venir')
                    </h1>
                    <div id="calendar_events" class=" ">
                        @include('partials._events')
                    </div>
                </div>
            </section> --}}
        </div>
    </section>
@endsection