<?php

namespace App\Http\Controllers;

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
}
