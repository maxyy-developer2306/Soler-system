
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_BASE } from "../../config/api"

function ProfileEdit() {
    const navigate = useNavigate()
    const [form, setForm] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await axios.get(
                    `${API_BASE}/api/profile`,
                    { withCredentials: true }
                )

                setForm({
                    fullName: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "",
                    country: "",
                    postalCode: "",
                    dateOfBirth: "",
                    gender: "",
                    occupation: "",
                    company: "",
                    bio: "",
                    image: "",
                    ...response.data.profile
                })
            } catch (error) {
                setError(error.response?.data?.msg || "Profile load nahi hui")
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setError("")

        try {
            await axios.put(
                `${API_BASE}/api/profile/update`,
                form,
                { withCredentials: true }
            )

            navigate("/profile")
        } catch (error) {
            setError(error.response?.data?.msg || "Profile update nahi hui")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-4">Loading profile...</p>
    if (!form) return <p className="p-4 text-red-500">{error}</p>

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                {[
                    ["fullName", "Full Name"],
                    ["email", "Email"],
                    ["phone", "Phone"],
                    ["address", "Address"],
                    ["city", "City"],
                    ["country", "Country"],
                    ["postalCode", "Postal Code"],
                    ["dateOfBirth", "Date of Birth"],
                    ["occupation", "Occupation"],
                    ["company", "Company"],
                    ["image", "Profile Image URL"]
                ].map(([name, label]) => (
                    <div key={name} className="mb-3">
                        <label className="mb-1 block">{label}</label>
                        <input
                            className="w-full rounded border p-2"
                            name={name}
                            type={name === "dateOfBirth" ? "date" : "text"}
                            value={form[name] || ""}
                            onChange={handleChange}
                        />
                    </div>
                ))}

                <label className="mb-1 block">Gender</label>
                <select
                    name="gender"
                    value={form.gender || ""}
                    onChange={handleChange}
                    className="mb-3 w-full rounded border p-2"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <label className="mb-1 block">About Me</label>
                <textarea
                    name="bio"
                    value={form.bio || ""}
                    onChange={handleChange}
                    className="mb-4 w-full rounded border p-2"
                    rows="4"
                />

                {error && <p className="mb-3 text-red-500">{error}</p>}

                <button
                    disabled={saving}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                    {saving ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    )
}

export default ProfileEdit
