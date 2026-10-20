import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { API_BASE } from "../../config/api"
import { User, MapPin, Briefcase, Pencil } from "lucide-react"

function Profile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await axios.get(
                    `${API_BASE}/api/profile`,
                    { withCredentials: true }
                )

                setProfile(response.data.profile)
            } catch (error) {
                setError(
                    error.response?.data?.msg || "Profile could not be loaded."
                )
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
                <p className="text-center text-sm font-light text-slate-500">
                    Loading profile...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
                <div className="mx-auto max-w-xl rounded-md border border-red-200 bg-red-50 p-4 text-sm font-light text-red-600">
                    {error}
                </div>
            </div>
        )
    }

    const hasProfile = profile && (
        profile.phone ||
        profile.address ||
        profile.city ||
        profile.country ||
        profile.bio ||
        profile.image
    )

    if (!hasProfile) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
                <div className="mx-auto mt-10 max-w-xl rounded-md border border-slate-200 bg-white p-8 text-center">
                    <h1 className="mb-3 text-2xl font-light text-slate-900">
                        Complete Your Profile
                    </h1>

                    <p className="mb-2 text-sm font-light text-slate-500">
                        Your profile is not set up yet.
                    </p>

                    <p className="mb-6 text-sm font-light text-slate-500">
                        Add your details so people can learn more about you
                        and contact you easily regarding your products and services.
                    </p>

                    <Link
                        to="/ProfileCreate"
                        className="inline-flex h-8 items-center rounded-md bg-slate-900 px-3 text-sm font-normal text-white transition-colors duration-200 hover:bg-slate-700 active:scale-[0.98]"
                    >
                        Create Profile
                    </Link>
                </div>
            </div>
        )
    }

    const personal = [
        ["Full Name", profile.fullName],
        ["Email", profile.email],
        ["Phone", profile.phone],
        ["Date of Birth", profile.dateOfBirth],
        ["Gender", profile.gender]
    ]

    const address = [
        ["Address", profile.address],
        ["City", profile.city],
        ["Country", profile.country],
        ["Postal Code", profile.postalCode]
    ]

    const work = [
        ["Occupation", profile.occupation],
        ["Company", profile.company]
    ]

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-light text-slate-900">
                        Manage My Account
                    </h1>

                    <Link
                        to="/ProfileEdit"
                        className="inline-flex h-8 items-center rounded-md bg-slate-900 px-3 text-sm font-normal text-white transition-colors duration-200 hover:bg-slate-700 active:scale-[0.98]"
                    >
                        <Pencil size={14} strokeWidth={1.5} className="mr-1.5" />
                        Edit Profile
                    </Link>
                </div>

                <div className="mb-5 flex items-center rounded-md border border-slate-200 bg-white p-5">
                    {profile.image ? (
                        <img
                            src={profile.image}
                            alt="Profile"
                            className="mr-5 h-20 w-20 rounded-full border border-slate-200 object-cover"
                        />
                    ) : (
                        <div className="mr-5 flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-2xl font-light text-slate-500">
                            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
                        </div>
                    )}

                    <div>
                        <h2 className="text-lg font-normal text-slate-900">
                            {profile.fullName || "Not added"}
                        </h2>
                        <p className="mt-1 break-all text-sm font-light text-slate-500">
                            {profile.email || "Not added"}
                        </p>
                    </div>
                </div>

                <div className="rounded-md border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex items-center">
                        <User size={16} strokeWidth={1.5} className="mr-2 text-slate-500" />
                        <h2 className="text-sm font-normal text-slate-900">
                            Personal Profile
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {personal.map(([label, value]) => (
                            <div key={label}>
                                <p className="text-xs font-light text-slate-500">{label}</p>
                                <p className="mt-1 text-sm font-normal text-slate-900">
                                    {value || "Not added"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div className="rounded-md border border-slate-200 bg-white p-5">
                        <div className="mb-4 flex items-center">
                            <MapPin size={16} strokeWidth={1.5} className="mr-2 text-slate-500" />
                            <h2 className="text-sm font-normal text-slate-900">
                                Address Book
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {address.map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-xs font-light text-slate-500">{label}</p>
                                    <p className="mt-1 text-sm font-normal text-slate-900">
                                        {value || "Not added"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-5">
                        <div className="mb-4 flex items-center">
                            <Briefcase size={16} strokeWidth={1.5} className="mr-2 text-slate-500" />
                            <h2 className="text-sm font-normal text-slate-900">
                                Work Details
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {work.map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-xs font-light text-slate-500">{label}</p>
                                    <p className="mt-1 text-sm font-normal text-slate-900">
                                        {value || "Not added"}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                            <p className="text-xs font-light text-slate-500">About Me</p>
                            <p className="mt-1 text-sm font-light leading-relaxed text-slate-700">
                                {profile.bio || "Not added"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile