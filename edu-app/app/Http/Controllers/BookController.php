<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Book;
use App\Models\BookPage;

class BookController extends Controller
{
    // GET /api/books
    public function index()
    {
        $books = Book::with('pages')->orderBy('upload_date', 'desc')->get();
        return response()->json($books);
    }

    // GET /api/books/{id}
    public function show($id)
    {
        $book = Book::with('pages')->find($id);
        if (!$book) return response()->json(['error' => 'Book not found'], 404);
        return response()->json($book);
    }

    // POST /api/books
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'field' => 'nullable|string|max:100',
            'pdf_file' => 'required|mimes:pdf|max:10240'
        ]);

        try {
            // 1️⃣ Save PDF file
            $pdfFile = $request->file('pdf_file');
            $pdfName = time() . '_' . $pdfFile->getClientOriginalName();
            $pdfPath = $pdfFile->storeAs('books', $pdfName);
            $fullPath = Storage::path($pdfPath);

            // 2️⃣ Generate first page as cover
            $imagick = new \Imagick();
            $imagick->setResolution(150, 150);
            $imagick->readImage($fullPath);

            $imagick->setIteratorIndex(0); // first page
            $coverImage = $imagick->getImage();
            $coverImage->setImageFormat('jpg');

            $coverPath = 'book_covers/book_' . time() . '_cover.jpg';
            Storage::put($coverPath, $coverImage->getImageBlob());

            $imagick->clear();
            $imagick->destroy();

            // 3️⃣ Create book record
            $book = Book::create([
                'title' => $request->title,
                'description' => $request->description,
                'original_file_path' => $pdfPath,
                'cover_path' => $coverPath,
                'upload_date' => now(),
            ]);

            // 4️⃣ Generate all pages
            $imagick = new \Imagick();
            $imagick->setResolution(150, 150);
            $imagick->readImage($fullPath);
            $totalPages = $imagick->getNumberImages();

            for ($i = 0; $i < $totalPages; $i++) {
                $imagick->setIteratorIndex($i);
                $image = $imagick->getImage();
                $image->setImageFormat('jpg');

                $pageFileName = 'book_pages/book_' . $book->id . '/page_' . ($i + 1) . '.jpg';
                Storage::put($pageFileName, $image->getImageBlob());

                BookPage::create([
                    'book_id' => $book->id,
                    'page_number' => $i + 1,
                    'page_path' => $pageFileName,
                ]);
            }

            $imagick->clear();
            $imagick->destroy();

            return response()->json([
                'message' => 'Book uploaded successfully',
                'book' => $book->load('pages')
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Upload failed: ' . $e->getMessage()], 500);
        }
    }

    // PUT /api/books/{id}
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'field' => 'nullable|string|max:100',
        ]);

        $book = Book::find($id);
        if (!$book) return response()->json(['error' => 'Book not found'], 404);

        $book->update([
            'title' => $request->title,
            'field' => $request->field,
        ]);

        return response()->json(['message' => 'Book updated successfully', 'book' => $book]);
    }

    // DELETE /api/books/{id}
    public function destroy($id)
    {
        $book = Book::with('pages')->find($id);
        if (!$book) return response()->json(['error' => 'Book not found'], 404);

        Storage::delete($book->original_file_path);

        // Delete pages
        foreach ($book->pages as $page) {
            Storage::delete($page->page_path);
        }

        // Delete cover
        if ($book->cover_path) {
            Storage::delete($book->cover_path);
        }

        $book->delete();

        return response()->json(['message' => 'Book deleted successfully']);
    }
}
