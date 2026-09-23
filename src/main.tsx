import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

import App from "./App.tsx"

import { ProfileProvider } from "./components/ProfileContext"
import { FavoriteProvider } from "./components/FavoriteContext"
import { WatchProgressProvider } from "./components/WatchProgressContext"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ProfileProvider>
            <FavoriteProvider>
                <WatchProgressProvider>
                    <App />
                </WatchProgressProvider>
            </FavoriteProvider>
        </ProfileProvider>
    </StrictMode>
)

