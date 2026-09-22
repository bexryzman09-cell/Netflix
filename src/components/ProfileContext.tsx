import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"

export type NotificationSettings = {
    premieres: boolean
    recommendations: boolean
}

export type Profile = {
    id: string
    name: string
    email: string
    phone?: string
    password: string
    avatar?: string
    notifications: NotificationSettings
    createdAt: number
}

type RegisterInput = {
    name: string
    email: string
    password: string
    phone?: string
}

type ActionResult = { ok: boolean; error: string }

type ProfileContextType = {
    profiles: Profile[]
    currentProfile: Profile | null
    registerProfile: (data: RegisterInput) => ActionResult
    selectProfile: (id: string) => void
    logout: () => void
    updateProfile: (
        id: string,
        data: Partial<Omit<Profile, "id" | "password">>
    ) => void
    changePassword: (
        id: string,
        oldPassword: string,
        newPassword: string
    ) => ActionResult
    deleteProfile: (id: string) => void
}

const PROFILES_KEY = "streamflix-profiles"
const CURRENT_KEY = "streamflix-current-profile"

const ProfileContext = createContext<ProfileContextType | undefined>(
    undefined
)

type ProfileProviderProps = {
    children: ReactNode
}

export function ProfileProvider({ children }: ProfileProviderProps) {
    const [profiles, setProfiles] = useState<Profile[]>(() => {
        const saved = localStorage.getItem(PROFILES_KEY)

        if (!saved) {
            return []
        }

        try {
            return JSON.parse(saved) as Profile[]
        } catch {
            return []
        }
    })

    const [currentProfileId, setCurrentProfileId] = useState<string | null>(
        () => localStorage.getItem(CURRENT_KEY)
    )

    useEffect(() => {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
    }, [profiles])

    useEffect(() => {
        if (currentProfileId) {
            localStorage.setItem(CURRENT_KEY, currentProfileId)
        } else {
            localStorage.removeItem(CURRENT_KEY)
        }
    }, [currentProfileId])

    const currentProfile =
        profiles.find((profile) => profile.id === currentProfileId) ?? null

    function registerProfile(data: RegisterInput): ActionResult {
        const emailTaken = profiles.some(
            (profile) =>
                profile.email.toLowerCase() === data.email.trim().toLowerCase()
        )

        if (emailTaken) {
            return {
                ok: false,
                error: "Профиль с такой почтой уже существует",
            }
        }

        if (data.password.length < 4) {
            return {
                ok: false,
                error: "Пароль должен быть не короче 4 символов",
            }
        }

        const newProfile: Profile = {
            id: crypto.randomUUID(),
            name: data.name.trim() || "Без имени",
            email: data.email.trim(),
            phone: data.phone?.trim() || undefined,
            password: data.password,
            notifications: { premieres: true, recommendations: true },
            createdAt: Date.now(),
        }

        setProfiles((prev) => [...prev, newProfile])
        setCurrentProfileId(newProfile.id)

        return { ok: true, error: "" }
    }

    function selectProfile(id: string) {
        setCurrentProfileId(id)
    }

    function logout() {
        setCurrentProfileId(null)
    }

    function updateProfile(
        id: string,
        data: Partial<Omit<Profile, "id" | "password">>
    ) {
        setProfiles((prev) =>
            prev.map((profile) =>
                profile.id === id ? { ...profile, ...data } : profile
            )
        )
    }

    function changePassword(
        id: string,
        oldPassword: string,
        newPassword: string
    ): ActionResult {
        const profile = profiles.find((item) => item.id === id)

        if (!profile) {
            return { ok: false, error: "Профиль не найден" }
        }

        if (profile.password !== oldPassword) {
            return { ok: false, error: "Старый пароль указан неверно" }
        }

        if (newPassword.length < 4) {
            return {
                ok: false,
                error: "Новый пароль должен быть не короче 4 символов",
            }
        }

        setProfiles((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, password: newPassword } : item
            )
        )

        return { ok: true, error: "" }
    }

    function deleteProfile(id: string) {
        setProfiles((prev) => prev.filter((profile) => profile.id !== id))

        if (currentProfileId === id) {
            setCurrentProfileId(null)
        }
    }

    return (
        <ProfileContext.Provider
            value={{
                profiles,
                currentProfile,
                registerProfile,
                selectProfile,
                logout,
                updateProfile,
                changePassword,
                deleteProfile,
            }}
        >
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfiles() {
    const context = useContext(ProfileContext)

    if (!context) {
        throw new Error("useProfiles must be used inside ProfileProvider")
    }

    return context
}