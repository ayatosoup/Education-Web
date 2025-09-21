<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    // List all categories
    public function index()
    {
        $categories = DB::table('categories')->orderBy('name')->get();
        return response()->json($categories);
    }

    // Show a single category
    public function show($id)
    {
        $category = DB::table('categories')->find($id);

        if (! $category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json($category);
    }

    // Create a new category
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $id = DB::table('categories')->insertGetId([
            'name'       => $validated['name'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'id'      => $id,
        ], 201);
    }

    // Update an existing category
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
        ]);

        $updated = DB::table('categories')
            ->where('id', $id)
            ->update([
                'name'       => $validated['name'],
                'updated_at' => now(),
            ]);

        if (! $updated) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json(['message' => 'Category updated successfully']);
    }

    // Delete a category
    public function destroy($id)
    {
        $deleted = DB::table('categories')->where('id', $id)->delete();

        if (! $deleted) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
