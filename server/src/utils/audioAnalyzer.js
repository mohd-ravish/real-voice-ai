const { spawn } = require('child_process');
const path = require('path');

/**
 * Analyze audio file using Python ML model
 * @param {string} audioPath - Path to the audio file
 * @returns {Promise} Analysis result
 */
function analyzeAudio(audioPath) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'analyze_audio.py');
    const modelPath = process.env.MODEL_PATH || path.join(__dirname, '../../catboost_model.pkl');
    
    // Auto-detect Python path based on environment
    let pythonPath = process.env.PYTHON_PATH;
    if (!pythonPath) {
      // Check if virtual environment exists (production)
      const venvPath = path.join(__dirname, '../../venv/bin/python3');
      const fs = require('fs');
      if (fs.existsSync(venvPath)) {
        pythonPath = venvPath;
      } else {
        pythonPath = 'python'; // Fallback to system python
      }
    }

    console.log('🐍 Running Python analysis...');
    console.log('Python:', pythonPath);
    console.log('Script:', pythonScript);
    console.log('Audio:', audioPath);

    const pythonProcess = spawn(pythonPath, [pythonScript, audioPath, modelPath]);

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error('Python stderr:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process exited with code:', code);
        console.error('Error output:', errorData);
        return reject(new Error(`Python process failed: ${errorData || 'Unknown error'}`));
      }

      try {
        const result = JSON.parse(outputData);
        console.log('✅ Analysis complete:', result);
        resolve(result);
      } catch (error) {
        console.error('Failed to parse Python output:', outputData);
        reject(new Error(`Failed to parse analysis result: ${error.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      reject(new Error(`Failed to start Python: ${error.message}`));
    });
  });
}

module.exports = {
  analyzeAudio
};
