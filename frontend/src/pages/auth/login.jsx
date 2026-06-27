import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Navbar from "../../components/common/Navbar";
import { useAuth } from "../../context/AuthContext";
import { registerStyles as s } from "../../assets/dummyStyles";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Email and Password are required");
            return;
        }

        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                const role = result.user?.role;
                if (role === "admin") {
                    navigate("/admin-dashboard");
                } else if (role === "seller") {
                    navigate("/dashboard");
                } else {
                    navigate("/");
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error(err);
            setError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.pageWrapper}>
            <Navbar />

            <div className={s.container}>
                <div className={s.formCard}>
                    <h1 className={s.heading}>Welcome Back</h1>

                    <p className={s.subheading}>
                        Please enter your details to sign in
                    </p>

                    {error && (
                        <div className={s.errorMessage}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={s.form}>
                        <div>
                            <label className={s.label}>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                className={s.input}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className={s.label}>
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-teal-600 hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={s.input}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
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

                        <button
                            type="submit"
                            className={s.submitButton}
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p className={s.footerText}>
                        Don't have an account?{" "}
                        <Link to="/register" className={s.loginLink}>
                            Create an Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
