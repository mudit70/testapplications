<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        return Post::all();
    }

    public function show(int $id)
    {
        return Post::find($id);
    }

    public function store(Request $request)
    {
        return Post::create([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'author' => $request->input('author'),
        ]);
    }

    public function destroy(int $id)
    {
        Post::destroy($id);

        return response()->json(['deleted' => true]);
    }
}
