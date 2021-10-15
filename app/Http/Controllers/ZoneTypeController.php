<?php

namespace App\Http\Controllers;

use App\Models\ZoneType;
use Illuminate\Http\Request;

class ZoneTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $zoneTypes = ZoneType::all();
        return response()->json([
            'success' => true,
            'zoneTypes' => $zoneTypes
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
     * @param  \App\Models\ZoneType  $zoneType
     * @return \Illuminate\Http\Response
     */
    public function show(ZoneType $zoneType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ZoneType  $zoneType
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ZoneType $zoneType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ZoneType  $zoneType
     * @return \Illuminate\Http\Response
     */
    public function destroy(ZoneType $zoneType)
    {
        //
    }
}
