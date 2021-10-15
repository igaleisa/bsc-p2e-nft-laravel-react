<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $casts = [
        'attributes' => 'array'
    ];

    protected $fillable = [
        'tokenId',
        'assigned',
        'equipped',
        'category_id' ,
        'rarity_id',
        'name', 
        'description', 
        'image', 
        'attributes',
        'v360',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'pivot',
        'category_id',
        'rarity_id',
    ];
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function rarity()
    {
        return $this->belongsTo(Rarity::class);
    }

    protected $with = ['category', 'rarity'];

    public function users() 
    {
        return $this->belongsToMany(User::class, 'inventories', 'equipment_id', 'user_id');
    }
}
