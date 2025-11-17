# AI Voice Detection - Backend Server

Backend API for AI-Generated Voice Detection application.

## Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Set up Python virtual environment and dependencies:
```bash
# Run the setup script (recommended)
.\setup-python.ps1

# Or manually:
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

3. **Install FFmpeg** (required for audio recording support):
```bash
# Using Chocolatey
choco install ffmpeg

# Or using Winget
winget install ffmpeg

# Verify installation
ffmpeg -version
```
See `FFMPEG_SETUP.md` for detailed instructions.

4. Ensure the `catboost_model.pkl` file is in the parent directory.

5. Configure environment variables in `.env` file:
   - Update `PYTHON_PATH` to use the venv Python: `venv/Scripts/python.exe`

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### POST /api/analyze
Upload and analyze an audio file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `audio` file (WAV or MP3)

**Response:**
```json
{
  "success": true,
  "prediction": "Real" | "Fake",
  "confidence": 95.5,
  "isFake": false,
  "audioStats": {
    "duration": 3.45,
    "sampleRate": 22050,
    "featuresCount": 26
  }
}
```

### GET /api/health
Check server health status.
