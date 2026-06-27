import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { contactStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import { HiMail, HiPhone, HiLocationMarker, HiCheckCircle } from 'react-icons/hi';

const Contact = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        message: '',
        role: user?.role || 'buyer',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/contact`, formData);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.container}>
            <Navbar />
            <div className={s.mainContainer}>
                {/* Header */}
                <div className={s.header}>
                    <h1 className={s.heading}>Get In Touch</h1>
                    <p className={s.subheading}>
                        Have questions or feedback? We'd love to hear from you. Our team is here to help you with anything you need.
                    </p>
                </div>

                <div className={s.grid}>
                    {/* Left - Contact Info */}
                    <div className={s.contactInfoContainer}>
                        <div className={s.contactInfoCard}>
                            <div className={`${s.contactItem} ${s.contactItemMarginBottom}`}>
                                <div className={s.contactIconWrapper}>
                                    <HiMail size={20} />
                                </div>
                                <div>
                                    <div className={s.contactTitle}>Email Us</div>
                                    <div className={s.contactDetail}>support@realestate.com</div>
                                </div>
                            </div>
                            <div className={s.contactItem}>
                                <div className={s.contactIconWrapperAlt}>
                                    <HiPhone size={20} />
                                </div>
                                <div>
                                    <div className={s.contactTitle}>Call Us</div>
                                    <div className={s.contactDetail}>+1 (234) 567-7890</div>
                                </div>
                            </div>
                        </div>

                        <div className={s.quickSupportCard}>
                            <h3 className={s.quickSupportTitle}>Quick Support</h3>
                            <p className={s.quickSupportText}>
                                Available 24/7 for our premium members. Your satisfaction is our priority.
                            </p>
                        </div>
                    </div>

                    {/* Right - Form */}
                    <div className={s.formCard}>
                        {success ? (
                            <div className={s.successContainer}>
                                <HiCheckCircle size={64} className={s.successIcon} />
                                <h2 className={s.successTitle}>Message Sent!</h2>
                                <p className={s.successMessage}>
                                    Thank you for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => { setSuccess(false); setFormData({ name: '', email: '', phone: '', message: '', role: 'buyer' }); }}
                                    className={s.successButton}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={s.form}>
                                {error && <div className={s.errorMessage}>{error}</div>}

                                <div className={s.formTwoColGrid}>
                                    <div className={s.inputGroup}>
                                        <label className={s.label}>Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Hexa"
                                            className={s.input}
                                            required
                                        />
                                    </div>
                                    <div className={s.inputGroup}>
                                        <label className={s.label}>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="hexagonservices@gmail.com"
                                            className={s.input}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={s.inputGroup}>
                                    <label className={s.label}>Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="07417417410"
                                        className={s.input}
                                    />
                                </div>

                                <div className={s.inputGroup}>
                                    <label className={s.label}>Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="New Address jk"
                                        className={`${s.input} ${s.textarea}`}
                                        rows={5}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={s.submitButton}
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;