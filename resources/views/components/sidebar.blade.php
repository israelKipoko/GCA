@props(['profiles'])

<aside id="sidebar">
    <section id="sidebar_wrapper" class=" mt-[115px]">
        <button id="expand_btn"><i class="fa-solid fa-chevron-right fa-lg" style="color: #fff;"></i></button>
        <header id="sidebar_header" class="">
            <img class="text-[#fff]" id="logo_img" src="" alt="LOGO"/>
        </header>
        <nav class="">
            <ul class="flex flex-col gap-y-1 opacity-[0.7]">
                @if(auth()->user()->hasRole('User') || auth()->user()->hasRole('Admin'))
                    <li>
                        <a href="/home">
                            <span>
                                <i class="fa-solid fa-house fa-lg " style="color: #fff;"></i>
                                <h1 class="hide_sidebar_text">{{__('Accueil')}}</h1>
                            </span>
                            <span class="sidebar_menu_tooltip">{{__('Accueil')}}</span>
                        </a>
                    </li>
                @endif
                <li>
                    <a href="/home/dashboard?q=dashboard">
                        <span>
                            <i class='bx bxs-dashboard text-white fa-xl'></i>
                            <h1 class="hide_sidebar_text">{{__('Tableau de bord')}}</h1>
                        </span>
                        <span class="sidebar_menu_tooltip">{{__('Tableau de bord')}}</span>
                    </a>
                </li>
                {{-- <li>
                    <a href="/home/reports?q=reports">
                        <span>
                            <i class="fa-solid fa-book-open fa-lg" style="color: #fff;"></i>
                            <h1 class="hide_sidebar_text">{{__('Compte rendu')}}</h1>
                        </span>
                        <span class="sidebar_menu_tooltip">{{__('Compte rendu')}}</span>
                    </a>
                </li>--}}
                <li>
                    <a href="/home/clients?q=clients">
                        <span>
                           <i class="fa-solid fa-users fa-lg text-white"></i>
                            <h1 class="hide_sidebar_text">{{__('Clients')}}</h1>
                        </span>
                        <span class="sidebar_menu_tooltip">{{__('Clients')}}</span>
                    </a>
                </li>
                <li>
                    <a href="/home/library?q=library">
                        <span>
                            <i class='bx bx-library text-white fa-xl'></i>
                            <h1 class="hide_sidebar_text">{{__('Bibliothèque')}}</h1>
                        </span>
                        <span class="sidebar_menu_tooltip">{{__('Bibliothèque')}}</span>
                    </a>
                </li> 
            </ul>
        </nav>
        <footer class="">
            <details class="">
                <summary class="flex items-center justify-center">
                    <div id="user_picture" class="w-[40px] h-[40px]">
                        <img src="{{asset('storage/'.$profiles[0]->avatar)}}" alt="user-profile">
                    </div>
                    <div>
                        <h1 class="hide_sidebar_text flex ml-2 text-white font-bold">{{auth()->user()->firstname." ".auth()->user()->name}}</h1>
                    </div>
                </summary>
                    <ul>
                        <li>

                        </li>
                        <li>
                            <form action="/logout/user" method="POST" id="logout_form">
                                @csrf
                                <button type="submit">
                                    <h1 class="text-red-600"><i class="fa-solid fa-arrow-right-from-bracket fa-lg"></i>{{__('Logout')}}</h1>
                                </button>
                            </form>
                        </li>
                    </ul>
            </details>
            
        </footer>
    </section>
</aside>