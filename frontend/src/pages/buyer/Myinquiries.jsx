import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { myInquiriesStyles as s } from '../../assets/dummyStyles';
import { HiChatAlt, HiUser, HiMail, HiPhone, HiCalendar, HiEye } from 'react-icons/hi';

const MyInquiries = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${API_URL}/api/inquiry/seller`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInquiries(res.data.inquiries || []);
        } catch (err) {
            console.error("Failed to fetch inquiries:", err);
            setError("Failed to load inquiries. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await axios.patch(`${API_URL}/api/inquiry/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchInquiries();
        } catch (err) {
            console.error("Failed to mark inquiry as read:", err);
        }
    };

    const handleReply = (inquiry) => {
        navigate(`/chat-messages?buyerId=${inquiry.buyer?._id}&propertyId=${inquiry.property?._id}`);
    };

    if (loading) {
        return (
            <div className={s.loaderFullPage}>
                <div className={s.loader}></div>
            </div>
        );
    }

    return (
        <div className={s.bgTransparentMinH}>
            <div className={`${s.containerFadeIn} ${s.py12Pt12} ${s.pt0}`}>
                <div className={s.mb12}>
                    <h1 className={s.heading}>Customer Inquiries</h1>
                    <p className={s.textMuted}>Review and respond to interest in your properties.</p>
                </div>

                {error ? (
                    <div className={s.containerPy12TextCenter}>
                        <div className={s.cardPremiumPy16Px8}>
                            <p className={s.textDangerMb4}>{error}</p>
                            <div className={s.mb8}></div>
                            <button onClick={fetchInquiries} className={s.btnPrimary}>
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : inquiries.length === 0 ? (
                    <div className={s.cardPremiumPy24Px8TextCenter}>
                        <div className={s.iconContainer}>
                            <HiChatAlt size={32} />
                        </div>
                        <h3 className={s.mb4}>No inquiries received</h3>
                        <p className={s.textMutedMb8}>
                            You haven't received any inquiries yet. Better listings get more attention!
                        </p>
                        <Link to="/dashboard/properties" className={s.btnPrimary}>
                            Improve My Listings
                        </Link>
                    </div>
                ) : (
                    <div className={s.flexColGap6}>
                        {inquiries.map((inquiry) => (
                            <div key={inquiry._id} className={s.inquiryCard}>
                                <div className={s.inquiryMain}>
                                    <div className={s.iconWrapper}>
                                        <HiChatAlt className={s.iconSize} />
                                    </div>
                                    <div className={s.flex1}>
                                        <div className={s.titleRow}>
                                            <h3 className={s.titleText}>
                                                {inquiry.property?.title || "Property"}
                                            </h3>
                                            <span className={`${s.badge} ${inquiry.isRead ? s.badgeRead : s.badgeNew}`}>
                                                {inquiry.isRead ? "Read" : "New"}
                                            </span>
                                        </div>

                                        <div className={s.buyerInfo}>
                                            <div className={s.infoItem}>
                                                <HiUser className={s.textMutedSmall} />
                                                <span className={s.fontSemibold}>
                                                    {inquiry.buyer?.name || "Buyer"}
                                                </span>
                                            </div>
                                            {inquiry.buyer?.email && (
                                                <div className={s.infoItem}>
                                                    <HiMail className={s.textMutedSmall} />
                                                    {inquiry.buyer.email}
                                                </div>
                                            )}
                                            {inquiry.buyer?.phone && (
                                                <div className={s.infoItem}>
                                                    <HiPhone className={s.textMutedSmall} />
                                                    {inquiry.buyer.phone}
                                                </div>
                                            )}
                                        </div>

                                        <p className={s.message}>"{inquiry.message}"</p>

                                        <div className={s.meta}>
                                            <span className={s.flexItemsCenterGap2}>
                                                <HiCalendar size={14} />
                                                {new Date(inquiry.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={s.actions}>
                                    <Link
                                        to={`/property/${inquiry.property?._id}`}
                                        className={s.btnOutline}
                                    >
                                        <HiEye size={16} /> View Property
                                    </Link>
                                    {!inquiry.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(inquiry._id)}
                                            className={s.btnPrimaryWhitespaceNowrap}
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                    <button onClick={() => handleReply(inquiry)} className={s.btnMessage}>
                                        <HiChatAlt size={16} /> Reply
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyInquiries;