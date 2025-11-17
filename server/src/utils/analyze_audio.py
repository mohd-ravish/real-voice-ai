#!/usr/bin/env python
import sys
import json
import librosa
import numpy as np
import joblib
import warnings
import os

warnings.filterwarnings('ignore')

def check_audio_file(audio_path):
    """Check if audio file exists and is readable"""
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")
    if os.path.getsize(audio_path) == 0:
        raise ValueError("Audio file is empty")

def extract_features(audio_path):
    """Extract audio features for model prediction"""
    try:
        # Check file first
        check_audio_file(audio_path)
        
        # Load audio file with error handling
        # librosa uses audioread which supports various formats via ffmpeg
        y, sr = librosa.load(audio_path, sr=22050, mono=True)
        
        # Extract MFCC features (21 coefficients)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=21)
        mfcc_mean = np.mean(mfcc, axis=1)
        
        # Extract RMS feature
        rms = librosa.feature.rms(y=y)
        rms_mean = np.mean(rms)
        
        # Extract Spectral Centroid feature
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        spectral_centroid_mean = np.mean(spectral_centroid)
        
        # Extract Spectral Bandwidth feature
        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
        spectral_bandwidth_mean = np.mean(spectral_bandwidth)
        
        # Extract Spectral Rolloff feature
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        spectral_rolloff_mean = np.mean(spectral_rolloff)
        
        # Extract Zero Crossing Rate feature
        zero_crossing_rate = librosa.feature.zero_crossing_rate(y=y)
        zero_crossing_rate_mean = np.mean(zero_crossing_rate)
        
        # Concatenate all features
        features = np.concatenate([
            mfcc_mean,
            [rms_mean],
            [spectral_centroid_mean],
            [spectral_bandwidth_mean],
            [spectral_rolloff_mean],
            [zero_crossing_rate_mean]
        ])
        
        # Get audio duration
        duration = librosa.get_duration(y=y, sr=sr)
        
        return features, duration, sr
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        raise Exception(f"Error extracting features: {str(e)}\nDetails: {error_details}")

def analyze_audio(audio_path, model_path):
    """Analyze audio and return prediction"""
    try:
        # Extract features
        features, duration, sample_rate = extract_features(audio_path)
        
        # Load model
        model = joblib.load(model_path)
        
        # Reshape features for prediction
        features_reshaped = features.reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features_reshaped)[0]
        
        # Get prediction probability
        try:
            proba = model.predict_proba(features_reshaped)[0]
            confidence = float(max(proba) * 100)
        except:
            confidence = None
        
        # Map prediction to label (0 = Real, 1 = Fake)
        label = "Fake" if prediction == 1 else "Real"
        is_fake = bool(prediction == 1)
        
        # Return result as JSON
        result = {
            "prediction": label,
            "isFake": is_fake,
            "confidence": confidence,
            "audioStats": {
                "duration": float(duration),
                "sampleRate": int(sample_rate),
                "featuresCount": len(features)
            }
        }
        
        return result
    except Exception as e:
        raise Exception(f"Error analyzing audio: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({
            "error": "Usage: python analyze_audio.py <audio_path> <model_path>"
        }))
        sys.exit(1)
    
    audio_path = sys.argv[1]
    model_path = sys.argv[2]
    
    try:
        result = analyze_audio(audio_path, model_path)
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
