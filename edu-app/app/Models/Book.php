<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $table = 'books';

    protected $fillable = [
        'title',
        'field',
        'original_file_path',
        'upload_date',
        'cover_path'
    ];

    public $timestamps = false;

    public function pages()
    {
        return $this->hasMany(BookPage::class, 'book_id');
    }
}
