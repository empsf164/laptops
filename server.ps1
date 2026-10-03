$port = 8088
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Server listening on $prefix..."

$baseDir = Get-Location

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = $request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($urlPath)) {
        $urlPath = "index.html"
    }

    $filePath = Join-Path $baseDir $urlPath

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = "text/plain"
        switch ($ext) {
            ".html" { $contentType = "text/html; charset=utf-8" }
            ".css"  { $contentType = "text/css; charset=utf-8" }
            ".js"   { $contentType = "application/javascript; charset=utf-8" }
            ".json" { $contentType = "application/json; charset=utf-8" }
            ".png"  { $contentType = "image/png" }
            ".jpg"  { $contentType = "image/jpeg" }
            ".jpeg" { $contentType = "image/jpeg" }
            ".svg"  { $contentType = "image/svg+xml" }
            ".webp" { $contentType = "image/webp" }
            ".ico"  { $contentType = "image/x-icon" }
        }

        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = $contentType
        $response.ContentLength64 = $bytes.Length
        $response.StatusCode = 200
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $response.OutputStream.Close()
}
