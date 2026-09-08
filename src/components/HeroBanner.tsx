type HeroBannerProps = {
    movie: {
        title: string
        rating: number
        year: number
        type?: string
        description?: string
        image: string
        trailerYoutubeId?: string
    }
    onWatch: () => void
    onFavorite: () => void
    isFavorite: boolean
}

const TYPE_LABELS: Record<string, string> = {
    movie: "Фильм",
    series: "Сериал",
    anime: "Аниме"
}

export default function HeroBanner({ movie, onWatch, onFavorite, isFavorite }: HeroBannerProps) {
    return (
        <div className="hero-banner">

            <div
                className="hero-banner-bg"
                style={{ backgroundImage: `url(${movie.image})` }}
            />

            <img src={movie.image} alt={movie.title} className="hero-banner-image" />

            <div className="hero-banner-gradient" />

            <div className="hero-banner-content">

                <h1>{movie.title}</h1>

                <div className="hero-banner-meta">
                    <span>⭐ {movie.rating}</span>
                    <span>·</span>
                    <span>{movie.year}</span>
                    {movie.type && (
                        <>
                            <span>·</span>
                            <span>{TYPE_LABELS[movie.type] || movie.type}</span>
                        </>
                    )}
                </div>

                {movie.description && (
                    <p className="hero-banner-description">{movie.description}</p>
                )}

                <div className="hero-banner-actions">

                    <button
                        className="hero-btn hero-btn--primary"
                        onClick={() => movie.trailerYoutubeId ? onWatch() : alert("Видео для этого тайтла пока не добавлено")}
                    >
                        ▶ Смотреть
                    </button>

                    <button className="hero-btn hero-btn--fav" onClick={onFavorite}>
                        {isFavorite ? "★ В избранном" : "+ В избранное"}
                    </button>

                </div>

            </div>

        </div>
    )
}