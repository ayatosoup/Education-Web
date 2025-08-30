<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function showForm()
    {
        // Akan membuka file resources/views/upload/pdf.blade.php
        return view('upload');
    }
    public function handleUpload(Request $request)
    {
        if ($request->hasFile('pdf_file')) {
            $file = $request->file('pdf_file');
            $extension = $file->getClientOriginalExtension();

            // cek pdf
            if ($extension !== 'pdf') {
                return back()->with('error', 'Sorry, only PDF files are allowed.');
            }

            // simpan pdf
            $targetDir = public_path('uploads/');
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

            $targetFile = $targetDir . $file->getClientOriginalName();
            $file->move($targetDir, $file->getClientOriginalName());

            // proses pdf ke images
            $imagick = new \Imagick();
            $imagick->setResolution(300, 300);
            $imagick->readImage($targetFile);

            $outputDir = public_path('images/');
            if (!file_exists($outputDir)) {
                mkdir($outputDir, 0777, true);
            }

            foreach ($imagick as $index => $image) {
                $image->setImageFormat('jpg');
                $image->writeImage($outputDir . 'page_' . ($index + 1) . '.jpg');
            }

            $imagick->clear();
            $imagick->destroy();

            return back()->with('success', 'PDF uploaded and images extracted.');
        }

        return back()->with('error', 'No file uploaded.');
    }
}
