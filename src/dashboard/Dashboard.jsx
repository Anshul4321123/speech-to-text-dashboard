import React, { useState, useRef } from 'react'
import { useSignOut } from '@nhost/react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { signOut } = useSignOut()
  const navigate = useNavigate()
  
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)

  const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const startRecording = async () => {
    setError('')
    setTranscript('')
    audioChunksRef.current = []
    
    if (!DEEPGRAM_API_KEY) {
      setError('Deepgram API key not configured')
      return
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }
      
      mediaRecorder.onstop = async () => {
        setIsProcessing(true)
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        
        const formData = new FormData()
        formData.append('audio', audioBlob, 'audio.webm')
        
        try {
          const response = await fetch('https://api.deepgram.com/v1/listen', {
            method: 'POST',
            headers: { 'Authorization': `Token ${DEEPGRAM_API_KEY}` },
            body: formData
          })
          
          const data = await response.json()
          const text = data.results?.channels[0]?.alternatives[0]?.transcript
          if (text) setTranscript(text)
          else setError('No speech detected')
        } catch (err) {
          setError('Transcription failed')
        } finally {
          setIsProcessing(false)
        }
      }
      
      mediaRecorder.start(1000)
      setIsRecording(true)
    } catch (err) {
      setError('Microphone access denied')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🎙️ Speech to Text</h2>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
      
      <div style={styles.card}>
        <div style={styles.buttons}>
          {!isRecording ? (
            <button onClick={startRecording} style={styles.start} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : '🎤 Start'}
            </button>
          ) : (
            <button onClick={stopRecording} style={styles.stop}>⏹️ Stop</button>
          )}
          <button onClick={() => setTranscript('')} style={styles.clear}>Clear</button>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}
        
        {isProcessing && <div style={styles.processing}>⏳ Transcribing...</div>}
        
        <div style={styles.transcript}>
          <strong>Transcript:</strong>
          <p>{transcript || (isRecording ? '🔴 Recording... Speak now' : 'Ready to record')}</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    background: '#f5f5f5',
    margin: 0,
    padding: 0
  },
  header: {
    background: 'white',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  logout: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  card: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  start: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  stop: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  clear: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    padding: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginBottom: '15px'
  },
  processing: {
    padding: '8px',
    backgroundColor: '#e7f3ff',
    color: '#004085',
    borderRadius: '4px',
    marginBottom: '15px',
    textAlign: 'center'
  },
  transcript: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #dee2e6'
  }
}

export default Dashboard