<div class="pending_cases_wrapper ">
    <button   class="action-button--previous action-button--horizontal-scroll">
        <i id="left" class="fa-solid fa-angle-left"></i>
    </button>
    <ul class="carousel">
        @foreach ($userPendingCases as $case)
            <li class="card ">
                <a href="/home/pending-cases/{{$case->id}}" class="">
                    <div class="update_notice">

                    </div>
                    <div class="image_logo ">
                        <img class="" src="{{asset('images/icons/folder.png')}}" alt="img" draggable="false">
                    </div>
                    <div class="case_deatails">
                        <div class="w-full">
                            <p>{{$case->title}}</p>
                        </div>
                        <span title="date d'échéance" class="text-[14px]">
                            <p class="">{{__("Date d'échéance")}} :</p>
                            @php
                            $dueDate = date("d M Y", strtotime($case->due_date));
                            @endphp
                            {{$dueDate}}
                        </span>
                    </div>
                </a>
            </li>
        @endforeach
    </ul>
    <button class="action-button--next action-button--horizontal-scroll">
        <i id="right" class="fa-solid fa-angle-right "></i>
    </button>
  </div>