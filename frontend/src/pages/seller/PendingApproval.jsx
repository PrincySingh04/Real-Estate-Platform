import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { pendingApprovalStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import { HiClock, HiRefresh, HiHome } from 'react-icons/hi';

const PendingApproval = () => {
    const { refreshUser } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshUser();
        setTimeout(() => setRefreshing(false), 1500);
    };

    return (
        <div className={s.container}>
            <div className={s.iconCircle}>
                <HiClock size={48} />
            </div>

            <h1 className={s.heading}>Account Pending Approval</h1>
            <p className={s.description}>
                Your seller account is currently under review. Our admin team will verify
                your details and approve your account shortly. You'll be able to list
                properties once approved.
            </p>

            <div className={s.buttonGroup}>
                <Link to="/" className={s.browseButton}>
                    <HiHome size={18} />
                    Browse Properties
                </Link>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className={`${s.refreshButtonBase} ${refreshing ? s.refreshButtonDisabled : s.refreshButtonEnabled}`}
                >
                    <HiRefresh size={18} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Checking...' : 'Check Status'}
                </button>
            </div>

            <div className={s.supportContainer}>
                <span>Need help?</span>
                <Link to="/contact" className={s.supportLink}>Contact Support</Link>
            </div>
        </div>
    );
};

export default PendingApproval;