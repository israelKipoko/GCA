<div
    x-data = "{show : false}"
    x-show = "show"
    x-on:open-create-client.window = "show = true"
    x-on:close-create-client.window = "show = false"
    x-on:keydown.escape.window = "show = false"
    style="display: none;"
    x-transition
    id="create-client_dialog" class="fixed z-50 inset-0">
 {{-- Gray background --}}
 <div x-on:click="show = false" class="fixed inset-0 opacity-40"></div>
  {{-- Modal --}}
  <section class=" rounded m-auto fixed inset-0 max-w-2xl pb-12 overflow-y-auto" style="height: fit-content;">
      <form class="py-2 client_create_form" action="/home/clients/store-new-client" method="POST" enctype="multipart/form-data">
        @csrf
        <button type="button" x-data x-on:click="$dispatch('close-create-client')" class="absolute top-3 right-5 text-white font-bold"><i class='bx bx-x bx-md'></i></button>
        <div>
          <h1>{{__("Enregistrer Un nouveau client")}}</h1>
          <div class="mb-6 px-2  flex flex-col gap-y-4">
            <div class="flex justify-evenly">
              <div >
                <label for="name" class="">{{__("Nom de client")}} :</label>
                <div class="input_div mt-2">
                    <input
                    id="name"
                    type="text"
                    class="inputTypeTwo focus:outline-none"
                    name="name" 
                    maxlength="40"
                    placeholder="{{__('Nom')}}"
                    required/>
                    <i class="fa-solid fa-users credentials_icons"></i>
                </div>
                @error('name')
                    <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                @enderror
              </div>
              <div>
                <label for="name">{{__("Secteur d'activité")}} :</label>
                <div class="input_div mt-2">
                    <input
                    id="sector"
                    type="text"
                    class="inputTypeTwo focus:outline-none"
                    name="sector" 
                    placeholder="{{__("Secteur d'activité")}}"
                    required/>
                    <i class="fa-solid fa-globe credentials_icons"></i>
                </div>
                @error('sector')
                    <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
                @enderror
              </div>
            </div>
            <div>
              <label for="address" class="ml-9 ">{{__("Adresse")}} :</label>
              <div class="flex justify-evenly mt-2">
                  <div class="input_div">
                    <input
                    id="city" 
                    type="text"
                    class="inputTypeTwo focus:outline-none"
                    name="city"
                    placeholder="{{__('Ville')}}"
                    required/>
                    <i class="fa-solid fa-location-dot credentials_icons"></i>
                  </div>
                  <div class="input_div">
                    <input
                    id="district" 
                    type="text"
                    class="inputTypeTwo focus:outline-none"
                    name="district"
                    placeholder="{{__('Commune')}}"
                    required/>
                    <i class="fa-solid fa-location-dot credentials_icons"></i>
                  </div>
              </div>
            </div>
            <div>
              <label for="address" class="ml-9">{{__("Contacts")}} :</label>
              <div class="flex justify-evenly mt-2">
                  <div class="input_div">
                    <input
                    id="phone" 
                    type="tel"
                    class="inputTypeTwo focus:outline-none"
                    name="phone"
                    placeholder="{{__('Téléphone')}}"/>
                    <i class="fa-solid fa-phone credentials_icons"></i>
                  </div>
                  <div class="input_div">
                    <input
                    id="email" 
                    type="email"
                    class="inputTypeTwo focus:outline-none"
                    name="email"
                    placeholder="{{__('Email')}}"/>
                    <i class="fa-solid fa-envelope credentials_icons"></i>
                  </div>
              </div>
            </div>
            <div class="w-[250px] mx-auto">
              <label for="name" class="">{{__("Logo")}} :</label>
              <div class="  mt-2">
                  <input
                  id="logo"
                  type="file"
                  class=" text-[#262626] vfocus:outline-none"
                  name="logo" />
              </div>
              @error('logo')
                  <p class="text-red-500 text-xs ml-1 mt-1">{{$message}}</p>
              @enderror
            </div>
        </div>
        <div class="w-fit mx-auto">
          <button class="create_button">{{__("Enregistrer")}}</button>
        </div>
        </div>
      </form>  
  </section>

</div>