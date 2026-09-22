import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WatchProgressProvider } from "./components/WatchProgressContext"
import { FavoriteProvider } from './components/FavoriteContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoriteProvider>
      <WatchProgressProvider>
        <App />
      </WatchProgressProvider>
    </FavoriteProvider>
  </StrictMode>
)