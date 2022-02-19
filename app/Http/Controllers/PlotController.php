<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Validator;

class PlotController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $preset = Preset::where('is_deleted', false)->get();

        $plots = $preset->filter(function ($item) {
            return $item->tokentype->name == 'Zone';
        })->values();

        return response()->json([
            'success' => true,
            'plots' => $plots
        ], 200);
    }    

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Preset  $preset
     * @return \Illuminate\Http\Response
     */
    public function show($plotId)
    {
        $plot = Preset::where('is_deleted', false)->where('id', $plotId)->first();

        return response()->json([
            'success' => true,
            'plot' => $plot,
        ], 200);
    }
}
