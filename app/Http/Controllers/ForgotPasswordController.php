<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon; 
use App\Models\User; 
use App\Mail\ForgotEmail;
use Mail;
use Hash;
use DB;
use Validator;

class ForgotPasswordController extends Controller
{
    public function submitForgetPasswordForm(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users',
        ]);

        if($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validated = $validator->validated();

        $token = Str::random(64);

        DB::table('password_resets')->insert([
            'email' => $validated['email'],
            'token' => $token, 
            'created_at' => Carbon::now()
        ]);

        $user = User::where('email', $validated['email'])->firstOrFail();

        if(!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot find out matching user!'
            ]);
        }

        $details = [
            'name' => $user->username,
            'url' => env('APP_URL', 'https://portal.umbrellaproject.cc') . '/reset?token=' . $token
        ];

        Mail::to($validated['email'])->send(new ForgotEmail($details));

        // return back()->with('message', 'We have e-mailed your password reset link!');

        return response()->json([
            'success' => true,
            'message' => 'We have e-mailed your password reset link!'
        ]);
    }
}
