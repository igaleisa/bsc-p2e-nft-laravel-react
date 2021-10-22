<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Models\Preset;
use App\Models\Crate;
use Illuminate\Http\Request;
use Validator;

class TokenController extends Controller
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
            'token' => Token::all()
        ], 200);
    }

    public function count()
    {
        return response()->json([
            'success' => true,
            'objects' => count(Token::all())
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
            'token_id' => 'required|integer|unique:tokens|gt:0',
            'preset_id' => 'required|integer|gt:0',
            'owner' => 'required|string|between:2,255',
            'state_id' => 'required|integer|gt:0',
            'price' => 'required|number|gt:0',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $token = Token::create([
            'token_id' => $validated['token_id'],
            'preset_id' => $validated['preset_id'],
            'owner' => $validated['owner'],
            'state_id' => $validated['state_id'],
            'price' => $validated['price'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Object successfully has been registered',
            'object' => $token
        ], 201);
    }

    /**
     * Register batch token list.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function registerList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'owner' => 'required|string|between:2,255',
            'to' => 'required|array|min:1',
            'to.*' => 'required|string|min:1',  
            'presetIds' => 'required|array|min:1',
            'presetIds.*' => 'required|integer|gt:0',  
            'tokenIds' => 'required|array|min:1',
            'tokenIds.*' => 'required|integer|gt:0',  
            'amounts' => 'required|array|min:1',
            'amounts.*' => 'required|integer|gt:0',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();
        
        
        $tokenIndex = 0;
        $insertTokenData = [];

        foreach($validated['to'] as $address) {
            $index = 0;
            foreach($validated['presetIds'] as $presetId) {
                $amount = $validated['amounts'][$index++];
                $preset = Preset::where('preset_id', $presetId)->first();
    
                if($preset) {
                    $tokenData = [];                
                    $tokenData['preset_id'] = $preset->id;
                    $tokenData['owner'] = strtolower($address);
                    $tokenData['state_id'] = strtolower($address) == strtolower($validated['owner']) ? 1 : 2;
                    
                    for($i = 0; $i<$amount; $i++) {
                        $tokenData['token_id'] = $validated['tokenIds'][$tokenIndex++];
                        $insertTokenData[] = $tokenData;                
                    }       
                }     
            }
        }
        

        Token::insert($insertTokenData);

        return response()->json([
            'success' => true,
            'message' => 'Token list successfully has been registered',
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Token  $token
     * @return \Illuminate\Http\Response
     */
    public function show(Token $token)
    {
        return response()->json([
            'success' => true,
            'object' => $token
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Token  $token
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Token $token)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|gt:0',
            'token_id' => 'integer|unique:tokens|gt:0',
            'preset_id' => 'integer|gt:0',
            'owner' => 'string|between:2,255',
            'state_id' => 'integer|gt:0',
            'price' => 'number|gt:0',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $token = Token::where('id', $validated['id'])->firstOrFail();

        if($token) {

            $token->update([
                'token_id' => $validated['token_id'],
                'preset_id' => $validated['preset_id'],
                'owner' => $validated['owner'],
                'state_id' => $validated['state_id'],
                'price' => $validated['price'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Object successfully has been updated',
                'object' => $equipment
            ], 201);

        } else {

            return response()->json([
                'success' => false,
                'message' => 'Cannot find out object',
            ], 400);

        }

        // $token->update($validator->validated());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Token  $token
     * @return \Illuminate\Http\Response
     */
    public function destroy(Token $token)
    {
        $token->delete();

        return response()->json([
            'success' => true,
            'msg' => 'Object has been deleted'
        ], 201);
    }

    public function getList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address' => 'required|string|min:1'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();
        $tokenList = Token::where('owner', $validated['address'])->get();

        return response()->json([
            'success' => true,
            'tokenList' => $tokenList
        ], 201);
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

        $token = Token::where('token_id', $id)->first();

        if(!$token) {
            return response()->json(['error' => 'TokenId is invalid'], 400);
        }

        $preset = Preset::where('preset_id', $token->preset_id)->first();

        if(!$preset) {
            return response()->json(['error' => 'TokenId is invalid'], 400);
        }

        return response()->json([
            'tokenId' => $token->token_id,
            'name' => $preset->name,
            'description' => $preset->description,
            'external_url' => config('admin.web_url'),
            'image' => config('admin.storage_url') . 'thumbnails/' . $preset->thumbnail,
            'attributes' => json_decode($preset->attributes),
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

        $tokens = Token::where('token_id', $id)->get();

        if(count($tokens) !== 1) {
            return response()->json(['error' => 'TokenId is invalid'], 400);
        }
  
        $token = $tokens->first();

        return response()->json([
            'success' => true,
            'object' => $token
        ], 200);
    }

    public function assignTokenList(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'owner' => 'required|string|between:2,255',
            'to' => 'required|array|min:1',
            'to.*' => 'required|string|min:1',  
            'ids' => 'required|array|min:1',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();
        
        $owner = $validated['owner'];

        $index = 0;
        foreach($validated['to'] as $address) {
            $tokenIds = $validated['ids'][$index++];

            foreach($tokenIds as $tokenId) {
                $token = Token::where('owner', $owner)->where('token_id', intval($tokenId))->first();

                if($token) {
                    $token->update([
                        'owner' => strtolower($address),
                        'state_id' => 2,
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Token list successfully has been assigned',
        ], 200);
    }

    public function getCratePreset(Request $request) 
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|gt:0',
        ]);

        if($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $crate = Crate::where('crate_id', $validated['id'])->first();

        if(!$crate) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Crate Id'
            ], 401);
        }

        $crate_quantity = $crate->quantity;
        $crate_faction = $crate->faction_id;
        $crate_price = $crate->price;
        $crate_isDeleted = $crate->is_deleted;
        $crate_rarities = $crate->rarities->pluck('id');

        if($crate_isDeleted) {
            return response()->json([
                'success' => false,
                'message' => 'Deleted Crate Id'
            ], 401);
        }

        $preset = Preset::where('tokentype_id', 2)->where('is_deleted', false)->where('faction_id', $crate_faction)->whereIn('rarity_id', $crate_rarities)->get()->pluck('id')->toArray();

        if(count($preset) < $crate_quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient matching preset quantity'
            ], 401);
        }

        $presetKeys = array_rand($preset, $crate_quantity);
        $presetIds = array();

        foreach($presetKeys as $presetKey) {
            $presetIds[] = $preset[$presetKey];
        }
        
        return response()->json([
            'success' => true,
            'presetIds' => $presetIds
        ], 201);
    }
}
