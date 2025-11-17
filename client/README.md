# AI Voice Detection - Frontend (Next.js)

Modern React-based frontend for AI-Generated Voice Detection application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 📁 **Audio Upload**: Upload WAV or MP3 files for analysis
- 🎙️ **Voice Recording**: Record audio directly in the browser
- 🎯 **Real-time Analysis**: Get instant predictions on voice authenticity
- 📊 **Detailed Statistics**: View audio metrics and confidence scores
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## Prerequisites

- Node.js 18+ installed
- Backend server running (see `../server/README.md`)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env.local` file (already created):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running the Application

Development mode:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
client/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── AudioUpload.tsx     # File upload component
│   ├── AudioRecorder.tsx   # Voice recording component
│   ├── AnalysisResult.tsx  # Results display component
│   └── InfoSection.tsx     # Info accordion component
├── lib/
│   └── api.ts           # API client functions
├── public/              # Static assets
└── package.json
```

## Usage

1. **Upload Audio**: 
   - Click the "Upload Audio" tab
   - Select a WAV or MP3 file (max 10MB)
   - Click "Analyze Voice"

2. **Record Audio**:
   - Click the "Record Audio" tab
   - Click the microphone icon to start recording
   - Click again to stop
   - Click "Analyze Voice"

3. **View Results**:
   - See if the voice is Real or Fake
   - View confidence score
   - Check audio statistics

## API Integration

The frontend communicates with the backend API at `http://localhost:5000`:

- `POST /api/analyze` - Analyze audio file
- `GET /api/health` - Check server health

## Customization

### Styling
Modify `tailwind.config.js` to customize colors and theme:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* custom colors */ }
    }
  }
}
```

### API URL
Change the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

## Troubleshooting

**Port already in use:**
```bash
# Use a different port
PORT=3001 npm run dev
```

**API connection issues:**
- Ensure backend server is running on port 5000
- Check `.env.local` has correct API URL
- Verify CORS is enabled on backend

## License

MIT
