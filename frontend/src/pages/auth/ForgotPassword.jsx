import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { registerStyles as s } from "../../assets/dummyStyles";
import API_URL from "../../config";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await axios.post(
                `${API_URL}/api/auth/forgot-password`,
                { email }
            );

            if (res.data.success) {
                setSuccess(
                    res.data.message ||
                        "Password reset link sent to your email."
                );
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to send reset link."
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
                        Forgot Password
                    </h1>

                    <p className={s.subheading}>
                        Enter your email address to receive a password reset
                        link
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
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="name@company.com"
                                className={s.input}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={s.submitButton}
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "Send Reset Link"}
                        </button>
                    </form>

                    <p className={s.footerText}>
                        Remembered your password?{" "}
                        <Link
                            to="/login"
                            className={s.loginLink}
                        >
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;