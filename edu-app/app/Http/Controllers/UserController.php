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
        // Ambil semua data user
        $users = User::all();

        // Kirim sebagai JSON
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function show($id)
    {
        // Ambil data user berdasarkan ID
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $user]);
    }

    public function store(Request $request)
    {
        //Membuat user baru
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
        // Perbarui data user berdasarkan ID
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
        // Hapus user berdasarkan ID
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['success' => true, 'message' => 'User deleted']);
    }

    // Give a user access to a book
    public function giveBookAccess(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'book_id' => 'required|integer'
        ]);

        $exists = DB::table('book_user_access')
            ->where('user_id', $request->user_id)
            ->where('book_id', $request->book_id)
            ->exists();

        if (!$exists) {
            DB::table('book_user_access')->insert([
                'user_id'    => $request->user_id,
                'book_id'    => $request->book_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return response()->json(['success' => true, 'message' => 'Access granted.']);
        }

        return response()->json(['success' => false, 'message' => 'User already has access.']);
    }

    // Remove a user's access to a book
    public function removeBookAccess(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'book_id' => 'required|integer'
        ]);

        $deleted = DB::table('book_user_access')
            ->where('user_id', $request->user_id)
            ->where('book_id', $request->book_id)
            ->delete();

        if ($deleted) {
            return response()->json(['success' => true, 'message' => 'Access removed.']);
        }

        return response()->json(['success' => false, 'message' => 'User did not have access.']);
    }

    // List all books a user can access
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
