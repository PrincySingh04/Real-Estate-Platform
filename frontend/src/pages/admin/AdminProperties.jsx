import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { adminPropertiesStyles as s } from '../../assets/dummyStyles';
import { HiOfficeBuilding, HiTrash } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const AdminProperties = () => {
    const { token } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/admin/properties`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProperties(res.data.properties || []);
        } catch (err) {
            console.error("Failed to fetch properties:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;
        try {
            await axios.delete(`${API_URL}/api/admin/properties/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProperties();
        } catch (err) {
            console.error("Failed to delete property:", err);
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
        <div>
            <div className={s.headerContainer}>
                <h1 className={s.pageTitle}>Property Moderation</h1>
                <p className={s.pageSubtitle}>Review and manage all property listings across the platform.</p>
            </div>

            {properties.length === 0 ? (
                <div className={s.emptyStateCard}>
                    <HiOfficeBuilding size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No properties pending moderation.</p>
                </div>
            ) : (
                <div className={s.propertiesGrid}>
                    {properties.map((property) => (
                        <div key={property._id} className="card-premium p-0 overflow-hidden">
                            {/* Image */}
                            <div className="relative h-[200px] overflow-hidden">
                                <img
                                    src={property.images?.[0] || '/placeholder.jpg'}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-text-main mb-1 truncate">{property.title}</h3>
                                <p className="text-text-muted text-sm mb-3">{property.location?.city}, {property.location?.state}</p>

                                {/* Actions */}
                                <div className={s.actionWrapper}>
                                    <div className={s.sellerInfo}>
                                        <div className={s.sellerName}>{property.seller?.name}</div>
                                        <div className={s.sellerEmail}>{property.seller?.email}</div>
                                    </div>
                                    <div className={s.buttonGroup}>
                                        <Link
                                            to={`/property/${property._id}`}
                                            className={s.viewLink}
                                            title="View"
                                        >
                                            <HiOfficeBuilding size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(property._id)}
                                            className={s.deleteButton}
                                            title="Delete"
                                        >
                                            <HiTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminProperties;