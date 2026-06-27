import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { sellerRequestsStyles as s } from '../../assets/dummyStyles';
import { HiMail, HiPhone, HiCheckCircle, HiClock } from 'react-icons/hi';

const SellerRequest = () => {
    const { token } = useAuth();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingSellers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/admin/pending-sellers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSellers(res.data.pendingSellers || []);
        } catch (err) {
            console.error("Failed to fetch pending sellers:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingSellers();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.patch(`${API_URL}/api/admin/approve-seller/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPendingSellers();
        } catch (err) {
            console.error("Failed to approve seller:", err);
        }
    };

    if (loading) {
        return (
            <div className={s.loaderFullPage}>
                <div className={s.loader}></div>
            </div>
        );
    }

    return (
        <div className={s.container}>
            <div className={s.headerContainer}>
                <h1 className={s.pageTitle}>Seller Verification</h1>
                <p className={s.pageSubtitle}>Review and approve new seller registration requests.</p>
            </div>

            <div className={s.card}>
                <div className={s.cardInner}>
                    <h2 className={s.sectionTitle}>
                        Pending Requests ({sellers.length})
                    </h2>

                    {sellers.length === 0 ? (
                        <div className={s.emptyState}>
                            <HiCheckCircle size={48} className={s.emptyStateIcon} />
                            <p>No Pending seller requests at the moment.</p>
                        </div>
                    ) : (
                        <div className={s.requestGrid}>
                            {sellers.map((seller) => (
                                <div key={seller._id} className={s.requestCard}>
                                    <div className={s.requestHeader}>
                                        <div className={s.avatar}>
                                            {seller.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className={s.requestName}>{seller.name}</div>
                                            <div className={s.requestDate}>
                                                <HiClock size={12} />
                                                {new Date(seller.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={s.contactInfo}>
                                        <div className={s.contactItem}>
                                            <HiMail size={16} />
                                            {seller.email}
                                        </div>
                                        {seller.phone && (
                                            <div className={s.contactItem}>
                                                <HiPhone size={16} />
                                                {seller.phone}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleApprove(seller._id)}
                                        className={s.approveButton}
                                    >
                                        <HiCheckCircle size={18} />
                                        Approve Seller
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerRequest;