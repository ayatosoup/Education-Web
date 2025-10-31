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

        $defaultPositions = DB::table('book_page_player_positions')
            ->where('book_id', $id)
            ->get(['page_number', 'audio_position', 'video_position'])
            ->keyBy('page_number')
            ->map(function($item) {
                return [
                    'audio' => $item->audio_position ? json_decode($item->audio_position, true) : null,
                    'video' => $item->video_position ? json_decode($item->video_position, true) : null,
                ];
            });

        $userPositions = DB::table('user_book_page_player_positions')
            ->where('book_id', $id)
            ->where('user_id', Auth::id())
            ->get(['page_number', 'audio_position', 'video_position'])
            ->keyBy('page_number')
            ->map(function($item) {
                return [
                    'audio' => $item->audio_position ? json_decode($item->audio_position, true) : null,
                    'video' => $item->video_position ? json_decode($item->video_position, true) : null,
                ];
            });

        $playerPositions = [];
        foreach ($book->pages as $page) {
            $pageNum = $page->page_number;
            $playerPositions[$pageNum] = [
                'audio' => $userPositions[$pageNum]['audio'] ?? $defaultPositions[$pageNum]['audio'] ?? ['x' => 20, 'y' => 20],
                'video' => $userPositions[$pageNum]['video'] ?? $defaultPositions[$pageNum]['video'] ?? ['x' => 50, 'y' => 50],
            ];
        }

        $book->playerPositions = $playerPositions;

        return response()->json($book);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'pdf_file'     => 'required|mimes:pdf|max:10240',
            'uploaded_by'  => 'required|integer|exists:users,id',
            'category_id'  => 'required|integer|exists:categories,id',
        ]);

        $bookId = null;

        try {
            $pdf = $request->file('pdf_file');
            $bookFolder = "book_temp_" . time(); 
            $pdfFileName = 'original.pdf';
            $pdfPath = $pdf->storeAs($bookFolder, $pdfFileName, 'local');

            $bookId = DB::table('books')->insertGetId([
                'title'              => $request->title,
                'description'        => $request->description,
                'category_id'        => $request->category_id,
                'uploaded_by'        => $request->uploaded_by,
                'original_file_path' => $pdfPath, 
                'upload_date'        => now(),
            ]);

            $actualBookFolder = "book_{$bookId}";
            $tempPath = Storage::disk('local')->path($bookFolder);
            $actualPath = Storage::disk('local')->path($actualBookFolder);
            rename($tempPath, $actualPath);

            DB::table('books')->where('id', $bookId)->update([
                'original_file_path' => "{$actualBookFolder}/{$pdfFileName}"
            ]);

            $pagesFolder = "{$actualBookFolder}/book_pages";
            $tmpPdf = Storage::disk('local')->path("{$actualBookFolder}/{$pdfFileName}");

            $probe = new \Imagick();
            $probe->pingImage($tmpPdf);
            $numPages = $probe->getNumberImages();
            $probe->clear();
            $probe->destroy();

            for ($i = 0; $i < $numPages; $i++) {
                $pageNumber  = $i + 1;
                $pageFile    = "page_{$pageNumber}.png";
                $pageFullPath = Storage::disk('local')->path("{$pagesFolder}/{$pageFile}");

                if (!is_dir(dirname($pageFullPath))) {
                    mkdir(dirname($pageFullPath), 0755, true);
                }

                $pageImagick = new \Imagick();
                $pageImagick->setResolution(300, 300);
                $pageImagick->readImage($tmpPdf . "[" . $i . "]");
                $pageImagick->setImageBackgroundColor('white');
                $flattened = $pageImagick->mergeImageLayers(\Imagick::LAYERMETHOD_FLATTEN);
                $flattened->setImageColorspace(\Imagick::COLORSPACE_RGB);
                $flattened->setImageFormat('png');
                $flattened->writeImage($pageFullPath);

                $flattened->clear();
                $flattened->destroy();
                $pageImagick->clear();
                $pageImagick->destroy();

                DB::table('book_pages')->insert([
                    'book_id'     => $bookId,
                    'page_number' => $pageNumber,
                    'page_path'   => "{$pagesFolder}/{$pageFile}",
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

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

    public function update(Request $request, $id)
    {
        $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'pdf_file'    => 'nullable|mimes:pdf|max:10240',
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'page_number' => 'nullable|integer|required_with:audio_file,video_link',
            'audio_file'  => 'nullable|mimes:mp3,wav,m4a,ogg|max:20480',
            'video_link'  => 'nullable|url|string|max:500',
        ]);

        $book = DB::table('books')->where('id', $id)->first();
        if (!$book) return response()->json(['error' => 'Book not found'], 404);

        try {
            $updateData = $request->only(['title','description','category_id']);

            if ($request->hasFile('pdf_file')) {
                Storage::disk('local')->deleteDirectory("book_{$id}/book_pages");
                DB::table('book_pages')->where('book_id',$id)->delete();

                $pagesFolder = "book_{$id}/book_pages";
                $tmpPdf = $request->file('pdf_file')->getPathname();

                $probe = new \Imagick();
                $probe->pingImage($tmpPdf);
                $numPages = $probe->getNumberImages();
                $probe->clear();
                $probe->destroy();

                for ($i = 0; $i < $numPages; $i++) {
                    $pageNumber  = $i + 1;
                    $pageFile    = "page_{$pageNumber}.png";
                    $pageFullPath = Storage::disk('local')->path("{$pagesFolder}/{$pageFile}");
                    if (!is_dir(dirname($pageFullPath))) mkdir(dirname($pageFullPath), 0755, true);

                    $pageImagick = new \Imagick();
                    $pageImagick->setResolution(300, 300);
                    $pageImagick->readImage($tmpPdf . "[" . $i . "]");
                    $pageImagick->setImageBackgroundColor('white');
                    $flattened = $pageImagick->mergeImageLayers(\Imagick::LAYERMETHOD_FLATTEN);
                    $flattened->setImageColorspace(\Imagick::COLORSPACE_RGB);
                    $flattened->setImageFormat('png');
                    $flattened->writeImage($pageFullPath);

                    $flattened->clear();
                    $flattened->destroy();
                    $pageImagick->clear();
                    $pageImagick->destroy();

                    DB::table('book_pages')->insert([
                        'book_id'     => $id,
                        'page_number' => $pageNumber,
                        'page_path'   => "{$pagesFolder}/{$pageFile}",
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                }
            }

            // update audio/video for a page
            if ($request->filled('page_number')) {
                $page = DB::table('book_pages')
                    ->where('book_id', $id)
                    ->where('page_number', $request->page_number)
                    ->first();

                if (!$page) {
                    return response()->json([
                        'error' => "Page number {$request->page_number} not found"
                    ], 404);
                }

                $pageUpdateData = [];

                if ($request->boolean('remove_audio')) {
                    if ($page->audio_path && Storage::disk('local')->exists($page->audio_path)) {
                        Storage::disk('local')->delete($page->audio_path);
                    }
                    $pageUpdateData['audio_path'] = null;
                }

                if ($request->hasFile('audio_file')) {
                    if ($page->audio_path && Storage::disk('local')->exists($page->audio_path)) {
                        Storage::disk('local')->delete($page->audio_path);
                    }

                    $audioFolder = "book_{$id}/audio_file";
                    $audioFile  = $request->file('audio_file');
                    $audioName  = 'page_' . $request->page_number . '_' . time() . '.' . $audioFile->getClientOriginalExtension();
                    $path = $audioFile->storeAs($audioFolder, $audioName, 'local');
                    $pageUpdateData['audio_path'] = $path;
                }

                if ($request->has('video_link')) {
                    $pageUpdateData['video_link'] = $request->video_link;
                }

                if (!empty($pageUpdateData)) {
                    $pageUpdateData['updated_at'] = now();
                    DB::table('book_pages')->where('id', $page->id)->update($pageUpdateData);
                }
            }

            if (!empty($updateData)) {
                DB::table('books')->where('id',$id)->update($updateData);
            }

            $updatedBook = DB::table('books')
                ->join('categories','books.category_id','=','categories.id')
                ->select('books.*','categories.name as category_name')
                ->where('books.id',$id)
                ->first();

            return response()->json(['message'=>'Book updated successfully','book'=>$updatedBook]);

        } catch (\Exception $e) {
            return response()->json(['error'=>'Update failed: '.$e->getMessage()],500);
        }
    }

    public function destroy($id)
    {
        $book = DB::table('books')->where('id',$id)->first();
        if (!$book) return response()->json(['error'=>'Book not found'],404);

        try {
            Storage::disk('local')->deleteDirectory("book_{$id}");
            DB::table('book_pages')->where('book_id',$id)->delete();
            DB::table('book_user_access')->where('book_id',$id)->delete();
            DB::table('annotations')->where('book_id',$id)->delete();
            DB::table('book_page_player_positions')->where('book_id',$id)->delete();
            DB::table('user_book_page_player_positions')->where('book_id',$id)->delete();
            DB::table('books')->where('id',$id)->delete();

            return response()->json(['message'=>'Book deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error'=>'Delete failed: '.$e->getMessage()],500);
        }
    }

    public function servePage($book,$filename)
    {
        $path = storage_path("app/private/book_{$book}/book_pages/{$filename}");
        if (!file_exists($path)) abort(404);
        return response()->file($path);
    }

    public function serveAudio(Request $request, $book, $filenameWithoutExt)
    {
        if ($request->header('X-Requested-With') !== 'XMLHttpRequest') {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $user = $request->user();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $audioFolder = storage_path("app/private/book_{$book}/audio_file/");
        $audioPath = null;
        $extensions = ['mp3','wav','m4a','ogg'];
        foreach ($extensions as $ext) {
            $p = $audioFolder . $filenameWithoutExt . '.' . $ext;
            if (file_exists($p)) { $audioPath = $p; break; }
        }
        if (!$audioPath) {
            return response()->json(['error'=>'Audio not found'], 404);
        }

        return response()->stream(function() use ($audioPath) {
            $handle = fopen($audioPath, 'rb');
            while (!feof($handle)) {
                echo fread($handle, 1024 * 8);
                flush();
            }
            fclose($handle);
        }, 200, [
            'Content-Type' => 'application/octet-stream',
            'Cache-Control' => 'no-store, private, max-age=0',
        ]);
    }

    public function listMyBooks(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['success'=>false,'message'=>'Unauthenticated'],401);

        $bookIds = DB::table('book_user_access')
            ->where('user_id',$user->id)
            ->pluck('book_id')
            ->toArray();

        $books = DB::table('books')->whereIn('id',$bookIds)->get();
        return response()->json($books);
    }
}
