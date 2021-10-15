<?php

namespace App\Http\Controllers;

use App\Models\BadgeType;
use Illuminate\Http\Request;

class BadgeTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $badgeTypes = BadgeType::all();
        return response()->json([
            'success' => true,
            'badgeTypes' => $badgeTypes
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
     * @param  \App\Models\BadgeType  $badgeType
     * @return \Illuminate\Http\Response
     */
    public function show(BadgeType $badgeType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\BadgeType  $badgeType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BadgeType $badgeType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\BadgeType  $badgeType
     * @return \Illuminate\Http\Response
     */
    public function destroy(BadgeType $badgeType)
    {
        //
    }
}
