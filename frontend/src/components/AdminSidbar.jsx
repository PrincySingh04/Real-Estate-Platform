import React from 'react';
import { NavLink } from 'react-router-dom';
import { adminSidebarStyles as s } from '../assets/dummyStyles';
import { useAuth } from '../context/AuthContext';
import Logo from './common/Logo';
import {
    HiViewGrid,
    HiUsers,
    HiOfficeBuilding,
    HiMail,
    HiChatAlt,
    HiClipboardList,
    HiLogout,
    HiX,
} from 'react-icons/hi';

const navItems = [
    { to: '/admin-dashboard', label: 'Overview', icon: HiViewGrid, end: true },
    { to: '/admin-dashboard/users', label: 'Users', icon: HiUsers },
    { to: '/admin-dashboard/seller-requests', label: 'Seller Requests', icon: HiClipboardList },
    { to: '/admin-dashboard/properties', label: 'Properties', icon: HiOfficeBuilding },
    { to: '/admin-dashboard/inquiries', label: 'Inquiries', icon: HiChatAlt },
    { to: '/admin-dashboard/contacts', label: 'Contact Inbox', icon: HiMail },
];

const AdminSidbar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();

    return (
        <>
            <div className={s.backdrop(isOpen)} onClick={onClose}></div>
            <aside className={s.sidebar(isOpen)}>
                <div className={s.logoContainer}>
                    <Logo fontSize="1.25rem" iconSize={18} />
                    <button onClick={onClose} className="md:hidden text-text-main">
                        <HiX size={22} />
                    </button>
                </div>

                <nav className={s.navContainer}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={onClose}
                            className={({ isActive }) => s.navLink(isActive)}
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

export default AdminSidbar;