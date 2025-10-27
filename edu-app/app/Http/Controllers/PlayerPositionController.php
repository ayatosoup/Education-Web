<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PlayerPositionController extends Controller
{
    public function updateDefaultPosition(Request $request, $bookId, $pageNumber)
    {
        $request->validate([
            'audio_position' => 'nullable|array',
            'audio_position.x' => 'required_with:audio_position|numeric',
            'audio_position.y' => 'required_with:audio_position|numeric',
            'video_position' => 'nullable|array',
            'video_position.x' => 'required_with:video_position|numeric',
            'video_position.y' => 'required_with:video_position|numeric',
        ]);

        try {
            $existing = DB::table('book_page_player_positions')
                ->where('book_id', $bookId)
                ->where('page_number', $pageNumber)
                ->first();

            $data = [
                'book_id' => $bookId,
                'page_number' => $pageNumber,
                'updated_at' => now(),
            ];

            if ($request->has('audio_position')) {
                $audioPos = $request->input('audio_position');
                $data['audio_position'] = json_encode($audioPos);
                Log::info('Saving audio position:', ['audio' => $audioPos, 'json' => $data['audio_position']]);
            } else if ($existing && $existing->audio_position) {
                $data['audio_position'] = $existing->audio_position;
            }

            if ($request->has('video_position')) {
                $videoPos = $request->input('video_position');
                $data['video_position'] = json_encode($videoPos);
                Log::info('Saving video position:', ['video' => $videoPos, 'json' => $data['video_position']]);
            } else if ($existing && $existing->video_position) {
                $data['video_position'] = $existing->video_position;
            }

            if ($existing) {
                DB::table('book_page_player_positions')
                    ->where('id', $existing->id)
                    ->update($data);
                
                Log::info('Updated existing position', ['id' => $existing->id, 'data' => $data]);
            } else {
                $data['created_at'] = now();
                $id = DB::table('book_page_player_positions')->insertGetId($data);
                
                Log::info('Inserted new position', ['id' => $id, 'data' => $data]);
            }

            $saved = DB::table('book_page_player_positions')
                ->where('book_id', $bookId)
                ->where('page_number', $pageNumber)
                ->first();

            return response()->json([
                'message' => 'Default player positions updated successfully',
                'data' => [
                    'audio_position' => $saved->audio_position ? json_decode($saved->audio_position, true) : null,
                    'video_position' => $saved->video_position ? json_decode($saved->video_position, true) : null,
                ],
                'saved_record' => $saved
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to save default position:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateUserPosition(Request $request, $bookId, $pageNumber)
    {
        $request->validate([
            'audio_position' => 'nullable|array',
            'audio_position.x' => 'required_with:audio_position|numeric',
            'audio_position.y' => 'required_with:audio_position|numeric',
            'video_position' => 'nullable|array',
            'video_position.x' => 'required_with:video_position|numeric',
            'video_position.y' => 'required_with:video_position|numeric',
        ]);

        try {
            $userId = Auth::id();
            
            $existing = DB::table('user_book_page_player_positions')
                ->where('user_id', $userId)
                ->where('book_id', $bookId)
                ->where('page_number', $pageNumber)
                ->first();

            $data = [
                'user_id' => $userId,
                'book_id' => $bookId,
                'page_number' => $pageNumber,
                'updated_at' => now(),
            ];

            if ($request->has('audio_position')) {
                $data['audio_position'] = json_encode($request->input('audio_position'));
            } else if ($existing && $existing->audio_position) {
                $data['audio_position'] = $existing->audio_position;
            }

            if ($request->has('video_position')) {
                $data['video_position'] = json_encode($request->input('video_position'));
            } else if ($existing && $existing->video_position) {
                $data['video_position'] = $existing->video_position;
            }

            if ($existing) {
                DB::table('user_book_page_player_positions')
                    ->where('id', $existing->id)
                    ->update($data);
            } else {
                $data['created_at'] = now();
                DB::table('user_book_page_player_positions')->insert($data);
            }

            return response()->json([
                'message' => 'Player positions saved successfully',
                'data' => [
                    'audio_position' => $request->input('audio_position'),
                    'video_position' => $request->input('video_position'),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to save user position:', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getPagePositions($bookId, $pageNumber)
    {
        $userId = Auth::id();

        $defaultPos = DB::table('book_page_player_positions')
            ->where('book_id', $bookId)
            ->where('page_number', $pageNumber)
            ->first();

        $userPos = DB::table('user_book_page_player_positions')
            ->where('user_id', $userId)
            ->where('book_id', $bookId)
            ->where('page_number', $pageNumber)
            ->first();

        $result = [
            'audio' => ['x' => 20, 'y' => 20],
            'video' => ['x' => 50, 'y' => 50],
        ];

        if ($defaultPos) {
            if ($defaultPos->audio_position) {
                $decoded = json_decode($defaultPos->audio_position, true);
                if ($decoded) {
                    $result['audio'] = $decoded;
                }
            }
            if ($defaultPos->video_position) {
                $decoded = json_decode($defaultPos->video_position, true);
                if ($decoded) {
                    $result['video'] = $decoded;
                }
            }
        }

        if ($userPos) {
            if ($userPos->audio_position) {
                $decoded = json_decode($userPos->audio_position, true);
                if ($decoded) {
                    $result['audio'] = $decoded;
                }
            }
            if ($userPos->video_position) {
                $decoded = json_decode($userPos->video_position, true);
                if ($decoded) {
                    $result['video'] = $decoded;
                }
            }
        }

        return response()->json($result);
    }
}