import { useState } from "react"
import MovieCard from "./MovieCard"
import { MOVIES } from "./movis.data"
import type { Movie } from "./FavoriteContext"
import HeroBanner from "./components/HeroBanner"
import PopularRow from "./components/PopularRow"
import { useFavorites } from "./FavoriteContext"
import FavoritePages from "./components/FavoritePages"
import MoviePage from "./components/MoviePage"
import "./App.css"

const GENRES = [
  "Боевик",
  "Комедия",
  "Ужасы",
  "Фэнтези",
  "Романтика",
  "Фантастика",
  "Приключения",
]

function getYearBucket(year: number) {
  if (year >= 2020) return "2020s"
  if (year >= 2010) return "2010s"
  if (year >= 2000) return "2000s"
  if (year >= 1990) return "1990s"
  return "before1990"
}

function App() {
  const [seacrhTerm, setSearchTerm] = useState("")
  const [showFavorites, setShowFavorites] = useState(false)
  const [visibleMovies, setVisibleMovies] = useState(8)

  const [contentFilter, setContentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("default")

  const [genreFilter, setGenreFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState(0)

  const [activeMovie, setActiveMovie] = useState<{
    movie: Movie
    mode: "details" | "movie" | "trailer"
  } | null>(null)

  const {
    toggleFavorite,
    isFavorite,
    favorites,
  } = useFavorites()

  const [randomMovies] = useState<Movie[]>(() => {
    return [...MOVIES].sort(() => Math.random() - 0.5)
  })

  const [popularMovies] = useState<Movie[]>(() => {
    return [...MOVIES]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8)
  })

  const heroMovie = randomMovies[0]

  const watchedCount = MOVIES.filter(
    (movie: Movie) =>
      localStorage.getItem(
        `watched-${movie.title}-${movie.year}`
      ) === "true"
  ).length

  const handleSelectMovie = (
    movie: Movie,
    mode: "details" | "movie" | "trailer" = "details"
  ) => {
    setActiveMovie({
      movie,
      mode,
    })
  }

  const filteredMovies = randomMovies
    .filter((movie: Movie) => {
      const search = seacrhTerm.toLowerCase().trim()

      const matchesSearch =
        movie.title.toLowerCase().includes(search) ||
        movie.russianTitle?.toLowerCase().includes(search) ||
        movie.year.toString().includes(search)

      const matchesFilter =
        contentFilter === "all" ||
        (contentFilter === "movie" &&
          movie.type === "movie") ||
        (contentFilter === "series" &&
          movie.type === "series") ||
        (contentFilter === "anime" &&
          movie.type === "anime") ||
        (contentFilter === "watched" &&
          localStorage.getItem(
            `watched-${movie.title}-${movie.year}`
          ) === "true")

      const matchesGenre =
        genreFilter === "all" ||
        movie.genres?.includes(genreFilter) === true

      const matchesYear =
        yearFilter === "all" ||
        getYearBucket(movie.year) === yearFilter

      const matchesRating =
        movie.rating >= ratingFilter

      return (
        matchesSearch &&
        matchesFilter &&
        matchesGenre &&
        matchesYear &&
        matchesRating
      )
    })
    .sort((a: Movie, b: Movie) => {
      if (sortBy === "rating") {
        return b.rating - a.rating
      }

      if (sortBy === "newest") {
        return b.year - a.year
      }

      if (sortBy === "oldest") {
        return a.year - b.year
      }

      return 0
    })

  const moviesToShow = filteredMovies.slice(
    0,
    visibleMovies
  )

  const hasMoreMovies =
    visibleMovies < filteredMovies.length

  const changeFilter = (filter: string) => {
    setContentFilter(filter)
    setVisibleMovies(8)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setContentFilter("all")
    setSortBy("default")
    setGenreFilter("all")
    setYearFilter("all")
    setRatingFilter(0)
    setVisibleMovies(8)
  }

  if (activeMovie) {
    return (
      <MoviePage
        movie={activeMovie.movie}
        initialMode={activeMovie.mode}
        onBack={() => setActiveMovie(null)}
      />
    )
  }

  if (showFavorites) {
    return (
      <FavoritePages
        onBack={() => setShowFavorites(false)}
        onSelect={handleSelectMovie}
      />
    )
  }

  return (
    <div className="bg-black text-white movie-page">

      {heroMovie && (
        <HeroBanner
          movie={heroMovie}
          onWatch={() =>
            handleSelectMovie(heroMovie, "movie")
          }
          onFavorite={() =>
            toggleFavorite(heroMovie)
          }
          isFavorite={isFavorite(heroMovie)}
        />
      )}

      <header className="movie-header">

        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXf0vclMBWcSqvOwleb4PpHVPYqynsL_7iYHCYC7Q4ZA&s=10"
          alt="Netflix"
          className="netflix-logo"
        />

        <div className="flex gap-10">

          <input
            type="search"
            value={seacrhTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setVisibleMovies(8)
            }}
            placeholder="Поиск фильмов и сериалов..."
            className="netflix-search"
          />

          <button
            type="button"
            className="favorit_pages--button"
            onClick={() => setShowFavorites(true)}
          >
            Избранное ({favorites.length})
          </button>

        </div>

        <span className="info-icon text-white ">
          ⓘ
        </span>

      </header>

      <PopularRow
        movies={popularMovies}
        onSelect={handleSelectMovie}
      />

      <div className="movie-filters">

        <div className="filter-tabs">

          <button
            type="button"
            className={
              contentFilter === "all"
                ? "filter-tab active"
                : "filter-tab"
            }
            onClick={() => changeFilter("all")}
          >
            Все
          </button>

          <button
            type="button"
            className={
              contentFilter === "movie"
                ? "filter-tab active"
                : "filter-tab"
            }
            onClick={() => changeFilter("movie")}
          >
            🎬 Фильмы
          </button>

          <button
            type="button"
            className={
              contentFilter === "series"
                ? "filter-tab active"
                : "filter-tab"
            }
            onClick={() => changeFilter("series")}
          >
            📺 Сериалы
          </button>

          <button
            type="button"
            className={
              contentFilter === "anime"
                ? "filter-tab active"
                : "filter-tab"
            }
            onClick={() => changeFilter("anime")}
          >
            ⛩️ Аниме
          </button>

          <button
            type="button"
            className={
              contentFilter === "watched"
                ? "filter-tab active"
                : "filter-tab"
            }
            onClick={() => changeFilter("watched")}
          >
            ✓ Смотрел ({watchedCount})
          </button>

        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value)
            setVisibleMovies(8)
          }}
        >
          <option value="default">
            Сортировка
          </option>

          <option value="rating">
            ⭐ По рейтингу
          </option>

          <option value="newest">
            🆕 Сначала новые
          </option>

          <option value="oldest">
            📅 Сначала старые
          </option>
        </select>

      </div>

      <div className="advanced-filters">

        <select
          className="sort-select"
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value)
            setVisibleMovies(8)
          }}
        >
          <option value="all">
            Год: Все
          </option>

          <option value="2020s">
            2020-е
          </option>

          <option value="2010s">
            2010-е
          </option>

          <option value="2000s">
            2000-е
          </option>

          <option value="1990s">
            1990-е
          </option>

          <option value="before1990">
            До 1990
          </option>
        </select>

        <select
          className="sort-select"
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(
              Number(e.target.value)
            )
            setVisibleMovies(8)
          }}
        >
          <option value={0}>
            Рейтинг: Все
          </option>

          <option value={9}>
            9+
          </option>

          <option value={8}>
            8+
          </option>

          <option value={7}>
            7+
          </option>

          <option value={6}>
            6+
          </option>
        </select>

        <div className="genre-pills-row">

          <button
            type="button"
            className={
              genreFilter === "all"
                ? "genre-filter-btn active"
                : "genre-filter-btn"
            }
            onClick={() => {
              setGenreFilter("all")
              setVisibleMovies(8)
            }}
          >
            Все жанры
          </button>

          {GENRES.map((genre) => (
            <button
              type="button"
              key={genre}
              className={
                genreFilter === genre
                  ? "genre-filter-btn active"
                  : "genre-filter-btn"
              }
              onClick={() => {
                setGenreFilter(genre)
                setVisibleMovies(8)
              }}
            >
              {genre}
            </button>
          ))}

        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="genre-filter-btn"
        >
          ✕ Сбросить
        </button>

      </div>

      <div className="movies-container">

        {moviesToShow.length > 0 ? (

          moviesToShow.map(
            (movie: Movie, index: number) => (
              <MovieCard
                key={`${movie.title}-${movie.year}-${index}`}
                image={movie.image}
                rating={movie.rating}
                title={movie.title}
                year={movie.year}
                type={movie.type}
                video={movie.video}
                description={movie.description}
                genres={movie.genres}
                russianTitle={movie.russianTitle}
                trailerYoutubeId={movie.trailerYoutubeId}
                onSelect={handleSelectMovie}
              />
            )
          )

        ) : (

          <p>
            Фильмы и сериалы не найдены
          </p>

        )}

      </div>

      {hasMoreMovies && (
        <div className="flex justify-center mt-10 pb-10">

          <button
            type="button"
            onClick={() =>
              setVisibleMovies(
                (prev: number) => prev + 8
              )
            }
            className="px-8 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300"
          >
            Ещё
          </button>

        </div>
      )}

    </div>
  )
}

export default App