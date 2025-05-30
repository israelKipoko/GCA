<?php

namespace App\Models;

use App\Models\Task;
use App\Models\User;
use App\Models\Client;
use Spatie\Image\Enums\Fit;
use App\Models\PendingCases;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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
        'assigned_group'
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
    protected function assignedGroup(): Attribute{
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
    public function task(){
        return $this->hasMany(Task::class,'case_id');
    }
}
