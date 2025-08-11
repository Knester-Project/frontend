import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

//Styles and Theme
import './index.css'
import { ThemeProviderEffect } from './components/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProviderEffect />
    <App />
  </StrictMode>,
)
