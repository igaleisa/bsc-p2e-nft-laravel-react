<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Wallet;
use App\Models\UserWallet;
use Validator;
use Illuminate\Support\Str;
use Elliptic\EC;
use kornrunner\Keccak;

class WalletController extends Controller
{
    private function pubKeyToAddress($pubkey) {
        return "0x" . substr(Keccak::hash(substr(hex2bin($pubkey->encode("hex")), 1), 256), 24);
    }
    
    private function verifySignature($message, $signature, $address) {
        $msglen = strlen($message);
        $hash   = Keccak::hash("\x19Ethereum Signed Message:\n{$msglen}{$message}", 256);
        $sign   = ["r" => substr($signature, 2, 64), 
                   "s" => substr($signature, 66, 64)];
        $recid  = ord(hex2bin(substr($signature, 130, 2))) - 27; 
        if ($recid != ($recid & 1)) 
            return false;
    
        $ec = new EC('secp256k1');
        $pubkey = $ec->recoverPubKey($hash, $sign, $recid);
    
        return $address == $this->pubKeyToAddress($pubkey);
    }

    public function getNonce(Request $request) {
        $validator = Validator::make($request->all(), [
            'address' => 'required|string|between:2,255',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();
        $wallet = Wallet::firstOrCreate([
            'address' => $validated['address']
        ]);

        if(UserWallet::where('wallet_id', $wallet->id)->where('user_id', '!=', auth()->user()->id)->count() > 0) {
            return response()->json([
                'success' => false,
                'error' => 'The wallet address was registered by other user.',
                'wallet' => $wallet
            ], 201);
        }

        if(UserWallet::where('user_id', auth()->user()->id)->where('wallet_id', '!=', $wallet->id)->count() > 0) {
            return response()->json([
                'success' => false,
                'error' => 'You must use registered wallet address instead of current one.',
                'wallet' => $wallet
            ], 201);
        }

        $user_wallet = UserWallet::where('user_id', auth()->user()->id)->where('wallet_id', $wallet->id)->first();
        if(!$user_wallet) {
            $user_wallet = UserWallet::create([
                'user_id' => auth()->user()->id,
                'wallet_id' => $wallet->id,
                'nonce' => Str::uuid(),
            ]);
        }

        return response()->json([
            'success' => true,
            'nonce' => $user_wallet->nonce
        ], 201);
    }

    public function getAuth(Request $request) {
        $validator = Validator::make($request->all(), [
            'address' => 'required|string|between:2,255',
            'signature' => 'required|string|between:2,255',
        ]);

        if($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $wallet = Wallet::where('address', $validated['address'])->first();
        if(!$wallet) {
            return response()->json([
                'success' => false,
                'error' => 'The address was not registered.'
            ], 201);
        }

        $user_wallet = UserWallet::where('user_id', auth()->user()->id)->where('wallet_id', $wallet->id)->first();
        if(!$user_wallet) {
            return response()->json([
                'success' => false,
                'error' => 'The address was not registered.'
            ], 201);
        }

        $authMsg = 'Nonce: ' . $user_wallet->nonce;

        if ($this->verifySignature($authMsg, $validated['signature'], $validated['address'])) {
            $user_wallet->update([
                'nonce' => Str::uuid(),
            ]);
            return response()->json([
                'success' => true,
                'status' => true,
                'account' => $wallet->address,
            ], 201);
        } else {
            return response()->json([
                'success' => false,
                'error' => 'Signature validation was failed.'
            ], 201);
        }        
    }

    public function connect(Request $request) {
        $validator = Validator::make($request->all(), [
            'wallet' => 'required|string|between:2,255',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $wallet = Wallet::firstOrCreate([
            'address' => $validated['wallet']
        ]);

        $user_wallets = UserWallet::where('wallet_id', $wallet->id)->where('user_id', '!=', auth()->user()->id)->get();
        if(count($user_wallets)) {
            return response()->json([
                'success' => false,
                'message' => 'Wallet was registered by other user',
                'wallet' => $wallet
            ], 201);
        }

        // Set active flag to false for all of previous user wallet
        UserWallet::where('user_id', auth()->user()->id)->where('wallet_id', '!=', $wallet->id)->update([
            'active' => false
        ]);

        // Set active flag to true for current user wallet
        $user_wallet = UserWallet::where('user_id', auth()->user()->id)->where('wallet_id', $wallet->id)->first();
        if(is_null($user_wallet)) {
            $user_wallet = UserWallet::create([
                'user_id' => auth()->user()->id,
                'wallet_id' => $wallet->id,
                'active' => true
            ]);
        } else {
            $user_wallet->update([
                'active' => true
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Wallet successfully has been connected',
            'wallet' => $wallet
        ], 201);
    }
}
