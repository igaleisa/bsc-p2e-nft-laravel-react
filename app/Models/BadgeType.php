<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BadgeType extends Model
{
    use HasFactory;

    protected $hidden = [
        'description',
        'created_at',
        'updated_at',
    ];
}
