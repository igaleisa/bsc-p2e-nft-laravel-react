<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Validator;

class PresetController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'presets' => Preset::where('is_deleted', false)->get()
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
        $validator = Validator::make($request->all(), [
            'preset_id' => 'required|integer|unique:presets|gte:1',
            'tokenType' => 'required|integer|gte:0',
            'level' => 'required|integer|between:0,100',
            'faction' => 'required|integer|gte:0',
            'category' => 'required|integer|gte:0',
            'rarity' => 'required|integer|gte:0',
            'badgeType' => 'required|integer|gte:0',
            'zoneType' => 'required|integer|gte:0',
            'price' => 'required|numeric|gt:0',
            'name' => 'required|string|between:2,255',
            'description' => 'required|string|between:2,255',
            'thumbnail' => 'required|string|between:2,255',
            // 'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:20480', 
            'attributes' => 'required|string',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        // $imageName = time().'.'.$request->thumbnail->extension();  

        // Upload thumbnail image to S3 Bucket
        // Storage::disk('s3')->put('thumbnails/' . $imageName, file_get_contents($request->thumbnail), 'public');

        $validated = $validator->validated();

        $preset = Preset::create([
            'preset_id' => $validated['preset_id'],
            'special' => $request['special'],
            'tokentype_id' => $validated['tokenType'],
            'level' => $validated['level'],
            'faction_id' => $validated['faction'] ? $validated['faction'] : null,
            'category_id' => $validated['category'] ? $validated['category'] : null,
            'rarity_id' => $validated['rarity'] ? $validated['rarity'] : null,
            'badgetype_id' => $validated['badgeType'] ? $validated['badgeType'] : null,
            'zonetype_id' => $validated['zoneType'] ? $validated['zoneType'] : null,
            'price' => $validated['price'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            // 'thumbnail' => $imageName,
            'thumbnail' => $validated['thumbnail'],
            'attributes' => json_encode(json_decode($validated['attributes'])),
            'v360' => $request['v360'] ? $request['v360'] : null,
        ]);

        return response()->json([
            'success' => true,
            'preset' => $preset,
            'message' => 'Preset successfully has been registered'
        ], 200);
            
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Preset  $preset
     * @return \Illuminate\Http\Response
     */
    public function show(Preset $preset)
    {
        return response()->json([
            'success' => true,
            'preset' => $preset,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Preset  $preset
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Preset $preset)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|gt:0',
            'preset_id' => 'required|integer|gte:1',
            'tokenType' => 'required|integer|gte:0',
            'level' => 'required|integer|between:0,100',
            'faction' => 'required|integer|gte:0',
            'category' => 'required|integer|gte:0',
            'rarity' => 'required|integer|gte:0',
            'badgeType' => 'required|integer|gte:0',
            'zoneType' => 'required|integer|gte:0',
            'price' => 'required|numeric|gt:0',
            'name' => 'required|string|between:2,255',
            'description' => 'required|string|between:2,255',
            'thumbnail' => 'required|string|between:2,255',
            // 'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:20480', 
            'attributes' => 'required|string',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $preset = Preset::where('id', $validated['id'])->firstOrFail();

        $preset->update([
            'preset_id' => $validated['preset_id'],
            'special' => $request['special'],
            'tokentype_id' => $validated['tokenType'],
            'level' => $validated['level'],
            'faction_id' => $validated['faction'] ? $validated['faction'] : null,
            'category_id' => $validated['category'] ? $validated['category'] : null,
            'rarity_id' => $validated['rarity'] ? $validated['rarity'] : null,
            'badgetype_id' => $validated['badgeType'] ? $validated['badgeType'] : null,
            'zonetype_id' => $validated['zoneType'] ? $validated['zoneType'] : null,
            'price' => $validated['price'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'thumbnail' => $validated['thumbnail'],
            'attributes' => json_encode(json_decode($validated['attributes'])),
            'v360' => $request['v360'] ? $request['v360'] : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Preset successfully has been updated',
            'preset' => $preset
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Preset  $preset
     * @return \Illuminate\Http\Response
     */
    public function destroy(Preset $preset)
    {
        // if($preset->thumbnail) {
        //     // delete original folder
        //     Storage::disk('s3')->delete('thumbnails/' . $preset->thumbnail);
        // }

        $preset->delete();
        // $preset->update([
        //     'is_deleted' => true
        // ]);

        return response()->json([
            'success' => true,
            'msg' => 'Preset has been deleted'
        ], 201);
    }

    
}
