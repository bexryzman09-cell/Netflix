import { createContext, useContext, useEffect, useState } from "react"

const FavoriteContext = createContext(null)

export function FavoriteProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("favorites")
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites))
    }, [favorites])

    function toggleFavorite(movie) {
        setFavorites((prev) => {
            const exists = prev.some(
                (item) => item.title === movie.title
            )

            if (exists) {
                return prev.filter(
                    (item) => item.title !== movie.title
                )
            }

            return [...prev, movie]
        })
    }

    function isFavorite(movie) {
        return favorites.some(
            (item) => item.title === movie.title
        )
    }

    return (
        <FavoriteContext.Provider
            value={{
                favorites,
                toggleFavorite,
                isFavorite
            }}
        >
            {children}
        </FavoriteContext.Provider>
    )
}

export function useFavorites() {
    return useContext(FavoriteContext)
}