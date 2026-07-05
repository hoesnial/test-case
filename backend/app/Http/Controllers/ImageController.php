<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // max 5MB (5120 KB)
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');

            // Generate unique filename
            $filename = Str::random(20) . '.' . $image->getClientOriginalExtension();

            // Store in public/images directory
            $path = $image->storeAs('images', $filename, 'public');

            // Generate FULL public URL with domain
            $url = url(Storage::url($path));

            return response()->json([
                'url' => $url,
                'path' => $path,
            ], 200);
        }

        return response()->json([
            'error' => 'No image file provided',
        ], 400);
    }
}
