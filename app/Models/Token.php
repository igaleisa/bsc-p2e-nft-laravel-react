<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    protected $fillable = [
        'token_id',
        'preset_id',
        'owner',
        'state_id', 
        'health', 
        'price',
        'is_sale'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    // public function users() 
    // {
    //     return $this->belongsToMany(User::class, 'inventories', 'token_id', 'user_id');
    // }

    public function preset()
    {
        return $this->belongsTo(Preset::class);
    }

    public function state()
    {
        return $this->belongsTo(TokenState::class);
    }

    protected $with = [
        'preset',
        'state',
    ];
}
