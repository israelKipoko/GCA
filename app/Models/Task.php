<?php

namespace App\Models;

use App\Models\User;
use App\Models\Cases;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'due_date',
        'note',
        'status',
        'created_by',
        'assigned_to',
        'case_id',
    ];

    protected function assignedTo(): Attribute{
        return Attribute::make(
            get: fn($value) => json_decode($value,true),
            set: fn($value) => json_encode($value),
        );
    }
    public function user(){
        return $this->belongsTo(User::class, 'created_by');
    }
    public function cases(){
        return $this->belongsTo(Cases::class, 'case_id');
    }
}
