'use client'

import { AnalysisResult } from '@/lib/api'

interface AnalysisResultProps {
  result: AnalysisResult
  onReset: () => void
}

export default function AnalysisResultComponent({
  result,
  onReset,
}: AnalysisResultProps) {
  const isFake = result.isFake
  const gradientClass = isFake 
    ? 'bg-gradient-to-br from-red-500/20 to-pink-600/20 border-red-500/30' 
    : 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30'
  const iconColor = isFake ? 'text-red-400' : 'text-green-400'

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-2">
        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Analysis Complete
      </h3>

      {/* Result Card */}
      <div
        className={`${gradientClass} glass text-white rounded-2xl p-8 text-center border relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            {isFake ? (
              <svg className={`w-20 h-20 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className={`w-20 h-20 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="text-5xl font-bold mb-3">
            {result.prediction} Voice
          </div>
          <div className="text-xl opacity-90 mb-4">
            {isFake
              ? 'This audio appears to be AI-generated'
              : 'This audio appears to be from a real human'}
          </div>
          {result.confidence && (
            <div className="inline-block glass px-6 py-3 rounded-full border border-white/20">
              <div className="text-sm text-gray-300 mb-1">Confidence Level</div>
              <div className="text-3xl font-bold">{result.confidence.toFixed(1)}%</div>
            </div>
          )}
        </div>
      </div>

      {/* Audio Statistics */}
      <div>
        <h4 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Audio Statistics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-5 border border-blue-500/20 hover:border-blue-500/40 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-gray-400">Duration</div>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {result.audioStats.duration.toFixed(2)}s
            </div>
          </div>
          <div className="glass rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="text-sm text-gray-400">Sample Rate</div>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {result.audioStats.sampleRate} Hz
            </div>
          </div>
          <div className="glass rounded-xl p-5 border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <div className="text-sm text-gray-400">Features</div>
            </div>
            <div className="text-3xl font-bold text-indigo-400">
              {result.audioStats.featuresCount}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full glass border border-white/10 text-gray-300 font-semibold py-4 px-6 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Analyze Another Audio
      </button>
    </div>
  )
}
