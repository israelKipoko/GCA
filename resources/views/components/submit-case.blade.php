@props(['case'])
<dialog id="submit_case_wrapper" class="py-4 px-12 rounded-[4px]">
    <section>
        <form action="/pending-cases/{{$case->id}}/submit-case" method="POST">
            @csrf
            <div>
                <h1 class="font-bold text-[#ffffffcc] mb-1">{{__('Êtes-vous sûr de vouloir soumettre le dossier')}}?</h1>
            </div>
            <div class="w-fit mx-auto mt-4 flex gap-x-9">
                <button type="button" class="cancel">{{__('Annuler')}}</button>
                <button class="bg-red-600 text-white">{{__('Soumettre')}}</button>
            </div>
        </form>
    </section>
</dialog>