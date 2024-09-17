<dialog id="upload_update_dialog" class="py-4 px-12 rounded-[4px]">
    <section class=" rounded-[4px]" id="upload_files">
        <button id="go_back">{{__("Retour")}}</button>
        <form action="/home/pending-cases/{{$case->id}}/update-case/file" method="POST" enctype="multipart/form-data" class="mt-9">
            @csrf
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
                <label for="comments" class="font-bold text-[#ffffffcc] mb-1">{{__("Commentaire")}} :</label>
                <textarea name="comments" id="comments" cols="30" rows="8" class="rounded-[8px] p-4 bg-[#eee]">
        
                </textarea>
            </div>
            <div class="w-fit ml-auto mt-9">
                <button class="bg-red-600 ">{{__("Soumettre")}}</button>
                <button type="button" class="cancel">{{__("Annuler")}}</button>
            </div>
        </form>
    </section>
</dialog>

@push('js')
    <script>
        const fileInput = document.querySelector('#upload_update_dialog #file');
        const modal = document.querySelector('#upload_update_dialog');
        const goBackButtons = document.querySelectorAll('#go_back');

        /* GO BACK BUTTONS */
        goBackButtons.forEach((button) => {
            button.addEventListener('click', ()=>{
                modal.close();
            }); 
        });
        /* GO BACK BUTTONS */

       
        const pond = FilePond.create(fileInput);
        FilePond.setOptions({
            server: {
                process: `/home/pending-cases/${@json($case->id)}/upload-file`,
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                revert: `/home/pending-cases/${@json($case->id)}/delete-file`,
                onerror: (response) => {
                    console.log(response.data);
                    return response.error;
                },
            },
        });

    </script>
@endpush        
