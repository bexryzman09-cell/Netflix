import MovieCard from "../components/MovieCard"
import { useFavorites, type Movie } from "../components/FavoriteContext"

type FavoritePagesProps = {
    onBack: () => void
    onSelect: (
        movie: Movie,
        mode?: "details" | "movie" | "trailer"
    ) => void
}

export default function FavoritePages({
    onBack,
    onSelect,
}: FavoritePagesProps) {
    const { favorites } = useFavorites()

    return (
        <div className="bg-black dark:text-white movie-page">
            <header className="movie-header">
                <button
                    type="button"
                    onClick={onBack}
                    className="theme-button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>alt-arrow-left-line-duotone</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15 5l-6 7l6 7" /></svg>
                </button>

                <h1 className="text-white flex  gap-3  ">
                    Избранное <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><title>baseline-star-rate</title><path fill="currentColor" d="M14.43 10L12 2l-2.43 8H2l6.18 4.41L5.83 22L12 17.31L18.18 22l-2.35-7.59L22 10z" /></svg>
                </h1>
            </header>

            <div className="movies-container">
                {favorites.length > 0 ? (
                    favorites.map((movie: Movie, index: number) => (
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