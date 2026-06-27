import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { editPropertyStyles as s } from '../../assets/dummyStyles';

const EditProperty = () => {
   
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        propertyType: '',
        status: 'sale',
        price: '',
        areaSize: '',
        bhk: '',
        bathrooms: '',
        area: '',
        city: '',
    });

    
    useEffect(() => {
        if (!propertyId) {
            console.error('No propertyId found!');
            navigate('/dashboard/properties', { replace: true });
            return;
        }

        fetchProperty();
    }, [propertyId]);

    const fetchProperty = async () => {
        try {
            setLoading(true);
            console.log('Fetching property with ID:', propertyId);
            
            const res = await axios.get(`${API_URL}/api/property/${propertyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Property data fetched:', res.data);
            setFormData(res.data.property || res.data);
        } catch (error) {
            console.error('Error fetching property:', error);
            navigate('/dashboard/properties', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!propertyId) {
            alert('Property ID not found');
            return;
        }

        try {
            setSaving(true);
            await axios.put(
                `${API_URL}/api/property/${propertyId}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Property updated successfully!');
            navigate('/dashboard/properties');
        } catch (error) {
            console.error('Error updating property:', error);
            alert('Failed to update property');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={s.pageContainer}>
                <div className={s.innerContainer}>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className={s.loader}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={s.pageContainer}>
            <div className={s.innerContainer}>
                <div className={s.headerWrapper}>
                    <h1 className={s.pageTitle}>Edit Property</h1>
                    <p className={s.pageSubtitle}>Update your property details and manage images.</p>
                </div>

                <form onSubmit={handleSubmit} className={s.formContainer}>
                    {/* Content Section */}
                    <div className={s.section}>
                        <div className={s.sectionHeader}>
                            <div className={s.sectionIndicator}></div>
                            <h2 className={s.sectionTitle}>Content & Description</h2>
                        </div>
                        <div className={s.sectionContent}>
                            <div>
                                <label className={s.label}>Property Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={s.input}
                                    required
                                />
                            </div>

                            <div>
                                <label className={s.label}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`${s.textarea}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Details Section */}
                    <div className={s.section}>
                        <div className={s.sectionHeader}>
                            <div className={s.sectionIndicator}></div>
                            <h2 className={s.sectionTitle}>Property Details</h2>
                        </div>
                        <div className={`${s.sectionContent} ${s.threeColumnGrid}`}>
                            <div>
                                <label className={s.label}>Property Type</label>
                                <select
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                    className={s.select}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Land">Land</option>
                                </select>
                            </div>

                            <div>
                                <label className={s.label}>BHK</label>
                                <input
                                    type="number"
                                    name="bhk"
                                    value={formData.bhk}
                                    onChange={handleChange}
                                    className={s.input}
                                />
                            </div>

                            <div>
                                <label className={s.label}>Bathrooms</label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleChange}
                                    className={s.input}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Location Section */}
                    <div className={s.section}>
                        <div className={s.sectionHeader}>
                            <div className={s.sectionIndicator}></div>
                            <h2 className={s.sectionTitle}>Pricing & Location</h2>
                        </div>
                        <div className={s.sectionContent}>
                            <div className={s.twoColumnGridInner}>
                                <div>
                                    <label className={s.label}>Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={s.input}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={s.label}>Area Size (Sq Ft)</label>
                                    <input
                                        type="number"
                                        name="areaSize"
                                        value={formData.areaSize}
                                        onChange={handleChange}
                                        className={s.input}
                                    />
                                </div>

                                <div>
                                    <label className={s.label}>Area/Locality</label>
                                    <input
                                        type="text"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        className={s.input}
                                    />
                                </div>

                                <div>
                                    <label className={s.label}>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={s.input}
                                    />
                                </div>

                                <div>
                                    <label className={s.label}>Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={s.select}
                                    >
                                        <option value="sale">Available</option>
                                        <option value="sold">Sold</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className={s.formActions}>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/properties')}
                            className={s.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={s.submitButton}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProperty;