<?php

namespace App\Http\Controllers;

use App\Models\Rarity;
use Illuminate\Http\Request;

class RarityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $rarities = Rarity::all();
        return response()->json([
            'success' => true,
            'rarities' => $rarities
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
     * @param  \App\Models\Rarity  $rarity
     * @return \Illuminate\Http\Response
     */
    public function show(Rarity $rarity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Rarity  $rarity
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Rarity $rarity)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Rarity  $rarity
     * @return \Illuminate\Http\Response
     */
    public function destroy(Rarity $rarity)
    {
        //
    }
}
