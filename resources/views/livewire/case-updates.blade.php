<div>
   @if (!empty($updates))
        @foreach ($updates as $update)
            <div class="flex flex-col gap-y-2">
                <div class="">
                    <p class="">
                        <span class="capitalize">{{$update['user']['firstname'].' '.$update['user']['name']}}</span>
                        <span>{{__(
                                $update['action']==='submit'?"a soumis le travail":
                                ($update['action']==='add'?"a ajouté le fichier":"a modifié le fichier")
                            )}}.
                        </span>
                        @if($update['action']!='submit')
                            <b class="text-[#356B8C]">
                                @php
                                    
                                        if($update['action']==='update'){
                                            foreach ($updates as $item) {
                                            if($item['id'] == $update["update_file_id"])
                                                echo $item->getFirstMedia($case->number)->name;
                                            }
                                        }else{
                                            echo $update->getFirstMedia($case->number)->name;
                                        }
                                        echo "";
                                @endphp
                        </b>.
                       @endif
                        <div class="text-[14px] w-fit ml-auto opacity-[0.6]">
                            @php
                                setlocale(LC_TIME, 'fr_FR.utf8');
                                $date = strftime('%d %B %Y', $update->created_at->getTimestamp());
                                echo $date;
                            @endphp
                        </div>
                    </p>
                </div>
                @if ($update->comments != null)
                    <div class="w-fit ml-auto">
                        <p class="mr-9 text-[15px]">{{$update->comments}}</p>
                        <div class="w-[25px] ml-auto">
                            <img class="object-cover" src="{{ asset('storage/'.$update['user']['profiles']['avatar'])}}" alt="profile">
                        </div>
                    </div>
                @endif
                <div class="update_separator"></div>
            </div>  
        @endforeach
    @else 
       <h1 class="text-center">{{__('Pas des mises à jour')}}!!</h1>
   @endif
</div>
