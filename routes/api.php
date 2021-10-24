<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CrateController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RarityController;
use App\Http\Controllers\MintController;
use App\Http\Controllers\LoginHistoryController;
use App\Http\Controllers\TokenTypeController;
use App\Http\Controllers\BadgeTypeController;
use App\Http\Controllers\ZoneTypeController;
use App\Http\Controllers\PresetController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\ForgotPasswordController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/tfa', [AuthController::class, 'loginTFA'])->name('login.tfa');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::apiResource('rarities', RarityController::class)->only(['index']);
Route::apiResource('categories', CategoryController::class)->only(['index']);
Route::apiResource('tokentypes', TokenTypeController::class)->only(['index']);
Route::apiResource('badgetypes', BadgeTypeController::class)->only(['index']);
Route::apiResource('zonetypes', ZoneTypeController::class)->only(['index']);

Route::post('/forgot', [ForgotPasswordController::class, 'submitForgetPasswordForm'])->name('forget.password'); 
Route::post('/reset-password', [ForgotPasswordController::class, 'submitResetPasswordForm'])->name('reset.password');


Route::group([
    'middleware' => ['jwt.verify', 'role:user'],
    'prefix' => 'user',  
], function() {
    Route::apiResource('lootbox', Cratecontroller::class)->only([
        'index', 'show'
    ]);
    Route::post('/lootbox/buy', [CrateController::class, 'buy'])->name('lootbox.buy');
    Route::post('/wallet/nonce', [WalletController::class, 'getNonce'])->name('wallet.nonce');
    Route::post('/wallet/auth', [WalletController::class, 'getAuth'])->name('wallet.auth');
    Route::post('/wallet/connect', [WalletController::class, 'connect'])->name('wallet.connect');
    Route::post('/category/name', [CategoryController::class, 'getName'])->name('category.name');
    Route::post('/token/list', [TokenController::class, 'getList'])->name('token.list');
    Route::post('/account/profile', [AuthController::class, 'getUserInfo'])->name('account.profile');
    Route::get('/crates/{crate}', [CrateController::class, 'show'])->name('crate.info');
    Route::post('/payment/crate', [PaymentController::class, 'registerCrate'])->name('payment.crate');
    Route::get('/email/resend', [VerificationController::class, 'resend'])->name('verification.resend');
    Route::post('/account/tfa', [AuthController::class, 'update2FA'])->name('account.tfa');
    Route::post('/crates/buy', [TokenController::class, 'getCratePreset'])->name('crates.buy');    
});

Route::group([
    'middleware' => ['jwt.verify', 'role:admin'],
    'prefix' => 'admin',    
], function() {
    Route::apiResource('crates', Cratecontroller::class);
    Route::apiResource('token', TokenController::class)->only(['index', 'update', 'delete']);
    Route::apiResource('users', UserController::class);    
    Route::apiResource('preset', PresetController::class);   
    Route::post('/token/assign', [TokenController::class, 'assignTokenList'])->name('token.assign');
    Route::post('/mint', [MintController::class, 'mint'])->name('mint');    
    Route::get('/usercount', [UserController::class, 'count'])->name('user.count');
    Route::get('/cratecount', [CrateController::class, 'count'])->name('crate.count');
    Route::get('/objectcount', [TokenController::class, 'count'])->name('token.count');
    Route::get('/logincount', [LoginHistoryController::class, 'count'])->name('login.count');
});

Route::group([
    'middleware' => ['jwt.verify', 'role:admin,user'],
    'prefix' => 'share',    
], function() {
    Route::get('/token/{id}', [TokenController::class, 'getTokenInfo'])->name('token.info');
    Route::post('/token/register', [TokenController::class, 'registerList'])->name('token.register');
});

Route::any('{any}', function(){
    return response()->json([
    	'status' => 'error',
        'message' => 'Resource not found'], 404);
})->where('any', '.*');;
