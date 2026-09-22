type ProfileAvatarProps = {
    name: string
    avatar?: string
    size?: "sm" | "md" | "lg"
}

const COLORS = [
    "bg-red-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-purple-600",
    "bg-amber-600",
    "bg-pink-600",
    "bg-cyan-600",
]

const SIZE_CLASSES: Record<string, string> = {
    sm: "w-9 h-9 text-sm",
    md: "w-14 h-14 text-xl",
    lg: "w-20 h-20 sm:w-24 sm:h-24 text-3xl sm:text-4xl",
}

function colorForName(name: string) {
    let hash = 0

    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) % COLORS.length
    }

    return COLORS[Math.abs(hash) % COLORS.length]
}

export default function ProfileAvatar({
    name,
    avatar,
    size = "md",
}: ProfileAvatarProps) {
    const sizeClass = SIZE_CLASSES[size]

    if (avatar) {
        return (
            <img
                src={avatar}
                alt={name}
                className={`${sizeClass} rounded-md object-cover shrink-0`}
            />
        )
    }

    const initial = name.trim().slice(0, 1).toUpperCase() || "?"

    return (
        <div
            className={`${sizeClass} rounded-md ${colorForName(
                name
            )} flex items-center justify-center font-bold text-white shrink-0`}
        >
            {initial}
        </div>
    )
}