<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookPage extends Model
{
    use HasFactory;

    protected $table = 'book_pages';

    protected $fillable = [
        'book_id',
        'page_number',
        'page_path',
        'audio_path'
    ];

    public $timestamps = true;

    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }
}
