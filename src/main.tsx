import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { KonstaProvider } from 'konsta/react'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import WebApp from '@twa-dev/sdk'

import './index.css'
import { UserProvider } from './providers/UserProvider.tsx'

WebApp.ready() // tell the TG that the mini app is ready to be displayed

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <KonstaProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </KonstaProvider>
    </BrowserRouter>
  </StrictMode>,
)
