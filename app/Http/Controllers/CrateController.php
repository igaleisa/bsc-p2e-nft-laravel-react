<?php

namespace App\Http\Controllers;

use App\Models\Crate;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Payment;
use App\Models\UserCrate;
use App\Models\Token;
use App\Models\CrateToken;
use App\Models\CrateRarity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Validator;

class CrateController extends Controller
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
            'crates' => Crate::where('is_deleted', false)->get()
        ], 200);
    }

    public function count()
    {
        return response()->json([
            'success' => true,
            'crates' => count(Crate::where('is_deleted', false)->get())
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
            'crate_id' => 'required|integer|gt:0',
            'name' => 'required|string|between:2,255|unique:crates',
            'faction' => 'required|integer|gt:0',
            'level' => 'required|integer|gt:0',
            'quantity' => 'required|integer|gt:0',
            'price' => 'required|numeric|gt:0',
            'rarity' => 'required|string|min:1',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        
        // Create new Crate
        $validated = $validator->validated();
        $crate = Crate::create([
            'crate_id' => trim($validated['crate_id']),
            'name' => trim($validated['name']),
            'faction_id' => $validated['faction'],
            'level' => $validated['level'],
            'quantity' => $validated['quantity'],
            'price' => $validated['price'],
            'v360' => $request['v360'] ? $request['v360'] : null,
        ]);

        // Create new Crate_Rarity
        $array_rarity = explode(',', $validated['rarity']);

        foreach($array_rarity as $rarity) {
            CrateRarity::create([
                'crate_id' => $crate->id,
                'rarity_id' => $rarity
            ]);
        }

        // Upload 360 images to S3 Bucket
        // $collection_count = 0;
        // if($request->hasfile('collection')) {            
        //     foreach($request->file('collection') as $collection_item) {
        //         $collection_count++;
        //         Storage::disk('s3')->put('crates/' . $crate->id . '/' . $collection_count . '.' . $collection_item->extension(), file_get_contents($collection_item));
        //     }
        //     if($collection_count) {
        //         $crate->update([
        //             'v360' => true
        //         ]);
        //     }
        // }

        return response()->json([
            'success' => true,
            'message' => 'Crate successfully has been registered',
            'crate' => $crate
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Crate  $crate
     * @return \Illuminate\Http\Response
     */
    public function show(Crate $crate)
    {
        return response()->json([
            'success' => true,
            'crate' => $crate,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Crate  $crate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Crate $crate)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|gt:0',
            'name' => 'required|string|between:2,255',
            'faction' => 'required|integer|gt:0',
            'level' => 'required|integer|gt:0',
            'quantity' => 'required|integer|gt:0',
            'price' => 'required|numeric|gt:0',
            'rarity' => 'required|string|min:1',
            // 'rarity.*' => 'required|integer|gt:0',            
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();
        $crate = Crate::where('id', $validated['id'])->firstOrFail();

        if(!$crate) {
            return response()->json([
                'success' => false,
                'message' => 'Crate ID is not valid',
            ], 201);
        }

        // Upload 360 images to S3 Bucket
        // $collection_count = 0;

        // if($request->hasfile('collection')) { 
        //     // delete original folder
        //     Storage::disk('s3')->deleteDirectory('crates/' . $crate->id);

        //     foreach($request->file('collection') as $collection_item) {
        //         $collection_count++;
        //         Storage::disk('s3')->put('crates/' . $crate->id . '/' . $collection_count . '.' . $collection_item->extension(), file_get_contents($collection_item));
        //     }

        //     $crate->update([
        //         'name' => trim($validated['name']),
        //         'faction_id' => $validated['faction'],
        //         'level' => $validated['level'],
        //         'quantity' => $validated['quantity'],
        //         'price' => $validated['price'],
        //         'v360' => true
        //     ]);
        // } else {
        //     $crate->update([
        //         'name' => trim($validated['name']),
        //         'faction_id' => $validated['faction'],
        //         'level' => $validated['level'],
        //         'quantity' => $validated['quantity'],
        //         'price' => $validated['price']
        //     ]);
        // }

        $crate->update([
            'name' => trim($validated['name']),
            'faction_id' => $validated['faction'],
            'level' => $validated['level'],
            'quantity' => $validated['quantity'],
            'price' => $validated['price'],
            'v360' => $request['v360'] ? $request['v360'] : null,
        ]);

        $crate_rarities = CrateRarity::where('crate_id', $crate->id)->get();        
        foreach($crate_rarities as $crate_rarity) {
            $crate_rarity->delete();
        }

        // Create new Crate_Rarity
        $array_rarity = explode(',', $validated['rarity']);
        foreach($array_rarity as $rarity) {
            CrateRarity::create([
                'crate_id' => $crate->id,
                'rarity_id' => $rarity
            ]);
        }

        // foreach($validated['rarity'] as $rarity) {
        //     CrateRarity::create([
        //         'crate_id' => $crate->id,
        //         'rarity_id' => $rarity
        //     ]);
        // }

        return response()->json([
            'success' => true,
            'message' => 'Crate successfully has been updated',
            'crate' => $crate
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Crate  $crate
     * @return \Illuminate\Http\Response
     */
    public function destroy(Crate $crate)
    {
        // if($crate->v360) {
        //     // delete original folder
        //     Storage::disk('s3')->deleteDirectory('crates/' . $crate->id);
        // }
        // $crate->delete();

        $crate->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'success' => true,
            'msg' => 'Crate has been deleted'
        ], 201);
    }    
}
