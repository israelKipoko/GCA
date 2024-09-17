<div id="user_profile" class="flex items-center justify-center h-full">
    {{-- <div class="section_header h-12">
        <div class="h-full flex justify-between items-center px-4 text-center">
            <h1 class="font-bold text-[17px] text-[#fff]">{{__('Mon Profile')}}</h1> 
            <a href="#" class="py-1 px-2 rounded-[8px] bg-[#ffffff33] hover:bg-[#ebe1e133]" title={{__('Modifier mon profile')}}><i class="fa-solid fa-md fa-pen" style="color: #ffffff;"></i></a>
        </div>
    </div> --}}
    <div class="mt w-full ">
        <div class="flex px-4">
            <div>
                <div id="user_picture" class="border w-[80px] h-[80px]">
                    @if ($profiles[0] == null)
                        <img src="{{$profiles[0]->avatar? asset('storage/'.$profiles[0]->avatar) : asset('images/profiles/man_default_profile.jpeg')}}" alt="user-profile">
                    @else
                        <img src="https://ui-avatars.com/api/?name={{ urlencode(auth()->user()->firstname )}}+{{ urlencode(auth()->user()->name )}}&background=random" alt="user-profile">
                    @endif
                </div>
            </div>
            <div class="ml-4">
                <div class="flex gap-x-1">
                    <h2 class="capitalize text-[#11101d] font-bold">{{Auth::user()->firstname? (Auth::user()->firstname) : "Your name"}}</h2>
                    <h2 class="uppercase text-[#11101d] font-bold">{{Auth::user()->name? (Auth::user()->name) : ""}}</h2>
                </div>
                <p class="capitalize text-[#11101d] font">{{$profiles[0]->position? (Auth::user()->position) : "Your position"}}</p>
                <span class="ml-2 text-[#11101d]"><i class="fa-solid fa-location-dot mr-2" style="color: #1c71d8;"></i>{{$profiles[0]->location? (Auth::user()->position) : "Your location"}}</span>
            </div>
        </div>
        <div class="mt-4" id="statistics_wrapper">
            {{-- @livewire('stats') --}}
        </div>
    </div>
</div>