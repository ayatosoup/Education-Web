<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    public function index()
    {
        $books = DB::table('books')->orderBy('upload_date', 'desc')->get();
        return response()->json($books);
    }

    public function show($id)
    {
        $book = DB::table('books')->where('idbook', $id)->first();
        
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }
        
        return response()->json($book);
    }

    public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'pdf_file' => 'required|mimes:pdf|max:10240',
        'uploaded_by' => 'required|integer|exists:users,id'
    ]);

    try {
        $file = $request->file('pdf_file');
        $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
        $filePath = public_path('uploads/books/');
        if (!file_exists($filePath)) mkdir($filePath, 0777, true);
        $file->move($filePath, $fileName);
        $fullPath = 'uploads/books/' . $fileName;

        $bookId = DB::table('books')->insertGetId([
            'title' => $request->title,
            'description' => $request->description,
            'original_file_path' => $fullPath,
            'uploaded_by' => $request->uploaded_by,
            'upload_date' => now()
        ]);

        $imagick = new \Imagick();
        $imagick->setResolution(200, 200);
        $imagick->readImage($filePath . $fileName);

        $outputDir = public_path("uploads/book_pages/$bookId/");
        if (!file_exists($outputDir)) mkdir($outputDir, 0777, true);

        foreach ($imagick as $index => $image) {
            $pageNumber = $index + 1;
            $image->setImageFormat('jpg');
            $pageFile = "page_{$pageNumber}.jpg";
            $image->writeImage($outputDir . $pageFile);

            DB::table('book_pages')->insert([
                'book_id' => $bookId,
                'page_number' => $pageNumber,
                'page_path' => "uploads/book_pages/$bookId/" . $pageFile,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        $imagick->clear();
        $imagick->destroy();

        return response()->json([
            'message' => 'Book uploaded successfully',
            'book_id' => $bookId
        ], 201);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Upload failed: ' . $e->getMessage()], 500);
    }
}

public function update(Request $request, $id)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'pdf_file' => 'nullable|mimes:pdf|max:10240'
    ]);

    $book = DB::table('books')->where('id', $id)->first();
    if (!$book) {
        return response()->json(['error' => 'Book not found'], 404);
    }

    try {
        $updateData = [
            'title' => $request->title,
            'description' => $request->description,
        ];

        if ($request->hasFile('pdf_file')) {
            if ($book->original_file_path && file_exists(public_path($book->original_file_path))) {
                unlink(public_path($book->original_file_path));
            }
            DB::table('book_pages')->where('book_id', $id)->delete();

            $file = $request->file('pdf_file');
            $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
            $filePath = public_path('uploads/books/');
            if (!file_exists($filePath)) mkdir($filePath, 0777, true);
            $file->move($filePath, $fileName);
            $fullPath = 'uploads/books/' . $fileName;

            $updateData['original_file_path'] = $fullPath;

            $imagick = new \Imagick();
            $imagick->setResolution(200, 200);
            $imagick->readImage($filePath . $fileName);

            $outputDir = public_path("uploads/book_pages/$id/");
            if (!file_exists($outputDir)) mkdir($outputDir, 0777, true);

            foreach ($imagick as $index => $image) {
                $pageNumber = $index + 1;
                $image->setImageFormat('jpg');
                $pageFile = "page_{$pageNumber}.jpg";
                $image->writeImage($outputDir . $pageFile);

                DB::table('book_pages')->insert([
                    'book_id' => $id,
                    'page_number' => $pageNumber,
                    'page_path' => "uploads/book_pages/$id/" . $pageFile,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            $imagick->clear();
            $imagick->destroy();
        }

        DB::table('books')->where('id', $id)->update($updateData);

        $updatedBook = DB::table('books')->where('id', $id)->first();
        return response()->json([
            'message' => 'Book updated successfully',
            'book' => $updatedBook
        ]);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Update failed: ' . $e->getMessage()], 500);
    }
}
}