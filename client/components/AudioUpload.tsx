'use client'

import { useState, useRef } from 'react'
import { analyzeAudio } from '@/lib/api'

interface AudioUploadProps {
  onFileSelect: (file: File | null) => void
  onAnalysisComplete: (result: any) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

export default function AudioUpload({
  onFileSelect,
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
}: AudioUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      // Validate file type
      if (!file.type.includes('audio')) {
        setError('Please select a valid audio file (.wav or .mp3)')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      setSelectedFile(file)
      onFileSelect(file)
      setError(null)

      // Create audio URL for playback
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeAudio(selectedFile)
      onAnalysisComplete(result)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze audio')
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setAudioUrl(null)
    setError(null)
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Upload an audio file</h3>

      {/* File Input */}
      <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-10 text-center hover:border-blue-400/50 transition-all hover:bg-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".wav,.mp3,audio/wav,audio/mpeg"
          onChange={handleFileChange}
          className="hidden"
          id="audio-upload"
        />
        <label
          htmlFor="audio-upload"
          className="cursor-pointer flex flex-col items-center relative z-10"
        >
          <svg
            className="w-20 h-20 text-blue-400/70 mb-4 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-gray-300 font-medium text-lg mb-2">
            {selectedFile ? selectedFile.name : 'Choose an audio file'}
          </span>
          <span className="text-sm text-gray-500">
            WAV, MP3, WebM, OGG • Maximum 10MB
          </span>
        </label>
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <div className="glass rounded-xl p-5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <h4 className="text-sm font-semibold text-gray-300">Audio Preview</h4>
          </div>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      {selectedFile && (
        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${
              isAnalyzing
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Analyze Voice
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            disabled={isAnalyzing}
            className="px-6 py-4 glass text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 border border-white/10"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
