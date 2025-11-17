const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeAudio } = require('../utils/audioAnalyzer');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /wav|mp3|webm|ogg|m4a/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                     file.mimetype === 'audio/wav' || 
                     file.mimetype === 'audio/mpeg' ||
                     file.mimetype === 'audio/webm' ||
                     file.mimetype === 'audio/ogg' ||
                     file.mimetype === 'audio/x-wav';
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Audio files only (.wav, .mp3, .webm, .ogg, .m4a)'));
    }
  }
});

// POST /api/analyze - Analyze uploaded audio
router.post('/analyze', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided'
      });
    }

    console.log('📁 File received:', req.file.originalname);
    console.log('📊 Analyzing audio...');

    // Analyze the audio file
    const result = await analyzeAudio(req.file.path);

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Error analyzing audio'
    });
  }
});

module.exports = router;
