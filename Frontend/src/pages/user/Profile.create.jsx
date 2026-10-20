import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_BASE } from "../../config/api"

const styles = `
.pc-page {
    min-height: 100vh;
    background: #f5f7fa;
    color: #1f2937;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    font-size: 14px;
}

.pc-page * {
    box-sizing: border-box;
}

/* Top header band */
.pc-header {
    background: #0B1F3A;
}

.pc-header-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 28px 24px;
}

.pc-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.01em;
}

.pc-subtitle {
    margin: 6px 0 0;
    font-size: 14px;
    color: #aebed3;
}

.pc-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
}

.pc-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
}

/* Photo section at the top of the form */
.pc-photo {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
}

.pc-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 88px;
    flex-shrink: 0;
    overflow: hidden;
    font-size: 12px;
    color: #9ca3af;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 50%;
}

.pc-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.pc-photo-info {
    flex: 1;
    min-width: 0;
}

.pc-photo-title {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.pc-photo-hint {
    margin: 0 0 10px;
    font-size: 13px;
    color: #6b7280;
}

.pc-file {
    display: block;
    width: 100%;
    max-width: 320px;
    padding: 6px;
    font-size: 13px;
    color: #4b5563;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 4px;
}

/* Form fields */
.pc-form {
    padding: 20px;
}

.pc-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.pc-field.wide {
    grid-column: 1 / -1;
}

.pc-label {
    display: block;
    margin-bottom: 5px;
    font-size: 13px;
    color: #4b5563;
}

.pc-input {
    display: block;
    width: 100%;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 14px;
    color: #1f2937;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.15s;
}

.pc-input:focus {
    border-color: #1E4E8C;
}

textarea.pc-input {
    resize: vertical;
}

.pc-error {
    margin: 16px 0 0;
    padding: 10px 12px;
    font-size: 13px;
    color: #b91c1c;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 4px;
}

.pc-actions {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
}

.pc-btn {
    height: 38px;
    padding: 0 20px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    background: #0B1F3A;
    border: 1px solid #0B1F3A;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s;
}

.pc-btn:hover:not(:disabled) {
    background: #16345c;
}

.pc-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 600px) {
    .pc-header-inner { padding: 22px 16px; }
    .pc-container { padding: 16px; }
    .pc-grid { grid-template-columns: 1fr; }
    .pc-photo { padding: 16px; }
    .pc-form { padding: 16px; }
}
`

function ProfileCreate() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
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
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")

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
        setLoading(true)
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

            navigate("/profile")
        } catch (error) {
            setError(error.response?.data?.msg || "Profile save nahi hui")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="pc-page">
            <style>{styles}</style>

            <div className="pc-header">
                <div className="pc-header-inner">
                    <h1 className="pc-title">Create Profile</h1>
                    <p className="pc-subtitle">Apni profile details fill karo.</p>
                </div>
            </div>

            <div className="pc-container">
                <form onSubmit={handleSubmit} className="pc-card">
                    <div className="pc-photo">
                        <div className="pc-avatar">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile preview" />
                            ) : (
                                <span>No photo</span>
                            )}
                        </div>

                        <div className="pc-photo-info">
                            <label htmlFor="profile-image" className="pc-photo-title">
                                Profile photo
                            </label>
                            <p className="pc-photo-hint">
                                Upload a clear photo of yourself.
                            </p>
                            <input
                                id="profile-image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="pc-file"
                            />
                        </div>
                    </div>

                    <div className="pc-form">
                        <div className="pc-grid">
                            {[
                                ["fullName", "Full Name"],
                                ["phone", "Phone"],
                                ["address", "Address"],
                                ["city", "City"],
                                ["country", "Country"],
                                ["postalCode", "Postal Code"],
                                ["dateOfBirth", "Date of Birth"],
                                ["occupation", "Occupation"],
                                ["company", "Company"]
                            ].map(([name, label]) => (
                                <div key={name} className="pc-field">
                                    <label className="pc-label">{label}</label>
                                    <input
                                        className="pc-input"
                                        name={name}
                                        type={name === "dateOfBirth" ? "date" : "text"}
                                        value={form[name]}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}

                            <div className="pc-field">
                                <label className="pc-label">Gender</label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="pc-input"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="pc-field wide">
                                <label className="pc-label">About Me</label>
                                <textarea
                                    name="bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    className="pc-input"
                                    rows="4"
                                />
                            </div>
                        </div>

                        {error && <p className="pc-error">{error}</p>}

                        <div className="pc-actions">
                            <button disabled={loading} className="pc-btn">
                                {loading ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileCreate