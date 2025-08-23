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

        {{-- <script type="module" src="{{asset('build/assets/app-D0tTX_OH.js')}}"></script>  --}}
        {{-- @vite(['resources/js/app.jsx']) --}}
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
                    margin-block: 10px;
                    width: fit-content;
                    margin: auto;
                }
                .credentials{
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .login{
                    background-color: #007bff;
                    color: #fff;
                    opacity: 0.8;
                    border-radius: 4px;
                    font-weight: bold;
                    width: fit-content;
                    padding: 7px 15px;
                    margin: auto;
                    text-align: center;
                }
                .logo{
                    font-weight: bold;
                    background-color: #356B8C;
                    width: fit-content;
                    margin: auto;
                    border-radius: 4px;
                }
                .logo img{
                    width: 170px;
                    height: 40px;
                    object-fit: contain;
                }
        </style>
    </head>
    <body class=" bg-[#1B1B1B] scrollable">
        <div class="emailCodeVerificationContainer">
            <div class="logo">
                <img src="{{ asset('icons/Mobeko_logo1.png') }}" alt="">
            </div>
            <div>
                <h3>Bonjour, {{$name}}</h3>
                <h4>Votre mot de passe a été réinitialisé avec succès!</h4>
                <div class="credentials">
                    <span>
                        🔹 Nouveau mot de passe : {{$password}}
                    </span>
                </div><br/>
               
            </div>
            <div class="emailCodeVerification">
                <a  href="{{$login_url}}" target="_blank" rel="noopener noreferrer" class="login">
                    Se Connecter
                </a> 
            </div><br/>

            <div>
                Merci,<br/>
                L'équipe Mobeko
            </div>
            
        </div>
        
    </body>
</html>