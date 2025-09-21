<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    // List all books
    public function index()
    {
        $books = DB::table('books')->orderBy('upload_date', 'desc')->get();
        return response()->json($books);
    }

    // Show single book
    public function show($id)
    {
        $book = DB::table('books')->where('id', $id)->first();
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }
        return response()->json($book);
    }

    // Store new book with PDF and pages
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'pdf_file' => 'required|mimes:pdf|max:10240',
            'uploaded_by' => 'required|integer|exists:users,id'
        ]);

        try {
            // Insert book first to get ID
            $bookId = DB::table('books')->insertGetId([
                'title' => $request->title,
                'description' => $request->description,
                'original_file_path' => '', 
                'uploaded_by' => $request->uploaded_by,
                'upload_date' => now()
            ]);

            // Define directories
            $bookFolder = "private/book_{$bookId}";
            $pdfFolder = storage_path("app/$bookFolder/books");
            $pagesFolder = storage_path("app/$bookFolder/book_pages");

            // Make sure folders exist
            if (!file_exists($pdfFolder)) mkdir($pdfFolder, 0777, true);
            if (!file_exists($pagesFolder)) mkdir($pagesFolder, 0777, true);

            // Save PDF
            $file = $request->file('pdf_file');
            $baseName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $baseName);
            $fileName = time() . '_' . $baseName . '.pdf';
            $fullPdfPath = $pdfFolder . '/' . $fileName;
            $file->move($pdfFolder, $fileName);

            // Update book with actual PDF path 
            DB::table('books')->where('id', $bookId)->update([
                'original_file_path' => "$bookFolder/books/$fileName"
            ]);

            // Extract PDF pages
            $imagick = new \Imagick();
            $imagick->setResolution(200, 200);
            $imagick->readImage($fullPdfPath);

            foreach ($imagick as $index => $image) {
                $pageNumber = $index + 1;
                $image->setImageFormat('jpg');
                $pageFile = "page_{$pageNumber}.jpg";
                $pageFullPath = $pagesFolder . '/' . $pageFile;

                $image->writeImage($pageFullPath);

                DB::table('book_pages')->insert([
                    'book_id' => $bookId,
                    'page_number' => $pageNumber,
                    'page_path' => "$bookFolder/book_pages/$pageFile",
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

    // Update book (title, description, optionally PDF)
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
                // Delete old PDF
                $oldPdfPath = storage_path("app/{$book->original_file_path}");
                if (file_exists($oldPdfPath)) unlink($oldPdfPath);

                // Delete old pages
                $oldPages = DB::table('book_pages')->where('book_id', $id)->get();
                foreach ($oldPages as $page) {
                    $oldPagePath = storage_path("app/{$page->page_path}");
                    if (file_exists($oldPagePath)) unlink($oldPagePath);
                }
                DB::table('book_pages')->where('book_id', $id)->delete();

                // Directories
                $bookFolder = "private/book_{$id}";
                $pdfFolder = storage_path("app/$bookFolder/books");
                $pagesFolder = storage_path("app/$bookFolder/book_pages");
                if (!file_exists($pdfFolder)) mkdir($pdfFolder, 0777, true);
                if (!file_exists($pagesFolder)) mkdir($pagesFolder, 0777, true);

                // Save new PDF
                $file = $request->file('pdf_file');
                $baseName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $baseName);
                $fileName = time() . '_' . $baseName . '.pdf';
                $fullPdfPath = $pdfFolder . '/' . $fileName;
                $file->move($pdfFolder, $fileName);

                $updateData['original_file_path'] = "$bookFolder/books/$fileName";

                // Extract pages
                $imagick = new \Imagick();
                $imagick->setResolution(200, 200);
                $imagick->readImage($fullPdfPath);

                foreach ($imagick as $index => $image) {
                    $pageNumber = $index + 1;
                    $image->setImageFormat('jpg');
                    $pageFile = "page_{$pageNumber}.jpg";
                    $pageFullPath = $pagesFolder . '/' . $pageFile;

                    $image->writeImage($pageFullPath);

                    DB::table('book_pages')->insert([
                        'book_id' => $id,
                        'page_number' => $pageNumber,
                        'page_path' => "$bookFolder/book_pages/$pageFile",
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
