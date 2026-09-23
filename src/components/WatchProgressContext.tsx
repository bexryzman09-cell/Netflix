import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react"
import type { ReactNode } from "react"
import type { Movie } from "./FavoriteContext"
import { useProfiles } from "./ProfileContext"

export type ProgressEntry = {
    movie: Movie
    currentTime: number
    duration: number
    updatedAt: number
}

type MovieRef = Pick<Movie, "title" | "year">

const keyOf = (movie: MovieRef) =>
    `${movie.title}-${movie.year}`

type WatchProgressContextType = {
    progressList: ProgressEntry[]
    getProgress: (movie: MovieRef) => ProgressEntry | undefined
    saveProgress: (
        movie: Movie,
        currentTime: number,
        duration: number
    ) => void
    removeProgress: (movie: MovieRef) => void
}

const MIN_PROGRESS_PERCENT = 0.5
const MAX_PROGRESS_PERCENT = 95

const WatchProgressContext =
    createContext<WatchProgressContextType | undefined>(undefined)

export const WatchProgressProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const { currentProfile } = useProfiles()

    const profileId = currentProfile?.id ?? null

    const [progressList, setProgressList] = useState<ProgressEntry[]>([])
    const [loadedProfileId, setLoadedProfileId] =
        useState<string | null>(null)

    // Загружаем прогресс именно текущего профиля
    useEffect(() => {
        if (!profileId) {
            setProgressList([])
            setLoadedProfileId(null)
            return
        }

        const storageKey = `watchProgress-${profileId}`

        try {
            const raw = localStorage.getItem(storageKey)

            if (raw) {
                setProgressList(JSON.parse(raw) as ProgressEntry[])
            } else {
                setProgressList([])
            }
        } catch {
            setProgressList([])
        }

        setLoadedProfileId(profileId)
    }, [profileId])

    // Сохраняем только после загрузки данных нужного профиля
    useEffect(() => {
        if (!profileId) return
        if (loadedProfileId !== profileId) return

        try {
            localStorage.setItem(
                `watchProgress-${profileId}`,
                JSON.stringify(progressList)
            )
        } catch {
            // ignore
        }
    }, [progressList, profileId, loadedProfileId])

    const getProgress = (movie: MovieRef) => {
        return progressList.find(
            (entry) =>
                keyOf(entry.movie) === keyOf(movie)
        )
    }

    const saveProgress = (
        movie: Movie,
        currentTime: number,
        duration: number
    ) => {
        if (!profileId) return

        if (
            !duration ||
            Number.isNaN(duration) ||
            !Number.isFinite(duration)
        ) {
            return
        }

        if (
            Number.isNaN(currentTime) ||
            !Number.isFinite(currentTime) ||
            currentTime < 0
        ) {
            return
        }

        const percent = (currentTime / duration) * 100

        setProgressList((prev) => {
            // Фильм почти полностью просмотрен
            if (percent >= MAX_PROGRESS_PERCENT) {
                return prev.filter(
                    (entry) =>
                        keyOf(entry.movie) !== keyOf(movie)
                )
            }

            // Слишком маленький прогресс не сохраняем
            if (percent < MIN_PROGRESS_PERCENT) {
                return prev
            }

            const entry: ProgressEntry = {
                movie,
                currentTime,
                duration,
                updatedAt: Date.now(),
            }

            const rest = prev.filter(
                (item) =>
                    keyOf(item.movie) !== keyOf(movie)
            )

            return [entry, ...rest].sort(
                (a, b) => b.updatedAt - a.updatedAt
            )
        })
    }

    const removeProgress = (movie: MovieRef) => {
        setProgressList((prev) =>
            prev.filter(
                (entry) =>
                    keyOf(entry.movie) !== keyOf(movie)
            )
        )
    }

    return (
        <WatchProgressContext.Provider
            value={{
                progressList,
                getProgress,
                saveProgress,
                removeProgress,
            }}
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