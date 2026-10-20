
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
    const [notice, setNotice] = useState("")
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await axios.get(
                    `${API_BASE}/api/profile`,
                    { withCredentials: true }
                )

                setForm({
                    fullName: "",
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
                    ...response.data.profile
                })
                setImagePreview(response.data.profile.image || "")
            } catch (error) {
                setError(error.response?.data?.msg || "Profile load nahi hui")
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    function handleChange(e) {
        if (e.target.name === "image") {
            const selectedFile = e.target.files?.[0] || null
            if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview)
            setImageFile(selectedFile)
            setImagePreview(selectedFile ? URL.createObjectURL(selectedFile) : "")
            return
        }

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
            const profileData = new FormData()
            Object.entries(form).forEach(([key, value]) => {
                profileData.append(key, value)
            })
            if (imageFile) profileData.append("image", imageFile)

            await axios.put(
                `${API_BASE}/api/profile/update`,
                profileData,
                { withCredentials: true }
            )

            setNotice("Profile update ho gayi hai.")
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
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium text-lg">
                                    👤
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">
                                {form.fullName || "Edit Profile"}
                            </h1>
                            <p className="text-sm text-slate-500">
                                Update your profile information
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                ["fullName", "Full Name", "text"],
                                ["phone", "Phone", "tel"],
                                ["address", "Address", "text"],
                                ["city", "City", "text"],
                                ["country", "Country", "text"],
                                ["postalCode", "Postal Code", "text"],
                                ["dateOfBirth", "Date of Birth", "date"],
                                ["occupation", "Occupation", "text"],
                                ["company", "Company", "text"]
                            ].map(([name, label, type]) => (
                                <div key={name}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {label}
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        name={name}
                                        type={type}
                                        value={form[name] || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={form.gender || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    About Me
                                </label>
                                <textarea
                                    name="bio"
                                    value={form.bio || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    rows="4"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-3">
                                    Profile Photo
                                </label>
                                <input
                                    id="profile-image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Profile preview"
                                        className="mt-3 h-20 w-20 rounded-full object-cover border border-slate-200"
                                    />
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {notice && (
                            <div className="mb-4 p-3 rounded border border-green-200 bg-green-50 text-sm text-green-700">
                                {notice}
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => navigate("/profile")}
                                className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Back to Profile
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                            >
                                {saving ? "Updating..." : "Update Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileEdit

