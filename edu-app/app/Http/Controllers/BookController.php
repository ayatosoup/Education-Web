<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class BookController extends Controller
{
    public function index()
    {
        $books = DB::table('books')
            ->join('categories', 'books.category_id', '=', 'categories.id')
            ->select('books.*', 'categories.name as category_name')
            ->orderBy('upload_date', 'desc')
            ->get();

        return response()->json($books);
    }

    public function show($id)
    {
        $book = DB::table('books')
            ->join('categories', 'books.category_id', '=', 'categories.id')
            ->select('books.*', 'categories.name as category_name')
            ->where('books.id', $id)
            ->first();

        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        $book->pages = DB::table('book_pages')
            ->where('book_id', $id)
            ->orderBy('page_number', 'asc')
            ->get();

        $annotations = DB::table('annotations')
            ->where('book_id', $id)
            ->where('user_id', Auth::id())
            ->get(['page_number', 'annotation_paths'])
            ->keyBy('page_number')
            ->map(fn($item) => json_decode($item->annotation_paths, true));

        $book->annotations = $annotations;

        return response()->json($book);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'pdf_file'    => 'required|mimes:pdf|max:10240',
            'uploaded_by' => 'required|integer|exists:users,id',
            'category_id' => 'required|integer|exists:categories,id',
        ]);

        $bookId = null;

        try {
            $bookId = DB::table('books')->insertGetId([
                'title'              => $request->title,
                'description'        => $request->description,
                'category_id'        => $request->category_id,
                'original_file_path' => '',
                'uploaded_by'        => $request->uploaded_by,
                'upload_date'        => now(),
            ]);

            $bookFolder  = "book_{$bookId}";
            $pdfFolder   = "{$bookFolder}/books";
            $pagesFolder = "{$bookFolder}/book_pages";

            $file     = $request->file('pdf_file');
            $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
            $fileName = time() . "_{$baseName}.pdf";

            $pdfPath = $file->storeAs($pdfFolder, $fileName, 'local');

            DB::table('books')->where('id', $bookId)->update(['original_file_path' => $pdfPath]);

            $imagick = new \Imagick();
            $imagick->setResolution(200, 200);
            $imagick->readImage(Storage::disk('local')->path($pdfPath));

            foreach ($imagick as $index => $image) {
                $pageNumber   = $index + 1;
                $pageFile     = "page_{$pageNumber}.jpg";
                $pageFullPath = Storage::disk('local')->path("{$pagesFolder}/{$pageFile}");
                if (!is_dir(dirname($pageFullPath))) {
                    mkdir(dirname($pageFullPath), 0755, true);
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

            return response()->json(['message' => 'Book uploaded successfully', 'book_id' => $bookId], 201);

        } catch (\Exception $e) {
            if ($bookId) {
                Storage::disk('local')->deleteDirectory("book_{$bookId}");
                DB::table('books')->where('id', $bookId)->delete();
                DB::table('book_pages')->where('book_id', $bookId)->delete();
            }
            return response()->json(['error' => 'Upload failed: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'pdf_file'    => 'nullable|mimes:pdf|max:10240',
            'category_id' => 'sometimes|required|integer|exists:categories,id',
        ]);

        $book = DB::table('books')->where('id', $id)->first();
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        try {
            $updateData = $request->only(['title', 'description', 'category_id']);

            if ($request->hasFile('pdf_file')) {
                if ($book->original_file_path) Storage::disk('local')->delete($book->original_file_path);
                Storage::disk('local')->deleteDirectory("book_{$id}/book_pages");
                DB::table('book_pages')->where('book_id', $id)->delete();

                $bookFolder  = "book_{$id}";
                $pdfFolder   = "{$bookFolder}/books";
                $pagesFolder = "{$bookFolder}/book_pages";

                $file     = $request->file('pdf_file');
                $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
                $fileName = time() . "_{$baseName}.pdf";

                $pdfPath = $file->storeAs($pdfFolder, $fileName, 'local');
                $updateData['original_file_path'] = $pdfPath;

                $imagick = new \Imagick();
                $imagick->setResolution(200, 200);
                $imagick->readImage(Storage::disk('local')->path($pdfPath));

                foreach ($imagick as $index => $image) {
                    $pageNumber   = $index + 1;
                    $pageFile     = "page_{$pageNumber}.jpg";
                    $pageFullPath = Storage::disk('local')->path("{$pagesFolder}/{$pageFile}");
                    if (!is_dir(dirname($pageFullPath))) mkdir(dirname($pageFullPath), 0755, true);

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

            if (!empty($updateData)) {
                DB::table('books')->where('id', $id)->update($updateData);
            }

            $updatedBook = DB::table('books')
                ->join('categories', 'books.category_id', '=', 'categories.id')
                ->select('books.*', 'categories.name as category_name')
                ->where('books.id', $id)
                ->first();

            return response()->json(['message' => 'Book updated successfully', 'book' => $updatedBook]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Update failed: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $book = DB::table('books')->where('id', $id)->first();
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        try {
            if ($book->original_file_path) Storage::disk('local')->delete($book->original_file_path);
            Storage::disk('local')->deleteDirectory("book_{$id}");
            DB::table('book_pages')->where('book_id', $id)->delete();
            DB::table('books')->where('id', $id)->delete();

            return response()->json(['message' => 'Book deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Delete failed: ' . $e->getMessage()], 500);
        }
    }

    public function servePage($book, $filename)
    {
        $path = storage_path("app/private/book_{$book}/book_pages/{$filename}");
        if (!file_exists($path)) abort(404);
        return response()->file($path);
    }

    public function listMyBooks(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);

        $bookIds = DB::table('book_user_access')->where('user_id', $user->id)->pluck('book_id');
        $books   = DB::table('books')->whereIn('id', $bookIds)->get();

        return response()->json($books);
    }

    public function serveAudio($book, $filename)
    {
        $path = storage_path("app/private/book_{$book}/audio_file/{$filename}");
        if (!file_exists($path)) return response()->json(['error' => 'Audio file not found'], 404);

        return response()->file($path, [
            'Content-Type'   => mime_content_type($path) ?: 'audio/mpeg',
            'Content-Length' => filesize($path),
            'Accept-Ranges'  => 'bytes',
            'Cache-Control'  => 'public, max-age=3600',
        ]);
    }
}
