<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\FunnyEmail;
use Mail;

class TestMailController extends Controller
{
    public function sendTestMail() {
        Mail::to('maxim.gregory1@gmail.com')->send(new FunnyEmail());
    }
}
