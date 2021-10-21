<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'referral_code',
        'referrer_id',
        'tfa',
        'tfa_code',
        'tfa_code_created_at',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'referral_code',
        'status',
        'referrer_id',
        'pivot',
        'email_verified_at',
        'tfa_code',
        'tfa_code_created_at',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier() {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims() {
        return [];
    }    

    public function isAdmin() {
        return $this->role === 'admin';
    }
 
    public function isUser() {
        return $this->role === 'user';
    }

    public function hasRole($role) {
        return $this->role == $role? true : false;
    }

    // public function tokens() {
    //     return $this->belongsToMany(Token::class, 'inventories', 'user_id', 'equipment_id');
    // }

    public function referral() {
        return $this->belongsTo(User::class, 'referrer_id', 'id');
    }

    public function referrals() {
        return $this->hasMany(User::class, 'referrer_id', 'id');
    }

    protected $appends = ['referral_link', 'emailVerificationRequired'];

    public function getReferralLinkAttribute()
    {
        // return $this->referral_link = route('register', ['ref' => $this->referral_code]);
        return $this->referral_link = $this->referral_code;
    }  
    
    public function getEmailVerificationRequiredAttribute()
    {
        // return $this->referral_link = route('register', ['ref' => $this->referral_code]);
        return $this->emailVerificationRequired = $this->email_verified_at ? false : true;
    }  

    public function wallets() {
        return $this->belongsToMany(Wallet::class, 'user_wallets', 'user_id', 'wallet_id');
    }
}
