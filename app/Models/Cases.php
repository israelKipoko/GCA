<?php

namespace App\Models;

use App\Models\User;
use App\Models\Client;
use App\Models\PendingCases;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Image\Enums\Fit;

class Cases extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;
    
    protected $fillable = [
        'title',
        'description',
        'assigned_to',
        'client_id',
        'due_date',
        'priority',
        'created_by',
        'status',
        'type',
        'sample',
    ];
    public function registerMediaConversions(Media $media = null): void{
        $this->addMediaConversion('thumb')
            ->fit(Fit::Contain, 300, 300)
            ->nonQueued();  // This processes the conversion synchronously
    }
    protected function assignedTo(): Attribute{
        return Attribute::make(
            get: fn($value) => json_decode($value,true),
            set: fn($value) => json_encode($value),
        );
    }

    public function client(){
        return $this->belongsTo(Client::class);
    }
    public function user(){
        return $this->belongsTo(User::class, 'created_by');
    }
    public function pendingcases(){
        return $this->hasMany(PendingCases::class);
    }
}
