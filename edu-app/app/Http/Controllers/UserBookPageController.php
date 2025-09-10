<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserBookPageController extends Controller
{
    public function getUserBookPages($userId, $bookId)
    {
        $pages = DB::table('user_book_pages')
            ->join('book_pages', 'user_book_pages.book_page_id', '=', 'book_pages.id')
            ->where('user_book_pages.user_id', $userId)
            ->where('book_pages.book_id', $bookId)
            ->select('user_book_pages.*', 'book_pages.page_number', 'book_pages.page_path')
            ->get();

        return response()->json($pages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'book_page_id' => 'required|integer|exists:book_pages,id',
            'custom_notes' => 'nullable|string',
            'annotation_data' => 'nullable|json',
            'custom_file' => 'nullable|file|max:10240'
        ]);

        $customFilePath = null;
        if ($request->hasFile('custom_file')) {
            $file = $request->file('custom_file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/user_pages/'), $fileName);
            $customFilePath = 'uploads/user_pages/' . $fileName;
        }

        $id = DB::table('user_book_pages')->insertGetId([
            'user_id' => $request->user_id,
            'book_page_id' => $request->book_page_id,
            'custom_notes' => $request->custom_notes,
            'annotation_data' => $request->annotation_data,
            'custom_file_path' => $customFilePath,
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Annotation added', 'id' => $id], 201);
    }

    public function update(Request $request, $id)
    {
        $page = DB::table('user_book_pages')->where('id', $id)->first();
        if (!$page) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $updateData = [
            'custom_notes' => $request->custom_notes,
            'annotation_data' => $request->annotation_data,
            'updated_at' => now()
        ];

        if ($request->hasFile('custom_file')) {
            if ($page->custom_file_path && file_exists(public_path($page->custom_file_path))) {
                unlink(public_path($page->custom_file_path));
            }
            $file = $request->file('custom_file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/user_pages/'), $fileName);
            $updateData['custom_file_path'] = 'uploads/user_pages/' . $fileName;
        }

        DB::table('user_book_pages')->where('id', $id)->update($updateData);

        return response()->json(['message' => 'Annotation updated']);
    }

    public function destroy($id)
    {
        $page = DB::table('user_book_pages')->where('id', $id)->first();
        if (!$page) {
            return response()->json(['error' => 'Not found'], 404);
        }

        if ($page->custom_file_path && file_exists(public_path($page->custom_file_path))) {
            unlink(public_path($page->custom_file_path));
        }

        DB::table('user_book_pages')->where('id', $id)->delete();

        return response()->json(['message' => 'Annotation deleted']);
    }
}
