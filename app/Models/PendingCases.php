<?php

namespace App\Models;

use App\Models\User;
use App\Models\Cases;
use App\Models\Profiles;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class PendingCases extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'case_number',
        'user_id',
        'comments',
        'action',
    ];

    public function registerMediaConversions(Media $media = null): void{
        $this->addMediaConversion('thumb')
            ->fit(Fit::Contain, 80, 90)
            ->withResponsiveImages()
            ->Queued();
    }
    public function cases(){
        return $this->hasOne(Cases::class);
    }
    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }
}
