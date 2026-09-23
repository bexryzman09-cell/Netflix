import MovieCard from "../components/MovieCard"
import { MOVIES } from "../data/movis.data"
import type { Movie } from "../components/FavoriteContext"
import { useProfiles } from "../components/ProfileContext"
type WatchedPageProps = {
    onBack: () => void
    onSelect: (
        movie: Movie,
        mode?: "details" | "movie" | "trailer"
    ) => void
}

export default function WatchedPage({
    onBack,
    onSelect,
}: WatchedPageProps) {
    const { currentProfile } = useProfiles()

    const profileId = currentProfile?.id

    const watched = profileId
        ? MOVIES.filter(
            (movie: Movie) =>
                localStorage.getItem(
                    `watched-${profileId}-${movie.title}-${movie.year}`
                ) === "true"
        )
        : []

    return (
        <div className="bg-black dark:text-white movie-page">
            <header className="movie-header">
                <button type="button" onClick={onBack} className="theme-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>alt-arrow-left-linear</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15 5l-6 7l6 7" /></svg>
                </button>

                <h1 className="text-white">Просмотрено ✓</h1>
            </header>

            <div className="movies-container">
                {watched.length > 0 ? (
                    watched.map((movie: Movie, index: number) => (
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
                            onSelect={onSelect}
                        />
                    ))
                ) : (
                    <p className="mt-10 text-center text-2xl font-medium tracking-tight text-gray-300">
                        Вы пока ничего не посмотрели
                    </p>
                )}
            </div>
        </div>
    )
}