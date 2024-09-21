@props(['users','totalItemPrice','userEvents','userEventsExist','dateToday'])
<div
    x-data = "{show : false}"
    x-show = "show"
    x-on:open-new-event-modal.window = "show = true"
    x-on:close-new-event-modal.window = "show = false"
    x-on:keydown.escape.window = "show = false"
    style="display: none;"
    x-transition

    id="new-event-modal" class="fixed z-50 inset-0">
    {{-- Gray background --}}
    <div x-on:click="show = false" class="fixed inset-0 bg-[#000] opacity-40"></div>

    {{-- Modal --}}
    <section class="new-event-modal-wrapper absolute rounded m-auto text-[#fff] fixed inset-0 w-fit overflow-y-auto" style="max-height:500px">
        <div class=" w-full flex flex-col h-full py-4 px-6">
            <h1 class="font-bold text-[16px] opacity-[0.7] mb-4 text-[#fff]">@lang('messages.Nouvel Evénement')</h1>
            <div class="flex gap-x-6">
                <form action="/home/event/create" method="POST">
                    @csrf
                    <div class="w-fit my-3">
                        <button type="submit" class="action_button rounded-md"><i class="fa-regular fa-floppy-disk"></i> @lang('Sauvegarder')</button>
                    </div>
                    <section class="flex gap-x-9 py-4" wire:ignore>
                        <div class="flex flex-col gap-y-6">
                            <div class="input_div">
                                <input
                                    wire:model="title"
                                    type="text"
                                    class="event_title_input focus:outline-none text-[14px]"
                                    name="title"
                                    placeholder="Ajouter un titre"
                                    required/>
                                <i class="fa-solid fa-align-justify event_icons"></i>
                            </div>
                            <div class="flex justify-between">
                                <div class="input_div">
                                    <input  type="text" name="date" id="datepicker" class="focus:outline-none border px-2 py-1.5 rounded-md text-[14px]  w-[260px] border-[#fff] bg-[#262626]" placeholder="Entrer une date" required/>
                                    <i class="fa-solid fa-calendar-days absolute right-3 top-2"></i>
                                </div>
                                <div class="flex gap-x-2 items-center">
                                    <div class="flex flex-col">
                                        <div class="hs-dropdown relative inline-flex">
                                            <button id="hs-dropdown-unstyled" type="button" class="hs-dropdown-toggle event_time_trigger border border-[#fff] event_reminder_trigger inline-flex justify-center items-center text-[14px] gap-x-1 p-1 rounded-md bg-[#262626]" aria-expanded="false" aria-label="Menu">
                                                <i class='bx bxs-time' ></i><span></span><i class='bx bx-chevron-down bx-sm'></i>
                                            </button>
                                            <input   type="text"  id="start_time" name="start_time" class="hidden"/>
                                            <div class="event_reminder_options event_time_options hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-30 bg-white shadow-md rounded-lg text-[#262626] p-1 space-y-0.5 mt-2 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-default">
                                              {{-- {{HOURS}} --}}
                                            </div>
                                        </div>
                                    </div>
                                    <span>@lang('to')</span>
                                    <div  class="flex flex-col">
                                        <div class="hs-dropdown relative inline-flex">
                                            <button id="hs-dropdown-unstyled" type="button" class="hs-dropdown-toggle event_time_trigger border border-[#fff] event_reminder_trigger inline-flex justify-center items-center text-[14px] gap-x-1 p-1 rounded-md bg-[#262626]" aria-expanded="false" aria-label="Menu">
                                                <i class='bx bxs-time-five'></i><span></span><i class='bx bx-chevron-down bx-sm'></i>
                                            </button>
                                            <input  type="text"  id="end_time" name="end_time" class="hidden" />
                                            <div class="event_reminder_options event_time_options hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-30 min-h-fit bg-white shadow-md rounded-lg text-[#262626] p-1 space-y-0.5 mt-2 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-default">
                                            
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="custom-select input_div">
                                <div class=" multiple-select ">
                                    <div class="input_div event_title_input">
                                        <div id="participants_badges_wrapper">
                                            <input  type="text" id="selected_participants" name="selected_participants[]" class="participants_input focus:outline-none text-[14px] select-placeholder" placeholder="Ajouter un participant"/>
                                        </div>
                                        <i class="fa-solid fa-users event_icons "></i>
                                        <input wire:model="participants" type="text" id="participants" name="participants[]" class="hidden" required/>
                                    </div>
                                </div>
                                <div class="options">
                                    @foreach ($users as $user)
                                        <div class="option" data-value="{{$user['id']}}">
                                            <span class="capitalize text-[#22243D] text-[14px]">{{$user['name']}}</span>
                                            <p class="text-[#22243D] text-[13px] font-bold">{{$user['email']}}</p>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                            <div class="input_div">
                                <input
                                    type="text"
                                    class="event_title_input focus:outline-none text-[14px]"
                                    name="meeting_link"
                                    placeholder="Ajouter le lien pour une réunion en ligne"/>
                                    <i class="fa-solid fa-video event_icons"></i>
                            </div>
                            <div class="">
                                <textarea id="hs-autoheight-textarea" name="note" class="event_title_input focus:outline-none text-[14px] py-3 px-4 block w-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:focus:ring-neutral-600" rows="3" placeholder="Description..."></textarea>
                            </div>
                        </div>
                        {{-- <div class="flex flex-col items-start gap-y-6">
                            <div>
                                  <div class="hs-dropdown relative inline-flex">
                                    <button id="hs-dropdown-unstyled" type="button" class="hs-dropdown-toggle event_reminder_trigger inline-flex justify-center items-center text-[14px] gap-x-2 p-1 rounded-md bg-[#262626]" aria-expanded="false" aria-label="Menu">
                                        <i class='bx bx-alarm bx-xs'></i><span>@lang('15 minutes avant')</span><i class='bx bx-chevron-down bx-sm'></i>
                                    </button>
                                    <input wire:model="reminder"  type="text" name="reminder" id="reminder" class="hidden" value="15M">
                                    <div class="event_reminder_options hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg text-[#262626] p-1 space-y-0.5 mt-2 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-default">
                                      <span class="block cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm  hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-[#b1afaf80] dark:focus:bg-neutral-700" data-value="15M">
                                        @lang('15 minutes avant')
                                      </span>
                                      <span class="block cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm  hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-[#b1afaf80] dark:focus:bg-neutral-700" data-value="30M">
                                        @lang('30 minutes avant')
                                      </span>
                                      <span class="block cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm  hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-[#b1afaf80] dark:focus:bg-neutral-700" data-value="1H">
                                        @lang('1 heure avant')
                                      </span>
                                      <span class="block cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm  hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-[#b1afaf80] dark:focus:bg-neutral-700" data-value="2H">
                                        @lang('2 heure avant')
                                       </span>
                                      <span class="block cursor-pointer flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm  hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-[#b1afaf80] dark:focus:bg-neutral-700" data-value="1D">
                                        @lang('1 jour avant')
                                      </span>
                                    </div>
                                  </div>
                            </div>
                        </div> --}}
    
                        {{-- Event Display --}}
                    </section>
                </form>
                <section>
                    <div class="bg-[#313131] w-[350px] rounded-[4px]">
                        <div class=" border-b py-1 px-2 flex justify-between items-center ">
                            <i class="fa-solid fa-chevron-left icons left date_controls"></i>
                            <div class="input_div rounded-[4px] ">
                                <form action="" id="planned_events_calendar_form">
                                    <input type="text" name="calendar_date" id="planned_events_calendar_date" class="focus:outline-none hover:bg-[#b1afaf80] cursor-pointer p-1 rounded-[4px] bg-[#313131] w-[150px] text-[14px] capitalize"/>
                                    <i class='bx bx-chevron-down bx-sm absolute -right-1 top-0.5'></i>
                                </form>
                            </div>
                            <i class="fa-solid fa-chevron-right icons right date_controls"></i>
                        </div>
                        <div class="py-2 px-2 h-[380px] flex flex-col gap-y-1" id="availability_list">
                            @if ($userEventsExist)
                                @if ($userEvents[0]->date == $dateToday)
                                        @foreach ($userEvents as $item)
                                        <div class="events_wrapper ml-2">
                                            <div class="event_divider"></div>
                                            <div class="flex gap-x-2 py-1">
                                                <div>
                                                    <p>{{$item->time['start_time']}}</p>
                                                    <span class="hidden">remaining time</span>
                                                </div>
                                                <div class="">
                                                    <h1 class="font-bold capitalize text-[17px] text-[#356B8C]">{{$item->title}}</h1>
                                                    <div>
                                                        <div id="user_picture" class="hidden w-[40px] h-[40px]">
                                                            {{-- <img src="{{asset('storage${UserEvent['user']['avatar']})}}" alt="user-profile"> --}}
                                                        </div>
                                                        <div>
                                                            <h1 class="capitalize flex ml-2 text-white text-[14px]">{{$item->user->firstname}}  {{$item->user->name}} </h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    @endforeach
                                @else
                                    <div class="flex items-center h-full">
                                        <h1 class="capitalize flex ml-2 text-white text-[14px] text-center">Vous n'avez aucun événement prévu pour à ce jour!!</h1>
                                    </div>
                                @endif
                            @endif
                        </div>
                    </div>
                </section>
            </div>
            
            <button type="button" x-data x-on:click="$dispatch('close-new-event-modal')" id="close_item_details" class="absolute top-2 right-3"><i class='bx bx-x  bx-md'></i></button>
        </div>
    </section>
</div>
