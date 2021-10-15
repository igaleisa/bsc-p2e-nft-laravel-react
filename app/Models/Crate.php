<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crate extends Model
{
    use HasFactory;

    protected $fillable = [
        'crate_id',
        'name',
        'faction_id',
        'level',
        'quantity',
        'price',
        'v360',
        'is_deleted',
    ];

    protected $hidden = [
        'is_deleted',
        'faction_id',
        'created_at',
        'updated_at',
    ];


    public function faction()
    {
        return $this->belongsTo(Faction::class);
    }

    public function rarities()
    {
        return $this->belongsToMany(Rarity::class, 'crate_rarities', 'crate_id', 'rarity_id');
    }

    protected $with = ['faction', 'rarities'];
}
