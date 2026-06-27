import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { adminDashboardStyles as s } from '../../assets/dummyStyles';
import {
    HiUsers,
    HiOfficeBuilding,
    HiClipboardList,
    HiChatAlt,
    HiRefresh,
} from 'react-icons/hi';

const AdminDashboard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        activeListings: 0,
        soldProperties: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(res.data.stats || res.data);
        } catch (err) {
            console.error("Failed to fetch admin stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        { label: "Total Users", value: stats.totalUsers, icon: HiUsers },
        { label: "Total Properties", value: stats.totalProperties, icon: HiOfficeBuilding },
        { label: "Active Listings", value: stats.activeListings, icon: HiClipboardList },
        { label: "Sold Properties", value: stats.soldProperties, icon: HiChatAlt },
    ];

    const services = [
        { name: "Database" },
        { name: "Media Storage" },
        { name: "Auth Service" },
        { name: "API Gateway" },
    ];

    const adminTools = [
    { label: "System Logs", path: "/admin/logs" },
    { label: "DB Backup", path: "/admin/backup" },
    { label: "Settings", path: "/admin/settings" },
];

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
                <div>
                    <h1 className={s.pageTitle}>Admin Overview</h1>
                    <p className={s.pageSubtitle}>Welcome back, administrator. Here's today's summary.</p>
                </div>
                <button onClick={fetchStats} className={s.refreshButton}>
                    <HiRefresh size={18} /> Refresh Data
                </button>
            </div>

            <div className={s.statsGrid}>
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className={s.statCard}>
                            <div className={s.statIconContainer}>
                                <Icon size={22} />
                            </div>
                            <div>
                                <div className={s.statTitle}>{stat.label}</div>
                                <div className={s.statValue}>{stat.value}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={s.secondGrid}>
                <div className={s.systemHealthCard}>
                    <h3 className={s.systemHealthTitle}>System Health</h3>
                    <div className={s.servicesContainer}>
                        {services.map((service, i) => (
                            <div key={i} className={s.serviceItem}>
                                <span className={s.serviceName}>{service.name}</span>
                                <div className={s.statusContainer}>
                                    <span className={s.statusDot}></span>
                                    <span className={s.statusText}>Online</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={s.adminToolsCard}>
                    <h3 className={s.adminToolsTitle}>Admin Tools</h3>
                    <p className={s.adminToolsDesc}>Quickly manage platform resources and tasks.</p>
                    <div className={s.adminToolsButtonsContainer}>
                        {adminTools.map((tool, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(tool.path)}
                                className={s.adminToolButton}
                            >
                                {tool.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;