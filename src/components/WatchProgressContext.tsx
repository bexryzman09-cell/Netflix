import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react"
import type { ReactNode } from "react"
import type { Movie } from "./FavoriteContext"

export type ProgressEntry = {
    movie: Movie
    currentTime: number
    duration: number
    updatedAt: number
}


type MovieRef = Pick<Movie, "title" | "year">

const keyOf = (movie: MovieRef) => `${movie.title}-${movie.year}`

type WatchProgressContextType = {
    progressList: ProgressEntry[]
    getProgress: (movie: MovieRef) => ProgressEntry | undefined
    saveProgress: (movie: Movie, currentTime: number, duration: number) => void
    removeProgress: (movie: MovieRef) => void
}

const STORAGE_KEY = "watchProgress"
const MIN_PROGRESS_PERCENT = 2
const MAX_PROGRESS_PERCENT = 95

const WatchProgressContext = createContext<WatchProgressContextType | undefined>(
    undefined
)

export const WatchProgressProvider = ({ children }: { children: ReactNode }) => {
    const [progressList, setProgressList] = useState<ProgressEntry[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? (JSON.parse(raw) as ProgressEntry[]) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progressList))
        } catch {

        }
    }, [progressList])

    const getProgress = (movie: MovieRef) =>
        progressList.find((entry) => keyOf(entry.movie) === keyOf(movie))

    const saveProgress = (movie: Movie, currentTime: number, duration: number) => {
        if (!duration || Number.isNaN(duration) || !Number.isFinite(duration)) return

        const percent = (currentTime / duration) * 100

        setProgressList((prev) => {
            const rest = prev.filter((entry) => keyOf(entry.movie) !== keyOf(movie))

            if (percent >= MAX_PROGRESS_PERCENT) return rest
            if (percent < MIN_PROGRESS_PERCENT) return rest

            const entry: ProgressEntry = {
                movie,
                currentTime,
                duration,
                updatedAt: Date.now(),
            }

            return [entry, ...rest].sort((a, b) => b.updatedAt - a.updatedAt)
        })
    }

    const removeProgress = (movie: MovieRef) => {
        setProgressList((prev) => prev.filter((entry) => keyOf(entry.movie) !== keyOf(movie)))
    }

    return (
        <WatchProgressContext.Provider
            value={{ progressList, getProgress, saveProgress, removeProgress }}
        >
            {children}
        </WatchProgressContext.Provider>
    )
}

export const useWatchProgress = () => {
    const ctx = useContext(WatchProgressContext)
    if (!ctx) {
        throw new Error(
            "useWatchProgress должен использоваться внутри <WatchProgressProvider>"
        )
    }
    return ctx
}