<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrateToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'crate_id',
        'token_id',
    ];
}
