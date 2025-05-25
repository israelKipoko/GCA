<?php

namespace App\Models;

use App\Models\User;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Library extends Model implements HasMedia
{
    use HasFactory,InteractsWithMedia;

    protected $fillable = [
        'category_name',
        'creators',
        'created_by',
    ];

    public function registerMediaConversions(Media $media = null): void{
        $this->addMediaConversion('thumb')
            ->fit(Fit::Contain, 300, 300)
            ->nonQueued();  // This processes the conversion synchronously
    }

    protected function creators(): Attribute{
        return Attribute::make(
            get: fn($value) => json_decode($value,true),
            set: fn($value) => json_encode($value),
        );
    }

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
