<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'address',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'pivot',
    ];
}
