import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { FaChevronUp } from 'react-icons/fa';
import { useAuth } from './context/AuthContext';

// Pages - Public
import LandingPage from './pages/shared/LandingPage';
import Properties from './pages/shared/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Profile from './pages/shared/Profile';
import ChatMessages from './pages/shared/ChatMessages';

// Pages - Auth
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import Login from './pages/auth/login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Components - Layouts
import SellerLayout from './components/SellerLayout';
import AdminLayout from './components/AdminLayout';

// Pages - Seller
import PendingApproval from './pages/seller/PendingApproval';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProperties from './pages/seller/AddProperties';
import MyProperties from './pages/seller/MyProperties';
import EditProperty from './pages/seller/EditProperty';



// Pages - Buyer
import MyInquiries from './pages/buyer/Myinquiries';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUser from './pages/admin/AdminUser';
import SellerRequest from './pages/admin/SellerRequest';
import AdminProperties from './pages/admin/AdminProperties';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminContacts from './pages/admin/AdminContact';

// Protected Routes
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute';
import Contact from './pages/shared/Contact';
import Wishlist from './pages/buyer/Wishlist';

// Scroll to top on route change
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// Floating scroll to top button
const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
        visible
          ? 'scale-100 opacity-100 bg-emerald-500 text-white hover:bg-green-400'
          : 'pointer-events-none scale-0 opacity-0'
      }`}
    >
      <FaChevronUp size={22} />
    </button>
  );
};

// Main App Component
const App = () => {
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <ScrollToTopOnRouteChange />
      <ScrollTopButton />

      <Routes>
        {/* PUBLIC ONLY ROUTES */}
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* OPEN ROUTES */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* SELLER & BUYER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['seller', 'buyer']} />}>
          <Route path="/dashboard" element={<SellerLayout />}>
          
            <Route index element={<SellerDashboard />} />
            <Route path="properties" element={<MyProperties />} />
            <Route path="properties/add" element={<AddProperties />} />
            <Route path="properties/edit/:propertyId" element={<EditProperty />} />
            <Route path="inquiries" element={<MyInquiries />} />
          </Route>
          <Route path="/chat-messages" element={<ChatMessages />} />
        </Route>

        {/* ADMIN ONLY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUser />} />
            <Route path="seller-requests" element={<SellerRequest />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
        </Route>

        {/* SELLER PENDING APPROVAL */}
        <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
          <Route path="/pending-approval" element={<PendingApproval />} />
        </Route>

      </Routes>
    </div>
  );
};

export default App;