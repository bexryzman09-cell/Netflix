import MovieCard from "../MovieCard"
import { useFavorites } from "../FavoriteContext"

type FavoritePagesProps = {
    onBack: () => void
    onSelect: (movie: any, mode?: "details" | "movie" | "trailer") => void
}

export default function FavoritePages({ onBack, onSelect }: FavoritePagesProps) {
    const { favorites } = useFavorites()

    return (
        <div className="bg-black dark:text-white text-black movie-page">
            <header className="movie-header">
                <button type="button" onClick={onBack} className="theme-button">
                    ←
                </button>
                <h1 className="text-white">Избранное ⭐</h1>
            </header>

            <div className="movies-container">
                {favorites.length > 0 ? (
                    favorites.map((movie, index) => (
                        <MovieCard
                            key={`${movie.title}-${movie.year}-${index}`}
                            image={movie.image}
                            rating={movie.rating}
                            title={movie.title}
                            year={movie.year}
                            type={movie.type}
                            trailerYoutubeId={movie.trailerYoutubeId}
                            onSelect={onSelect}
                        />
                    ))
                ) : (
                    <p className="mt-10 text-center text-2xl font-medium tracking-tight text-gray-300">
                        В избранном пока ничего нет
                    </p>
                )}
            </div>
        </div>
    )
}