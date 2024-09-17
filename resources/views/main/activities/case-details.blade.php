@extends('layout')

@section('content')
    <section>
        <div id="home_wrapper">
            <section class="lg:block hidden">
                <x-sidebar :profiles="$profiles"/>
            </section>
            <section id="main" class="activities_wrapper case_details_wrapper flex justify-evenly px-4 py-4">
                <h1 class="capitalize" id="{{($case->status == "pending")? "case_status_pending": "case_status_submitted"}}">{{$case->status}}</h1>
                <div class="w-full">
                    <div class="flex justify-between items-center pr-4">
                        <div class="flex flex-col gap-y-2">
                            <h1 class="text-[#ffffffcc] font-bold">Assigné à :</h1>
                            <div class="flex gap-x-2 assigned_to_profile pl-4">
                                @foreach ($assigned_to as $user)
                                    <div class="user_picture element_tooltip_container w-[35px] h-[35px]">
                                        <img src="{{asset('storage/'.$user->profiles->avatar)}}" alt="user-profile">
                                        <div class="tooltip flex w-[100px] text-center">{{$user->firstname." ". $user->name}}</div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                        <div>
                            <div class="actions_button flex gap-x-">
                                <div class="element_tooltip_container">
                                    <button class="" id="update_button"><i class="fa-solid fa-file-import"></i></button>
                                    <div class="tooltip">{{__('Importer')}}</div>
                                </div>
                                <div class="element_tooltip_container">
                                    <button id="submit_case_button"><i class="fa-solid fa-paper-plane text-[#3EA53C]"></i></button>
                                    <div class="tooltip">{{__('Soumettre')}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-9 flex flex-col gap-y-4">
                        <div class="flex gap-x-1 items-center">
                            <h1 class="text-[#ffffffcc] font-bold text-[18px]">{{__("Titre")}} :</h1>
                            <p class="text-[#ffffffcc]">{{$case->title}}</p>
                        </div>
                        <div class=" gap-x-1 items-center">
                            <h1 class="text-[#ffffffcc] font-bold text-[18px]">{{__("Déscription")}} :</h1>
                            <p class="text-[#ffffffcc] w-[550px] max-h-[180px] pl-3 ">{{$case->description}}</p>
                        </div>
                        <div>
                            <h1 class="text-[#ffffffcc] font-bold text-[18px] mb-4">{{__("Documents")}} :</h1>
                            <div class="">
                                <div class="flex gap-x-2">
                                    @foreach ($pendingCase as $item)
                                        @if ($item->getFirstMedia($case->number)->hasGeneratedConversion('thumb'))
                                            <div class="w-[90px] doc_actions_wrapper">
                                                <div class=" justify-center">
                                                    <img class="mx-auto" src="{{$item->getFirstMediaUrl($case->number, 'thumb')}}"/>
                                                    <div class="doc_thumnail_filename">
                                                        <h1>{{$item->getFirstMedia($case->number)->name}}</h1>
                                                    </div>
                                                </div>   
                                                <div class="doc_actions">
                                                    <div>
                                                        <a href="{{$item->getFirstMediaUrl($case->number)}}" target="_blank"><i class="fa-solid fa-eye"></i></a>
                                                        <a href="{{$item->getFirstMediaUrl($case->number)}}" download><i class='bx bxs-download'></i></a>
                                                    </div>
                                                </div>
                                            </div>    
                                        @else
                                            @if ($item->getFirstMedia($case->number)->mime_type = 'application/vnd.oasis.opendocument.text' || $item->getFirstMedia($case->number)->mime_type= 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                                                <div class="w-[90px] doc_actions_wrapper">
                                                    <div>
                                                        <img src="{{asset('images/logos/docx_icon.svg')}}"/>
                                                        <div class="doc_thumnail_filename ">
                                                            <h1 class="ml-3">{{$item->getFirstMedia($case->number)->name}}</h1>
                                                        </div>
                                                    </div>   
                                                    <div class="doc_actions">
                                                        <div>
                                                            {{-- <a href="{{$item->getFirstMediaUrl($case->number)}}"><i class="fa-solid fa-eye"></i></a> --}}
                                                            <a href="{{$item->getFirstMediaUrl($case->number)}}" download><i class='bx bxs-download'></i></a>
                                                        </div>
                                                    </div>
                                                </div>    
                                            @else
                                                <div class="w-[90px] doc_actions_wrapper">
                                                    <div class="">
                                                        <img src="{{asset('images/logos/unknown_file_icon.svg')}}"/>
                                                        <div class="doc_thumnail_filename">
                                                            <h1 class="ml-3">{{$item->getFirstMedia($case->number)->name}}</h1>
                                                        </div>
                                                    </div> 
                                                    <div class="doc_actions">
                                                        <div>
                                                            {{-- <a href="{{$item->getFirstMediaUrl($case->number)}}"><i class="fa-solid fa-eye"></i></a> --}}
                                                            <a href=""><i class='bx bxs-download'></i></a>
                                                        </div>
                                                    </div>
                                                </div>   
                                            @endif
                                        @endif
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="case_updates_wrapper" class="h-[500px] mt-16 w-[500px] p-2">
                    <div class=" text-white">
                         @livewire('case-updates',['case' => $case, 'pendingCase' => $pendingCase])
                    </div>
                </div>
            </section>
        </div>
    </section>
                       
@livewire('uploads-file', ['case' => $case, 'pendingCase' => $pendingCase, 'hasMedia' => $hasMedia])
<x-submit-case :case="$case"/>
@endsection
