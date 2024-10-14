@php
    $firstFiveUsers = array_splice($users, 0, 5);
    $remainedUsers = $users;
@endphp
<div class="flex">
    @foreach ($firstFiveUsers as $item)
        <div class="w-[35px] h-[35px] element_tooltip_container user_picture">
            {{-- <img class="w-full h-full rounded-full object-contain" src="{{asset('/storage'.$item->profiles->avatar)}}" alt=""> --}}
            {{-- <div class="tooltip flex w-fit text-center">{{$item->firstname." ". $item->name}}</div> --}}
        </div>
    @endforeach
    @if (sizeof($remainedUsers) != 0)
        <div class="z-10  flex items-center justify-center text-white font-bold">
            +{{sizeof($remainedUsers)}}
        </div>
    @endif
</div>
 
        