import { useFavorites, type Movie } from "./FavoriteContext"

type FavoriteButtonProps = {
  movie: Movie
}

export default function FavoriteButton({
  movie,
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites()

  return (
    <button
      type="button"
      className="z-10 favorite-button"
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(movie)
      }}
    >
      {isFavorite(movie) ? "★" : "☆"}
    </button>
  )
}