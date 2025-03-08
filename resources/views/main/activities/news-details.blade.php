@extends('layout')

@section('content')
    <section>
        <div id="home_wrapper">
            <section id="main" class="activities_wrapper flex  px-4 h- py-4">
                <div class="text-center w-full h-fit my-auto">
                    <div class=" mx-auto w-fit gap-x-2 text-[18px] mb-1 text-white">
                        <h1>{{$news->title}}</h1>
                        <div id="underline_title"></div>
                    </div>
                    <div class="mt-4 text-white text-center">
                        <p>{{$news->content}}</p>
                    </div>
                    <div class="w-fit ml-auto mt-4 mr-16">
                        <p class="text-white">
                            {{__('Fait le')}}
                                @php
                                    setlocale(LC_TIME, 'fr_FR.utf8');
                                    $date = strftime('%d %B %Y',  $news->created_at->getTimestamp());
                                @endphp
                            {{$date}}
                        </p>
                        <span style="line-height: 1.2rem;">
                            <h1 class="capitalize font-bold text-[#356B8C]">{{$news->user->firstname." ".$news->user->name." ".$news->user->lastname}}</h1>
                            <h1 class="capitalize font-bold text-[#356B8C]">{{$news->user->profiles->position}}</h1>
                        </span>
                    </div>
                </div>
            </section>
        </div>
    </section>
@endsection