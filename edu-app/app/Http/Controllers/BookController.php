<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Book;
use App\Models\BookPage;

class BookController extends Controller
{
    // GET /api/books - Get all books
    public function index()
    {
       $books = Book::with('pages')->orderBy('upload_date', 'desc')->get();
        return response()->json($books);
    }

    // GET /api/books/{id} - Get single book
    public function show($id)
    {
        $book = Book::with('pages')->find($id);
        
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
            'field' => 'nullable|string|max:100',
            'pdf_file' => 'required|mimes:pdf|max:10240' // 10MB max
        ]);

         try {
            // Save pdf in storage
            $pdfFile = $request->file('pdf_file');
            $pdfName = time().'_'.$pdfFile->getClientOriginalName();
            $pdfPath = $pdfFile->storeAs('books', $pdfName);

            $book = Book::create([
                'title' => $request->title,
                'description' => $request->description,
                'original_file_path' => $pdfPath,
                'upload_date' => now(),
            ]);

           // Process PDF into image pages
            $imagick = new \Imagick();
            $imagick->setResolution(150, 150);
            
            // Fix the file path for Windows compatibility
            $fullPath = Storage::path($pdfPath);
            // Normalize path separators for Windows
            $fullPath = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $fullPath);
            
            // Alternative: Use realpath to get absolute path
            $realPath = realpath($fullPath);
            if (!$realPath || !file_exists($realPath)) {
                throw new \Exception("PDF file not found at path: $fullPath");
            }
            
            $imagick->readImage($realPath);

            foreach ($imagick as $index => $image) {
                $image->setImageFormat('jpg');
                $pageFileName = 'book_pages/book_'.$book->id.'/page_'.($index+1).'.jpg';
                
                // Get the image blob and store it
                $imageBlob = $image->getImageBlob();
                Storage::put($pageFileName, $imageBlob);

                BookPage::create([
                    'book_id' => $book->id,
                    'page_number' => $index+1,
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

    // PUT /api/books/{id} - Update book
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

    // DELETE /api/books/{id} - Delete book
    public function destroy($id)
    {
        $book = Book::with('pages')->find($id);
        if (!$book) return response()->json(['error' => 'Book not found'], 404);

        Storage::delete($book->original_file_path);
        foreach ($book->pages as $page) {
            Storage::delete($page->page_path);
        }

        $book->delete();

        return response()->json(['message' => 'Book deleted successfully']);
    }
}