import { useEffect, useRef, useState, type ComponentType } from "react"
import { useProfiles } from "./ProfileContext"
import ProfileAvatar from "./ProfileAvatar"
import FireIcon from "../icons/FireIcon"
import PlayIcon from "../icons/PlayIcon"
import CheckIcon from "../icons/CheckIcon"
import StarIcon from "../icons/StarIcon"
import TrophyIcon from "../icons/TrophyIcon"
import SettingsIcon from "../icons/SettingsIcon"
export type ProfileMenuPage =
    | "favorites"
    | "continue"
    | "watched"
    | "ratings"
    | "achievements"
    | "settings"
type ProfileButtonProps = {
    onNavigate: (page: ProfileMenuPage) => void
    favoritesCount: number
}

const MENU_ITEMS: {
    key: ProfileMenuPage
    icon: ComponentType
    label: string
}[] = [
        { key: "favorites", icon: FireIcon, label: "Избранное" },
        { key: "continue", icon: PlayIcon, label: "Продолжить просмотр" },
        { key: "watched", icon: CheckIcon, label: "Просмотрено" },
        { key: "ratings", icon: StarIcon, label: "Мои оценки" },
        { key: "achievements", icon: TrophyIcon, label: "Достижения" },
        { key: "settings", icon: SettingsIcon, label: "Настройки" },
    ]

export default function ProfileButton({
    onNavigate,
}: ProfileButtonProps) {
    const { currentProfile, logout } = useProfiles()
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                rootRef.current &&
                !rootRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (!currentProfile) {
        return null
    }

    return (
        <div className="relative   shrink-0" ref={rootRef}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/10 transition-colors"
            >
                <ProfileAvatar
                    name={currentProfile.name}
                    avatar={currentProfile.avatar}
                    size="sm"
                />
                <span className="hidden sm:inline text-white font-medium max-w-32 truncate">
                    {currentProfile.name}
                </span>  
                <span className="text-white/60 text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>alt-arrow-down-line-duotone</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19 9l-7 6l-7-6" /></svg></span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-72 max-w-[90vw] rounded-lg border border-white/10 bg-neutral-900 shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                        <ProfileAvatar
                            name={currentProfile.name}
                            avatar={currentProfile.avatar}
                            size="md"
                        />
                        <div className="min-w-0">
                            <p className="text-white font-semibold truncate">
                                {currentProfile.name}
                            </p>
                            <p className="text-white/50 text-sm truncate">
                                {currentProfile.email}
                            </p>
                        </div>
                    </div>

                    <div className="py-2">
                        {MENU_ITEMS.map((item) => {
                            const Icon = item.icon

                            return (
                                <button className="flex p-2 items-center text-center gap-2"
                                    key={item.key}
                                    onClick={() => onNavigate(item.key)}
                                >
                                    <Icon />
                                    <span>{item.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="border-t border-white/10 py-2">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false)
                                logout()
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white/70 hover:bg-white/10 transition-colors"
                        >
                            <span className="w-5 text-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>baseline-change-circle</title><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m.06 17v-2.01H12c-1.28 0-2.56-.49-3.54-1.46a5.006 5.006 0 0 1-.64-6.29l1.1 1.1c-.71 1.33-.53 3.01.59 4.13c.7.7 1.62 1.03 2.54 1.01v-2.14l2.83 2.83zm4.11-4.24l-1.1-1.1c.71-1.33.53-3.01-.59-4.13A3.48 3.48 0 0 0 12 8.5h-.06v2.15L9.11 7.83L11.94 5v2.02c1.3-.02 2.61.45 3.6 1.45c1.7 1.7 1.91 4.35.63 6.29" /></svg></span>
                            <span>Сменить профиль</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}