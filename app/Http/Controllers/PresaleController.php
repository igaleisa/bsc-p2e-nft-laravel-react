<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Crate;
use App\Models\Payment;
use App\Models\UserCrate;
use App\Models\Wallet;
use App\Models\UserWallet;
use Validator;

class PresaleController extends Controller
{
    public function getReferrer() {
        // check there is referrer user(parent)
        $parent = auth()->user()->referral;

        if(is_null($parent)) {
            return response()->json([
                'success' => false,
                'referrer' => NULL
            ], 200);
        }

        if(!count($parent->wallets)) {
            return response()->json([
                'success' => false,
                'referrer' => NULL
            ], 200);
        }

        return response()->json([
            'success' => true,
            'referrer' => $parent->wallets[count($parent->wallets) - 1]
        ], 200);
    }
}
