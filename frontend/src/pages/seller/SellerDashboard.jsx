import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { sellerDashboardStyles as s } from '../../assets/dummyStyles';
import PropertyCard from '../../components/common/PropertyCard';
import {
    HiEye, HiUsers, HiOfficeBuilding, HiCheckCircle,
    HiPlus, HiDownload, HiSearch
} from 'react-icons/hi';

const SellerDashboard = () => {
    const { token } = useAuth();
    const [properties, setProperties] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [dashStats, setDashStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [propRes, dashRes, inqRes] = await Promise.all([
                axios.get(`${API_URL}/api/property/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/property/seller/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/inquiry/seller`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setProperties(propRes.data.properties || []);
            setDashStats(dashRes.data.stats || {});
            setInquiries(inqRes.data.inquiries || []);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleExport = () => {
        const headers = ["Title", "Location", "Type", "Price", "Status", "Views"];
        const rows = properties.map(p => [
            p.title || '',
            `${p.city || ''} ${p.area || ''}`.trim(),
            p.propertyType || '',
            p.price || 0,
            p.status || '',
            p.views || 0,
        ]);
        const csvContent = [headers, ...rows]
            .map(row => row.map(val => `"${val}"`).join(","))
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "property_listings.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const stats = [
        { label: "Total Views", value: dashStats.totalViews || 0, icon: HiEye },
        { label: "Active Leads", value: dashStats.totalInquiries || 0, icon: HiUsers },
        { label: "Live Listings", value: dashStats.activeListings || 0, icon: HiOfficeBuilding },
        { label: "Properties Sold", value: dashStats.soldProperties || 0, icon: HiCheckCircle },
    ];

    const filteredProperties = properties.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loader-full-page">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Header */}
            <div className={s.header}>
                <div className={s.headerLeft}>
                    <h1 className={s.headerTitle}>Seller Dashboard</h1>
                    <p className={s.headerSubtitle}>Manage your property portfolio and track performance.</p>
                </div>
                <div className={s.headerActions}>
                    <button onClick={handleExport} className={s.exportButton}>
                        <HiDownload size={16} />
                        Export
                    </button>
                    <Link to="/dashboard/properties/add" className={s.addButton}>
                        <HiPlus size={16} />
                        Add New
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className={s.statsGrid}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className={s.statCard}>
                            <div className={s.statIconWrapper}>
                                <Icon size={20} />
                            </div>
                            <div className={s.statTitle}>{stat.label}</div>
                            <div className={s.statValue}>{stat.value}</div>
                        </div>
                    );
                })}
            </div>

            {/* Property Listings */}
            <div className={s.listingsSection}>
                <div className={s.listingsHeader}>
                    <h2 className={s.listingsTitle}>Property Listings</h2>
                    <div className={s.searchWrapper}>
                        <HiSearch className={s.searchIcon} size={16} />
                        <input
                            type="text"
                            placeholder="Search Listings..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={s.searchInput}
                        />
                    </div>
                </div>

                {filteredProperties.length === 0 ? (
                    <div className={s.emptyListings}>
                        No properties found matching "{search}"
                    </div>
                ) : (
                    <div className={`${s.propertiesGrid} justify-items-stretch`}>
                        {filteredProperties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Widgets */}
            <div className={s.widgetsGrid}>
                {/* Recent Lead Inquiries */}
                <div className={s.inquiriesWidget}>
                    <h3 className={s.widgetTitle}>Recent Lead Inquiries</h3>
                    <p className={s.widgetSubtitle}>New messages from potential buyers.</p>
                    {inquiries.length === 0 ? (
                        <div className={s.noInquiries}>No recent inquiries.</div>
                    ) : (
                        <div className={s.inquiriesList}>
                            {inquiries.slice(0, 5).map((inq) => (
                                <div key={inq._id} className={s.inquiryItem}>
                                    <div className={s.inquiryLeft}>
                                        <div className={s.inquiryIcon}>
                                            {inq.buyer?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className={s.inquiryName}>{inq.buyer?.name}</div>
                                            <div className={s.inquiryProperty}>{inq.property?.title}</div>
                                        </div>
                                    </div>
                                    <div className={s.inquiryRight}>
                                        <div className={s.inquiryDate}>
                                            {new Date(inq.createdAt).toLocaleDateString()}
                                        </div>
                                        <span className={s.inquiryStatus(inq.isRead ? 'read' : 'unread')}>
                                            {inq.isRead ? 'Read' : 'New'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Tips */}
                <div className={s.tipsWidget}>
                    <h3 className={s.widgetTitle}>Quick Tips</h3>
                    <div className={s.tipsList}>
                        <div className={s.tipCardHighViews}>
                            <div className={s.tipTitleHighViews}>⚡ High Views!</div>
                            <p className={s.tipTextHighViews}>
                                Your listings are trending. Try adding video tours to increase interest.
                            </p>
                        </div>
                        <div className={s.tipCardMarket}>
                            <div className={s.tipTitleMarket}>📊 Market Insight</div>
                            <p className={s.tipTextMarket}>
                                Properties in your area are selling fast. Your prices are competitive.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;