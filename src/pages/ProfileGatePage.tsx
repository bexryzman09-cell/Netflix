import { useState } from "react"
import { useProfiles } from "../components/ProfileContext"
import ProfileAvatar from "../components/ProfileAvatar"

export default function ProfileGatePage() {
    const { profiles, registerProfile, selectProfile } = useProfiles()

    const [mode, setMode] = useState<"pick" | "register">(
        profiles.length === 0 ? "register" : "pick"
    )

    const [loginId, setLoginId] = useState<string | null>(null)
    const [loginPassword, setLoginPassword] = useState("")
    const [loginError, setLoginError] = useState("")

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    })
    const [formError, setFormError] = useState("")

    function handleLoginSubmit(profileId: string) {
        const profile = profiles.find((item) => item.id === profileId)

        if (!profile) {
            return
        }

        if (profile.password !== loginPassword) {
            setLoginError("Неверный пароль")
            return
        }

        selectProfile(profileId)
    }

    function handleRegisterSubmit() {
        if (!form.name.trim() || !form.email.trim() || !form.password) {
            setFormError("Заполните имя, почту и пароль")
            return
        }

        const result = registerProfile({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
        })

        if (!result.ok) {
            setFormError(result.error)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-3xl">
                {mode === "pick" && (
                    <>
                        <h1 className="text-white text-2xl sm:text-4xl font-semibold text-center mb-10">
                            Кто смотрит?
                        </h1>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
                            {profiles.map((profile) => (
                                <button
                                    key={profile.id}
                                    type="button"
                                    onClick={() => {
                                        setLoginId(profile.id)
                                        setLoginPassword("")
                                        setLoginError("")
                                    }}
                                    className="flex cursor-pointer flex-col items-center gap-3 group"
                                >
                                    <div className="rounded-md group-hover:ring-4 ring-white/70 transition-all">
                                        <ProfileAvatar
                                            name={profile.name}
                                            avatar={profile.avatar}
                                            size="lg"
                                        />
                                    </div>
                                    <span className="text-white/80 group-hover:text-white text-sm sm:text-base truncate max-w-28">
                                        {profile.name}
                                    </span>
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    setMode("register")
                                    setFormError("")
                                }}
                                className="flex cursor-pointer flex-col items-center gap-3 group"
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md border-2 border-dashed border-white/30 flex items-center justify-center text-white/40 text-3xl sm:text-4xl group-hover:border-white/70 group-hover:text-white/70 transition-all">
                                    +
                                </div>
                                <span className= "cursor-pointer  text-white/60 group-hover:text-white text-sm sm:text-base">
                                    Добавить профиль
                                </span>
                            </button>
                        </div>
                    </>
                )}

                {mode === "register" && (
                    <div className="max-w-sm mx-auto">
                        <h1 className= "flex text-white text-2xl sm:text-3xl font-semibold text-center mb-2">
                           Создать профиль
                        </h1>
                        <p className="text-white/50 text-center mb-8 text-sm sm:text-base">
                            Регистрация нужна, чтобы сохранять избранное,
                            историю просмотра и оценки
                        </p>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Имя"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                className="w-full bg-neutral-800 text-white rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-red-600"
                            />
                            <input
                                type="email"
                                placeholder="Почта"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                className="w-full bg-neutral-800 text-white rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-red-600"
                            />
                            <input
                                type="tel"
                                placeholder="Телефон (необязательно)"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                                className="w-full bg-neutral-800 text-white rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-red-600"
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full bg-neutral-800 text-white rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-red-600"
                            />

                            {formError && (
                                <p className="text-red-500 text-sm">
                                    {formError}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleRegisterSubmit}
                                className="w-full cursor-pointer bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold rounded-md py-3"
                            >
                                Зарегистрироваться
                            </button>

                            {profiles.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode("pick")
                                        setFormError("")
                                    }}
                                    className="w-full text-white/50 hover:text-white text-sm py-2"
                                >
                                    ← Назад к профилям
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {loginId && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center px-4 z-50">
                    <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-xs">
                        <p className="text-white font-semibold mb-4 text-center">
                            Пароль для профиля «
                            {profiles.find((item) => item.id === loginId)
                                ?.name}
                            »
                        </p>

                        <input
                            type="password"
                            autoFocus
                            value={loginPassword}
                            onChange={(e) =>
                                setLoginPassword(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleLoginSubmit(loginId)
                                }
                            }}
                            placeholder="Пароль"
                            className="w-full bg-neutral-800 text-white rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-red-600 mb-3"
                        />

                        {loginError && (
                            <p className="text-red-500 text-sm mb-3">
                                {loginError}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setLoginId(null)}
                                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md py-2.5 transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                onClick={() => handleLoginSubmit(loginId)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md py-2.5 transition-colors"
                            >
                                Войти
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}