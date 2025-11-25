# RealVoice AI - Advanced neural analysis for synthetic voice detection

<img width="1793" height="943" alt="Screenshot 2025-11-18 171354" src="https://github.com/user-attachments/assets/d7267606-a355-48d4-a522-a70280484d72" />

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)

**RealVoice AI** is an advanced machine learning application that detects whether a voice recording is authentic (human) or AI-generated. Built with Next.js, Node.js, and Python, it provides real-time audio analysis with confidence scores.

A real-time AI-generated voice detection system leveraging MFCC, NMF, and statistical audio features to accurately classify synthetic and human voices. Trained and evaluated models including CatBoost, XGBoost, Random Forest, and KNN on over 581K samples, achieving **91% accuracy with CatBoost**.

## ✨ Features

- 🎤 **Live Audio Recording** - Record voice directly in your browser
- 📁 **File Upload Support** - Upload audio files (WAV, MP3, WebM, OGG)
- 🤖 **AI Detection** - Advanced ML model trained to distinguish real vs fake voices
- ⚡ **Real-time Analysis** - Fast processing with detailed results
- 📊 **Confidence Scores** - Get percentage-based confidence in predictions
- 📈 **Audio Statistics** - View duration, sample rate, and feature analysis
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 🔒 **Secure** - Client-side recording, server-side analysis

## 🖼️ Screenshots

### Main Interface
Clean, intuitive interface for recording or uploading audio files.

### Analysis Results
Detailed results showing prediction, confidence score, and audio statistics.

## 🏗️ Architecture

```
┌─────────────────┐       ┌──────────────────┐      ┌─────────────────┐
│   Next.js       │─────▶│   Node.js        │─────▶│   Python ML     │
│   Frontend      │       │   Express API    │      │   CatBoost      │
│   (Vercel)      │◀─────│   (VPS/PM2)      │◀─────│   + FFmpeg      │
└─────────────────┘       └──────────────────┘      └─────────────────┘
```

### Tech Stack

**Frontend:**
- ⚛️ Next.js 14 (React)
- 📘 TypeScript
- 🎨 Tailwind CSS
- 📡 Axios for API calls

**Backend:**
- 🟢 Node.js + Express
- 🐍 Python 3.8+
- 🎵 FFmpeg (audio processing)
- 🤖 CatBoost ML model
- 📦 PM2 (process management)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- FFmpeg installed globally

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohd-ravish/AI-Generated-Voice-Detection
   cd AI-Generated-Voice-Detection
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create Python virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   
   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   ```

4. **Run Development Servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```
   Backend runs on `http://localhost:5000`
   
   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

5. **Open your browser**
   
   Visit `http://localhost:3000` and start detecting AI voices!

## 📁 Project Structure

```
AI-Generated-Voice-Detection/
├── client/                    # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx        # Root layout with metadata
│   │   ├── page.tsx          # Main page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── AudioRecorder.tsx # Audio recording component
│   │   ├── AudioUpload.tsx   # File upload component
│   │   ├── AnalysisResult.tsx # Results display
│   │   └── InfoSection.tsx   # How it works section
│   └── lib/
│       └── api.ts            # API client
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── index.js          # Express server
│   │   ├── routes/
│   │   │   └── analyze.js    # Analysis endpoint
│   │   └── utils/
│   │       ├── analyze_audio.py      # Python ML script
│   │       └── audioAnalyzer.js      # Node-Python bridge
│   ├── catboost_model.pkl    # Pre-trained ML model
│   ├── package.json
│   └── requirements.txt      # Python dependencies
│
└── README.md
```

## 🎯 How It Works

1. **User Input**
   - User records audio via browser microphone OR
   - Uploads an audio file (WAV, MP3, WebM, OGG)

2. **Frontend Processing**
   - Audio is captured and converted to compatible format
   - Sent to backend API via HTTP POST request

3. **Backend Analysis**
   - Express server receives audio file
   - Temporarily saves file to disk
   - Spawns Python process with audio file path

4. **Machine Learning Analysis**
   - Python script uses FFmpeg to process audio
   - Extracts acoustic features:
     - **MFCC** (Mel-Frequency Cepstral Coefficients)
     - **RMS Energy**
     - **Spectral Centroid**
     - **Spectral Bandwidth**
     - **Spectral Rolloff**
     - **Zero Crossing Rate**
   - Loads pre-trained CatBoost ML model
   - Makes prediction: **Real** or **Fake**
   - Calculates confidence score

5. **Results Display**
   - Python returns JSON with prediction and confidence
   - Backend sends response to frontend
   - UI displays results with visual indicators
   - Temporary files are cleaned up

## 🧪 API Endpoints

### `POST /api/analyze`
Analyze audio file for authenticity.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `audio` (file)

**Response:**
```json
{
  "success": true,
  "prediction": "Real",
  "isFake": false,
  "confidence": 0.89,
  "audioStats": {
    "duration": 3.2,
    "sampleRate": 44100,
    "featuresCount": 156
  }
}
```

### `GET /api/health`
Check server health status.

**Response:**
```json
{
  "success": true,
  "message": "RealVoice AI API is running",
  "timestamp": "2025-11-25T10:30:00.000Z"
}
```

## 🔧 Configuration

### Environment Variables

**Backend** (`server/.env`):
```env
NODE_ENV=development
PORT=5000
```

**Frontend** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- ML model powered by [CatBoost](https://catboost.ai/)
- Audio processing by [FFmpeg](https://ffmpeg.org/)
- Audio feature extraction using [librosa](https://librosa.org/)

## 📧 Contact

**Mohd Ravish** - [@mohd-ravish](https://github.com/mohd-ravish)

Project Link: [https://github.com/mohd-ravish/AI-Generated-Voice-Detection](https://github.com/mohd-ravish/AI-Generated-Voice-Detection)

---

⭐ **Star this repo if you find it helpful!**  
