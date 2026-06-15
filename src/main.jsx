import React from 'react'
import ReactDOM from 'react-dom/client'
import { NhostProvider } from '@nhost/react'
import { nhost } from './nhost'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
      <App />
    </NhostProvider>
  </React.StrictMode>
)