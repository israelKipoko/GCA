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
            body{
                background: #f1f1f188;
                position: relative;
                font-family: 'Inter';
            }
            .emailCodeVerificationContainer{
                position: absolute;
                right: 50%;
                top: 50%;
                height: 200px;
                width: 400px;
                transform: translate(50%,50%);
                background-color: #313131;
                padding: 15px 10px;
                border-radius: 4px;
                padding-block: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
                .emailCodeVerification{
                    background-color: #313131;
                    border-radius: 4px;
                    width: fit-content;
                    height: fit-content;
                    padding: 15px 10px;
                    padding-left: 20px;
                    margin: auto;
                    color: #fff;
                }
                .logo_div{
                    width: 200px;
                    height: 50px;
                    margin: auto;
                    margin-top: 10px;
                }
                h4{
                    margin-top: -80px;
                    color: #fff;
                    text-align: center;
                }
                .logo_div img{
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                #button_div{
                    width: fit-content;
                    margin-left: auto;
                }
                #button_div a{
                    background-color: #0f6cbd;
                    padding: 5px 10px;
                    border-radius: 4px;
                    color: #ffffff;
                    text-decoration-line: none;
                    font-weight: bold;
                }
        </style>
    </head>
    <body class=" bg-[#1B1B1B] scrollable">
        <div class="emailCodeVerificationContainer">
            <div class="logo_div">
                <img src="{{asset('icons/Mobeko_logo1.png')}}" alt="">
            </div>
            <div>
                <h4>Félicitations,<br/> Vous avez changé votre email avec succès!</h4>
            </div>
            
            <div id="button_div">
                <a  href="{{ route('route_login') }}">
                    Se connecter
                </a>
            </div>
           
        </div>
        
    </body>
</html>