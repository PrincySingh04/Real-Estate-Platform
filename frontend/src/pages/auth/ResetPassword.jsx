import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Navbar from "../../components/common/Navbar";
import { registerStyles as s } from "../../assets/dummyStyles";
import API_URL from "../../config";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                `${API_URL}/api/auth/reset-password/${token}`,
                {
                    password,
                }
            );

            if (res.data.success) {
                setSuccess(
                    res.data.message ||
                        "Password updated successfully"
                );

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to reset password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.pageWrapper}>
            <Navbar />

            <div className={s.container}>
                <div className={s.formCard}>
                    <h1 className={s.heading}>
                        Reset Password
                    </h1>

                    <p className={s.subheading}>
                        Create a new password for your account
                    </p>

                    {error && (
                        <div className={s.errorMessage}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={s.successMessage}>
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className={s.form}
                    >
                        <div>
                            <label className={s.label}>
                                New Password
                            </label>

                            <div className="relative">
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="••••••••"
                                    className={s.input}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? (
                                        <HiEyeOff size={20} />
                                    ) : (
                                        <HiEye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className={s.label}>
                                Confirm New Password
                            </label>

                            <div className="relative">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="••••••••"
                                    className={s.input}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? (
                                        <HiEyeOff size={20} />
                                    ) : (
                                        <HiEye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={s.submitButton}
                            disabled={loading}
                        >
                            {loading
                                ? "Updating..."
                                : "Reset Password"}
                        </button>
                    </form>

                    <p className={s.footerText}>
                        Back to{" "}
                        <Link
                            to="/login"
                            className={s.loginLink}
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;