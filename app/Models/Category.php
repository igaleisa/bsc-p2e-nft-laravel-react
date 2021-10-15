<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $hidden = [
        'faction_id',
        'created_at',
        'updated_at',
    ];

    protected $with = ['faction'];

    public function faction() {
        return $this->belongsTo(Faction::class);
    }
}
