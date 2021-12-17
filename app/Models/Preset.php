<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Preset extends Model
{
    use HasFactory;

    protected $fillable = [
        'preset_id',
        'name',
        'tokentype_id',
        'level',
        'faction_id',
        'category_id',
        'rarity_id',
        'badgetype_id',
        'zonetype_id',
        'price',   
        'special',
        'name',
        'description',
        'thumbnail',
        'attributes',
        'v360',
        'is_deleted',
    ];

    protected $hidden = [
        'is_deleted',
        'faction_id',
        'tokentype_id',
        'category_id',
        'rarity_id',
        'badgetype_id',
        'zonetype_id',
        'created_at',
        'updated_at',
    ];

    public function tokentype()
    {
        return $this->belongsTo(TokenType::class);
    }

    public function faction()
    {
        return $this->belongsTo(Faction::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function rarity()
    {
        return $this->belongsTo(Rarity::class);
    }

    public function badgetype()
    {
        return $this->belongsTo(BadgeType::class);
    }

    public function zonetype()
    {
        return $this->belongsTo(ZoneType::class);
    }

    protected $with = [
        'tokentype',
        'faction',
        'category',
        'rarity',
        'badgetype',
        'zonetype',
    ];
}
