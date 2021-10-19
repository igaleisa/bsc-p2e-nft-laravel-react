<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\TestMailController;
use App\Http\Controllers\VerificationController;
use App\Mail\ForgotEmail;


// use App\Mail\FunnyEmail;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/metadata/{id}', [TokenController::class, 'getMetadata'])->name('metadata');

// Route::get('/funny', [TestMailController::class, 'sendTestMail'])->name('testmail');

// Route::get('/testmail', function() {
//     return new ForgotEmail([
//         'name' => 'Artem',
//         'url' => 'http://portal.umbrellaproject.localhost/reset?token=123123123123123'
//     ]);
// });

Route::get('email/verify/{id}', [VerificationController::class, 'verify'])->name('verification.verify'); // Make sure to keep this as your route name

Route::view('/{any}', 'index')->where('any', '.*');

