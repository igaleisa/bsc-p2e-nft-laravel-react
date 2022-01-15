<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'success' => true,
            'categories' => $categories
        ], 200);
    }

    public function getName(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'categoryId' => 'required|integer|gt:0',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        if($validated['categoryId'] == 7) {
            return response()->json([
                'success' => true,
                'category' => 'My Land Plots'
            ], 200);
        } else {
            $category = Category::where('id', $validated['categoryId'])->first();

            if(!$category) {
                return response()->json(['error' => 'Category Id is not registered'], 400);           
            } else {
                return response()->json([
                    'success' => true,
                    'category' => $category->name
                ], 200);
            }
        }        
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
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        //
    }
}
