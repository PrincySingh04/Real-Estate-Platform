import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { adminContactsStyles as s } from '../../assets/dummyStyles';
import { HiMail, HiPhone, HiClock } from 'react-icons/hi';

const AdminContacts = () => {
    const { token } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/contact`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(res.data.contacts || []);
        } catch (err) {
            console.error("Failed to fetch contacts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    if (loading) {
        return (
            <div className="loader-full-page">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className={s.container}>
            <div>
                <h1 className={s.heading}>Contact Requests</h1>
                <p className={s.subheading}>Read and manage inquires from platform users.</p>
            </div>

            <div className={s.card}>
                <div className={s.cardHeader}>
                    <h2 className={s.cardTitle}>Inbox ({contacts.length})</h2>
                </div>

                {contacts.length === 0 ? (
                    <div className={s.emptyState}>
                        <HiMail size={48} className={s.emptyIcon} />
                        <p>No contact requests yet.</p>
                    </div>
                ) : (
                    <div className={s.contactList}>
                        {contacts.map((contact, index) => (
                            <div
                                key={contact._id}
                                className={s.contactItem(index, contacts.length)}
                            >
                                <div className={s.contactHeader}>
                                    <div className="flex items-center gap-4">
                                        <div className={s.avatarWrapper(contact.role)}>
                                            {contact.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className={s.nameBadgeContainer}>
                                                <span className={s.name}>{contact.name}</span>
                                                <span className={s.roleBadge(contact.role)}>
                                                    {contact.role}
                                                </span>
                                            </div>
                                            <div className={s.contactDetails}>
                                                <span className={s.detailItem}>
                                                    <HiMail size={14} />
                                                    {contact.email}
                                                </span>
                                                {contact.phone && (
                                                    <span className={s.detailItem}>
                                                        <HiPhone size={14} />
                                                        {contact.phone}
                                                    </span>
                                                )}
                                                <span className={s.detailItem}>
                                                    <HiClock size={14} />
                                                    {new Date(contact.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {contact.message && (
                                    <div className={s.messageBox}>
                                        {contact.message}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContacts;