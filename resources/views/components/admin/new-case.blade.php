<div
x-data = "{show : false}"
x-show = "show"
x-on:open-create-case.window = "show = true"
x-on:close-create-case.window = "show = false"
x-on:keydown.escape.window = "show = false"
style="display: none;"
x-transition
id="create-case_dialog" class="fixed z-50 inset-0">
<div x-on:click="show = false" class="fixed inset-0 opacity-40"></div>
<section class=" rounded m-auto fixed inset-0 max-w-2xl pb-12 " style="height: fit-content;">
    <form action="/home/cases/create" method="post">
        @csrf
        <div>
            <div class="flex px-4 py-3">
                <div class="flex flex-col gap-y-3">
                    <div >
                        <label for="title" class="">{{__("Titre du dossier")}} :</label>
                        <div class="input_div mt-2">
                            <input
                            id="title"
                            type="text"
                            class="inputTypeTwo focus:outline-none"
                            name="title" 
                            placeholder="{{__('Titre')}}"
                            required/>
                            <i class='bx bxs-folder credentials_icons'></i>
                        </div>
                        @error('name')
                            <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                        @enderror
                      </div>
                      <div>
                        <label for="title" class="">{{__("Description")}} :</label>
                        <div class="input_div mt-2">
                            <textarea name="description" id="description" class="border border-[#8AAEE0] text-[#fff] focus:outline-none" cols="20" rows="7"  placeholder="{{__('Description')}}" required>

                            </textarea>
                        </div>
                        @error('name')
                            <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                        @enderror
                      </div>
                      <div>
                        <label for="title" class="text-center">{{__("Assigné à")}} :</label>
                        <div class="input_div mt-2">
                        <!-- Select -->
                        <!-- Select -->
                        <select name="assigned_to" multiple="" data-hs-select='{
                            "placeholder": "Select option...",
                            "toggleTag": "<button type=\"button\"></button>",
                            "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400",
                            "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
                            "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
                            "mode": "tags",
                            "wrapperClasses": "relative ps-0.5 pe-9 min-h-[46px] flex items-center flex-wrap text-nowrap w-full border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-[#313131] dark:border-[#8AAEE0] dark:text-neutral-400",
                            "tagsItemTemplate": "<div class=\"flex flex-nowrap items-center relative z-10 bg-white border border-gray-200 rounded-full p-1 m-1 dark:bg-neutral-900 dark:border-neutral-700\"><div class=\"size-6 me-1\" data-icon></div><div class=\"whitespace-nowrap text-gray-800 dark:text-neutral-200\" data-title></div><div class=\"inline-flex flex-shrink-0 justify-center items-center size-5 ms-2 rounded-full text-gray-800 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm dark:bg-neutral-700/50 dark:hover:bg-neutral-700 dark:text-neutral-400 cursor-pointer\" data-remove><svg class=\"flex-shrink-0 size-3\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/></svg></div></div>",
                            "tagsInputClasses": "py-3 px-2 rounded-lg order-1 text-sm outline-none dark:bg-[#313131] dark:placeholder-neutral-500 dark:text-neutral-400",
                            "optionTemplate": "<div class=\"flex items-center\"><div class=\"size-8 me-2\" data-icon></div><div><div class=\"text-sm font-semibold text-gray-800 dark:text-neutral-200\" data-title></div><div class=\"text-xs text-gray-500 dark:text-neutral-500\" data-description></div></div><div class=\"ms-auto\"><span class=\"hidden hs-selected:block\"><svg class=\"flex-shrink-0 size-4 text-blue-600\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z\"/></svg></span></div></div>",
                            "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"flex-shrink-0 size-3.5 text-gray-500 dark:text-neutral-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                        }' class="hidden">
                                <option value="">Choose</option>
                                @foreach ($users as $user)
                                    <option value="{{$user->id}}"
                                        data-hs-select-option='{
                                        "icon": "<img class=\"inline-block size-6 rounded-full\" src=\"/storage/{{$user->profiles->avatar}}\" alt=\"\" />"}'>
                                        {{$user->name}}
                                    </option>
                                @endforeach
                            </select>
                            <!-- End Select -->
                            <!-- End Select -->
                        </div>
                        @error('name')
                            <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                        @enderror
                    </div>
                </div>
                <div class="flex flex-col items-center w-full">
                    
                    <div>
                        <label for="title" class="">{{__("Client")}} :</label>
                        <div class="input_div mt-2">
                           <!-- Select -->
                            <select name="client" data-hs-select='{
                                {{-- "hasSearch": true, --}}
                                "placeholder": "Select assignee",
                                "toggleTag": "<button type=\"button\"><span class=\"me-2\" data-icon></span><span class=\"text-gray-800 dark:text-neutral-200\" data-title></span></button>",
                                "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 px-4 pe-9 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1] dark:bg-[#313131] dark:border-[#8AAEE0] dark:text-neutral-400",
                                "dropdownClasses": "mt-2 max-h-72 p-1 space-y-0.5 z-20 w-full bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
                                "optionClasses": "py-2 px-3 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
                                "optionTemplate": "<div class=\"flex items-center\"><div class=\"me-2\" data-icon></div><div><div class=\"hs-selected:font-semibold text-sm text-gray-800 dark:text-neutral-200\" data-title></div></div><div class=\"ms-auto\"><span class=\"hidden hs-selected:block\"><svg class=\"flex-shrink-0 size-4 text-blue-600\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z\"/></svg></span></div></div>",
                                "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"flex-shrink-0 size-3.5 text-gray-500 dark:text-neutral-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                            }' class="hidden">
                                <option value="">Choose</option>
                                @foreach ($clients as $client)
                                    <option value="{{$client->id}}"
                                        data-hs-select-option='{
                                        "icon": "<img class=\"inline-block size-6 rounded-full\" src=\"{{$client->getFirstMediaUrl("client-logo")}}\" alt=\"\" />"}'>
                                        {{$client->name}}
                                    </option>
                                @endforeach
                            </select>
                            <!-- End Select -->
                        </div>
                        @error('name')
                            <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                        @enderror
                    </div>
                    <div class="mt-3 input_div">
                        <label for="due_date">Due date :</label>
                        <input type="date" class="inputTypeTwo focus:outline-none" name="due_date" id="due_date">
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="w-fit mx-auto mt-4">
            <button class="create_button">{{__("Enregistrer")}}</button>
          </div>
    </form>
</section>
</div>