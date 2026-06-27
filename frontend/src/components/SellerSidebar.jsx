import React from 'react';
import { NavLink } from 'react-router-dom';
import { sellerSidebarStyles as s } from '../assets/dummyStyles';
import { useAuth } from '../context/AuthContext';
import Logo from './common/Logo';
import { HiViewGrid, HiOfficeBuilding, HiChatAlt, HiMail, HiUser, HiSupport, HiLogout, HiX } from 'react-icons/hi';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: HiViewGrid, end: true },
    { to: '/dashboard/properties', label: 'My Listings', icon: HiOfficeBuilding },
    { to: '/dashboard/inquiries', label: 'Leads', icon: HiChatAlt },
    { to: '/chat-messages', label: 'Messages', icon: HiMail }, 
    { to: '/profile', label: 'Profile', icon: HiUser },
    { to: '/contact', label: 'Support', icon: HiSupport },
];

const SellerSidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();

    return (
        <>
            <div
                className={`${s.backdrop} ${isOpen ? s.backdropVisible : s.backdropHidden}`}
                onClick={onClose}
            ></div>
            <aside className={`${s.sidebar} ${isOpen ? s.sidebarOpen : s.sidebarClosed}`}>
                <div className={s.logoContainer}>
                    <Logo fontSize="1.25rem" iconSize={18} />
                    <button onClick={onClose} className="md:hidden text-text-main">
                        <HiX size={22} />
                    </button>
                </div>

                <nav className={s.nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `${s.navLink} ${isActive ? s.navLinkActive : s.navLinkInactive}`
                            }
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className={s.logoutContainer}>
                    <button onClick={logout} className={s.logoutButton}>
                        <HiLogout size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SellerSidebar;