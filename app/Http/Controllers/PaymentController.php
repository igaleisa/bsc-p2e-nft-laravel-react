<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Crate;
use App\Models\Preset;
use App\Models\Payment;
use App\Models\UserCrate;
use App\Models\Wallet;
use App\Models\UserWallet;
use Validator;

class PaymentController extends Controller
{
    public function registerCrate(Request $request) {
        $validator = Validator::make($request->all(), [
            'crateId' => 'required|integer|gt:0',
            'price' => 'required|numeric|gt:0',
            'unit' => 'required|string|min:1',  
            'wallet' => 'required|string|between:2,255',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $crate = Crate::where('id', $validated['crateId'])->firstOrFail();
        if(!$crate) {
            return response()->json([
                'success' => false,
                'message' => 'Crate ID was not registered',
            ], 401);
        }

        $wallet = Wallet::where('address', $validated['wallet'])->firstOrFail();
        if(!$wallet) {
            return response()->json([
                'success' => false,
                'message' => 'Wallet address was not registered',
            ], 401);
        }
        

        // register payment data
        $payment = Payment::create([
            'user_id' => auth()->user()->id,
            'wallet_id' => $wallet->id,
            'amount' => $validated['price'],
            'unit' => $validated['unit']
        ]);

        // register user crate
        $user_crate = UserCrate::create([
            'user_id' => auth()->user()->id,
            'crate_id' => $crate->id,
            'payment_id' => $payment->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment data successfully has been registered',
        ], 200);
    }

    public function registerPresetPayment(Request $request) {
        $validator = Validator::make($request->all(), [
            'presetId' => 'required|integer|gt:0',
            'price' => 'required|numeric|gt:0',
            'unit' => 'required|string|min:1',  
            'wallet' => 'required|string|between:2,255',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $preset = Preset::where('preset_id', $validated['presetId'])->firstOrFail();
        if(!$preset) {
            return response()->json([
                'success' => false,
                'message' => 'Preset ID was not registered',
            ], 401);
        }

        $wallet = Wallet::where('address', $validated['wallet'])->firstOrFail();
        if(!$wallet) {
            return response()->json([
                'success' => false,
                'message' => 'Wallet address was not registered',
            ], 401);
        }
        

        // register payment data
        $payment = Payment::create([
            'user_id' => auth()->user()->id,
            'wallet_id' => $wallet->id,
            'amount' => $validated['price'],
            'unit' => $validated['unit']
        ]);

        if(!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot create payment record',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment data successfully has been registered',
        ], 200);
    }

}
