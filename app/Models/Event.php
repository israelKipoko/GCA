<?php

namespace App\Models;

use App\Models\User;
use App\Models\Cases;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'time',
        'note',
        'reminder',
        'case_id',
        'created_by',
        'participants',
        'meeting_link',
        'group_participants'
    ];

    protected function participants(): Attribute{
        return Attribute::make(
            get: fn($value) => json_decode($value,true),
            set: fn($value) => json_encode($value),
        );
    }
    protected function time(): Attribute{
        return Attribute::make(
            get: fn($value) => json_decode($value,true),
            set: fn($value) => json_encode($value),
        );
    }
    protected function reminder(): Attribute{
        return Attribute::make(
            get: fn($value) => json_decode($value,true),
            set: fn($value) => json_encode($value),
        );
    }
    protected function groupParticipants(): Attribute{
        return Attribute::make(
            get: fn($value) => json_decode($value,true),
            set: fn($value) => json_encode($value),
        );
    }

    public function cases(){
        return $this->belongsTo(Cases::class, 'case_id');
    }
    public function user(){
        return $this->belongsTo(User::class, 'created_by');
    }
}
