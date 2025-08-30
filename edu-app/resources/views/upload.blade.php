<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your App</title>
    <!-- Replace with actual CSS filename from public/assets/ after copying dist folder -->
    <link rel="stylesheet" href="{{ asset('assets/index-abc123.css') }}">
</head>
<body>
    <div id="root"></div>
    <!-- Replace with actual JS filename from public/assets/ after copying dist folder -->
    <script src="{{ asset('assets/index-xyz789.js') }}"></script>

    <!-- Your original upload form (if you still need it) -->
    <div style="display: none;" id="upload-form">
        @if(session('success'))
            <p style="color: green;">{{ session('success') }}</p>
        @endif

        @if(session('error'))
            <p style="color: red;">{{ session('error') }}</p>
        @endif

        <form action="{{ route('upload.submit') }}" method="post" enctype="multipart/form-data">
            @csrf
            <label for="pdf_file">Select PDF to upload:</label>
            <input type="file" name="pdf_file" id="pdf_file" accept=".pdf" required>
            <button type="submit">Upload PDF</button>
        </form>
    </div>
</body>
</html>