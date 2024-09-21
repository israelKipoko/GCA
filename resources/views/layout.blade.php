<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        @vite(['resources/css/app.css'])

        <title>Laravel</title>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"/>

        @notifyCss
        @viteReactRefresh
        <!-- Fonts -->
        <link rel="stylesheet" href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@400;600;700&family=Roboto:wght@900&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://api.fontshare.com/v2/css?f[]=gambetta@400,500,600,700&display=swap" rel="stylesheet"> 
        <link rel="stylesheet" href=" {{asset('Datepicker.js-master/dist/css/datepicker.material.css')}}">

        <link rel="stylesheet"  href="{{asset('time-picker/dist/css/timepicker.min.css')}}"/>
        <link href="https://unpkg.com/filepond@^4/dist/filepond.css" rel="stylesheet" />
        <!-- Styles -->
        @viteReactRefresh
        <link rel="stylesheet" href="{{asset('css/style.css')}}">
        @livewireStyles
        {{-- @filamentStyles --}}
           @filemanagerStyles
    </head>
    <body class="h-[100vh] bg-[#1B1B1B]">
        @yield('content')
        <x-flash-message/>
        <x-notify::notify/>
        @notifyJs
        <script src="https://unpkg.com/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js"></script>
        <script src="https://unpkg.com/filepond@^4/dist/filepond.js"></script>
        @stack('js')
        @livewire('notifications')
        @livewireScripts
    <script src="{{asset('Datepicker.js-master/dist/datepicker.js')}}"></script>
        
        {{-- @filamentScripts --}}
        @filemanagerScripts
        @vite('resources/js/app.jsx')
    </body>
    <script src="{{asset('script/script.js')}}"></script>
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js'></script>
    <script src="{{asset('time-picker/dist/js/timepicker.min.js')}}"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
</html>