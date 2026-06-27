import React, { useEffect, useState, useRef } from 'react';
import { propertiesStyles as s } from '../../assets/dummyStyles';
import { useAuth } from '../../context/AuthContext';
import {
    HiFilter,
    HiX,
    HiSearch,
    HiViewGrid,
    HiViewList,
    HiOutlineExclamationCircle,
    HiOutlineSearch,
} from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/common/Navbar';
import PropertyCard from '../../components/common/PropertyCard'; // TODO: confirm this matches your actual PropertyCard file path
import API_URL from '../../config';

const Properties = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const location = useLocation();
    const [properties, setProperties] = useState([]);
    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("grid");

    const [filters, setFilters] = useState({
        city: "",
        propertyType: [],
        bhk: "",
        maxPrice: 100000000,
        amenities: [],
        furnishing: [],
        sort: "latest",
    });

    const propertyTypes = [
        { label: "Flat/Apartment", value: "flat" },
        { label: "Independent House/Villa", value: "villa" },
        { label: "Penthouse", value: "penthouse" },
        { label: "Commercial", value: "commercial" },
    ];
    const bhkOptions = ["1", "2", "3", "4", "5+"];
    const furnishingOptions = [
        { label: "Furnished", value: "furnished" },
        { label: "Semi-Furnished", value: "semi-furnished" },
        { label: "Unfurnished", value: "unfurnished" },
    ];

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const city = queryParams.get("city") || "";
        const type = queryParams.get("type") || "";
        const bhk = queryParams.get("bhk") || "";
        const initialFilters = {
            ...filters,
            city,
            propertyType: type ? [type] : [],
            bhk,
        }
        setFilters(initialFilters);
        fetchProperties(initialFilters);
        if (user) {
            fetchWishlist();
        }
    }, [location.search, user]);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWishlistedIds(
                res.data
                    .filter((items) => items.property)
                    .map((item) => String(item.property._id)),
            );
        }
        catch (error) {
            console.error("failed to fetch wishlist:", error);
        }

    };
    //  to toggle wishlist
    const handleToggleWishlist = async (propertyId) => {
        try {
            const isWishlisted = wishlistedIds.includes(propertyId);
            if (isWishlisted) {
                await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWishlistedIds((prev) => prev.filter((id) => id !== propertyId));

            } else {
                await axios.post(
                    `${API_URL}/api/wishlist/${propertyId}`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                setWishlistedIds((prev) => [...prev, propertyId]);

            }
        } catch (error) {
            console.error("Failed to toggle wishlist:", error);
        }
    };
    //  to fetch properties
    const fetchProperties = async (currentFilters) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (currentFilters.city) params.append("city", currentFilters.city);
            if (currentFilters.propertyType.length > 0)
                params.append("propertyType", currentFilters.propertyType.join(","));
            if (currentFilters.bhk) params.append("bhk", currentFilters.bhk);
            if (currentFilters.maxPrice)
                params.append("maxPrice", currentFilters.maxPrice);
            if (currentFilters.furnishing && currentFilters.furnishing.length > 0)
                params.append("furnishing", currentFilters.furnishing.join(","));
            if (currentFilters.sort) params.append("sort", currentFilters.sort);

            const res = await axios.get(
                `${API_URL}/api/property?${params.toString()}`,
            );
            setProperties(res.data.properties || []);
            setError(null);
        } catch (err) {
            setError("Failed to load properties. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchTimer = useRef(null);
    const debouncedFetch = (updatedFilters) => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        fetchTimer.current = setTimeout(() => {
            fetchProperties(updatedFilters);
        }, 500);
    };
    //filter fetching timer 

    const handleCheckboxChange = (category, value) => {
        const current = [...(filters[category] || [])];
        const index = current.indexOf(value);
        if (index === -1) {
            current.push(value);
        } else {
            current.splice(index, 1);
        }
        const updatedFilters = { ...filters, [category]: current };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };
    // to update filter once toggle the checks

    const handleCityChange = (e) => {
        const value = e.target.value;
        const updatedFilters = { ...filters, city: value };
        setFilters(updatedFilters);
        debouncedFetch(updatedFilters);
    };
    // for city search

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value);
        const updatedFilters = { ...filters, maxPrice: value };
        setFilters(updatedFilters);
        debouncedFetch(updatedFilters);
    };
    // for price filter

    const handleBhkSelect = (value) => {
        const updatedFilters = {
            ...filters,
            bhk: filters.bhk === value ? "" : value,
        };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };
    // to filter according to the bhk

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        const updatedFilters = { ...filters, sort: newSort };
        setFilters(updatedFilters);
        fetchProperties(updatedFilters);
    };

    const applyFilters = () => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        fetchProperties(filters);
    };
    // t apply filter by btn

    const resetFilters = () => {
        if (fetchTimer.current) clearTimeout(fetchTimer.current);
        const reset = {
            city: "",
            propertyType: [],
            bhk: "",
            maxPrice: 100000000,
            amenities: [],
            furnishing: [],
            sort: "latest",
        };
        setFilters(reset);
        navigate("/properties");
        fetchProperties(reset);
    };

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    return (
        <div className={s.pageContainer}>
            <Navbar />
            <div className={s.container}>
                <div className={s.mobileFilterButtonWrapper}>
                    <button onClick={() => setShowMobileFilters(true)}
                        className={s.mobileFilterButton}
                    >
                        <HiFilter />Show Filter & Search
                    </button>
                </div>
                <div className={s.layout}>
                    {showMobileFilters && (
                        <div className={s.mobileOverlay} onClick={() => setShowMobileFilters(false)}></div>
                    )}
                    <aside className={`${s.sidebar} ${showMobileFilters ? s.sidebarVisible : s.sidebarHidden}`}
                    >
                        <div className={s.sidebarHeader}>
                            <div className={s.sidebarTitleWrapper}>
                                <HiFilter className={s.sidebarTitleIcon}>
                                </HiFilter>
                                <h2 className={s.sidebarTitle}>Filter</h2>

                            </div>
                            <div className={s.sidebarHeaderActions}>
                                <button onClick={resetFilters} className={s.resetButton}>
                                    Reset
                                </button>
                                <button onClick={() => setShowMobileFilters(false)} className={s.closeMobileFilters}><HiX /></button>
                            </div>
                        </div>

                        <div className={s.filtersScrollArea}>
                            {/* Search by city */}
                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>Search by City</label>
                                <div className={s.searchInputWrapper}>
                                    <HiSearch className={s.searchIcon} size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter city name"
                                        className={s.searchInput}
                                        value={filters.city}
                                        onChange={handleCityChange}
                                    />
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>Property Type</label>
                                <div className={s.checkboxGroup}>
                                    {propertyTypes.map((type) => (
                                        <label key={type.value} className={s.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                className={s.checkbox}
                                                checked={filters.propertyType.includes(type.value)}
                                                onChange={() => handleCheckboxChange("propertyType", type.value)}
                                            />
                                            {type.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* BHK */}
                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>BHK</label>
                                <div className={s.bhkGroup}>
                                    {bhkOptions.map((bhk) => (
                                        <button
                                            key={bhk}
                                            type="button"
                                            className={`${s.bhkButton} ${filters.bhk === bhk ? s.bhkButtonActive : s.bhkButtonInactive}`}
                                            onClick={() => handleBhkSelect(bhk)}
                                        >
                                            {bhk}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className={s.filterSection}>
                                <div className={s.priceHeader}>
                                    <label className={s.filterLabel}>Max Price</label>
                                    <span className={s.priceValue}>
                                        ₹{(filters.maxPrice / 100000).toFixed(0)}L
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="500000"
                                    max="100000000"
                                    step="500000"
                                    value={filters.maxPrice}
                                    onChange={handlePriceChange}
                                    className={s.priceSlider}
                                />
                                <div className={s.priceLabels}>
                                    <span>₹5L</span>
                                    <span>₹10Cr+</span>
                                </div>
                            </div>

                            {/* Furnishing */}
                            <div className={s.filterSection}>
                                <label className={s.filterLabel}>Furnishing</label>
                                <div className={s.checkboxGroup}>
                                    {furnishingOptions.map((option) => (
                                        <label key={option.value} className={s.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                className={s.checkbox}
                                                checked={filters.furnishing.includes(option.value)}
                                                onChange={() => handleCheckboxChange("furnishing", option.value)}
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    applyFilters();
                                    setShowMobileFilters(false);
                                }}
                                className="btn btn-primary w-full"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    <main className={s.mainContent}>
                        <div className={s.contentHeader}>
                            <p className={s.resultCount}>
                                <span className={s.resultCountStrong}>{properties.length}</span> properties found
                            </p>
                            <div className={s.headerControls}>
                                <div className={s.viewModeToggle}>
                                    <button
                                        className={`${s.viewModeButton} ${viewMode === "grid" ? s.viewModeActive : s.viewModeInactive}`}
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <HiViewGrid size={18} />
                                    </button>
                                    <button
                                        className={`${s.viewModeButton} ${viewMode === "list" ? s.viewModeActive : s.viewModeInactive}`}
                                        onClick={() => setViewMode("list")}
                                    >
                                        <HiViewList size={18} />
                                    </button>
                                </div>
                                <div className={s.sortControl}>
                                    <label className={s.sortLabel}>Sort by</label>
                                    <select className={s.sortSelect} value={filters.sort} onChange={handleSortChange}>
                                        <option value="latest">Latest</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className={s.skeletonGrid}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className={s.skeletonCard}></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className={s.errorContainer}>
                                <HiOutlineExclamationCircle size={48} className={s.errorIcon} />
                                <h3 className={s.errorTitle}>{error}</h3>
                                <button onClick={() => fetchProperties(filters)} className={s.errorButton}>
                                    Try Again
                                </button>
                            </div>
                        ) : properties.length === 0 ? (
                            <div className={s.emptyContainer}>
                                <div className={s.emptyIconWrapper}>
                                    <HiOutlineSearch size={32} className={s.emptyIcon} />
                                </div>
                                <h3 className={s.emptyTitle}>No properties found</h3>
                                <p className={s.emptyText}>
                                    Try adjusting your filters or search in a different area.
                                </p>
                                <button onClick={resetFilters} className={s.emptyButton}>
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className={`${s.propertyList} ${viewMode === "grid" ? s.propertyListGrid : s.propertyListList}`}>
                                {properties.map((property) => (
                                    <PropertyCard
                                        key={property._id}
                                        property={property}
                                        isWishlisted={wishlistedIds.includes(String(property._id))}
                                        onToggleWishlist={handleToggleWishlist}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Properties