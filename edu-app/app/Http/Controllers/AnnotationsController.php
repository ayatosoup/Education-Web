<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AnnotationsController extends Controller
{
    // Get annotations for a specific page
    public function getPageAnnotations($bookId, $pageNumber)
    {
        $userId = Auth::id();

        $annotation = DB::table('annotations')
            ->where('user_id', $userId)
            ->where('book_id', $bookId)
            ->where('page_number', $pageNumber)
            ->first();

        if (!$annotation) {
            return response()->json(['annotation_paths' => []]);
        }

        return response()->json([
            'id' => $annotation->id,
            'annotation_paths' => json_decode($annotation->annotation_paths, true) ?? []
        ]);
    }

    // Get all annotations for a book
    public function getBookAnnotations($bookId)
    {
        $userId = Auth::id();

        $annotations = DB::table('annotations')
            ->where('user_id', $userId)
            ->where('book_id', $bookId)
            ->select('id', 'page_number', 'annotation_paths')
            ->get();

        $result = [];
        foreach ($annotations as $annotation) {
            $result[$annotation->page_number] = [
                'id' => $annotation->id,
                'paths' => json_decode($annotation->annotation_paths, true) ?? []
            ];
        }

        return response()->json($result);
    }

    // Save or update annotations for a page
    public function saveAnnotations(Request $request, $bookId)
    {
        $request->validate([
            'page_number' => 'required|integer|min:1',
            'annotation_paths' => 'present|array'
        ]);

        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $pageNumber = $request->page_number;
        $annotationPaths = json_encode($request->annotation_paths);

        try {
            DB::table('annotations')->updateOrInsert(
                [
                    'user_id' => $userId,
                    'book_id' => $bookId,
                    'page_number' => $pageNumber
                ],
                [
                    'annotation_paths' => $annotationPaths,
                    'updated_at' => now(),
                    'created_at' => now()
                ]
            );

            // If no paths remain, remove the record
            if (empty($request->annotation_paths)) {
                DB::table('annotations')
                    ->where('user_id', $userId)
                    ->where('book_id', $bookId)
                    ->where('page_number', $pageNumber)
                    ->delete();
            }

            return response()->json(['message' => 'Annotations saved successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to save annotations: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to save annotations.'], 500);
        }
    }

    // Remove all annotations for a specific page
    public function clearPageAnnotations($bookId, $pageNumber)
    {
        $userId = Auth::id();

        DB::table('annotations')
            ->where('user_id', $userId)
            ->where('book_id', $bookId)
            ->where('page_number', $pageNumber)
            ->delete();

        return response()->json(['message' => 'Page annotations cleared successfully']);
    }

    // Remove all annotations for a book
    public function clearBookAnnotations($bookId)
    {
        $userId = Auth::id();

        DB::table('annotations')
            ->where('user_id', $userId)
            ->where('book_id', $bookId)
            ->delete();

        return response()->json(['message' => 'All book annotations cleared successfully']);
    }

    // Delete a single annotation path by index
    public function deleteAnnotationPath(Request $request, $bookId, $pageNumber)
    {
        $request->validate([
            'path_index' => 'required|integer|min:0'
        ]);

        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $pathIndex = $request->path_index;

        $annotation = DB::table('annotations')
            ->where('user_id', $userId)
            ->where('book_id', $bookId)
            ->where('page_number', $pageNumber)
            ->first();

        if (!$annotation) {
            return response()->json(['error' => 'No annotations found for this page'], 404);
        }

        $paths = json_decode($annotation->annotation_paths, true) ?? [];

        if (!isset($paths[$pathIndex])) {
            return response()->json(['error' => 'Path index not found'], 404);
        }

        // Remove the path
        array_splice($paths, $pathIndex, 1);

        if (empty($paths)) {
            DB::table('annotations')->where('id', $annotation->id)->delete();
            return response()->json(['message' => 'Annotation path deleted, no paths remaining']);
        } else {
            DB::table('annotations')
                ->where('id', $annotation->id)
                ->update([
                    'annotation_paths' => json_encode(array_values($paths)),
                    'updated_at' => now()
                ]);

            return response()->json([
                'message' => 'Annotation path deleted successfully',
                'remaining_paths' => array_values($paths)
            ]);
        }
    }
}
