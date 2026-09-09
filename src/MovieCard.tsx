import { useState } from "react"
import FavoriteButton from "./FavoriteButton"
import type { Movie } from "./FavoriteContext"

const TYPE_LABELS: Record<string, string> = {
    movie: "Фильм",
    series: "Сериал",
    anime: "Аниме",
}

type MovieCardProps = {
    image: string
    rating: number
    title: string
    year: number
    trailerYoutubeId?: string
    video?: string
    type?: string
    description?: string
    genres?: string[]
    russianTitle?: string
    onSelect: (
        movie: Movie,
        mode?: "details" | "movie" | "trailer"
    ) => void
}

const MovieCard = ({
    image,
    rating,
    title,
    year,
    trailerYoutubeId,
    video,
    type,
    description,
    genres,
    russianTitle,
    onSelect,
}: MovieCardProps) => {
    const movie: Movie = {
        image,
        rating,
        title,
        year,
        trailerYoutubeId,
        video,
        type,
        description,
        genres,
        russianTitle,
    }

    const hasVideo = Boolean(trailerYoutubeId)

    const [playingInCard, setPlayingInCard] =
        useState<"movie" | "trailer" | null>(null)

    const openDetails = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        onSelect(movie, "details")
    }

    const startPlay = (
        e: React.MouseEvent,
        mode: "movie" | "trailer"
    ) => {
        e.stopPropagation()

        if (!hasVideo) {
            alert("Видео для этого тайтла пока не добавлено")
            return
        }

        setPlayingInCard(mode)
    }

    const stopPlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        setPlayingInCard(null)
    }

    return (
        <div className="movie-card-wrapper">

            <div
                className="movie-poster"
                onClick={openDetails}
            >

                {playingInCard ? (
                    <div className="card-player">

                        <button
                            className="card-player-close"
                            onClick={stopPlay}
                        >
                            ✕
                        </button>

                        <iframe
                            src={`https://www.youtube.com/embed/${trailerYoutubeId}?autoplay=1`}
                            title={`${title} — видео`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />

                    </div>
                ) : (
                    <>
                        <img
                            src={image}
                            alt={title}
                            className="movie-image"
                        />

                        {type && (
                            <span className="movie-type-badge">
                                {TYPE_LABELS[type] || type}
                            </span>
                        )}

                        <div
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >
                            <FavoriteButton movie={movie} />
                        </div>

                        <div className="poster-overlay">

                            <button
                                className="poster-play"
                                onClick={(e) =>
                                    startPlay(e, "movie")
                                }
                            >
                                ▶
                            </button>

                            <div className="poster-actions">

                                <button
                                    className="circle-btn"
                                    onClick={(e) =>
                                        startPlay(e, "movie")
                                    }
                                >
                                    <span className="circle-btn-icon">
                                        ▶
                                    </span>

                                    <span className="circle-btn-label">
                                        Смотреть
                                    </span>
                                </button>

                                <div
                                    className="circle-btn"
                                    onClick={(e) =>
                                        e.stopPropagation()
                                    }
                                >
                                    <div className="circle-btn-icon">
                                        <FavoriteButton movie={movie} />
                                    </div>

                                    <span className="circle-btn-label">
                                        В избранное
                                    </span>
                                </div>

                                <button
                                    className="circle-btn"
                                    onClick={openDetails}
                                >
                                    <span className="circle-btn-icon">
                                        ⓘ
                                    </span>

                                    <span className="circle-btn-label">
                                        Подробнее
                                    </span>
                                </button>

                            </div>

                            <button
                                className="poster-trailer-btn"
                                onClick={(e) =>
                                    startPlay(e, "trailer")
                                }
                            >
                                🎬 Трейлер
                            </button>

                        </div>
                    </>
                )}

            </div>

            <div className="movie-content">

                <h1 className="movie-content-title">
                    {title}
                </h1>

                <div className="movie-content-meta">

                    <span className="movie-content-rating">
                        ⭐ {rating}
                    </span>

                    <span>{year}</span>

                    {type && (
                        <span className="movie-content-badge">
                            {TYPE_LABELS[type] || type}
                        </span>
                    )}

                </div>

                {description && (
                    <p className="movie-content-description">
                        {description}
                    </p>
                )}

                {genres && genres.length > 0 && (
                    <div className="movie-content-genres">

                        {genres.map((g) => (
                            <span
                                key={g}
                                className="genre-pill"
                            >
                                {g}
                            </span>
                        ))}

                    </div>
                )}

            </div>

        </div>
    )
}

export default MovieCard