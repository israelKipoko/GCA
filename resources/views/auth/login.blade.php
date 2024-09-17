@extends('layout')

@section('content')
<img src={{asset("images/bg-image-1.avif")}} alt="background-image" class="login_image"/>
    <section id="login_page" class="py-12 px-6">
        <section id="login_content" class="flex lg:flex-basis flex-wrap lg:gap-y-4 gap-y-9  justify-around md:w-[75%] w-full">
            <div class=" md:w-[450px] px-4 text-center flex flex-col justify-around text-[#fff] font-bold">
                <div class="login_logo text-white w-fit mx-auto text-[24px]">logo</div>
                <div class="overlay"></div>
                <div class="mb-[24px]">
                    <h1 class="text-[25px] text-left mb-5">Bienvenu!</h1>
                    <p class="text-[14px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>
                    {{-- <a href="" id="learn_more">{{__('Apprendre plus')}}</a> --}}
                </div>
            </div>
            <div class="bg-[#B1C9EF] px-4 py-6 rounded-[24px]">
                <form name="form" action="/authenticate/user" method="POST" class="md:w-[350px] w-[280px]">
                    @csrf
                    <header>
                        <h1 class="uppercase font-bold mb-6 text-center md:text-xl text-[15px]">{{__('Login')}}</h1>
                    </header>
                    <section>
                        <div class="mb-6 px-2">
                            <div class="input_div">
                                <input
                                    type="email"
                                    class="input focus:outline-none"
                                    name="email" 
                                    placeholder="{{__('Email')}}"
                                    required/>
                                <i class="fa-solid fa-user credentials_icons"></i>
                            </div>
                            @error('email')
                                <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                            @enderror
                        </div>
                        <div class="mb-6 px-2">
                            <div class="input_div">
                                <input
                                id="password"
                                type="password"
                                class="input focus:outline-none"
                                name="password" 
                                placeholder="{{__('Mot de passe')}}"
                                required/>
                                {{-- <label for="password" class="label md:text-lg text-[14px]">{{__('Mot de passe')}}</label> --}}
                                <a class="password_eye" ><i title="montrer le mot de passe" class=" eye fa-solid fa-eye fa-lg " style="color: #9a9996;"></i></a>
                                <i class="fa-solid fa-lock credentials_icons"></i>
                            </div>
                            @error('password')
                                <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                            @enderror
                            <p class="mt-2 text-[#000] transition-all ease-in-out hover:text-[#395556] md:text-lg text-[13px]"><a href="/forgot-password" class="text-[16px]" title={{__('public.réinitialiser mon mot de passe')}}>
                                {{__('Mot de passe oublié')}}?</a></p>
                        </div>
                        
                        <div class="mb-6 mx-auto w-fit">
                            <input type="submit" value="Se connecter" class="bg-[#006DA4] text-[#fff] font-bold transition-all duration-200 ease-in-out rounded py-2 cursor-pointer px-4 hover:bg-[#004d74]"/>
                        </div>
                    </section>
                        
                    
                </form>
            </div>
        </section>
    </section>
@endsection
