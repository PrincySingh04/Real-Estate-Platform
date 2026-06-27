import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { propertyDetailsStyles as s } from '../assets/dummyStyles';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config'; // TODO: confirm this path matches your project structure
import Navbar from '../components/common/Navbar';
import PropertyCard from '../components/common/PropertyCard'; // TODO: confirm this matches your actual PropertyCard file path
import {
    HiOutlineHome,
    HiOutlineUserGroup,
    HiCollection,
    HiOutlineViewGrid,
    HiCalendar,
    HiBadgeCheck,
    HiChatAlt,
    HiLocationMarker,
    HiHeart,
    HiOutlineHeart,
    HiX,
    HiChevronLeft,
    HiChevronRight,
    HiCheckCircle,
} from 'react-icons/hi';

const PropertyDetails = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [similarProperties, setSimilarProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inquiry, setInquiry] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [inquiryStatus, setInquiryStatus] = useState({
        loading: false,
        success: false,
        error: null,
    });
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useEffect(() => {
        fetchPropertyDetails();
        if (user) checkWishlistStatus();
        window.scrollTo(0, 0);
    }, [id, user]);

    const fetchPropertyDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/property/${id}`); // TODO: confirm this endpoint matches your backend route
            const data = res.data.property || res.data;
            setProperty(data);
            setError(null);
            fetchSimilarProperties(data);
        } catch (err) {
            setError("Failed to load property details.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarProperties = async (currentProperty) => {
        try {
            const params = new URLSearchParams();
            if (currentProperty.city) params.append("city", currentProperty.city);
            if (currentProperty.propertyType)
                params.append("propertyType", currentProperty.propertyType);
            const res = await axios.get(`${API_URL}/api/property?${params.toString()}`);
            const all = res.data.properties || [];
            setSimilarProperties(
                all.filter((p) => p._id !== currentProperty._id).slice(0, 3),
            );
        } catch (err) {
            console.error("Failed to fetch similar properties:", err);
        }
    };

    const checkWishlistStatus = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const wishlistedIds = res.data
                .filter((item) => item.property)
                .map((item) => String(item.property._id));
            setIsInWishlist(wishlistedIds.includes(id));
        } catch (err) {
            console.error("Failed to check wishlist status:", err);
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            if (isInWishlist) {
                await axios.delete(`${API_URL}/api/wishlist/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsInWishlist(false);
            } else {
                await axios.post(
                    `${API_URL}/api/wishlist/${id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                setIsInWishlist(true);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    };

    const handleChatStart = () => {
    if (!user) {
        navigate("/login");
        return;
    }
    navigate(`/chat-messages?sellerId=${property.seller?._id}&propertyId=${property._id}&propertyTitle=${encodeURIComponent(property.title)}`);
};
    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setInquiryStatus({ loading: true, success: false, error: null });
        try {
            await axios.post(
                `${API_URL}/api/inquiry`,
                { propertyId: id, message: inquiry.message },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setInquiryStatus({ loading: false, success: true, error: null });
            setInquiry({ ...inquiry, message: "" });
        } catch (err) {
            setInquiryStatus({
                loading: false,
                success: false,
                error: err.response?.data?.message || "Failed to send inquiry",
            });
        }
    };

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const nextImage = () =>
        setLightboxIndex((prev) => (prev + 1) % property.images.length);
    const prevImage = () =>
        setLightboxIndex(
            (prev) => (prev - 1 + property.images.length) % property.images.length,
        );

    if (loading) {
        return (
            <div className={s.pageContainer}>
                <Navbar />
                <div className="loader-full-page">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className={s.pageContainer}>
                <Navbar />
                <div className="container p-16 text-center">
                    <p>{error || "Property not found."}</p>
                </div>
            </div>
        );
    }

    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(property.price);

    const stats = [
        { label: "Bedrooms", value: property.bhk || 0, icon: HiOutlineHome },
        {
            label: "Bathrooms",
            value:
                property.bathrooms ||
                Math.max(1, (parseInt(property.bhk) || 1) - 1),
            icon: HiOutlineUserGroup,
        },
        { label: "Furnishing", value: property.furnishing || "N/A", icon: HiCollection },
        { label: "Living Area", value: `${property.areaSize} sqft`, icon: HiOutlineViewGrid },
        { label: "Type", value: property.propertyType, icon: HiCalendar },
    ];

    const amenitiesList = property.amenities?.length
        ? property.amenities
        : ["Parking", "Security", "Water Supply", "Power Backup"];

    const additionalDetailsList = [
        { label: "Property ID", value: property._id.slice(-8).toUpperCase() },
        { label: "Added On", value: new Date(property.createdAt).toLocaleDateString() },
        { label: "Property Type", value: property.propertyType },
        { label: "Status", value: `For ${property.status}` },
    ];

    return (
        <div className={s.pageContainer}>
            <Navbar />
            <div className={s.mainContainer}>
                {/* Breadcrumbs */}
                <div className={s.breadcrumbs}>
                    <Link to="/" className={s.breadcrumbLink}>Home</Link>
                    <span>/</span>
                    <Link to="/properties" className={s.breadcrumbLink}>Browse Properties</Link>
                    <span>/</span>
                    <span className={s.breadcrumbCurrent}>{property.title}</span>
                </div>

                {/* Gallery */}
                <div className={s.galleryContainer}>
                    <div
                        className={s.galleryGrid}
                        style={{
                            gridTemplateColumns:
                                property.images.length > 1 ? "repeat(4, 1fr)" : "1fr",
                            gridTemplateRows:
                                property.images.length > 1 ? "repeat(2, 180px)" : "400px",
                        }}
                    >
                        <div
                            className={s.galleryMainItem(property.images.length > 1)}
                            onClick={() => openLightbox(0)}
                        >
                            <img src={property.images[0]} alt={property.title} className={s.galleryImage} />
                        </div>
                        {property.images.slice(1, 4).map((img, i) => (
                            <div key={i} className={s.gallerySideItem} onClick={() => openLightbox(i + 1)}>
                                <img src={img} alt={`${property.title} ${i + 2}`} className={s.galleryImage} />
                                {i === 2 && property.images.length > 4 && (
                                    <div className={s.galleryMoreOverlay}>
                                        +{property.images.length - 4} more
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile slider */}
                    <div className={s.mobileSliderContainer}>
                        <div className={s.mobileSliderTrack}>
                            {property.images.map((img, i) => (
                                <div key={i} className={s.mobileSlide} onClick={() => openLightbox(i)}>
                                    <img src={img} alt={`${property.title} ${i + 1}`} className={s.mobileSlideImage} />
                                </div>
                            ))}
                        </div>
                        <div className={s.mobileSlideCounter}>1 / {property.images.length}</div>
                    </div>
                </div>

                {/* Lightbox */}
                {lightboxIndex !== null && (
                    <div className={s.lightboxOverlay}>
                        <button onClick={closeLightbox} className={s.lightboxCloseBtn}>
                            <HiX size={20} className={s.lightboxCloseIcon} />
                        </button>
                        <div className={s.lightboxContent}>
                            <img
                                src={property.images[lightboxIndex]}
                                alt={property.title}
                                className={s.lightboxImage}
                            />
                        </div>
                        {property.images.length > 1 && (
                            <>
                                <button onClick={prevImage} className={s.lightboxPrevBtn}>
                                    <HiChevronLeft size={22} />
                                </button>
                                <button onClick={nextImage} className={s.lightboxNextBtn}>
                                    <HiChevronRight size={22} />
                                </button>
                            </>
                        )}
                        <div className={s.lightboxCounter}>
                            {lightboxIndex + 1} / {property.images.length}
                        </div>
                    </div>
                )}

                {/* Details layout */}
                <div className={s.detailsLayout}>
                    <div className={s.infoColumn}>
                        <div className={s.infoHeader}>
                            <div className={s.titleWrapper}>
                                <div className={s.badgeWrapper}>
                                    <span className={s.premiumBadge}>Premium Listing</span>
                                </div>
                                <h1 className={s.propertyTitle}>{property.title}</h1>
                                <div className={s.propertyLocation}>
                                    <HiLocationMarker className={s.locationIcon} />
                                    <span className={s.locationText}>{property.area}, {property.city}</span>
                                </div>
                            </div>
                            <div className={s.actionButtons}>
                                <button
                                    className={s.wishlistButton(isInWishlist)}
                                    onClick={handleToggleWishlist}
                                >
                                    {isInWishlist ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className={s.statsGrid}>
                            {stats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={i} className={s.statCard}>
                                        <Icon size={22} className={s.statIcon} />
                                        <div className={s.statValue}>{stat.value}</div>
                                        <div className={s.statLabel}>{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={s.descriptionSection}>
                            <h3 className={s.sectionTitle}>Description</h3>
                            <p className={s.descriptionText}>{property.description}</p>
                        </div>

                        <div className={s.amenitiesSection}>
                            <h3 className={s.sectionTitle}>Amenities</h3>
                            <div className={s.amenitiesGrid}>
                                {amenitiesList.map((amn, i) => (
                                    <div key={i} className={s.amenityItem}>
                                        <HiCheckCircle className={s.amenityIcon} />
                                        <span className={s.amenityText}>{amn}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={s.sidebarColumn}>
                        <div className={`${s.priceCard} bg-primary`}>
                            <div className={s.priceCardLabel}>Price</div>
                            <h2 className={s.priceCardValue}>
                                {property.status?.toLowerCase() === "rent"
                                    ? `₹${Number(property.price).toLocaleString("en-IN")}`
                                    : formattedPrice}
                                {property.status?.toLowerCase() === "rent" && (
                                    <span className={s.priceCardPeriod}> /month</span>
                                )}
                            </h2>
                            <div className={s.priceCardAvailability}>
                                Available for {property.status?.toLowerCase() === "rent" ? "Rent" : "Sale"}
                            </div>
                        </div>

                        <div className={s.sellerCard}>
                            <div className={s.sellerInfo}>
                                <div className={s.sellerAvatar}>
                                    <img
                                        src={
                                            property.seller?.profilePic ||
                                            `https://ui-avatars.com/api/?name=${property.seller?.name || "Seller"}&background=0d6e59&color=fff`
                                        }
                                        alt="Agent"
                                        className={s.sellerAvatarImage}
                                    />
                                </div>
                                <div className={s.sellerDetails}>
                                    <div className={s.sellerNameLink}>
                                        <h4 className={s.sellerName}>
                                            {property.seller?.name || "Seller"}
                                        </h4>
                                    </div>
                                    <div className={s.sellerVerifiedBadge}>
                                        <HiBadgeCheck className={s.verifiedIcon} /> Verified Seller
                                    </div>
                                </div>
                            </div>

                            <div className={s.chatButtonWrapper}>
                                <button className={s.chatButton} onClick={handleChatStart}>
                                    <HiChatAlt /> Chat
                                </button>
                            </div>

                            {/* Inquiry Form */}
                            <h4 className={s.inquiryFormTitle}>Inquire</h4>
                            <form onSubmit={handleInquirySubmit}>
                                {user?.role === "buyer" ? (
                                    <>
                                        <textarea
                                            placeholder="Your Message..."
                                            value={inquiry.message}
                                            onChange={(e) =>
                                                setInquiry({ ...inquiry, message: e.target.value })
                                            }
                                            className={s.inquiryTextarea}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className={s.inquirySubmitButton}
                                            disabled={inquiryStatus.loading}
                                        >
                                            {inquiryStatus.loading ? "Sending..." : "Send Inquiry"}
                                        </button>
                                        {inquiryStatus.success && (
                                            <p className={s.inquirySuccessMessage}>Inquiry sent!</p>
                                        )}
                                        {inquiryStatus.error && (
                                            <p className={s.inquirySuccessMessage}>{inquiryStatus.error}</p>
                                        )}
                                    </>
                                ) : (
                                    <div className={s.inquiryDisabledMessage}>
                                        <p className={s.inquiryDisabledText}>
                                            {user
                                                ? "Only buyers can send inquiries."
                                                : "Please login as a buyer to send inquiries."}
                                        </p>
                                        {!user && (
                                            <Link to="/login" className={s.inquiryLoginButton}>
                                                Login
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                <div className={s.additionalDetails}>
                    <h3 className={s.detailsTitle}>Additional Details</h3>
                    <div className={s.detailsGrid}>
                        {additionalDetailsList.map((detail, i) => (
                            <div key={i} className={s.detailRow}>
                                <span className={s.detailLabel}>{detail.label}</span>
                                <span className={s.detailValue}>{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Similar Properties */}
                <div className={s.similarSection}>
                    <div className={s.similarHeader}>
                        <div>
                            <h3 className={s.similarTitle}>Similar Properties</h3>
                            <p className={s.similarSubtitle}>You might also be interested in these</p>
                        </div>
                        <Link to="/properties" className={s.similarAllLink}>
                            View All
                        </Link>
                    </div>
                    {similarProperties.length === 0 ? (
                        <div className={s.similarEmptyState}>No similar properties found.</div>
                    ) : (
                        <div className={s.similarGrid}>
                            {similarProperties.map((p) => (
                                <PropertyCard key={p._id} property={p} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;