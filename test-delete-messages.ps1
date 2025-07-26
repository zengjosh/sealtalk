# Test script for delete-old-messages Edge Function

# Load environment variables from .env file
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Get environment variables
$supabaseUrl = $env:SUPABASE_URL
$supabaseKey = $env:SUPABASE_SERVICE_ROLE_KEY

# Fallback to VITE_ prefixed variables if the standard ones aren't found
if (-not $supabaseUrl) { $supabaseUrl = $env:VITE_SUPABASE_URL }
if (-not $supabaseKey) { $supabaseKey = $env:VITE_SUPABASE_KEY }

# Check if required environment variables are set
if (-not $supabaseUrl) {
    Write-Host "Error: SUPABASE_URL (or VITE_SUPABASE_URL) not found in environment variables" -ForegroundColor Red
    exit 1
}

if (-not $supabaseKey) {
    Write-Host "Error: SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_KEY) not found in environment variables" -ForegroundColor Red
    exit 1
}

# Extract project ID from Supabase URL
$projectId = ($supabaseUrl -split "//")[1] -split "\." | Select-Object -First 1

# Construct the Edge Function URL
$functionUrl = "https://$projectId.supabase.co/functions/v1/delete-old-messages"

Write-Host "Testing Edge Function at: $functionUrl" -ForegroundColor Cyan
Write-Host "Using Supabase Key: $($supabaseKey.Substring(0, 20))..." -ForegroundColor Gray

try {
    # Make the request
    $response = Invoke-WebRequest -Uri $functionUrl -Method POST -Headers @{
        "Authorization" = "Bearer $supabaseKey"
        "Content-Type" = "application/json"
    } -UseBasicParsing

    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response Body: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "Error calling Edge Function:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Body: $errorBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read error response body" -ForegroundColor Red
        }
    }
}
