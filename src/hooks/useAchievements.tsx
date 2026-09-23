import { useMemo } from "react"
import { MOVIES } from "../data/movis.data"
import type { Movie } from "../components/FavoriteContext"
import { useProfiles } from "../components/ProfileContext"
export type Badge = {
    id: string
    icon: string
    title: string
    category: "type" | "genre"
    count: number
    level: number
    levelLabel: string
    nextTarget: number | null
}

const TIERS = [3, 7, 15]
const TIER_LABELS = ["Бронза", "Серебро", "Золото"]

const TYPE_DEFS: { type: string; icon: string; title: string }[] = [
    { type: "movie", icon: "🎬", title: "Киноман" },
    { type: "series", icon: "📺", title: "Сериаломан" },
    { type: "anime", icon: "⛩️", title: "Отакон" },
]

const GENRE_DEFS: { genre: string; icon: string; title: string }[] = [
    { genre: "Боевик", icon: "💥", title: "Знаток боевиков" },
    { genre: "Комедия", icon: "😂", title: "Любитель комедий" },
    { genre: "Ужасы", icon: "🔪", title: "Мастер ужасов" },
    { genre: "Фэнтези", icon: "🧙", title: "Хранитель фэнтези" },
    { genre: "Романтика", icon: "💘", title: "Романтик" },
    { genre: "Фантастика", icon: "🚀", title: "Исследователь космоса" },
    { genre: "Приключения", icon: "🧭", title: "Искатель приключений" },
]

function levelFor(count: number) {
    let level = 0

    for (const tier of TIERS) {
        if (count >= tier) {
            level++
        }
    }

    return level
}

function nextTargetFor(count: number) {
    for (const tier of TIERS) {
        if (count < tier) {
            return tier
        }
    }

    return null
}

function isWatched(movie: Movie) {
    return (
        localStorage.getItem(`watched-${movie.title}-${movie.year}`) ===
        "true"
    )
}

export function useAchievements() {
    const { currentProfile } = useProfiles()

    const profileId = currentProfile?.id

    return useMemo(() => {
        if (!profileId) {
            return {
                typeBadges: [],
                genreBadges: [],
                totalWatched: 0,
            }
        }

        const watched = MOVIES.filter((movie) => {
            return (
                localStorage.getItem(
                    `watched-${profileId}-${movie.title}-${movie.year}`
                ) === "true"
            )
        })

        const typeBadges: Badge[] = TYPE_DEFS.map((def) => {
            const count = watched.filter(
                (movie) => movie.type === def.type
            ).length

            const level = levelFor(count)

            return {
                id: `type-${def.type}`,
                icon: def.icon,
                title: def.title,
                category: "type",
                count,
                level,
                levelLabel:
                    level > 0
                        ? TIER_LABELS[level - 1]
                        : "Не получено",
                nextTarget: nextTargetFor(count),
            }
        })

        const genreBadges: Badge[] = GENRE_DEFS.map((def) => {
            const count = watched.filter((movie) =>
                movie.genres?.includes(def.genre)
            ).length

            const level = levelFor(count)

            return {
                id: `genre-${def.genre}`,
                icon: def.icon,
                title: def.title,
                category: "genre",
                count,
                level,
                levelLabel:
                    level > 0
                        ? TIER_LABELS[level - 1]
                        : "Не получено",
                nextTarget: nextTargetFor(count),
            }
        })

        return {
            typeBadges,
            genreBadges,
            totalWatched: watched.length,
        }
    }, [profileId])
}