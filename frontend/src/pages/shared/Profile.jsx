import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/common/Navbar";
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import { profileStyles as s } from "../../assets/dummyStyles";
import { HiMail, HiPhone, HiLocationMarker, HiCamera, HiX } from "react-icons/hi";

const Profile = () => {
    const { token, refreshUser } = useAuth();

    const [user, setUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
    });

    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState("");

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userData = res.data.user;
            setUser(userData);
            setFormData({
                name: userData.name || "",
                phone: userData.phone || "",
                address: userData.address || "",
            });
            setPreview(userData.profilePic || "");
            setError(null);
        } catch (err) {
            console.log(err);
            setError(
                err.response?.data?.message ||
                "Failed to load profile. Please try again.",
            );
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
            setFormData({ ...formData, phone: digitsOnly });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setProfilePic(null);
        setPreview("");
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
        });
        setPreview(user.profilePic || "");
        setProfilePic(null);
        setError(null);
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.phone && formData.phone.length !== 10) {
            setError("Phone number must be exactly 10 digits.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = new FormData();
            data.append("name", formData.name);
            data.append("phone", formData.phone);
            data.append("address", formData.address);

            if (profilePic) {
                data.append("profilePic", profilePic);
            }

            await axios.put(`${API_URL}/api/user/profile`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            await fetchProfile();
            await refreshUser();
            setIsEditing(false);
        } catch (err) {
            console.log(err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className={s.containerWrapper()}>
                <Navbar />
                <div className="loader-full-page">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={s.containerWrapper()}>
                <Navbar />
                <div className="container p-16 text-center">
                    <p>{error || "Could not load your profile."}</p>
                    <button onClick={fetchProfile} className="btn btn-primary mt-4">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={s.containerWrapper(user.role)}>
            {user.role !== "seller" && <Navbar />}

            <div className={s.mainContainer(user.role)}>
                <div className={s.header}>
                    <h1 className={s.pageTitle}>Personal Profile</h1>
                    <p className={s.pageSubtitle}>
                        Manage your personal information and account settings.
                    </p>
                </div>

                <div className={s.card}>
                    {error && <div className={s.errorMessage}>{error}</div>}

                    <div className={s.profileHeader}>
                        <div className={s.avatarSection}>
                            <div className={s.avatarWrapper}>
                                {preview ? (
                                    <img src={preview} alt="Profile" className={s.avatarImage} />
                                ) : (
                                    <span className={s.avatarPlaceholder}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {isEditing && (
                                <>
                                    <label htmlFor="profilePicInput" className={s.uploadButton}>
                                        <HiCamera size={18} />
                                    </label>
                                    <input
                                        id="profilePicInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className={s.removeButton}
                                        >
                                            <HiX size={18} />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <div>
                            <h2 className={s.userName}>{user.name}</h2>
                            <span className={s.roleBadge}>{user.role?.toUpperCase()}</span>
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className={s.editForm}>
                            <div>
                                <label className={s.label}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={s.input}
                                />
                            </div>

                            <div>
                                <label className={s.label}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={10}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    className={s.input}
                                />
                            </div>

                            <div>
                                <label className={s.label}>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={s.textarea}
                                />
                            </div>

                            <div className={s.formActions}>
                                <button type="submit" className={s.saveButton} disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                                <button type="button" onClick={handleCancel} className={s.cancelButton}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className={s.infoSection}>
                                <div className={s.infoItem}>
                                    <div className={s.infoIcon}>
                                        <HiMail size={22} />
                                    </div>
                                    <div>
                                        <div className={s.infoLabel}>Email Address</div>
                                        <div className={s.infoValue}>{user.email}</div>
                                    </div>
                                </div>

                                <div className={s.infoItem}>
                                    <div className={s.infoIcon}>
                                        <HiPhone size={22} />
                                    </div>
                                    <div>
                                        <div className={s.infoLabel}>Phone Number</div>
                                        <div className={s.infoValue}>
                                            {user.phone || "Not Provided"}
                                        </div>
                                    </div>
                                </div>

                                <div className={s.infoItem}>
                                    <div className={s.infoIcon}>
                                        <HiLocationMarker size={22} />
                                    </div>
                                    <div>
                                        <div className={s.infoLabel}>Location / Address</div>
                                        <div className={s.infoValue}>
                                            {user.address || "Not Provided"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={s.editButtonWrapper}>
                                <button onClick={() => setIsEditing(true)} className={s.editProfileButton}>
                                    Edit Profile Details
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
