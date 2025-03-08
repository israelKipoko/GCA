<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

         {{-- <link rel="stylesheet" href="{{asset('build/assets/app-WSFwxfgs.css')}}"> --}}
         {{-- <link rel="stylesheet" href="{{asset('build/assets/app-CCSHuCSN.css')}}">  --}}
        {{-- @vite(['resources/css/app.css']) --}}
        <link rel="icon" href="{{ asset('icons/mobeko_logo2.png') }}" type="image/x-icon">

        <title>Mobeko</title>

        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"/>

        <!-- Fonts -->
        <link rel="stylesheet" href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@400;600;700&family=Roboto:wght@900&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://api.fontshare.com/v2/css?f[]=gambetta@400,500,600,700&display=swap" rel="stylesheet">

        <!-- Styles -->

        <style>
            .emailCodeVerificationContainer{

                }
                .emailCodeVerification{
                    background-color: #313131;
                    border-radius: 4px;
                    width: fit-content;
                    padding: 5px 10px;
                    margin: auto;
                }
                .emailCodeVerification a{
                    color: #fff;
                    opacity: 0.8;
                    font-weight: bold;
                    font-size: 20px;
                    text-align: center;
                }
        </style>
    </head>
    <body class=" bg-[#1B1B1B] scrollable">
        <div class="emailCodeVerificationContainer">
            <div>
                <h3>Bonjour, {{$userName}}</h3>
                <h4>Cliquez sur ce lien pour pouvoir vérifier votre nouveau email.</h4>
            </div>
            
            <div class="emailCodeVerification">
                <a href="{{ route('new-email', ['newEmail' => $newEmail, 'oldEmail' => $oldEmail]) }}" target="_blank">
                    Vérifier mon email
                </a>
            </div>
        </div>
        
    </body>
</html>