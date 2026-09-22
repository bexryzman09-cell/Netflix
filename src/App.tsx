import { useState } from "react"
import MovieCard from "./components/MovieCard"
import { MOVIES } from "./data/movis.data"
import type { Movie } from "./components/FavoriteContext"
import HeroBanner from "./components/HeroBanner"
import PopularRow from "./components/PopularRow"
import ContinueWatchingRow from "./components/ContinueWatchinGrow"
import { useFavorites } from "./components/FavoriteContext"
import { ProfileProvider, useProfiles } from "./components/ProfileContext"
import ProfileButton, {
  type ProfileMenuPage,
} from "./components/ProfileButton"
import ProfileGatePage from "./pages/ProfileGatePage"
import ProfileSettingsPage from "./pages/ProfileSettingsPage"
import WatchedPage from "./pages/WatchedPage"
import RatingsPage from "./pages/RatingsPage"
import ContinueWatchingPage from "./pages/ContinueWatchingPage"
import AchievementsPage from "./pages/AchievementsPage"
import FavoritePages from "./pages/FavoritePages"
import MoviePage from "./pages/MoviePage"
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

type Page = "home" | ProfileMenuPage

function AppContent() {
  const [seacrhTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState<Page>("home")
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

  const { currentProfile } = useProfiles()

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


  if (!currentProfile) {
    return <ProfileGatePage />
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

  if (page === "favorites") {
    return (
      <FavoritePages
        onBack={() => setPage("home")}
        onSelect={handleSelectMovie}
      />
    )
  }

  if (page === "continue") {
    return (
      <ContinueWatchingPage
        onBack={() => setPage("home")}
        onSelect={handleSelectMovie}
      />
    )
  }

  if (page === "watched") {
    return (
      <WatchedPage
        onBack={() => setPage("home")}
        onSelect={handleSelectMovie}
      />
    )
  }

  if (page === "ratings") {
    return (
      <RatingsPage
        onBack={() => setPage("home")}
        onSelect={handleSelectMovie}
      />
    )
  }

  if (page === "achievements") {
    return <AchievementsPage onBack={() => setPage("home")} />
  }

  if (page === "settings") {
    return <ProfileSettingsPage onBack={() => setPage("home")} />
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

      <div className="movie-header flex justify-between">

        <img
          src="netflix.png"
          alt="Netflix"
          className="netflix-logo"
          width={300}
          height={300}
        />

        <div className="relative flex flex-1 items-center">

          <input
            type="search"
            value={seacrhTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setVisibleMovies(8)
            }}
            placeholder="Поиск фильмов и сериалов..."
            className="netflix-search absolute left-1/2 -translate-x-1/2"
          />

          <div className="ml-auto">
            <ProfileButton
              favoritesCount={favorites.length}
              onNavigate={(target) => setPage(target)}
            />
          </div>

        </div>



      </div>

      <ContinueWatchingRow onSelect={handleSelectMovie} />

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
                ? "filter-tab active flex items-center gap-2"
                : "filter-tab flex items-center gap-2"
            }
            onClick={() => changeFilter("movie")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><title>flim-slate</title><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.5 10.5h14.412c1.456 0 2.184 0 2.636.44c.452.439.452 1.146.452 2.56V15c0 3.3 0 4.95-1.055 5.975C18.889 22 17.19 22 13.795 22h-3.09c-3.396 0-5.094 0-6.15-1.025C3.5 19.95 3.5 18.3 3.5 15zm-.002 0c-.357-1.358-.535-2.037-.491-2.634a3.54 3.54 0 0 1 1.5-2.648c.485-.337 1.152-.519 2.484-.883l7.741-2.113c.345-.094.517-.141.666-.168c1.652-.297 3.276.658 3.85 2.265c.051.144.098.32.19.671c.026.1.04.15.047.194a1.01 1.01 0 0 1-.635 1.12c-.04.016-.09.03-.188.056zM7 10l2-6m5 4l2-6" /><path stroke-linecap="round" d="M8 18h3" /></g></svg> Фильмы
          </button>

          <button
            type="button"
            className={
              contentFilter === "series"
                ? "filter-tab active flex items-center gap-2"
                : "filter-tab flex items-center gap-2"
            }
            onClick={() => changeFilter("series")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 14 14"><title>computer-screen-tv-movies-television-cathode-crt-tv-ray-tube-vintage-video</title><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect width="13" height="10.5" x=".5" y="3" rx="1" /><rect width="8" height="5.5" x="3" y="5.5" rx="1" /><path d="M5 .5L7 3L9 .5" /></g></svg> Сериалы
          </button>

          <button
            type="button"
            className={
              contentFilter === "anime"
                ? "filter-tab active flex items-center gap-2"
                : "filter-tab flex items-center gap-2"
            }
            onClick={() => changeFilter("anime")}
          ><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 64 64"><title>japanese-castle</title><path fill="currentColor" d="M54.5 41.375V39.5h1.406c3.365 0 6.094-2.616 6.094-4.688c0 0-1.875.938-4.688.938c-3.097 0-7.5-1.679-7.5-3.75v-7.5h1.406c3.365 0 6.094-2.616 6.094-4.688c0 0-1.875.938-4.688.938c-3.097 0-7.5-1.679-7.5-3.75V9.5h1.406c3.365 0 6.094-2.617 6.094-4.688c0 0-1.875.938-4.688.938c-3.097 0-7.5-1.679-7.5-3.75H23.562c0 2.071-4.403 3.75-7.5 3.75c-2.813 0-4.688-.938-4.688-.938c0 2.071 2.729 4.688 6.094 4.688h1.406V17c0 2.071-4.403 3.75-7.5 3.75c-2.813 0-4.688-.938-4.688-.938c0 2.071 2.729 4.688 6.094 4.688h1.406V32c0 2.071-4.403 3.75-7.5 3.75c-2.811 0-4.686-.937-4.686-.937C2 36.884 4.729 39.5 8.094 39.5H9.5V47L2 62h60l-7.5-15zm.761 9.222l.452.867h-2.228l1.55 2.602h2.033l.451.869h-6.888l1.452 2.602h6.79l.453.867h-2.598l-1.694 3.036h-.903l1.693-3.036h-6.323l-1.693 3.036h-.903l1.693-3.036h-7.904l1.694 3.036h-.903l-1.694-3.036h-6.322l1.692 3.036h-.902l-1.694-3.036h-6.323l1.693 3.036h-.903l-1.693-3.036h-4.742l-1.694 3.036h-.902l1.692-3.036h-7.227l-1.693 3.036h-.905l1.693-3.036H4.673l.453-.867h3.049l1.451-2.602H6.48l.451-.869h5.646l-1.549-2.602H8.287l.452-.867h3.839l1.808-3.036h.902l-1.807 3.036h8.13l-1.806-3.036h.902l1.807 3.036h6.324l-1.808-3.036h.903l1.807 3.036h4.518l1.807-3.036h.903l-1.808 3.036h6.324l1.807-3.036h.902l-1.806 3.036h8.131l-1.808-3.036h.902l1.808 3.036zM27.759 7.391c1.056-.841 1.72-2.11 4.241-2.11c2.525 0 3.089 1.223 4.241 2.109c2.74 2.109 4.95 2.101 5.304 2.109H22.454c.354-.007 2.649.001 5.305-2.108m-7.946 3.984h6.563v3.75h1.875v-3.75h2.813v3.75h1.875v-3.75h2.813v3.75h1.875v-3.75h6.563V17H19.813zM32 18.968l7.605 5.532h-15.21zm-15 7.407v3.75h1.875v-3.75H24.5v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.935v-3.75h5.625v3.75H47v-3.75h1.875v5.501h-33.75v-5.501zm8.333 10.313c1.664-1.12 2.706-2.813 6.667-2.813c3.968 0 4.854 1.632 6.667 2.813C42.973 39.5 46.443 39.489 47 39.5H17c.557-.011 4.162 0 8.333-2.812m-13.02 4.687v3.75h1.875v-3.75h6.094v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.938v-3.75h1.875v3.75h.938v-3.75h6.094v3.75h1.875v-3.75h1.875v5.032h-43.13v-5.032z" /><path fill="currentColor" d="m10.529 54.935l-1.452 2.601h7.904l-1.452-2.601zm8.372-.87l-1.549-2.601h-5.42l1.549 2.601zm14.453 0l-1.548-2.601H25.87l-1.549 2.601zm-9.935 0l1.548-2.601h-6.711l1.55 2.601zm22.583 0h8.13l-1.549-2.601h-5.032zm-.903 0l1.548-2.601h-7.615l1.549 2.601zm-5.42 0l-1.549-2.601h-5.42l1.549 2.601zm3.854.87l1.452 2.601h6.196l-1.452-2.601zm-5.903 0l-1.452 2.601h7.904l-1.452-2.601zm-14.873 0l1.452 2.601h3.839l1.453-2.601zm-6.323 0l1.452 2.601h5.42l-1.452-2.601zm13.969 0l-1.452 2.601h6.323l1.453-2.601z" /></svg> Аниме</button>

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

function App() {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  )
}

export default App