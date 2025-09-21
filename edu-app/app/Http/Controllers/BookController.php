<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    // Get all books ordered by latest upload date.
    public function index()
    {
        $books = DB::table('books')
            ->orderBy('upload_date', 'desc')
            ->get();

        return response()->json($books);
    }

    
    // Get a single book and its pages.
    public function show($id)
    {
        $book = DB::table('books')->where('id', $id)->first();

        if (! $book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        $book->pages = DB::table('book_pages')
            ->where('book_id', $id)
            ->orderBy('page_number', 'asc')
            ->get();

        return response()->json($book);
    }

    // Upload a new book PDF and generate page images.
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'pdf_file'    => 'required|mimes:pdf|max:10240',
            'uploaded_by' => 'required|integer|exists:users,id',
        ]);

        $bookId = null; 

        try {
            // Insert the book first to get its ID
            $bookId = DB::table('books')->insertGetId([
                'title'              => $request->title,
                'description'        => $request->description,
                'original_file_path' => '',
                'uploaded_by'        => $request->uploaded_by,
                'upload_date'        => now(),
            ]);

            $bookFolder  = "book_{$bookId}";
            $pdfFolder   = "{$bookFolder}/books";
            $pagesFolder = "{$bookFolder}/book_pages";

            // Save the uploaded PDF
            $file     = $request->file('pdf_file');
            $baseName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $baseName);
            $fileName = time() . '_' . $baseName . '.pdf';

            $pdfPath = $file->storeAs($pdfFolder, $fileName, 'local');

            // Update the record with the stored PDF path
            DB::table('books')->where('id', $bookId)
                ->update(['original_file_path' => $pdfPath]);

            // Convert each PDF page to a JPG image
            $imagick = new \Imagick();
            $imagick->setResolution(200, 200);
            $imagick->readImage(Storage::disk('local')->path($pdfPath));

            foreach ($imagick as $index => $image) {
                $pageNumber   = $index + 1;
                $pageFile     = "page_{$pageNumber}.jpg";
                $pageFullPath = Storage::disk('local')->path("{$pagesFolder}/{$pageFile}");


                $pageDirectory = dirname($pageFullPath);
                if (!is_dir($pageDirectory)) {
                    mkdir($pageDirectory, 0755, true);
                }

                $image->setImageFormat('jpg');
                $image->writeImage($pageFullPath);

                DB::table('book_pages')->insert([
                    'book_id'     => $bookId,
                    'page_number' => $pageNumber,
                    'page_path'   => "{$pagesFolder}/{$pageFile}",
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            $imagick->clear();
            $imagick->destroy();

            return response()->json([
                'message' => 'Book uploaded successfully',
                'book_id' => $bookId,
            ], 201);

        } catch (\Exception $e) {
            if ($bookId) {
                Storage::disk('local')->deleteDirectory("book_{$bookId}");
                DB::table('books')->where('id', $bookId)->delete();
                DB::table('book_pages')->where('book_id', $bookId)->delete();
            }

            return response()->json([
                'error' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Update book, add audio/video link
    public function update(Request $request, $id)
    {
        $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'pdf_file'    => 'nullable|mimes:pdf|max:10240',
            'page_number' => 'nullable|integer|required_with:audio_file,video_link',
            'audio_file'  => 'nullable|mimes:mp3,wav,m4a,ogg|max:20480',
            'video_link'  => 'nullable|url|string|max:500',
        ]);

        $book = DB::table('books')->where('id', $id)->first();

        if (! $book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        try {
            $updateData = $request->only(['title', 'description']);

            if ($request->hasFile('pdf_file')) {
                // Remove old PDF and page images
                if ($book->original_file_path) {
                    Storage::disk('local')->delete($book->original_file_path);
                }
                
                Storage::disk('local')->deleteDirectory("book_{$id}/book_pages");
                DB::table('book_pages')->where('book_id', $id)->delete();

                $bookFolder  = "book_{$id}";
                $pdfFolder   = "{$bookFolder}/books";
                $pagesFolder = "{$bookFolder}/book_pages";

                $file     = $request->file('pdf_file');
                $baseName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $baseName);
                $fileName = time() . '_' . $baseName . '.pdf';

                $pdfPath = $file->storeAs($pdfFolder, $fileName, 'local');
                $updateData['original_file_path'] = $pdfPath;

                $imagick = new \Imagick();
                $imagick->setResolution(200, 200);
                $imagick->readImage(Storage::disk('local')->path($pdfPath));

                foreach ($imagick as $index => $image) {
                    $pageNumber   = $index + 1;
                    $pageFile     = "page_{$pageNumber}.jpg";
                    $pageFullPath = Storage::disk('local')->path("{$pagesFolder}/{$pageFile}");

                    
                    $pageDirectory = dirname($pageFullPath);
                    if (!is_dir($pageDirectory)) {
                        mkdir($pageDirectory, 0755, true);
                    }

                    $image->setImageFormat('jpg');
                    $image->writeImage($pageFullPath);

                    DB::table('book_pages')->insert([
                        'book_id'     => $id,
                        'page_number' => $pageNumber,
                        'page_path'   => "{$pagesFolder}/{$pageFile}",
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }

                $imagick->clear();
                $imagick->destroy();
            }

            // Handle optional page-specific audio/video
            if ($request->filled('page_number')) {
                $page = DB::table('book_pages')
                    ->where('book_id', $id)
                    ->where('page_number', $request->page_number)
                    ->first();

                if (! $page) {
                    return response()->json([
                        'error' => 'Page number ' . $request->page_number . ' not found for this book.'
                    ], 404);
                }

                $pageUpdateData = [];

                if ($request->hasFile('audio_file')) {
                    if ($page->audio_path && Storage::disk('local')->exists($page->audio_path)) {
                        Storage::disk('local')->delete($page->audio_path);
                    }
                   
                    $audioFolder = "book_{$id}/audio_file";
                    $audioFile   = $request->file('audio_file');
                    $audioName   = 'page_' . $request->page_number . '_' . time() . '.' . $audioFile->getClientOriginalExtension();
                    $path = $audioFile->storeAs($audioFolder, $audioName, 'local');
                    $pageUpdateData['audio_path'] = $path;
                }

                if ($request->has('video_link')) {
                    $pageUpdateData['video_link'] = $request->video_link;
                }

                if (! empty($pageUpdateData)) {
                    $pageUpdateData['updated_at'] = now();
                    DB::table('book_pages')->where('id', $page->id)->update($pageUpdateData);
                }
            }

            if (! empty($updateData)) {
                DB::table('books')->where('id', $id)->update($updateData);
            }

            $updatedBook = DB::table('books')->where('id', $id)->first();

            return response()->json([
                'message' => 'Book updated successfully',
                'book'    => $updatedBook,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}

