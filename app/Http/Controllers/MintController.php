<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Equipment;
use Illuminate\Support\Facades\Storage;
use Validator;

class MintController extends Controller
{
    public function mint(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,255',
            'description' => 'required|string',
            'category' => 'required|integer|gt:0',
            'rarity' => 'required|integer|gt:0',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:20480',            
            'total' => 'required|integer|gte:0',
            'count' => 'required|integer|gt:0',
            'attributes' => 'required|string',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $imageName = time().'.'.$request->thumbnail->extension();  
     
        // save thumbnail to public folder
        // $request->thumbnail->move(public_path('img'), $imageName);   
        
        // Upload thumbnail image to S3 Bucket
        Storage::disk('s3')->put('thumbnails/' . $imageName, file_get_contents($request->thumbnail));

        // Upload collection images to S3 Bucket
        $collection_path = time();
        $collection_count = 0;
        if($request->hasfile('collection')) {            
            foreach($request->file('collection') as $collection_item) {
                $collection_count++;
                Storage::disk('s3')->put('objects/' . $collection_path . '/' . $collection_count . '.' . $collection_item->extension(), file_get_contents($collection_item));
            }
        }

        $validated = $validator->validated();

        $total = intval($validated['total']);
        $count = intval($validated['count']);

        for($i = 0; $i < $count; $i++ ) {
            $tokenId = $total + $i + 1;
            Equipment::create(
                [
                    'tokenId' => $tokenId,
                    'category_id' => $validated['category'],
                    'rarity_id' => $validated['rarity'],
                    'name' => trim($validated['name']) . ' #' . $tokenId,
                    'description' => trim($validated['description']),
                    'image' => Storage::disk('s3')->url('thumbnails/' . $imageName),
                    'attributes' => json_encode(json_decode($validated['attributes'])),
                    'v360' => $request->hasfile('collection') ? $collection_path : null,
                ]
            );
        }
  
        return response()->json([
            'success' => true,
            'message' => $count . ' tokens successfully has been registered'
        ], 200);
    }

    public function getMetadata($id) {
        $request = [
            'id' => $id,
        ];

        $validator = Validator::make($request, [
            'id' => 'required|integer|gt:0',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $tokens = Equipment::where('tokenId', $id)->get();

        if(count($tokens) !== 1) {
            return response()->json(['error' => 'tokenId is invalid'], 400);
        }
  
        $token = $tokens->first();

        return response()->json([
            'tokenId' => $token->tokenId,
            'name' => $token->name,
            'description' => $token->description,
            'external_url' => 'http://umbrella.localhost',
            'image' => $token->image,
            'attributes' => json_decode($token->attributes),
        ], 200);
    }

    public function getTokenInfo($id) {
        $request = [
            'id' => $id,
        ];

        $validator = Validator::make($request, [
            'id' => 'required|integer|gt:0',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $tokens = Equipment::where('tokenId', $id)->get();

        if(count($tokens) !== 1) {
            return response()->json(['error' => 'tokenId is not registered'], 400);
        }
  
        $token = $tokens->first();

        return response()->json([
            'success' => true,
            'tokenId' => $token->tokenId,
            'assigned' => $token->assigned,
            'equipped' => $token->equipped,
            'name' => $token->name,
            'description' => $token->description,
            'external_url' => 'http://umbrella.localhost',
            'image' => $token->image,
            'attributes' => json_decode($token->attributes),
            'v360' => $token->v360,
        ], 200);
    }

    public function assign(Request $request) {
        $validator = Validator::make($request->all(), [
            'tokenId' => 'required|integer|gt:0',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();
        $equipment = Equipment::where('tokenId', $validated['tokenId'])->first();

        if(!$equipment) {
            return response()->json(['error' => 'tokenId is not registered'], 400);
        }

        $equipment->update([
            'assigned' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Token (#' . $validated['tokenId'] . ') successfully has been assigned'
        ], 200);
    }
}
