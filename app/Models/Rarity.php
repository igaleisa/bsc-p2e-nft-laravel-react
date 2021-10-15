<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rarity extends Model
{
    use HasFactory;

    protected $fillable = [
        'class',
        'name',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'pivot',
    ];
}
