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

        // Mail::to($validated['email'])->send(new ForgotEmail($details));

        return response()->json([
            'success' => true,
            'message' => 'We have e-mailed your password reset link!'
        ]);
    }

    /**
       * Write code on Method
       *
       * @return response()
       */
    public function submitResetPasswordForm(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string|min:1',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validated = $validator->validated();
  
        $updatePassword = DB::table('password_resets')->where([
            'token' => $validated['token'],
        ])->first();
  
        if(!$updatePassword){
            return response()->json([
                'success' => false,
                'message' => 'Invalid token!'
            ]);
        }
        
        $email = $updatePassword->email;
        $user = User::where('email', $email)
                    ->update(['password' => Hash::make($validated['password'])]);
 
        DB::table('password_resets')->where(['email'=> $email])->delete();
  
        return response()->json([
            'success' => true,
            'message' => 'Your password has been changed!'
        ]);
      }
}
