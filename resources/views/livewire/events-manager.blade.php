<div class="text-white h-full">
    <section id="" class="flex h-full w-full ">
        <aside id="events_wrapper" class="">
            <section id="events_container" class="flex  flex-col gap-y-4 px-6 py-1">
                @if ($userEventsExist)
                    @foreach ($groudEvents as $event)
                        <div class="flex flex-col gap-x-[70px] ">
                            <div>
                                <span class="text-[14px] capitalize font-bold mb-1 opacity-[0.8]">{{$event['date']==$dateToday?_('today'):\Carbon\Carbon::parse($date)->locale('fr')->isoFormat('ddd DD MMM')}}</span>
                            </div>
                            <div class="flex flex-col gap-y-2">
                                @foreach ($event['events'] as $item)
                                <div class="hs-tooltip [--trigger:focus] [--placement:right]  inline-block">
                                    <button type="button" class="hs-tooltip-toggle w-full ">
                                        <div class="events_wrapper ml-2 ">
                                            <div class="event_divider"></div>
                                            <div class="flex gap-x-2">
                                                <div>
                                                    <p>{{$item->time['start_time']}}</p>
                                                    {{-- <span>
                                                        @php
                                                           $startTime = \Carbon\Carbon::createFromTimeString($item->time["start_time"]);
                                                           $endTime = \Carbon\Carbon::createFromTimeString($item->time["end_time"]);
                                                           $diff = $startTime->diff($endTime);
                                                           
                                                        @endphp
                                                        {{-- @if ( $diff->i >0 && $diff->i <=30) --}}
                                                        {{-- @endif 
                                                    </span> --}}
                                                </div>
                                                <div class="py-2">
                                                    <h1 class="font-bold capitalize text-[17px] text-[]">{{$item->title}}</h1>
                                                    <div class="flex items-center mt-2">
                                                        <div id="user_picture" class=" w-[25px] h-[25px]">
                                                            <img src="{{asset('storage/'.$item->user->avatar)}}" alt="user-profile">
                                                        </div>
                                                        <div>
                                                            <h1 class="capitalize flex ml-2 text-white text-[14px]">
                                                                @if ($item->user->id == Auth::id())
                                                                    @lang('Vous')
                                                                @else
                                                                    {{$item->user->firstname}} {{$item->user->name}}
                                                                @endif
                                                            </h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                      <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-3 px-4 bg-[#313131]  border text-sm text-gray-600 rounded-lg shadow-md dark:border-neutral-700 dark:text-neutral-400" role="tooltip">
                                         <div class="w-[250px]">
                                            <div>
                                                <h1 class="font-bold text-left  mb-2 capitalize text-[17px] text-[]">{{$item->title}}</h1>
                                            </div>
                                            <div class="flex gap-x-1 justify-center items-center">
                                                <div class="flex flex-col items-center">
                                                  <span class="capitalize">{{\Carbon\Carbon::parse($event['date'])->locale('fr')->isoFormat('ddd DD MMMM YYYY')}}</span>  
                                                  <span class="flex items-center"><i class='bx bxs-time mr-1' ></i> {{$item->time['start_time']}} - {{$item->time['end_time']}}</span>
                                                </div>
                                            </div>
                                            <div class="flex flex-col mt-2">
                                                @if ($item->user->id == Auth::id())
                                                    <div class="flex gap-x-1 items-center justify-start ">
                                                        <div id="user_picture" class=" w-[20px] h-[20px]">
                                                            <img src="{{asset('storage/'.$item->user->avatar)}}" alt="user-profile">
                                                        </div>
                                                        <span>{{$item->user->firstname}} {{$item->user->name}}</span> 
                                                    </div>
                                                    <span class="mt-2">@lang('Vous avez créez cet événement!')</span>

                                                @else
                                                   <span>{{$item->user->firstname}} {{$item->user->name}} @lang('Vous a invité').</span> 
                                                @endif
                                            </div>
                                            @if ($item->note != null)
                                                <div>
                                                    <p>{{$item->note}}</p>
                                                </div>
                                            @endif
                                            @if ($item->meetink_link != null)
                                                <div class="flex flex-col">
                                                    <h1>@lang('messages.voici le lien de la reunion')!</h1>
                                                    <a href="{{$item->meetink_link}}" class="badge_grey"><i class='bx bxs-video'></i>@lang('messages.meetig link')</a>
                                                </div>
                                            @endif
                                         </div>
                                      </span>
                                    </button>
                                  </div>
                                    
                                @endforeach
                               
                                {{-- <div class="events_title">
                                    <div>
                                        <h2>Event title</h2>
                                        <p>Time and/or place</p>
                                    </div>
                                </div>
                                <div class="events_title" class="flex flex-col">
                                    <div>
                                        <h2>Event title</h2>
                                        <p>Time and/or place</p>
                                    </div>
                                <div>
                                </div> --}}
                            </div>
                        </div>
                    @endforeach
                   
                @else
                    <div class=" my-auto">
                        <div class="w-[200px] h-[150px] mx-auto">
                            <img class="w-full h-full object-fit-contain" src="{{asset("icons/no-event.svg")}}" alt="">
                        </div>
                        <h1 class="text-[14px] font-bold text-center opacity-[0.7] mb-4 w-[200px] mx-auto">@lang("Vous n'avez aucun événement pour le moment!")</h1>
                        {{-- <button id="create_event_button"  x-data x-on:click="$dispatch('open-new-event-modal')" class="action_button">
                            @lang('messages.new')
                        </button> --}}
                    </div>
                @endif
            </section>
            {{-- @if ($userEventsExist)
                <div id="create_event_button_wrapper" class="">
                    <button id="create_event_button"  x-data x-on:click="$dispatch('open-new-event-modal')" class="action_button">
                        @lang('messages.new')
                    </button>
                </div>
            @endif --}}
           
        </aside>
        <section class="w-full flex flex-col justify-between">
            <div class="w-fit">
                <div>
                    <div class="mx-auto w-fit px-1">
                        <svg role="graphics-symbol" viewBox="0 0 20 20" style="width: 40px; height: 40px; display: block; fill: rgb(90, 90, 90); flex-shrink: 0; color: rgba(255, 255, 255, 0.13); margin: 8px;" class="calendarDate20"><g><path d="M5.64 14.824v-6.05c-1.298.286-1.584-.285-1.441-.856.779-.13 2.804-.597 3.57-.818v7.776l1.415.286c0 .506-.299.805-.831.805-.441 0-1.467-.026-1.96-.026-.766 0-2.168.026-2.168.026a.852.852 0 01-.052-.299c0-.246.104-.493.441-.584l1.026-.26zm7.029-.037c.866-.046 1.286-.818 1.362-2.124-2.24.946-4.24-.054-4.347-2.114-.106-2.008 1.1-3.36 3.055-3.463 2.152-.112 3.356 1.285 3.482 3.686.161 3.07-1.019 5.158-3.604 5.294-1.653.086-2.685-.53-2.74-1.58-.034-.643.465-1.156 1.217-1.117.187 1.056.88 1.454 1.575 1.418zm-.972-5.238c.067 1.286.954 2.384 2.35 2.179a166.03 166.03 0 00-.012-.236c-.1-1.916-.77-3.157-1.544-3.116-.486.025-.834.412-.794 1.173z"></path><path d="M16.664 0H3.334A3.333 3.333 0 000 3.334v13.332A3.333 3.333 0 003.334 20h13.332A3.333 3.333 0 0020 16.666V3.334A3.333 3.333 0 0016.666 0h-.002zm-.525 17.932H3.861a1.797 1.797 0 01-1.797-1.797V5.485h15.872v10.652c0 .993-.804 1.797-1.797 1.797v-.002z"></path></g></svg>
                       {{-- {{\Carbon\Carbon::parse($date)->locale('fr')->isoFormat('d')}} --}}
                    </div>
                </div>
                <div>
                    <a id="open_calendar_button" class="font-bold opacity-[0.8]" href="/home/calendar">
                        Voir le calendrier
                         <i class="fa-solid fa-square-up-right"></i>
                    </a>
                </div>
            </div>
            <div class="w-full flex items-end justify-end ">
                <div>
                    <h1 class="font-bold text-[#0f6cbd] text-center capitalize text-[15px]">
                        @lang('Intégrer votre calendrier') :
                    </h1>
                    <div class="flex gap-y-6 items-center justify-center">
                        <div class="calendar_icons relative">
                            <img class="" src="{{asset('icons/google-calendar.png')}}" alt="" style="">
                            <h1 class="text-[14px] text-center -mt-3">Google Calendar</h1>
                            <p class="text-[14px] font-bold text-center">Bientôt Disponible</p>
                        </div>
                        <div class="calendar_icons relative ">
                            <img src="{{asset('icons/microsoft-calendar.png')}}" alt="">
                            <h1 class="text-[14px] text-center -mt-3">Microsoft Calendar</h1>
                            <p class=" text-[14px] font-bold text-center">Bientôt Disponible</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
    </section>
</div>

@push('js')
    <script>
    const EventReminderOptionsTrigger = document.querySelector('.event_reminder_trigger span');
    const EventReminderOptions = document.querySelectorAll('.event_reminder_options span');
    EventReminderOptions.forEach((option) =>{
       option.addEventListener('click',()=>{
         EventReminderOptionsTrigger.innerText = option.innerText;
         document.querySelector('#reminder').value = option.getAttribute('data-value');
       })
    })
//   (function () {
//     function textareaAutoHeight(el, offsetTop = 0) {
//       el.style.height = 'auto';
//       el.style.height = `${el.scrollHeight + offsetTop}px`;
//     }

//     (function () {
//       const textareas = [
//         '#hs-autoheight-textarea'
//       ];

//       textareas.forEach((el) => {
//         const textarea = document.querySelector(el);
//         const overlay = textarea.closest('.hs-overlay');

//         if (overlay) {
//           const { element } = HSOverlay.getInstance(overlay, true);

//           element.on('open', () => textareaAutoHeight(textarea, 3));
//         } else textareaAutoHeight(textarea, 3);

//         textarea.addEventListener('input', () => {
//           textareaAutoHeight(textarea, 3);
//         });
//       });
//     })();
//   })()
</script>
@endpush
