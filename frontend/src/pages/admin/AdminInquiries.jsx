import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { adminInquiriesStyles as s } from '../../assets/dummyStyles';
import { HiHome, HiCalendar } from 'react-icons/hi';

const AdminInquiries = () => {
    const { token } = useAuth();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInquiries = async () => {
    try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/admin/inquiries`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Inquiries:", res.data.inquiries); // ✅ yeh add karo
        setInquiries(res.data.inquiries || []);
    } catch (err) {
        console.error("Failed to fetch inquiries:", err);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchInquiries();
    }, []);

    if (loading) {
        return (
            <div className="loader-full-page">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div>
            <div className={s.headerContainer}>
                <h1 className={s.headerTitle}>Platform Inquiries</h1>
                <p className={s.headerSubtitle}>Review communication between buyers and seller</p>
            </div>

            {inquiries.length === 0 ? (
                <div className={s.emptyState}>
                    <div className={s.emptyIcon}>
                        <HiHome size={48} />
                    </div>
                    <p className={s.emptyText}>No inquiries found.</p>
                </div>
            ) : (
                <div className={s.listContainer}>
                    {inquiries.map((inquiry) => (
                        <div key={inquiry._id} className={s.inquiryCard}>
                            {/* Top Section */}
                            <div className={s.cardTopSection}>
                                <div className={s.propertyInfoWrapper}>
                                    <div className={s.propertyIconWrapper}>
                                        <HiHome size={22} />
                                    </div>
                                    <div className={s.propertyTextWrapper}>
                                        <div className={s.propertyTitle}>
                                            {inquiry.property?.title || 'Property'}
                                        </div>
                                        <div className={s.propertyId}>
                                            Property ID: {inquiry.property?._id}
                                        </div>
                                    </div>
                                </div>
                                <div className={s.dateWrapper}>
                                    <HiCalendar size={14} className={s.dateIcon} />
                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                           
<div className={s.detailsGrid}>
    <div className={s.detailCard}>
        <div className={s.detailLabel}>Buyer Details</div>
        <div className={s.detailName}>{inquiry.buyer?.name || 'N/A'}</div>
        <div className={s.detailEmail}>{inquiry.buyer?.email || 'N/A'}</div>
    </div>
    <div className={s.detailCard}>
        <div className={s.detailLabel}>Seller Details</div>
        <div className={s.detailName}>{inquiry.seller?.name || 'N/A'}</div>
        <div className={s.detailEmail}>{inquiry.seller?.email || 'N/A'}</div>
    </div>
</div>


                            {/* Message */}
                            <div className={s.messageContainer}>
                                <div className={s.messageHeader}>
                                    ✉ MESSAGE
                                </div>
                                <p className={s.messageText}>"{inquiry.message}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminInquiries;