
import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { API_BASE } from "../../config/api"

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
        return <p className="p-4">Loading profile...</p>
    }

    if (error) {
        return <p className="p-4 text-red-500">{error}</p>
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
            <div className="p-4">
                <div className="mx-auto mt-10 max-w-xl rounded-lg border p-6 text-center">
                    <h1 className="mb-3 text-2xl font-bold">
                        Complete Your Profile
                    </h1>

                    <p className="mb-3 text-gray-600">
                        Your profile is not set up yet.
                    </p>

                    <p className="mb-5 text-gray-600">
                        Add your details so people can learn more about you
                        and contact you easily regarding your products and services.
                    </p>

                    <Link
                        to="/ProfileCreate"
                        className="inline-block rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        Create Profile
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">My Profile</h1>

            {profile.image && (
                <img
                    src={profile.image}
                    alt="Profile"
                    className="mb-4 h-24 w-24 rounded-full border object-cover"
                />
            )}

            <div className="max-w-2xl rounded border p-4">
                {[
                    ["Full Name", profile.fullName],
                    ["Email", profile.email],
                    ["Phone", profile.phone],
                    ["Address", profile.address],
                    ["City", profile.city],
                    ["Country", profile.country],
                    ["Postal Code", profile.postalCode],
                    ["Date of Birth", profile.dateOfBirth],
                    ["Gender", profile.gender],
                    ["Occupation", profile.occupation],
                    ["Company", profile.company],
                    ["About Me", profile.bio]
                ].map(([label, value]) => (
                    <div key={label} className="mb-3">
                        <p className="text-sm text-gray-500">{label}</p>
                        <p>{value || "Not added"}</p>
                    </div>
                ))}

                <Link
                    to="/ProfileCreate"
                    className="mt-3 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Edit Profile
                </Link>
            </div>
        </div>
    )
}

export default Profile
