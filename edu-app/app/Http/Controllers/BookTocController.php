<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class BookTocController extends Controller
{
    public function index(int $book): JsonResponse
    {
        $entries = DB::table('book_toc')
            ->where('book_id', $book)
            ->orderBy('page_number')
            ->get();

        return response()->json($entries);
    }

    public function store(Request $request, int $book): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'page_number' => 'required|integer|min:1',
        ]);

        $id = DB::table('book_toc')->insertGetId([
            'book_id'    => $book,
            'title'      => $validated['title'],
            'page_number'=> $validated['page_number'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['id' => $id], 201);
    }

    public function update(Request $request, int $book, int $toc): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'page_number' => 'sometimes|required|integer|min:1',
        ]);

        DB::table('book_toc')
            ->where('book_id', $book)
            ->where('id', $toc)
            ->update(array_merge($validated, ['updated_at' => now()]));

        return response()->json(['message' => 'TOC entry updated']);
    }

   
    public function destroy(int $book, int $toc): JsonResponse
    {
        DB::table('book_toc')
            ->where('book_id', $book)
            ->where('id', $toc)
            ->delete();

        return response()->json(['message' => 'TOC entry deleted']);
    }
}
