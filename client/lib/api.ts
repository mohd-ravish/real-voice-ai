import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface AnalysisResult {
  success: boolean
  prediction: 'Real' | 'Fake'
  isFake: boolean
  confidence: number | null
  audioStats: {
    duration: number
    sampleRate: number
    featuresCount: number
  }
  error?: string
}

export async function analyzeAudio(file: File): Promise<AnalysisResult> {
  const formData = new FormData()
  formData.append('audio', file)

  try {
    const response = await axios.post(`${API_URL}/api/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error: any) {
    console.error('API Error:', error)
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    } else if (error.message) {
      throw new Error(error.message)
    } else {
      throw new Error('Failed to analyze audio. Please try again.')
    }
  }
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_URL}/api/health`)
    return response.data.success === true
  } catch (error) {
    console.error('Server health check failed:', error)
    return false
  }
}
