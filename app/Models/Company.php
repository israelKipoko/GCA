<?php

namespace App\Models;

use App\Models\News;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'subscribtion',
        'is_active',
        'activated_at'
    ];

    public function news(){
        return $this->hasMany(News::class);
    }
}
