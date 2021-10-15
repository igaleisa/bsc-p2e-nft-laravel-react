<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'token_id',
    ];

    protected $hidden = [     
        'created_at',
        'updated_at',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'inventories', 'user_id', 'token_id');
    }

    public function equipment() {
        return $this->belongsTo(User::class, 'inventories', 'user_id', 'token_id');
    }
}
