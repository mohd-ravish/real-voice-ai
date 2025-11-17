'use client'

import { useState, useRef, useEffect } from 'react'
import AudioUpload from '@/components/AudioUpload'
import AudioRecorder from '@/components/AudioRecorder'
import AnalysisResult from '@/components/AnalysisResult'
import InfoSection from '@/components/InfoSection'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result)
    setIsAnalyzing(false)
  }

  // Auto-scroll to results when analysis is complete
  useEffect(() => {
    if (analysisResult && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [analysisResult])

  const handleReset = () => {
    setAudioFile(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-block mb-4 animate-float">
            <svg className="w-20 h-20 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14Z" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 10V11C19 14.866 15.866 18 12 18C8.13401 18 5 14.866 5 11V10" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 18V22" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 22H16" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 neon-text">
            RealVoice AI
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light">
            Advanced neural analysis for synthetic voice detection
          </p>
        </div>

        {/* Info Section */}
        <InfoSection />

        {/* Main Content */}
        <div className="glass rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden mt-8">
          <div className="scan-line"></div>
          
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/10">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-4 px-6 font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'border-b-2 border-blue-400 text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Audio
            </button>
            <button
              onClick={() => setActiveTab('record')}
              className={`pb-4 px-6 font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'record'
                  ? 'border-b-2 border-blue-400 text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Record Audio
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'upload' ? (
            <AudioUpload
              onFileSelect={setAudioFile}
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
          ) : (
            <AudioRecorder
              onRecordingComplete={setAudioFile}
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
          )}

          {/* Analysis Result */}
          {analysisResult && (
            <div ref={resultRef} className="mt-8">
              <AnalysisResult result={analysisResult} onReset={handleReset} />
            </div>
          )}

          {/* No Audio Message */}
          {!audioFile && !analysisResult && !isAnalyzing && (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse-glow">
                <svg className="w-16 h-16 mx-auto text-blue-400/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">Ready to analyze audio</p>
              <p className="text-gray-500 text-sm mt-2">Upload a file or record your voice to begin</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
