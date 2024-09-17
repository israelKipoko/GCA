<div class="image-gallery">
    @foreach($profiles as $profile)
        <img src="{{asset('storage'.$profiles[0]->avatar)}}" alt="Image">
    @endforeach
</div>