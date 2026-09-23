    import { useState, type ChangeEvent } from "react"
    import { useProfiles } from "../components/ProfileContext"
    import ProfileAvatar from "../components/ProfileAvatar"

    type ProfileSettingsPageProps = {
        onBack: () => void
    }


    export default function ProfileSettingsPage({
        onBack,
    }: ProfileSettingsPageProps) {
        const { currentProfile, updateProfile, changePassword } = useProfiles()

        const [name, setName] = useState(currentProfile?.name ?? "")
        const [email, setEmail] = useState(currentProfile?.email ?? "")
        const [phone, setPhone] = useState(currentProfile?.phone ?? "")
        const [savedMessage, setSavedMessage] = useState("")
        const [oldPassword, setOldPassword] = useState("")
        const [newPassword, setNewPassword] = useState("")
        const [confirmPassword, setConfirmPassword] = useState("")
        const [passwordMessage, setPasswordMessage] = useState("")
        const [passwordError, setPasswordError] = useState("")
        const [notifPremieres, setNotifPremieres] = useState(
            currentProfile?.notifications.premieres ?? true
        )





        const [notifRecommendations, setNotifRecommendations] = useState(
            currentProfile?.notifications.recommendations ?? true
        )
        if (!currentProfile) {
            return null
        }

        const profileId = currentProfile.id

        function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
            let value = e.target.value


            value = value.replace(/[^\d+]/g, "")


            if (value.includes("+")) {
                value =
                    "+" +
                    value
                        .slice(1)
                        .replace(/\+/g, "")
            }


            if (value.startsWith("+")) {
                value =
                    "+" +
                    value
                        .slice(1)
                        .replace(/\D/g, "")
            } else {
                value = value.replace(/\D/g, "")
            }

            setPhone(value)
        }

        function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
            const file = event.target.files?.[0]

            if (!file) {
                return
            }

            const reader = new FileReader()

            reader.onload = () => {
                if (typeof reader.result === "string") {
                    updateProfile(profileId, {
                        avatar: reader.result,
                    })
                }
            }

            reader.readAsDataURL(file)
        }

        function handleSaveDetails() {
            updateProfile(profileId, {
                name,
                email,
                phone: phone || undefined,
            })

            setSavedMessage("Изменения сохранены")

            setTimeout(() => {
                setSavedMessage("")
            }, 2500)
        }

        function handleSaveNotifications(next: {
            premieres?: boolean
            recommendations?: boolean
        }) {
            updateProfile(profileId, {
                notifications: {
                    premieres:
                        next.premieres ?? notifPremieres,

                    recommendations:
                        next.recommendations ??
                        notifRecommendations,
                },
            })
        }

        function handleChangePassword() {
            setPasswordError("")
            setPasswordMessage("")

            if (!oldPassword) {
                setPasswordError("Введите старый пароль")
                return
            }

            if (!newPassword) {
                setPasswordError("Введите новый пароль")
                return
            }

            if (newPassword !== confirmPassword) {
                setPasswordError("Новые пароли не совпадают")
                return
            }

            const result = changePassword(
                profileId,
                oldPassword,
                newPassword
            )

            if (!result.ok) {
                setPasswordError(result.error)
                return
            }

            setPasswordMessage("Пароль изменён")

            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
        }

        return (
            <div className="min-h-screen p-10 bg-black text-white">
                <header className="movie-header">
                    <button
                        type="button"
                        onClick={onBack}
                        className="theme-button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <title>alt-arrow-left-line-duotone</title>

                            <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="m15 5l-6 7l6 7"
                            />
                        </svg>
                    </button>

                    <h1 className="text-white">
                        Настройки профиля
                    </h1>
                </header>

                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-10">

                    {/* АВАТАР */}
                    <section className="flex flex-wrap items-center gap-5">
                        <ProfileAvatar
                            name={currentProfile.name}
                            avatar={currentProfile.avatar}
                            size="lg"
                        />

                        <label className="cursor-pointer text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-md px-4 py-2">
                            Изменить аватар

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </section>

                    {/* ОСНОВНАЯ ИНФОРМАЦИЯ */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold">
                            Основная информация
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2">

                            {/* ИМЯ */}
                            <div>
                                <label className="block text-sm text-white/60 mb-1">
                                    Имя
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    className="w-full bg-neutral-800 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>

                            {/* ПОЧТА */}
                            <div>
                                <label className="block text-sm text-white/60 mb-1">
                                    Почта
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    className="w-full bg-neutral-800 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>

                            {/* ТЕЛЕФОН */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm text-white/60 mb-1">
                                    Телефон
                                </label>

                                <input
                                    type="tel"
                                    inputMode="tel"
                                    value={phone}
                                    placeholder="+998901234567"
                                    onChange={handlePhoneChange}
                                    className="w-full bg-neutral-800 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-600"
                                />

                                <p className="text-xs text-white/40 mt-1">
                                    Можно использовать только + и цифры
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleSaveDetails}
                                className="bg-red-600 hover:bg-red-700 transition-colors font-semibold rounded-md px-6 py-2.5"
                            >
                                Сохранить
                            </button>

                            {savedMessage && (
                                <span className="text-emerald-400 text-sm">
                                    {savedMessage}
                                </span>
                            )}
                        </div>
                    </section>

                    {/* СМЕНА ПАРОЛЯ */}
                    <section className="space-y-4 border-t border-white/10 pt-8">
                        <h2 className="text-lg font-semibold">
                            Смена пароля
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-3">

                            <input
                                type="password"
                                placeholder="Старый пароль"
                                value={oldPassword}
                                onChange={(e) =>
                                    setOldPassword(e.target.value)
                                }
                                className="w-full bg-neutral-800 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-600"
                            />

                            <input
                                type="password"
                                placeholder="Новый пароль"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                className="w-full bg-neutral-800 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-600"
                            />

                            <input
                                type="password"
                                placeholder="Повторите новый пароль"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="w-full bg-neutral-800 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleChangePassword}
                                className="bg-neutral-800 hover:bg-neutral-700 transition-colors font-semibold rounded-md px-6 py-2.5"
                            >
                                Изменить пароль
                            </button>

                            {passwordMessage && (
                                <span className="text-emerald-400 text-sm">
                                    {passwordMessage}
                                </span>
                            )}

                            {passwordError && (
                                <span className="text-red-500 text-sm">
                                    {passwordError}
                                </span>
                            )}
                        </div>
                    </section>


                    <section className="space-y-4 border-t border-white/10 pt-8 pb-10">
                        <h2 className="text-lg font-semibold">
                            Уведомления
                        </h2>

                        <label className="flex items-center justify-between gap-4 bg-neutral-900 rounded-md px-4 py-3">
                            <span>
                                Премьеры и новинки
                            </span>

                            <input
                                type="checkbox"
                                checked={notifPremieres}
                                onChange={(e) => {
                                    const checked = e.target.checked

                                    setNotifPremieres(checked)

                                    handleSaveNotifications({
                                        premieres: checked,
                                    })
                                }}
                                className="w-5 h-5 accent-red-600 shrink-0"
                            />
                        </label>

                        <label className="flex items-center justify-between gap-4 bg-neutral-900 rounded-md px-4 py-3">
                            <span>
                                Персональные рекомендации
                            </span>

                            <input
                                type="checkbox"
                                checked={notifRecommendations}
                                onChange={(e) => {
                                    const checked = e.target.checked

                                    setNotifRecommendations(checked)

                                    handleSaveNotifications({
                                        recommendations: checked,
                                    })
                                }}
                                className="w-5 h-5 accent-red-600 shrink-0"
                            />
                        </label>
                    </section>
                </div>
            </div>
        )
    }