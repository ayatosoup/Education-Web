<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $user]);
    }

    public function store(Request $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role
            ]);
            return response()->json(['success' => true, 'data' => $user], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $user->update([
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
            'role' => $request->role ?? $user->role
        ]);

        return response()->json(['success' => true, 'data' => $user]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['success' => true, 'message' => 'User deleted']);
    }

    public function syncBookAccess(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'book_ids' => 'array',
            'book_ids.*' => 'integer|exists:books,id'
        ]);

        DB::table('book_user_access')->where('user_id', $request->user_id)->delete();

        if (!empty($request->book_ids)) {
            $insertData = collect($request->book_ids)->map(fn ($bookId) => [
                'user_id' => $request->user_id,
                'book_id' => $bookId,
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray();

            DB::table('book_user_access')->insert($insertData);
        }

        return response()->json(['success' => true, 'message' => 'Access synchronized.']);
    }

    public function listUserBooks($userId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $books = DB::table('book_user_access')
            ->where('user_id', $userId)
            ->pluck('book_id');

        return response()->json(['success' => true, 'user_id' => $userId, 'books' => $books]);
    }
}
