import MovieCard from "../components/MovieCard"
import { useWatchProgress } from "../components/WatchProgressContext"
import type { Movie } from "../components/FavoriteContext"

type ContinueWatchingPageProps = {
    onBack: () => void
    onSelect: (
        movie: Movie,
        mode?: "details" | "movie" | "trailer"
    ) => void
}

export default function ContinueWatchingPage({
    onBack,
    onSelect,
}: ContinueWatchingPageProps) {
    const { progressList } = useWatchProgress()

    return (
        <div className="bg-black dark:text-white movie-page">
            <header className="movie-header">
                <button type="button" onClick={onBack} className="theme-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>alt-arrow-left-linear</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15 5l-6 7l6 7" /></svg>
                </button>

                <h1 className="text-white">Продолжить просмотр ▶</h1>
            </header>

            <div className="movies-container">
                {progressList.length > 0 ? (
                    progressList.map(
                        ({ movie, currentTime, duration }, index) => (
                            <MovieCard
                                key={`${movie.title}-${movie.year}-${index}`}
                                image={movie.image}
                                rating={movie.rating}
                                title={movie.title}
                                russianTitle={movie.russianTitle}
                                year={movie.year}
                                type={movie.type}
                                video={movie.video}
                                description={movie.description}
                                genres={movie.genres}
                                trailerYoutubeId={movie.trailerYoutubeId}
                                progress={(currentTime / duration) * 100}
                                onSelect={() => onSelect(movie, "movie")}
                            />
                        )
                    )
                ) : (
                    <p className="mt-10 text-center text-2xl font-medium tracking-tight text-gray-300">
                        Нет фильмов с сохранённым прогрессом
                    </p>
                )}
            </div>
        </div>
    )
}