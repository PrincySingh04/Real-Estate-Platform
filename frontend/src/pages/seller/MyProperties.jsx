import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { myPropertiesStyles as s } from '../../assets/dummyStyles';
import PropertyCard from '../../components/common/PropertyCard';
import { HiPlus, HiPencil, HiTrash, HiChevronDown } from 'react-icons/hi';

const MyProperties = () => {
    const { token } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/property/my`, {
                headers: { Authorization: `Bearer ${token}` }
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
            await axios.delete(`${API_URL}/api/property/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProperties();
        } catch (err) {
            console.error("Failed to delete property:", err);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.patch(`${API_URL}/api/property/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProperties();
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const renderActions = (property) => (
        <div className={s.actionContainer}>
            <div className={s.selectWrapper}>
                <select
                    value={property.status}
                    onChange={(e) => handleStatusChange(property._id, e.target.value)}
                    className={`${s.select} ${property.status === 'sold' ? s.selectSold : s.selectAvailable}`}
                >
                    <option value="sale">Available</option>
                    <option value="sold">Sold</option>
                </select>
                <HiChevronDown size={14} className={s.selectIcon} />
            </div>
            <Link
                to={`/dashboard/properties/edit/${property._id}`}
                className={s.editButton}
            >
                <HiPencil size={14} /> Edit
            </Link>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    handleDelete(property._id);
                }}
                className={s.deleteButton}
            >
                <HiTrash size={14} />
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className={s.loaderFullPage}>
                <div className={s.loader}></div>
            </div>
        );
    }

    return (
        <div className={s.fadeIn}>
            {/* Header */}
            <div className={s.header}>
                <div>
                    <h1 className={s.heading}>My Properties</h1>
                    <p className={s.subheading}>Manage your property listings.</p>
                </div>
                <Link to="/dashboard/properties/add" className={s.addButton}>
                    <HiPlus size={18} />
                    Add Property
                </Link>
            </div>

            {/* Content */}
            <div className={s.content}>
                {properties.length === 0 ? (
                    <div className={s.emptyCard}>
                        <div className={s.emptyIconWrapper}>
                            <HiPlus size={32} className="text-text-muted" />
                        </div>
                        <h3 className={s.emptyTitle}>No Properties Yet</h3>
                        <p className={s.emptyText}>Start by adding your first property listing.</p>
                        <Link to="/dashboard/properties/add" className={s.emptyButton}>
                            Add Property
                        </Link>
                    </div>
                ) : (
                    <div className={s.grid}>
                        {properties.map((property) => (
                            <PropertyCard
                                key={property._id}
                                property={property}
                                renderActions={renderActions}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProperties;
