<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, int $id)
    {
        return Comment::create([
            'post_id' => $id,
            'author' => $request->input('author'),
            'body' => $request->input('body'),
        ]);
    }
}
