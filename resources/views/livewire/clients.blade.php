<div class="w-full">
    @if (!$showDetails)
        <div class="flex w-full justify-between">
            <div class="search_input_div text-[#fff]">
                <input wire:model.live="search" type="search" class="bg-[#313131]" name="client-search" placeholder="Search...">
                <i class='bx bx-search bx-xs'></i>
            </div>
            <div>
                <button type="button" x-data x-on:click="$dispatch('open-create-client')" class="create_button">+{{__('Ajouter')}}</button>
            </div>
        </div>
        <div class="mt-6 px-2">
            <div class="grid grid-cols-4 gap-y-9 justify-items-center">
                @foreach ($clients as $client)
                    <div class="client_wrapper" x-data x-on:click="$dispatch('open-client-details',{client : {{$client->id}}})" >
                        <div class="client_logo_wrapper">
                            @if ($client->hasMedia('client-logo'))
                                <div class=" h-[100px] rounded-t-[4px]">
                                    <img class="w-full h-full object-fit-cover rounded-t-[4px]" src="{{$client->getFirstMediaUrl("client-logo")}}" alt="image">
                                </div>
                            @else
                                <div class="bg-white h-full flex items-center justify-center rounded-t-[4px]">
                                    <i class="fa-solid fa-users fav-2xl  text-gray-400" style="font-size: 80px;"></i>
                                </div>
                            @endif
                        </div>
                        <div  class="bg-[#356B8C] h-[100px] py-1 px-2 rounded-b-[4px]">
                            <div class="flex flex-col gap-y-1 h-full">
                                <h1>{{$client->name}}</h1>
                                <h1 class="text-[14px] capitalize">{{$client->sector}}</h1>
                                <span class="text-center text-white text-[15px]">
                                    @php
                                      setlocale(LC_TIME, 'fr_FR.utf8');
                                     $date = strftime('%d %B %Y',  $client->created_at->getTimestamp());
                                    @endphp
                                  {{$date}}
                                </span>
                                {{-- <p class="text-[#313131] font-bold text-center mt-auto h-fit">cas traité</p> --}}
                            </div>
                        </div>
                    </div>
                @endforeach
            <div>
        </div>
        <x-admin.create-client/>
    @else
        <div class="mt-4 px-2">
            <div class="w-fit ml-auto">
                <button type="button"  x-data x-on:click="$dispatch('close-client-details')" class="text-blue-600">
                    <i class='bx bx-x-circle bx-md'></i>
                </button>
            </div>
            <section class="flex justify-between gap-y-6  ">
                <div class=" client_detials flex flex-col gap-y-4">
                    <div class="flex items-center gap-x-4">
                        <div class="w-[50px] h-[50px] rounded-full">
                            @if ($clickedClient[0]->hasMedia('client-logo'))
                                <img class="w-full h-full object-fit-cover rounded-full" src="{{$clickedClient[0]->getFirstMediaUrl("client-logo")}}" alt="image">
                            @else
                                <div class="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
                                    <i class="fa-solid fa-users text-gray-400" style="font-size: 20px;"></i>
                                </div>
                            @endif
                        </div>
                        <div>
                            <h1>{{$clickedClient[0]->name}}</h1>
                            <p class="text-14px opacity-[0.75] capitalize pl-1 -mt-2">{{$clickedClient[0]->sector}}</p>
                        </div>
                    </div>
                    @if ($clickedClient[0]->location != null)
                        <div class="flex gap-x-4">
                            <h1>{{__("Adresse")}} :</h1>
                            <div class="flex text-white font-bold">
                                <p>{{$clickedClient[0]->location['city']? $clickedClient[0]->location['city']." /": ""}}</p> 
                                <p>{{$clickedClient[0]->location['district']? $clickedClient[0]->location['district'] : ""}}</p> 
                            </div>
                        </div>
                    @endif
                    
                    @if ($clickedClient[0]->contacts != null)
                        <div class="flex gap-x-4">
                            <h1>{{__("Contacts")}} :</h1>
                            <div class="flex">
                                <p>{{$clickedClient[0]->contacts['phone']? $clickedClient[0]->contacts['phone']." /": ""}}</p> 
                                <p>{{$clickedClient[0]->contacts['email']? $clickedClient[0]->contacts['email']: ""}}</p> 
                            </div>
                        </div>
                    @endif
                    <div class="flex gap-x-1">
                        <h1>{{__("Créé depuis")}} :</h1>
                        <span class="text-white text-[15px]">
                            @php
                              setlocale(LC_TIME, 'fr_FR.utf8');
                             $date = strftime('%d %B %Y',  $clickedClient[0]->created_at->getTimestamp());
                            @endphp
                          {{$date}}
                        </span>
                    </div>
                </div>
                <div class="w-[520px] min-h-[530px] overflow-scroll px-1">
                    <div class=" client_detials">
                        <h1 class="mb-2">{{__("Dossiers")}} :</h1>
                        @if ($clickedClient[0]->cases_count != 0 )
                        <div class="flex flex-col gap-y-4">
                            @foreach ($clickedClient[0]->cases as $case)
                            <div class="bg-gray-600 rounded-[8px]">
                                <div class="flex items-center">
                                    <div class="w-[50px] w-[50px]">
                                        <img class="w-full h-full object-fit-cover" src="{{asset('images/icons/folder.png')}}" alt="img" draggable="false">
                                    </div>
                                    <div class="flex gap-x-1">
                                        <a href="/home/pending-cases/{{$case->id}}" class="text-[15px]" style="line-height: 1rem;">{{$case->title}}</a>
                                        <i class='bx bx-link-external text-white bx-xs cursor-pointer'></i>
                                    </div>
                                </div>
                                <div>
                                    <p class="pl-9 -mt-1">{{$case->description}}</p>
                                </div>
                                <div class="w-fit ml-auto">
                                    <div class="flex gap-x-2 assigned_to_profile pl-4 mt-3 p-2">
                                        @foreach ($assigned_to[$case->id] as $user)
                                            <div class="user_picture element_tooltip_container w-[35px] h-[35px]">
                                                <img src="{{asset('storage/'.$user->profiles->avatar)}}" alt="user-profile">
                                                <div class="tooltip flex w-[100px] text-center">{{$user->firstname." ". $user->name}}</div>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>
                        @else
                            <h1 class="text-center">{{"Aucun dossier!!"}}</h1>
                        @endif
                    </div>
                </div>
            </section>
           
        </div>
    @endif
</div>

@push('js')
    <script>
         const logoInput = document.querySelector('.client_create_form #logo');


         const pondOne = FilePond.create(logoInput);
         FilePond.registerPlugin(FilePondPluginFileValidateType);

            FilePond.setOptions({
                acceptedFileTypes: ['image/*'],
                fileValidateTypeDetectType: (source, type) =>
                    new Promise((resolve, reject) => {
                        // Do custom type detection here and return with promise

                        resolve(type);
                    }),
                server: {
                    process: `/home/client/upload-logo`,
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    revert: `/home/client/delete-logo`,
                    onerror: (response) => {
                        console.log(response.data);
                        return response.error;
                    },
                },
            });
    </script>
@endpush
