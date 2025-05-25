<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\News;
use App\Models\Cases;
use App\Models\Library;
use App\Models\Profiles;
use Spatie\Image\Enums\Fit;
use App\Models\PendingCases;
use App\Models\TemporaryFile;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'name',
        'lastname',
        'email',
        'phone',
        'password',
        'position',
        'address',
        'events',
        'gender',
        'verification_code',
        'google_refresh_token',
        'google_calendar',
        'microsoft_todo',
        'google_drive',
        'microsoft_calendar',
        'avatar',
    ];
    protected $guard_name = 'web';
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function registerMediaConversions(Media $media = null): void{
        $this->addMediaConversion('thumb')
            ->fit(Fit::Contain, 300, 300)
            ->nonQueued();  // This processes the conversion synchronously
    }

    protected function address(): Attribute{
        return Attribute::make(
            get: fn($value) => json_decode($value,true),
            set: fn($value) => json_encode($value),
        );
    }
    public function profiles(){
        return $this->hasOne(Profiles::class, 'user_id');
    }
    public function cases(){
        return $this->hasMany(Cases::class, 'created_by');
    }
    public function news(){
        return $this->hasMany(News::class,'created_ny');
    }
    public function pendingCases(){
        return $this->hasMany(PendingCases::class,'user_id');
    }
    public function library(){
        return $this->hasMany(Library::class);
    }
    public function temporaryFile(){
        return $this->hasMany(TemporaryFile::class);
    }
}
