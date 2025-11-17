'use client'

import { useState, useRef } from 'react'
import { analyzeAudio } from '@/lib/api'

interface AudioRecorderProps {
  onRecordingComplete: (file: File | null) => void
  onAnalysisComplete: (result: any) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

export default function AudioRecorder({
  onRecordingComplete,
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Try to use WAV format if supported, otherwise use WebM
      const options = { mimeType: 'audio/webm' }
      const mediaRecorder = new MediaRecorder(stream, options)
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Use the actual MIME type from the MediaRecorder
        const mimeType = mediaRecorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setRecordedBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)

        // Convert blob to file with appropriate extension
        const extension = mimeType.includes('webm') ? 'webm' : 'wav'
        const file = new File([blob], `recording.${extension}`, { type: mimeType })
        onRecordingComplete(file)

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setError(null)
    } catch (err: any) {
      setError('Failed to access microphone. Please grant permission and try again.')
      console.error('Recording error:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleAnalyze = async () => {
    if (!recordedBlob) {
      setError('Please record audio first')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const mimeType = recordedBlob.type || 'audio/webm'
      const extension = mimeType.includes('webm') ? 'webm' : 'wav'
      const file = new File([recordedBlob], `recording.${extension}`, { type: mimeType })
      const result = await analyzeAudio(file)
      onAnalysisComplete(result)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze audio')
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setRecordedBlob(null)
    setAudioUrl(null)
    setError(null)
    onRecordingComplete(null)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Record your voice</h3>

      <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-xl flex items-start gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p>Click the microphone button below to start recording. Click again to stop.</p>
      </div>

      {/* Recording Controls */}
      <div className="flex flex-col items-center justify-center py-10">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          className={`w-40 h-40 rounded-full flex items-center justify-center text-white text-5xl transition-all shadow-2xl relative overflow-hidden ${
            isRecording
              ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse-glow'
              : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 hover:shadow-blue-500/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <svg className="w-16 h-16 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isRecording ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            )}
          </svg>
        </button>
        <p className="mt-6 text-gray-300 font-medium text-lg">
          {isRecording ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              Recording... Click to stop
            </span>
          ) : (
            'Click to start recording'
          )}
        </p>
      </div>

      {/* Recorded Audio Player */}
      {audioUrl && (
        <div className="glass rounded-xl p-5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h4 className="text-sm font-semibold text-green-400">
              Recording captured successfully!
            </h4>
          </div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Recorded Audio</h4>
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
      {recordedBlob && (
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
