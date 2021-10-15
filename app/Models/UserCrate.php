<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCrate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'crate_id',
        'payment_id',
    ];
}
