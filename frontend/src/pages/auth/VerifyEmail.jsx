import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import { verifyEmailStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await axios.post(
                `${API_URL}/api/auth/verify-email`,
                {
                    email,
                    code,
                }
            );

            setSuccess(
                res.data.message || 'Email verified successfully!'
            );

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Verification failed. Try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.pageContainer}>
            <Navbar />

            <div className={s.containerCenter}>
                <div className={s.card}>
                    <h1 className={s.title}>Verify Your Email</h1>

                    <p className={s.subtitle}>
                        Enter the 7-digit code sent to your email
                    </p>

                    {error && (
                        <div className={s.errorAlert}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={s.successAlert}>
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className={s.form}
                    >
                        <div>
                            <label className={s.label}>
                                Verification Code
                            </label>

                            <input
                                type="text"
                                value={code}
                                onChange={(e) =>
                                    setCode(e.target.value)
                                }
                                placeholder="1 2 3 4 5 6 7"
                                className={s.codeInput}
                                maxLength={7}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={s.submitButton}
                            disabled={loading}
                        >
                            {loading
                                ? 'Verifying...'
                                : 'Verify Email'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;