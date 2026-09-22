import MovieCard from "../components/MovieCard"
import { MOVIES } from "../data/movis.data"
import type { Movie } from "../components/FavoriteContext"

type RatingsPageProps = {
    onBack: () => void
    onSelect: (
        movie: Movie,
        mode?: "details" | "movie" | "trailer"
    ) => void
}

function getUserRating(movie: Movie): number | null {
    const saved = localStorage.getItem(
        `movie-rating-${movie.title}-${movie.year}`
    )
    return saved ? Number(saved) : null
}

export default function RatingsPage({ onBack, onSelect }: RatingsPageProps) {
    const rated = MOVIES.reduce<{ movie: Movie; userRating: number }[]>(
        (acc, movie) => {
            const userRating = getUserRating(movie)

            if (userRating !== null) {
                acc.push({ movie, userRating })
            }

            return acc
        },
        []
    ).sort((a, b) => b.userRating - a.userRating)

    return (
        <div className="bg-black dark:text-white movie-page">
            <header className="movie-header">
                <button type="button" onClick={onBack} className="theme-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>alt-arrow-left-line-duotone</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15 5l-6 7l6 7" /></svg>
                </button>

                <h1 className="flex gap-2   text-white">Мои оценки <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><title>baseline-star</title><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" /></svg></h1>
            </header>

            <div className="movies-container">
                {rated.length > 0 ? (
                    rated.map(({ movie, userRating }, index) => (
                        <div
                            key={`${movie.title}-${movie.year}-${index}`}
                            className="relative"
                        >
                            <span className=" flex absolute top-2 left-2 z-10 bg-black/80 text-yellow-400 text-sm font-semibold rounded-md px-2 py-1 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>baseline-star</title><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" /></svg> {userRating}/10
                            </span>

                            <MovieCard
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
                        </div>
                    ))
                ) : (
                    <p className="mt-10 text-center text-2xl font-medium tracking-tight text-gray-300">
                        Вы ещё не оценили ни одного фильма
                    </p>
                )}
            </div>
        </div>
    )
}