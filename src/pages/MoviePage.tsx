import { useState, useEffect, useRef } from "react"
import { useFavorites } from "../components/FavoriteContext"
import { useWatchProgress } from "../components/WatchProgressContext"

const TYPE_LABELS: Record<string, string> = {
    movie: "Фильм",
    series: "Сериал",
    anime: "Аниме"
}

type MoviePageProps = {
    movie: {
        title: string
        russianTitle?: string
        year: number
        rating: number
        type?: string
        trailerYoutubeId?: string
        video?: string
        image: string
        description?: string
        genres?: string[]
    }
    initialMode?: "details" | "movie" | "trailer"
    onBack: () => void
}

function buildVkSrc(url: string) {
    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}autoplay=1&js_api=1`
}

let vkApiPromise: Promise<void> | null = null
function loadVkApi(): Promise<void> {
    if ((window as any).VK?.VideoPlayer) return Promise.resolve()

    if (!vkApiPromise) {
        vkApiPromise = new Promise((resolve) => {
            const script = document.createElement("script")
            script.src = "https://vk.com/js/api/videoplayer.js"
            script.onload = () => resolve()
            document.head.appendChild(script)
        })
    }

    return vkApiPromise
}

export default function MoviePage({ movie, initialMode = "details", onBack }: MoviePageProps) {
    const { toggleFavorite, isFavorite } = useFavorites()

    const { saveProgress } = useWatchProgress()

    const hasVideo = Boolean(movie.video)
    const hasTrailer = Boolean(movie.trailerYoutubeId)

    const [playing, setPlaying] = useState<"movie" | "trailer" | null>(
        initialMode !== "details" && hasVideo ? (initialMode as "movie" | "trailer") : null
    )

    const vkIframeRef = useRef<HTMLIFrameElement>(null)
    const vkPlayerRef = useRef<any>(null)

    useEffect(() => {
        if (playing !== "movie" || !movie.video) return

        let cancelled = false

        loadVkApi().then(() => {
            if (cancelled || !vkIframeRef.current) return
            vkPlayerRef.current = (window as any).VK.VideoPlayer(vkIframeRef.current)
        })


        const handleMessage = (event: MessageEvent) => {
            if (event.source !== vkIframeRef.current?.contentWindow) return

            console.log("[VK player event]", event.data)

            const data = event.data as any
            const currentTime = data?.currentTime ?? data?.time ?? data?.position
            const duration = data?.duration ?? data?.total

            if (typeof currentTime === "number" && typeof duration === "number" && duration > 0) {
                saveProgress(movie, currentTime, duration)
            }
        }

        window.addEventListener("message", handleMessage)

        return () => {
            cancelled = true
            window.removeEventListener("message", handleMessage)
            vkPlayerRef.current = null
        }
    }, [playing, movie.video])

    const ratingKey = `movie-rating-${movie.title}-${movie.year}`
    const [userRating, setUserRating] = useState<number | null>(() => {
        const saved = localStorage.getItem(ratingKey)
        return saved ? Number(saved) : null
    })
    const handleRating = (value: number) => {
        setUserRating(value)
        localStorage.setItem(ratingKey, value.toString())
    }

    const watchedKey = `watched-${movie.title}-${movie.year}`
    const [watched, setWatched] = useState(() => localStorage.getItem(watchedKey) === "true")
    const toggleWatched = () => {
        const next = !watched
        setWatched(next)
        localStorage.setItem(watchedKey, next.toString())
    }

    return (
        <div className="movie-page-detail">

            <div className="movie-page-topbar">
                <button className="back-button" onClick={onBack}>
                    ← Назад
                </button>
            </div>

            <div className="movie-hero">

                {playing ? (
                    <div className="movie-player">
                        <button className="player-close flex gap-2  items-center" onClick={() => setPlaying(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>baseline-close</title><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" /></svg> Закрыть
                        </button>

                        {playing === "movie" && movie.video ? (
                            <iframe
                                ref={vkIframeRef}
                                src={buildVkSrc(movie.video)}
                                title={`${movie.title} — просмотр`}
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock"
                                frameBorder="0"
                                allowFullScreen
                            />
                        ) : (
                            <iframe
                                src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=1`}
                                title={`${movie.title} — трейлер`}
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock"
                                frameBorder="0"
                                allowFullScreen
                            />
                        )}
                    </div>
                ) : (
                    <>
                        <img src={movie.image} alt={movie.title} className="movie-hero-image" />
                        <div className="movie-hero-gradient" />
                    </>
                )}

                {!playing && (
                    <div className="movie-hero-info">

                        <span className="movie-hero-badge">
                            {TYPE_LABELS[movie.type ?? ""] || "Фильм"}
                        </span>

                        <h1>{movie.title}</h1>

                        <div className="movie-hero-meta">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>baseline-star-rate</title><path fill="currentColor" d="M14.43 10L12 2l-2.43 8H2l6.18 4.41L5.83 22L12 17.31L18.18 22l-2.35-7.59L22 10z" /></svg> {movie.rating}</span>
                            <span>{movie.year}</span>
                            {movie.russianTitle && <span>{movie.russianTitle}</span>}
                        </div>

                        {movie.description && (
                            <p className="movie-hero-description">{movie.description}</p>
                        )}

                        <div className="movie-hero-actions">

                            <button
                                className="hero-btn hero-btn--primary"
                                onClick={() =>
                                    hasVideo
                                        ? setPlaying("movie")
                                        : alert("Видео для этого тайтла пока не добавлено")
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><title>button-play-solid</title><path fill="currentColor" fill-rule="evenodd" d="M2.676.02a1.74 1.74 0 0 0-.845.218a1.64 1.64 0 0 0-.895 1.433v10.677a1.64 1.64 0 0 0 .895 1.433a1.74 1.74 0 0 0 1.718-.016l8.63-5.338a1.61 1.61 0 0 0-.001-2.876L3.548.253L3.532.244A1.74 1.74 0 0 0 2.676.02" clip-rule="evenodd" /></svg> Смотреть
                            </button>

                            <button
                                className="hero-btn hero-btn--trailer"
                                onClick={() =>
                                    hasTrailer
                                        ? setPlaying("trailer")
                                        : alert("Трейлер для этого тайтла пока не добавлен")
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>flim-slate</title><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.5 10.5h14.412c1.456 0 2.184 0 2.636.44c.452.439.452 1.146.452 2.56V15c0 3.3 0 4.95-1.055 5.975C18.889 22 17.19 22 13.795 22h-3.09c-3.396 0-5.094 0-6.15-1.025C3.5 19.95 3.5 18.3 3.5 15zm-.002 0c-.357-1.358-.535-2.037-.491-2.634a3.54 3.54 0 0 1 1.5-2.648c.485-.337 1.152-.519 2.484-.883l7.741-2.113c.345-.094.517-.141.666-.168c1.652-.297 3.276.658 3.85 2.265c.051.144.098.32.19.671c.026.1.04.15.047.194a1.01 1.01 0 0 1-.635 1.12c-.04.016-.09.03-.188.056zM7 10l2-6m5 4l2-6" /><path stroke-linecap="round" d="M8 18h3" /></g></svg> Трейлер
                            </button>

                            <button className="hero-btn hero-btn--fav" onClick={() => toggleFavorite(movie)}>
                                {isFavorite(movie) ? "★ В избранном" : "+ В избранное"}
                            </button>

                        </div>

                        {movie.genres && movie.genres.length > 0 && (
                            <div className="movie-hero-genres">
                                {movie.genres.map((g) => (
                                    <span key={g}>{g}</span>
                                ))}
                            </div>
                        )}

                    </div>
                )}
            </div>

            <div className="movie-page-body">

                <div className="movie-modal-rating">

                    <div className="movie-modal-rating__top">
                        <span className="imdb-title">IMDb</span>
                        <span className="imdb-score flex gap-2 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>baseline-star-rate</title><path fill="currentColor" d="M14.43 10L12 2l-2.43 8H2l6.18 4.41L5.83 22L12 17.31L18.18 22l-2.35-7.59L22 10z" /></svg> {movie.rating}</span>
                    </div>

                    <div className="user-rating">
                        <h3>Оцените фильм</h3>

                        <div className="rating-buttons">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                                <button
                                    key={number}
                                    type="button"
                                    onClick={() => handleRating(number)}
                                    className={userRating === number ? "rating-button active" : "rating-button"}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        {userRating ? (
                            <div className="selected-rating">
                                <span>Ваша оценка</span>
                                <strong> {userRating}/10</strong>
                            </div>
                        ) : (
                            <p className="rating-placeholder">Выберите оценку от 1 до 10</p>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={toggleWatched}
                    className={`watched-button ${watched ? "watched" : ""}`}
                >
                    {watched ? "✓ Смотрел" : "○ Не смотрел"}
                </button>

            </div>
        </div>
    )
}