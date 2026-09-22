import { useAchievements, type Badge } from "../hooks/useAchievements"

type AchievementsPageProps = {
    onBack: () => void
}

export default function AchievementsPage({ onBack }: AchievementsPageProps) {
    const { typeBadges, genreBadges, totalWatched } = useAchievements()

    return (
        <div className="bg-black text-white movie-page">
            <header className="movie-header">
                <button  type="button" onClick={onBack} className="theme-button flex items-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>alt-arrow-left-line-duotone</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15 5l-6 7l6 7" /></svg>
                </button>

                <h1 className="text-white flex  text-center gap-2">Достижения <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 20 20"><title>trophy-20-solid</title><path fill="currentColor" fill-rule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 0 0-.629.74v.387q-1.24.235-2.445.564a.75.75 0 0 0-.552.698L1 4a5 5 0 0 0 4.506 4.976a6 6 0 0 0 2.946 1.822A6.5 6.5 0 0 1 7.768 13H7.5A1.5 1.5 0 0 0 6 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 0 0-1.5-1.5h-.268a6.5 6.5 0 0 1-.684-2.202a6 6 0 0 0 2.946-1.822a5 5 0 0 0 4.503-5.152a.75.75 0 0 0-.552-.698A32 32 0 0 0 16 2.562v-.387a.75.75 0 0 0-.629-.74A33 33 0 0 0 10 1M2.525 4.422Q3.255 4.24 4 4.09V5c0 .74.134 1.448.38 2.103a3.5 3.5 0 0 1-1.855-2.68m14.95 0a3.5 3.5 0 0 1-1.854 2.68A6 6 0 0 0 16 5v-.91q.744.149 1.475.332" clip-rule="evenodd" /></svg></h1>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <p className="text-white/60 mb-8">
                    Просмотрено тайтлов: {totalWatched}
                </p>

                <h2 className="text-lg font-semibold mb-4">
                    По типу контента
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                    {typeBadges.map((badge) => (
                        <BadgeCard key={badge.id} badge={badge} />
                    ))}
                </div>

                <h2 className="text-lg font-semibold mb-4">По жанрам</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-10">
                    {genreBadges.map((badge) => (
                        <BadgeCard key={badge.id} badge={badge} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function BadgeCard({ badge }: { badge: Badge }) {
    const earned = badge.level > 0

    return (
        <div
            className={`rounded-lg p-4 border ${earned
                ? "border-yellow-500/40 bg-neutral-900"
                : "border-white/10 bg-neutral-900/50"
                }`}
        >
            <div
                className={`text-3xl mb-2 ${earned ? "" : "grayscale opacity-40"
                    }`}
            >
                {badge.icon}
            </div>
            <p className="font-semibold text-sm">{badge.title}</p>
            <p
                className={`text-xs mt-1 ${earned ? "text-yellow-400" : "text-white/40"
                    }`}
            >
                {badge.levelLabel}
            </p>
            <p className="text-xs text-white/40 mt-1">
                {badge.nextTarget
                    ? `${badge.count} / ${badge.nextTarget} просмотрено`
                    : `${badge.count} просмотрено — максимальный уровень`}
            </p>
        </div>
    )
}