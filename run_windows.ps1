Set-Location $PSScriptRoot
if (-not (Test-Path .env)) {
    Write-Error "Please copy .env.example to .env and add your GROQ_API_KEY first."
    exit 1
}
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
