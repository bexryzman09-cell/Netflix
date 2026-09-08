import { createPortal } from "react-dom"
import { useEffect } from "react"

export default function Modal({ children, onClose }) {

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose()
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [onClose])

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >

            <div
                className="
                    relative
                    w-full
                    max-w-2xl
                    max-h-[90vh]
                    overflow-y-auto
                    rounded-2xl
                    border
                    border-white/10
                    bg-gray-900
                    shadow-2xl
                "
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="
                        absolute right-4 top-4
                        z-10
                        flex h-9 w-9 items-center justify-center
                        rounded-full
                        bg-white/10
                        text-gray-300
                        transition-all duration-300
                        hover:bg-red-500
                        hover:text-white
                        hover:rotate-90
                        active:scale-90
                    "
                >
                    ✕
                </button>

                <div className="p-6 pt-14 text-white">
                    {children}
                </div>

            </div>

        </div>,

        document.body
    )
}