import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import PropertyCard from '../../components/common/PropertyCard';
import { HiTrash } from 'react-icons/hi';

const Wishlist = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch wishlist on mount
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [user, token]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await axios.get(`${API_URL}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // res.data is array of wishlist items with populated property
            setWishlistItems(res.data);
        } catch (err) {
            console.error('Failed to fetch wishlist:', err);
            setError('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    // Remove from wishlist
    const handleRemoveFromWishlist = async (propertyId) => {
        try {
            await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Remove from local state
            setWishlistItems(prev => 
                prev.filter(item => item.property._id !== propertyId)
            );
        } catch (err) {
            console.error('Failed to remove from wishlist:', err);
            setError('Failed to remove from wishlist');
        }
    };

    // Custom renderActions for wishlist items
    const renderActions = (property) => (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveFromWishlist(property._id);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
        >
            <HiTrash size={16} />
            Remove from Wishlist
        </button>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        <p className="mt-4 text-gray-600">Loading your wishlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
                    <p className="text-gray-600">Properties you've saved for later.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-block mb-4">
                            <div className="text-6xl text-gray-300">♡</div>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            No Saved Properties
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start building your wishlist by saving properties you love!
                        </p>
                        <button
                            onClick={() => navigate('/properties')}
                            className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            Browse Properties
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Count */}
                        <div className="mb-8">
                            <p className="text-gray-600">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'property' : 'properties'} saved
                            </p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlistItems.map((item) => {
                                
                                const property = item.property;

                                return (
                                    <PropertyCard
                                        key={property._id}
                                        property={property}
                                        renderActions={() => renderActions(property)}
                                        isWishlisted={true}
                                        onToggleWishlist={() => handleRemoveFromWishlist(property._id)}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Wishlist;