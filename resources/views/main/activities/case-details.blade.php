@extends('layout')

@section('content')
    <section>
        <div id="home_wrapper">
            <section class="lg:block hidden">
                <x-sidebar />
            </section>
            <section id="main" class="activities_wrapper case_details_wrapper flex justify-evenly px-4 py-2">
                <div class="w-full">
                    <div class="flex flex-col gap-y-2">
                        <div class="flex flex-col gap-x-1 ">
                            <h1 class="text-[#ffffffcc] font-bold text-[18px]">{{__("Titre")}} :</h1>
                            <p class="text-[#ffffffcc]  pl-4">{{$case->title}}</p>
                        </div>
                        <div class="flex flex-col gap-x-1">
                            <h1 class="text-[#ffffffcc] font-bold text-[17px]">{{__("Déscription")}} :</h1>
                            <p class="text-[#ffffffcc] w-[550px] max-h-[180px] pl-4">{{$case->description}}</p>
                        </div>
                        <div class="flex gap-x-1">
                            <h1 class="text-[#ffffffcc] font-bold text-[17px]">{{__("Date limite")}} :</h1>
                            <p class="text-[#ffffffcc] pl-2">
                                @php
                                    $date = new DateTime($case->due_date);
                                    setlocale(LC_TIME, 'fr_FR.UTF-8');
                                    $formattedDate = strftime('%d %B', $date->getTimestamp());
                                    echo $formattedDate;
                                @endphp     
                            </p>
                        </div>
                            <div class="flex gap-x-2" id="assigned_user_wrapper">
                                <div class="capitalize" id="{{($case->status == "pending")? "case_status_pending": "case_status_submitted"}}"><span class="w-[8px] h-[8px] rounded-full bg-[#ffde4d]"> </span>{{$case->status}}</div>
                                <div class="flex gap-x-2 assigned_to_profile pl-4">
                                    @foreach ($assigned_to as $user)
                                        <div class="user_picture element_tooltip_container w-[35px] h-[35px]">
                                            <img src="{{asset('storage/'.$user->avatar)}}" alt="user-profile">
                                            <div class="tooltip flex w-[100px] text-center">{{$user->firstname." ". $user->name}}</div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        <div>
                </div>
                <div class="">
                    <div id="workspace" data-case-id="{{$case->id}}"></div>
                </div>
            </section>
        </div>
    </section>
@endsection
