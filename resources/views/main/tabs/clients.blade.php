@extends('layout')

@section('content')
<section>
    <div id="home_wrapper">
        <section class="lg:block hidden">
            <x-sidebar :profiles="$profiles"/>
        </section>
        <section id="main" class="py-4 activities_wrapper px-1">
            <div class="mt-6">
                <div class="">
                    <h1 class="text-white font-bold text-[30px] ml-9">Clients</h1>
                </div>
            </div>
            <div class="w-full px-4">
                <div id="clientsTable"></div>
            </div>
        </section>
    </div>
</section>
@endsection