import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { FavoriteProvider } from './FavoriteContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <FavoriteProvider>
        <App />
      </FavoriteProvider>
  </StrictMode>,
)