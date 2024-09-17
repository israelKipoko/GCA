@extends('layout')

@section('content')
<img src={{asset("images/register_image.jpg")}} alt="background-image" class="register_image"/>
<section class="container mx-auto md:py-6 px-2 overflow-scroll h-[100%]">
        <div id="regisklter_logo" class=" p-[20px] text-white text-[24px]">logo</div>
    <div id="register_page" class="lg:w-[700px]  mx-auto mt-[4%] rounded-[24px]">
        <div>
            <form name="form" id="register_form" action="/GCA/auth/register/new_user/store" method="POST" class="register_form md-px-6 px-6">
                @csrf
                <header>
                    <h1 class="uppercase font-bold text-center md:text-xl text-[15px]">{{__('Register')}}</h1>
                    <p class="text-[14px] mb-6 text-center text-white italic">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
                </header>
                <section class="grid md:grid-cols-2 grid-cols-1">
                        <div class="mb-6 px-2">
                            <div class="input_div">
                                <input
                                    type="text"
                                    class="input focus:outline-none"
                                    name="firstname" 
                                    value="{{old('firstname')}}"
                                    required/>
                                <label for="firstname" class="label md:text-lg text-[14px] ">{{__('Prénom')}}</label>
                                <i class="fa-solid fa-user credentials_icons"></i>
                            </div>
                            @error('firstname')
                                <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                            @enderror
                        </div>
                        <div class="mb-6 px-2">
                            <div class="input_div">
                                <input
                                    type="text"
                                    class="input focus:outline-none"
                                    name="name" 
                                    value="{{old('name')}}"
                                    required/>
                                <label for="name" class="label md:text-lg text-[14px] ">{{__('Nom')}}</label>
                                <i class="fa-solid fa-user credentials_icons"></i>
                            </div>
                            @error('name')
                                <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                            @enderror
                        </div>
                    
                    <div class="mb-6 px-2">
                        <div class="input_div">
                            <input
                                type="text"
                                class="input focus:outline-none"
                                name="lastname" 
                                value="{{old('lastname')}}"
                                required/>
                            <label for="lastname" class="label md:text-lg text-[14px] ">{{__('Postnom')}}</label>
                            <i class="fa-solid fa-user credentials_icons"></i>
                        </div>
                        @error('lastname')
                            <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                        @enderror
                    </div>
                    <div class="mb-6 px-2">
                        <div class="input_div">
                        <select name="role" id="role" class="input focus:outline-none" required>
                                <option value="user" selected><i class="fa-solid fa-user credentials_icons"></i>{{__('Utilisateur')}}</option>
                                <option value="Admin">{{__('Administrateur')}}</option>
                        </select>
                        </div>
                        @error('role')
                            <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                        @enderror
                    </div>
                    <div class="mb-6 px-2">
                        <div class="input_div">
                            <input
                                type="email"
                                class="input focus:outline-none"
                                name="email" 
                                value="{{old('email')}}"
                                required/>
                            <label for="email" class="label md:text-lg text-[14px] ">{{__('Email')}}</label>
                            <i class="fa-solid fa-envelope credentials_icons"></i>
                        </div>
                        @error('email')
                            <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                        @enderror
                    </div>
                    <div class="mb-6 px-2">
                        <div class="input_div">
                            <input
                                type="text"
                                class="input focus:outline-none"
                                name="phone" 
                                value="{{old('phone')}}"
                                required/>
                            <label for="phone" class="label md:text-lg text-[14px] ">{{__('Téléphone')}}</label>
                            <i class="fa-solid fa-phone credentials_icons"></i>
                        </div>
                        @error('phone')
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
                            required/>
                            <label for="password" class="label md:text-lg text-[14px]">{{__('Mot de passe')}}</label>
                            <a class="password_eye" ><i title="montrer le mot de passe" class=" eye fa-solid fa-eye fa-lg " style="color: #9a9996;"></i></a>
                            <i class="fa-solid fa-lock credentials_icons"></i>
                        </div>
                        @error('password')
                            <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                        @enderror
                    </div>
                    <div class="mb-6 px-2">
                        <div class="input_div">
                            <input
                            type="password"
                            class="input focus:outline-none"
                            name="Confirm_password" 
                            required/>
                            <label for="Confirm_password" class="label md:text-lg text-[14px]">{{__('Confirmer le mot de passe')}}</label>
                            <i class="fa-solid fa-lock credentials_icons"></i>
                        </div>
                        @error('Confirm_password')
                            <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                        @enderror
                    </div>
                </section>
                    <div class="mb-6 mx-auto w-fit">
                        <input type="submit" value="Enregistrer" class="bg-[#006DA4] text-[#fff] font-bold transition-all duration-200 ease-in-out rounded py-2 cursor-pointer px-4 hover:bg-[#004d74]"/>
                    </div>
            </form>
        </div>
</div>
</section>
@endsection
  