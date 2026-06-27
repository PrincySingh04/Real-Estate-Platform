import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "buyer",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        });
        setLoading(false);

        if (result.success) {
            setSuccess(
                result.message ||
                "Registration successful! Please check your email to verify your account.",
            );
        setTimeout(() => {
    navigate("/verify-email", {
        state: {
            email: formData.email
        }
    });
}, 2000);

        } else {
            setError(result.message);
        }
    };

    return (
        <div className={s.pageWrapper}>
            <Navbar />
            <div className={s.container}>
                <div className={s.formCard}>
                    <h1 className={s.heading}>Create Account</h1>
                    <p className={s.subheading}>Join our community to find or list properties</p>

                    {error && <div className={s.errorMessage}>{error}</div>}
                    {success && <div className={s.successMessage}>{success}</div>}

                    <form onSubmit={handleSubmit} className={s.form}>
                        <div>
                            <label className={s.label}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={s.input}
                                required
                            />
                        </div>

                        <div>
                            <label className={s.label}>Email Address</label>
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
                            <label className={s.label}>Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••"
                                    className={s.input}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 flex items-center"
                                >
                                    {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className={s.label}>Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••"
                                    className={s.input}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 flex items-center"
                                >
                                    {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className={s.label}>Select Role</label>
                            <div className={s.roleContainer}>
                                <label
                                    className={`${s.roleLabelBase} ${formData.role === "buyer" ? s.roleLabelActive : s.roleLabelInactive}`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="buyer"
                                        checked={formData.role === "buyer"}
                                        onChange={handleChange}
                                        className={s.hiddenRadio}
                                    />
                                    Buyer
                                </label>
                                <label
                                    className={`${s.roleLabelBase} ${formData.role === "seller" ? s.roleLabelActive : s.roleLabelInactive}`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="seller"
                                        checked={formData.role === "seller"}
                                        onChange={handleChange}
                                        className={s.hiddenRadio}
                                    />
                                    Seller
                                </label>
                            </div>
                        </div>

                        <button type="submit" className={s.submitButton} disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <p className={s.footerText}>
                        Already have an account?{" "}
                        <Link to="/login" className={s.loginLink}>
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;