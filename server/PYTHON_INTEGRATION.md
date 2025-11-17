# Python Integration in Server

## How It Works

The Node.js server **does NOT run Python separately**. Instead:

1. **Node.js spawns Python as a child process** when needed
2. Python script runs, processes audio, and exits
3. Node.js receives the JSON output from Python
4. Results are sent back to the client

```
Client Request → Node.js API → Spawn Python → ML Processing → Return JSON → Node.js → Client Response
```

## Architecture

```
User uploads audio
    ↓
Express API receives file
    ↓
audioAnalyzer.js spawns Python subprocess
    ↓
analyze_audio.py runs:
    - Loads audio with librosa
    - Extracts features
    - Loads CatBoost model
    - Makes prediction
    - Outputs JSON to stdout
    ↓
Node.js captures stdout
    ↓
Parse JSON and return to client
```

## Setup Python Virtual Environment

### Quick Setup (Recommended)

```powershell
cd server
npm run setup:python
```

This will:
- Create a `venv` folder in the server directory
- Install all Python dependencies from `requirements.txt`
- Configure the environment

### Manual Setup

```powershell
cd server

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Update .env Configuration

After setting up the venv, update your `.env` file:

```env
PYTHON_PATH=venv/Scripts/python.exe
```

This tells Node.js to use the Python from your virtual environment instead of the system Python.

## How Python is Called from Node.js

In `src/utils/audioAnalyzer.js`:

```javascript
const pythonProcess = spawn(pythonPath, [pythonScript, audioPath, modelPath]);
```

This spawns a new Python process each time an audio file is analyzed:
- **pythonPath**: Path to Python executable (from .env)
- **pythonScript**: Path to `analyze_audio.py`
- **audioPath**: Path to uploaded audio file
- **modelPath**: Path to `catboost_model.pkl`

## Key Files

### `src/utils/analyze_audio.py`
Standalone Python script that:
- Takes command-line arguments (audio path, model path)
- Processes audio using librosa
- Loads model with joblib
- Returns JSON to stdout
- Can be run independently for testing:
  ```bash
  python src/utils/analyze_audio.py <audio_file> <model_path>
  ```

### `src/utils/audioAnalyzer.js`
Node.js wrapper that:
- Spawns Python subprocess
- Captures stdout/stderr
- Parses JSON output
- Handles errors

## Testing Python Script Independently

You can test the Python script separately:

```powershell
# Activate venv
.\venv\Scripts\Activate.ps1

# Run the script
python src/utils/analyze_audio.py path/to/audio.wav ./catboost_model.pkl
```

Output will be JSON:
```json
{
  "prediction": "Real",
  "isFake": false,
  "confidence": 95.5,
  "audioStats": {
    "duration": 3.45,
    "sampleRate": 22050,
    "featuresCount": 26
  }
}
```

## Advantages of This Approach

✅ **No separate Python server needed**
✅ **Python only runs when needed** (efficient)
✅ **Isolated environments** (Node.js and Python dependencies separated)
✅ **Easy deployment** (single Node.js server)
✅ **Simple process management** (no need to manage two servers)

## Dependencies

### Node.js Dependencies (package.json)
- express
- cors
- multer
- dotenv

### Python Dependencies (requirements.txt)
- librosa (audio processing)
- numpy (numerical computing)
- joblib (model loading)
- soundfile (audio I/O)
- catboost (ML model)

## Troubleshooting

### Python not found
Update `PYTHON_PATH` in `.env`:
```env
# For venv
PYTHON_PATH=venv/Scripts/python.exe

# For system Python
PYTHON_PATH=python

# Full path
PYTHON_PATH=C:/Python311/python.exe
```

### Module not found errors
Ensure venv is created and packages are installed:
```powershell
cd server
.\venv\Scripts\Activate.ps1
pip list  # Check installed packages
pip install -r requirements.txt
```

### Model not found
Update `MODEL_PATH` in `.env`:
```env
MODEL_PATH=./catboost_model.pkl  # Relative to server folder

## Running the Server

```powershell
cd server

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will:
1. Start on port 5000
2. Wait for API requests
3. Spawn Python when needed for analysis
4. Return results to client

**No need to run Python separately!** 🎉
