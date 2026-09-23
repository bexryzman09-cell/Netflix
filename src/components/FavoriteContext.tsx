import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"
import { useProfiles } from "./ProfileContext"

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
    const { currentProfile } = useProfiles()

    const profileId = currentProfile?.id ?? null

    const getStorageKey = () => {
        if (!profileId) {
            return null
        }

        return `favorites - ${profileId} `
    }

    const [favorites, setFavorites] = useState<Movie[]>(() => {
        if (!profileId) {
            return []
        }

        const saved = localStorage.getItem(
            `favorites - ${profileId} `
        )

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
        if (!profileId) {
            setFavorites([])
            return
        }

        const saved = localStorage.getItem(
            `favorites - ${profileId} `
        )

        if (!saved) {
            setFavorites([])
            return
        }

        try {
            setFavorites(JSON.parse(saved) as Movie[])
        } catch {
            setFavorites([])
        }
    }, [profileId])

    useEffect(() => {
        const key = getStorageKey()

        if (!key) {
            return
        }

        localStorage.setItem(
            key,
            JSON.stringify(favorites)
        )
    }, [favorites, profileId])

    function toggleFavorite(movie: Movie) {
        if (!profileId) {
            return
        }

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

