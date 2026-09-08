import { useFavorites } from "./FavoriteContext"

export default function FavoriteButton({ movie }) {
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