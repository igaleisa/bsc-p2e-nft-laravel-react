<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\LoginHistory;
use Illuminate\Support\Str;
use Illuminate\Support\Number;
use Carbon\Carbon; 
use Validator;

use App\Mail\TfaEmail;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct() {
        // $this->middleware('jwt.verify')->except('login');
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
    	$validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $credentials = request(['email', 'password']);

        if(!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if(auth()->user()->status == 'banned') {
            auth()->logout();
            return response()->json(['error' => 'The account was banned'], 401);
        }

        if(auth()->user()->tfa) {
            // generate tfa code
            $user = User::where('id', auth()->user()->id)->firstOrFail();
            $code = random_init(1000, 9999);

            $user->update([
                'tfa_code' => $code,
                'tfa_code_created_at' => Carbon::now()
            ]);

            $details = [
                'name' => $user->username,
                'code' => $code,
            ];
    
            Mail::to($user->email)->send(new TfaEmail($details));

            return response()->json([
                'success' => true,
                'tfa' => true,
                'message' => '2FA code was sent to your email address'
            ]);            
        }

        $ipAddr = $request->ip();
        $macAddr = explode(" ", exec('getmac'))[0];
        $browserInfo = $request->header('User-Agent');

        // Save login history
        $loginHistory = LoginHistory::create([
            'user_id' => auth()->user()->id,
            'ip_address' => $ipAddr,
            'mac_address' => $macAddr,
            'browser' => $browserInfo,
        ]);

        return $this->createNewToken($token);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function loginTFA(Request $request){
    	$validator = Validator::make($request->all(), [
            'code' => 'required|string|min:4',
        ]);

        if($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $tfa_code = $request['code'];
        $user = User::where('tfa_code', $tfa_code)->first();

        if(is_null($user)) {
            return response()->json(['error' => 'Invalid 2FA code'], 401);
        }

        if($user->tfa_code != $tfa_code) {
            return response()->json(['error' => 'Invalid 2FA code'], 401);
        }

        $token = auth()->login($user);

        $ipAddr = $request->ip();
        $macAddr = explode(" ", exec('getmac'))[0];
        $browserInfo = $request->header('User-Agent');

        // Save login history
        $loginHistory = LoginHistory::create([
            'user_id' => $user->id,
            'ip_address' => $ipAddr,
            'mac_address' => $macAddr,
            'browser' => $browserInfo,
        ]);

        return $this->createNewToken($token);
    }

     /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|between:6,30|unique:users',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:6',
            // 'referrer' => 'string|between:6, 100',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $referrer = null;
        if($request['referrer'] != '')
            $referrer = User::where('referral_code', $request['referrer'])->first();

        $user = User::create(array_merge(
                    $validator->validated(),
                    [
                        'password' => bcrypt($request->password),
                        'referrer_id' => $referrer ? $referrer->id : null,
                        'referral_code' => Str::uuid(),
                    ]
                ));

        $user->sendEmailVerificationNotification();

        $credentials = request(['email', 'password']);

        if(!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if(auth()->user()->status == 'banned') {
            auth()->logout();
            return response()->json(['error' => 'The account was banned'], 401);
        }

        // return response()->json([
        //     'success' => true,
        //     'message' => 'User successfully registered',
        //     'user' => $user
        // ], 201);

        return $this->createNewToken($token);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth()->logout();

        return response()->json([
            'success' => true,
            'message' => 'User successfully signed out'
        ]);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserInfo() {
        return response()->json([
            'success' => true,
            'user' => auth()->user()
        ]);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token){
        return response()->json([
            'success' => true,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user() 
        ]);
    }

    /**
     * Update 2fa flag.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update2FA() {
        $user = User::where('id', auth()->user()->id)->firstOrFail();

        if(!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user!'
            ]);
        }        

        $tfa_val = $user->tfa;
        
        $user->update([
            'tfa' => $tfa_val ? 0 : 1
        ]);

        return response()->json([
            'success' => true,
            'tfa' => $user->tfa,
            'message' => $user->tfa ? '2FA is enabled!' : '2FA is disabled!'
        ]);
    }
}
