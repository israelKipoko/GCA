@props(['case'])
<div>

    {{-- <div>
        <h1 class="font-bold text-[#ffffffcc] mb-1">Mettre à jour</h1>
        <p>Description</p>
    </div> --}}
    <div>
        <label for="file" class="font-bold text-[#ffffffcc] mb-1">{{__("Document")}} :</label>
        <input  type="file" id="file" multiple name="file" required/>
        {{-- <p class="mb-3 text-red-600 capitalize"></p> --}}
    </div>
    <div class="flex flex-col">
        <label for="comment" class="font-bold text-[#ffffffcc] mb-1">{{__("Commentaire")}} :</label>
        <textarea name="comment" id="comment" cols="30" rows="8" class="rounded-[8px] p-4 bg-[#eee]">

        </textarea>
    </div>
    <div class="w-fit ml-auto mt-9">
        <button class="bg-red-600 ">{{__("Soumettre")}}</button>
        <button type="button" class="cancel">{{__("Annuler")}}</button>
    </div>
</div>
