import { useState } from "react"
import { useFavorites } from "../FavoriteContext"

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
        image: string
        description?: string
        genres?: string[]
    }
    initialMode?: "details" | "movie" | "trailer"
    onBack: () => void
}

export default function MoviePage({ movie, initialMode = "details", onBack }: MoviePageProps) {
    const { toggleFavorite, isFavorite } = useFavorites()

    const hasVideo = Boolean(movie.trailerYoutubeId)

    const [playing, setPlaying] = useState<"movie" | "trailer" | null>(
        initialMode !== "details" && hasVideo ? (initialMode as "movie" | "trailer") : null
    )

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
                        <button className="player-close" onClick={() => setPlaying(null)}>
                            ✕ Закрыть
                        </button>

                        <iframe
                            src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=1`}
                            title={`${movie.title} — ${playing === "movie" ? "просмотр" : "трейлер"}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
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
                            <span>⭐ {movie.rating}</span>
                            <span>{movie.year}</span>
                            {movie.russianTitle && <span>{movie.russianTitle}</span>}
                        </div>

                        {movie.description && (
                            <p className="movie-hero-description">{movie.description}</p>
                        )}

                        <div className="movie-hero-actions">

                            <button
                                className="hero-btn hero-btn--primary"
                                onClick={() => hasVideo ? setPlaying("movie") : alert("Видео для этого тайтла пока не добавлено")}
                            >
                                ▶ Смотреть
                            </button>

                            <button
                                className="hero-btn hero-btn--trailer"
                                onClick={() => hasVideo ? setPlaying("trailer") : alert("Трейлер для этого тайтла пока не добавлен")}
                            >
                                🎬 Трейлер
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
                        <span className="imdb-score">⭐ {movie.rating}</span>
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
                                <strong>⭐ {userRating}/10</strong>
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