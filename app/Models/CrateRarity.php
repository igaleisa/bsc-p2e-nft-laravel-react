<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrateRarity extends Model
{
    use HasFactory;

    protected $fillable = [
        'crate_id',
        'rarity_id',
    ];
}
