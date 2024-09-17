<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profiles extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'location',
        'avatar',
        'ongoing_task',
        'finished_task',
        'events',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
