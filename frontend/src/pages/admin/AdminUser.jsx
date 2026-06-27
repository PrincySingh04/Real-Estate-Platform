import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { adminUsersStyles as s } from '../../assets/dummyStyles';
import { HiMail, HiPhone, HiChevronDown, HiLockClosed, HiLockOpen, HiTrash } from 'react-icons/hi';

const AdminUser = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [filterOpen, setFilterOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.users || []);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBlock = async (id, isBlocked) => {
        if (!window.confirm(`Are you sure you want to ${isBlocked ? "unblock" : "block"} this user?`)) return;
        try {
            await axios.patch(`${API_URL}/api/admin/users/${id}/block`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (err) {
            console.error("Failed to block/unblock user:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`${API_URL}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'all') return true;
        return user.role === filter;
    });

    const filterOptions = ['all', 'admin', 'seller', 'buyer'];

    if (loading) {
        return (
            <div className="loader-full-page">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className={s.containerHeader}>
                <div>
                    <h1 className={s.headerTitle}>User Management</h1>
                    <p className={s.headerSubtitle}>Monitor platform users and access levels.</p>
                </div>
                <div className={s.filterWrapper}>
                    <button
                        className={s.filterButton}
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        <HiChevronDown size={16} />
                    </button>
                    {filterOpen && (
                        <div className={s.filterDropdown}>
                            {filterOptions.map(opt => (
                                <button
                                    key={opt}
                                    className={s.filterOption(filter === opt)}
                                    onClick={() => { setFilter(opt); setFilterOpen(false); }}
                                >
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <div className={s.cardContainer}>
                <div className={s.cardHeader}>
                    <div className={s.cardTitleRow}>
                        <h2 className={s.cardTitle}>Platform Users</h2>
                        <span className={s.userCount}>
                            Showing <span className={s.userCountSpan}>{filteredUsers.length}</span> users
                        </span>
                    </div>
                </div>

                <div className={s.tableWrapper}>
                    <table className={s.table}>
                        <thead className={s.thead}>
                            <tr className={s.tableRow}>
                                <th className={s.thUserInfo}>User Info</th>
                                <th className={s.thRole}>Role</th>
                                <th className={s.thContact}>Contact Details</th>
                                <th className={s.thStatus}>Account Status</th>
                                <th className={s.thActions}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className={s.tableRow}>
                                    {/* User Info */}
                                    <td className={s.tdUserInfo}>
                                        <div className="flex items-center gap-3">
                                            <div className={s.userAvatar}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className={s.userInfoName}>{user.name}</div>
                                                <div className={s.userInfoId}>ID: {user._id.slice(-7)}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role */}
                                    <td className={s.tdRole}>
                                        <span className={s.roleBadge(user.role)}>
                                            {user.role}
                                        </span>
                                    </td>

                                    {/* Contact */}
                                    <td className={s.tdContact}>
                                        <div className={s.contactWrapper}>
                                            <span className={s.contactEmail}>
                                                <HiMail size={14} />
                                                {user.email}
                                            </span>
                                            {user.phone && (
                                                <span className={s.contactPhone}>
                                                    <HiPhone size={14} />
                                                    {user.phone}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className={s.tdStatus}>
                                        {user.isBlocked ? (
                                            <span className={s.statusBadgeBlocked}>
                                                ✕ Blocked
                                            </span>
                                        ) : (
                                            <span className={s.statusBadgeActive}>
                                                ✓ Active
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className={s.tdActions}>
                                        <div className={s.actionsWrapper}>
                                            <button
                                                onClick={() => handleBlock(user._id, user.isBlocked)}
                                                className={s.blockButton(user.isBlocked)}
                                                title={user.isBlocked ? "Unblock" : "Block"}
                                            >
                                                {user.isBlocked
                                                    ? <HiLockClosed size={16} />
                                                    : <HiLockOpen size={16} />
                                                }
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className={s.deleteButton}
                                                title="Delete"
                                            >
                                                <HiTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className={s.emptyState}>No users found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUser;
