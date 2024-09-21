<div>
    <div class="calendar_container" wire:ignore>
        <div class="month_left">
          <div class="calendar">
            <div class="month">
              <i class="fas fa-angle-left prev"></i>
              <div class="date">december 2015</div>
              <i class="fas fa-angle-right next"></i>
            </div>
            <div class="weekdays">
              <div>Dim</div>
              <div>Lun</div>
              <div>Mar</div>
              <div>Mer</div>
              <div>Jeu</div>
              <div>Ven</div>
              <div>Sam</div>
            </div>
            <div class="days"></div>
            <div class="goto-today">
              {{-- <div class="goto">
                <input type="text" placeholder="mm/yyyy" class="date-input" />
                <button class="goto-btn">Go</button>
              </div> --}}
              <button class="today-btn">@lang("Aujourd'hui")</button>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="today-date">
            <div class="event-day">wed</div>
            <div class="event-date">12th december 2022</div>
          </div>
          <div class="events">
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
                        <div class="flex items-center h-full no-event">
                            <h3 class="">Aucun Evénement!!</h3>
                        </div>
                    @endif
                @endif
            </div>
          </div>
          <div class="add-event-wrapper">
            <div class="add-event-header">
              <div class="title">Add Event</div>
              <i class="fas fa-times close"></i>
            </div>
            <div class="add-event-body">
              <div class="add-event-input">
                <input type="text" placeholder="Event Name" class="event-name" />
              </div>
              <div class="add-event-input">
                <input
                  type="text"
                  placeholder="Event Time From"
                  class="event-time-from"
                />
              </div>
              <div class="add-event-input">
                <input
                  type="text"
                  placeholder="Event Time To"
                  class="event-time-to"
                />
              </div>
            </div>
            <div class="add-event-footer">
              <button class="add-event-btn">Add Event</button>
            </div>
          </div>
        </div>
        <button class="add-event" x-data x-on:click="$dispatch('open-new-event-modal')">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    <x-modals.new-event-modal :users="$users" :userEventsExist="$userEventsExist" :userEvents="$userEvents" :dateToday="$dateToday"/>
</div>
