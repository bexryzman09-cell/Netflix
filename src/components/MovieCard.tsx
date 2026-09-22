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
    progress?: number
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
    progress,
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

                        {typeof progress === "number" && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/25">
                                <div
                                    className="h-full bg-red-600"
                                    style={{
                                        width: `${Math.min(100, Math.max(0, progress))}%`,
                                    }}
                                />
                            </div>
                        )}

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
                                className="flex items-center gap-2 poster-trailer-btn"
                                onClick={(e) =>
                                    startPlay(e, "trailer")
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><title>film-marker</title><path d="M448.4 208h-344l341.2-68c8.5-1.6 14-9.7 12.4-18.1l-8.9-45.4c-1.6-8.4-9.8-13.8-18.3-12.2L60.7 137.9c-8.5 1.6-14 9.7-12.4 18l8.9 45.4c.6 2.8 2.1 5.2 3.9 7.2-7.4 1.2-13.1 7.2-13.1 14.9v209.2c0 8.5 7 15.4 15.6 15.4h384.8c8.6 0 15.6-6.9 15.6-15.4V223.4c0-8.5-7-15.4-15.6-15.4zM305 402.4l-50.7-36.3-50.7 36.3 19.5-58.4-50.8-36H235l19.2-58.4 19.3 58.4h62.7l-50.8 36 19.6 58.4z" fill="currentColor" /></svg> Трейлер
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

                    <span className="movie-content-rating flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>award-star-rounded</title><path fill="currentColor" d="m12 14.475l1.925 1.15q.275.175.538-.012t.187-.513l-.5-2.175l1.7-1.475q.25-.225.15-.537t-.45-.338l-2.225-.175l-.875-2.075q-.125-.3-.45-.3t-.45.3l-.875 2.075l-2.225.175q-.35.025-.45.338t.15.537l1.7 1.475l-.5 2.175q-.075.325.188.513t.537.012zM8.65 20H6q-.825 0-1.412-.587T4 18v-2.65L2.075 13.4q-.275-.3-.425-.662T1.5 12t.15-.737t.425-.663L4 8.65V6q0-.825.588-1.412T6 4h2.65l1.95-1.925q.3-.275.663-.425T12 1.5t.738.15t.662.425L15.35 4H18q.825 0 1.413.588T20 6v2.65l1.925 1.95q.275.3.425.663t.15.737t-.15.738t-.425.662L20 15.35V18q0 .825-.587 1.413T18 20h-2.65l-1.95 1.925q-.3.275-.662.425T12 22.5t-.737-.15t-.663-.425z" /></svg>    {rating}
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