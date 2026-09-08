import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"

export type Movie = {
    title: string
    russianTitle?: string
    year: number
    rating: number
    type?: string
    trailerYoutubeId?: string
    image: string
    description?: string
    genres?: string[]
    video?: string
}

type FavoriteContextType = {
    favorites: Movie[]
    toggleFavorite: (movie: Movie) => void
    isFavorite: (movie: Movie) => boolean
}

const FavoriteContext = createContext<
    FavoriteContextType | undefined
>(undefined)

type FavoriteProviderProps = {
    children: ReactNode
}

export function FavoriteProvider({
    children,
}: FavoriteProviderProps) {
    const [favorites, setFavorites] = useState<Movie[]>(() => {
        const saved = localStorage.getItem("favorites")

        if (!saved) {
            return []
        }

        try {
            return JSON.parse(saved) as Movie[]
        } catch {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        )
    }, [favorites])

    function toggleFavorite(movie: Movie) {
        setFavorites((prev) => {
            const exists = prev.some(
                (item) =>
                    item.title === movie.title &&
                    item.year === movie.year
            )

            if (exists) {
                return prev.filter(
                    (item) =>
                        !(
                            item.title === movie.title &&
                            item.year === movie.year
                        )
                )
            }

            return [...prev, movie]
        })
    }

    function isFavorite(movie: Movie) {
        return favorites.some(
            (item) =>
                item.title === movie.title &&
                item.year === movie.year
        )
    }

    return (
        <FavoriteContext.Provider
            value={{
                favorites,
                toggleFavorite,
                isFavorite,
            }}
        >
            {children}
        </FavoriteContext.Provider>
    )
}

export function useFavorites() {
    const context = useContext(FavoriteContext)

    if (!context) {
        throw new Error(
            "useFavorites must be used inside FavoriteProvider"
        )
    }

    return context
}