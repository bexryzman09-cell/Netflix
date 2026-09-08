import { useRef } from "react"

type PopularRowProps = {
    movies: any[]
    onSelect: (movie: any, mode?: "details" | "movie" | "trailer") => void
}

export default function PopularRow({ movies, onSelect }: PopularRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    if (!movies.length) return null

    const scrollByAmount = (amount: number) => {
        scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" })
    }

    return (
        <div className="popular-row">

            <h2 className="popular-row-title">🔥 Популярное сейчас</h2>

            <div className="popular-row-carousel">

                <button
                    className="popular-arrow popular-arrow--left"
                    onClick={() => scrollByAmount(-500)}
                    aria-label="Назад"
                >
                    ‹
                </button>

                <div className="popular-row-scroll" ref={scrollRef}>

                    {movies.map((movie, index) => (
                        <div
                            key={`${movie.title}-${movie.year}`}
                            className="popular-item"
                            onClick={() => onSelect(movie, "details")}
                        >
                            <span className="popular-number">
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="popular-poster"
                            />
                        </div>
                    ))}

                </div>

                <button
                    className="popular-arrow popular-arrow--right"
                    onClick={() => scrollByAmount(500)}
                    aria-label="Вперёд"
                >
                    ›
                </button>

            </div>

        </div>
    )
}