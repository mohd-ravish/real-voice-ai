# Setup Python Virtual Environment for Server

Write-Host "🐍 Setting up Python virtual environment for server..." -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Virtual environment created!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
    exit 1
}

# Activate virtual environment and install packages
Write-Host "📥 Installing Python packages..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

pip install --upgrade pip
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Python packages installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install packages" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✨ Python environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Configuration needed:" -ForegroundColor Cyan
Write-Host "Update the .env file with:" -ForegroundColor White
Write-Host 'PYTHON_PATH=venv\Scripts\python.exe' -ForegroundColor Gray
Write-Host ""
