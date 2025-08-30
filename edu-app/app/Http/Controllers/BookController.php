<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    // GET /api/books - Get all books
    public function index()
    {
        $books = DB::table('books')->orderBy('created_at', 'desc')->get();
        return response()->json($books);
    }

    // GET /api/books/{id} - Get single book
    public function show($id)
    {
        $book = DB::table('books')->where('idbook', $id)->first();
        
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }
        
        return response()->json($book);
    }

    // POST /api/books - Create new book
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'genre' => 'nullable|string|max:100',
            'pdf_file' => 'required|mimes:pdf|max:10240' // 10MB max
        ]);

        try {
            // Handle file upload
            $filePath = null;
            if ($request->hasFile('pdf_file')) {
                $file = $request->file('pdf_file');
                $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
                $file->move(public_path('books'), $fileName);
                $filePath = '/books/' . $fileName;
            }

            // Insert into database
            $bookId = DB::table('books')->insertGetId([
                'title' => $request->title,
                'genre' => $request->genre,
                'file' => $filePath,
                'created_at' => now()
            ]);

            // Get the created book
            $book = DB::table('books')->where('idbook', $bookId)->first();

            return response()->json([
                'message' => 'Book created successfully',
                'book' => $book
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Upload failed: ' . $e->getMessage()], 500);
        }
    }

    // PUT /api/books/{id} - Update book
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'genre' => 'nullable|string|max:100',
            'pdf_file' => 'nullable|mimes:pdf|max:10240'
        ]);

        $book = DB::table('books')->where('idbook', $id)->first();
        
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        try {
            $updateData = [
                'title' => $request->title,
                'genre' => $request->genre,
            ];

            // Handle file upload if new file provided
            if ($request->hasFile('pdf_file')) {
                // Delete old file if exists
                if ($book->file && file_exists(public_path($book->file))) {
                    unlink(public_path($book->file));
                }

                $file = $request->file('pdf_file');
                $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
                $file->move(public_path('books'), $fileName);
                $updateData['file'] = '/books/' . $fileName;
            }

            // Update database
            DB::table('books')->where('idbook', $id)->update($updateData);

            // Get updated book
            $updatedBook = DB::table('books')->where('idbook', $id)->first();

            return response()->json([
                'message' => 'Book updated successfully',
                'book' => $updatedBook
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Update failed: ' . $e->getMessage()], 500);
        }
    }

    // DELETE /api/books/{id} - Delete book
    public function destroy($id)
    {
        $book = DB::table('books')->where('idbook', $id)->first();
        
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        try {
            // Delete file if exists
            if ($book->file && file_exists(public_path($book->file))) {
                unlink(public_path($book->file));
            }

            // Delete from database
            DB::table('books')->where('idbook', $id)->delete();

            return response()->json(['message' => 'Book deleted successfully']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Delete failed: ' . $e->getMessage()], 500);
        }
    }
}