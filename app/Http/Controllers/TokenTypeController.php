<?php

namespace App\Http\Controllers;

use App\Models\TokenType;
use Illuminate\Http\Request;

class TokenTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tokenTypes = TokenType::all();
        return response()->json([
            'success' => true,
            'tokenTypes' => $tokenTypes
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TokenType  $tokenType
     * @return \Illuminate\Http\Response
     */
    public function show(TokenType $tokenType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TokenType  $tokenType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TokenType $tokenType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TokenType  $tokenType
     * @return \Illuminate\Http\Response
     */
    public function destroy(TokenType $tokenType)
    {
        //
    }
}
